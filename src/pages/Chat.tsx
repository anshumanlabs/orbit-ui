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
import { useThemeSettings } from "../context/ThemeContext";

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
  const { settings } = useThemeSettings();

  const bg = "#000";

  const contrast = {
    low: { text: "rgba(255,255,255,0.72)", border: "rgba(255,255,255,0.1)", muted: "rgba(255,255,255,0.5)" },
    medium: { text: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,0.16)", muted: "rgba(255,255,255,0.6)" },
    high: { text: "rgba(255,255,255,0.95)", border: "rgba(255,255,255,0.24)", muted: "rgba(255,255,255,0.7)" },
  }[settings.contrast];

  const density = {
    compact: { py: 1, px: 2, gap: 1, msgGap: 1 },
    default: { py: 2, px: 3, gap: 2, msgGap: 2 },
    spacious: { py: 3, px: 4, gap: 3, msgGap: 3 },
  }[settings.density];

  const fontSize = {
    small: 13,
    medium: 15,
    large: 17,
  }[settings.fontSize];

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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: bg }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: bg, borderBottom: `1px solid ${contrast.border}` }}>
        <Toolbar variant="dense" sx={{ minHeight: 48 }}>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/dashboard")} sx={{ mr: 1, p: 0.5 }}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Avatar sx={{ mr: 1.5, width: 28, height: 28, bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
            <SmartToyIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500, letterSpacing: "0.05em", color: "#fff", fontSize }}>
            AI CHAT
          </Typography>
          <Chip
            label="Online"
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              color: contrast.muted,
              border: `1px solid ${contrast.border}`,
              fontSize: "0.65rem",
              height: 24,
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: density.gap, mb: density.gap, flex: 1, display: "flex", flexDirection: "column", px: 0 }}>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: density.px * 2,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: contrast.border, borderRadius: "2px" },
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: "center", mt: 16, mb: 8 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  mx: "auto",
                  mb: 3,
                  bgcolor: "rgba(255,255,255,0.05)",
                  color: contrast.muted,
                  border: `1px solid ${contrast.border}`,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 24 }} />
              </Avatar>
              <Typography variant="body1" sx={{ color: contrast.text, fontWeight: 400, mb: 1, fontSize }}>
                Start a conversation
              </Typography>
              <Typography variant="body2" sx={{ color: contrast.muted, fontSize: fontSize - 2 }}>
                Ask anything and I will do my best to help.
              </Typography>
            </Box>
          )}

          <List sx={{ p: 0 }}>
            {messages.map((msg, idx) => (
              <ListItem
                key={idx}
                sx={{
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  px: 0,
                  py: density.msgGap,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: density.gap,
                    maxWidth: "70%",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 32 }}>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: contrast.muted,
                        width: 32,
                        height: 32,
                        border: `1px solid ${contrast.border}`,
                      }}
                    >
                      {msg.role === "user" ? <PersonIcon sx={{ fontSize: 16 }} /> : <SmartToyIcon sx={{ fontSize: 16 }} />}
                    </Avatar>
                  </ListItemAvatar>
                  <Paper
                    elevation={0}
                    sx={{
                      px: density.px * 1.5,
                      py: density.py,
                      borderRadius: 0,
                      bgcolor: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.05)",
                      color: msg.role === "user" ? "#000" : contrast.text,
                      border: msg.role === "user" ? "none" : `1px solid ${contrast.border}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap", fontSize }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            ))}

            {loading && (
              <ListItem sx={{ justifyContent: "flex-start", px: 0, py: density.msgGap }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: density.gap }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: contrast.muted,
                      width: 32,
                      height: 32,
                      border: `1px solid ${contrast.border}`,
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Paper
                    elevation={0}
                    sx={{
                      px: density.px * 1.5,
                      py: density.py,
                      borderRadius: 0,
                      bgcolor: "rgba(255,255,255,0.05)",
                      border: `1px solid ${contrast.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress size={14} sx={{ color: contrast.muted }} />
                    <Typography variant="body2" sx={{ color: contrast.muted, fontSize: fontSize - 2 }}>
                      Thinking
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            )}

            {error && (
              <Box sx={{ textAlign: "center", mt: density.gap }}>
                <Typography variant="body2" sx={{ color: contrast.muted, fontSize: fontSize - 2 }}>
                  {error}
                </Typography>
              </Box>
            )}
            <div ref={endRef} />
          </List>
        </Box>

        <Box
          sx={{
            px: density.px * 2,
            pb: density.py * 2,
            pt: density.py,
            borderTop: `1px solid ${contrast.border}`,
          }}
        >
          <Box sx={{ display: "flex", gap: density.gap }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              sx={{
                "& .MuiInput-input": {
                  color: "#fff",
                  fontSize,
                },
                "& .MuiInput-input::placeholder": {
                  color: contrast.muted,
                },
                "& .MuiInput-underline:before": {
                  borderBottom: `1px ${contrast.border}`,
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: `1px solid ${contrast.text}`,
                },
                "& .MuiInput-underline:after": {
                  borderBottom: `1px solid ${contrast.text}`,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              sx={{
                color: contrast.text,
                p: 1,
                "&:hover": {
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
                "&.Mui-disabled": {
                  color: contrast.muted,
                },
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ChatPage;
