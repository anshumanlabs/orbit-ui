import { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from "@mui/material";

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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, height: "80vh", display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          AI Chat
        </Typography>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            backgroundColor: "background.default",
          }}
        >
          {messages.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: "center", mt: 10 }}>
              Start a conversation...
            </Typography>
          )}
          <List>
            {messages.map((msg, idx) => (
              <ListItem
                key={idx}
                sx={{
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  px: 0,
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
                        width: 32,
                        height: 32,
                        fontSize: "0.75rem",
                      }}
                    >
                      {msg.role === "user" ? "U" : "AI"}
                    </Avatar>
                  </ListItemAvatar>
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: msg.role === "user" ? "primary.light" : "background.paper",
                      color: msg.role === "user" ? "primary.contrastText" : "text.primary",
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
                  <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32, fontSize: "0.75rem" }}>
                    AI
                  </Avatar>
                  <CircularProgress size={20} />
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

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            sx={{ backgroundColor: "primary.main", color: "primary.contrastText", "&:hover": { backgroundColor: "primary.dark" } }}
          >
            ➤
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;
