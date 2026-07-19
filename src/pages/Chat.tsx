import { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL;

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ role: "user", content: trimmed }]),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      let assistantText = "";

      if (typeof data === "string") {
        assistantText = data;
      } else if (typeof data === "object" && data !== null) {
        assistantText =
          data.choices?.[0]?.message?.content ??
          data.response ??
          data.message ??
          data.content ??
          JSON.stringify(data);
      } else {
        assistantText = String(data);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: unable to reach the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "grey.100" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" onClick={() => navigate("/dashboard")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <SmartToyIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AI Chat
          </Typography>
          <Chip label="Online" color="success" size="small" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 2, mb: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <Paper sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              backgroundColor: "background.default",
            }}
          >
            {messages.length === 0 && (
              <Box sx={{ textAlign: "center", mt: 10 }}>
                <SmartToyIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                <Typography color="text.secondary" variant="h6">
                  Start a conversation...
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                  Ask anything and I will do my best to help.
                </Typography>
              </Box>
            )}
            <List>
              {messages.map((msg, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    px: 0,
                    py: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1,
                      maxWidth: "75%",
                      flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: msg.role === "user" ? "primary.main" : "secondary.main",
                          width: 36,
                          height: 36,
                        }}
                      >
                        {msg.role === "user" ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                      </Avatar>
                    </ListItemAvatar>
                    <Paper
                      elevation={1}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: msg.role === "user" ? "primary.main" : "background.paper",
                        color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                        borderTopLeftRadius: msg.role === "assistant" ? 0 : 2,
                        borderTopRightRadius: msg.role === "user" ? 0 : 2,
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
              {loading && (
                <ListItem sx={{ justifyContent: "flex-start", px: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "secondary.main", width: 36, height: 36 }}>
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                    <CircularProgress size={24} />
                  </Box>
                </ListItem>
              )}
              {error && (
                <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
                  {error}
                </Typography>
              )}
              <div ref={endRef} />
            </List>
          </Box>

          <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              size="small"
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { backgroundColor: "primary.dark" },
                "&.Mui-disabled": { backgroundColor: "action.disabledBackground" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatPage;
