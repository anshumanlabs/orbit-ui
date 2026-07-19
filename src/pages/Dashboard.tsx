import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import GmailIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { useThemeSettings } from "../context/ThemeContext";

const providers = [
  {
    name: "Gmail",
    icon: <GmailIcon />,
    connected: true,
  },
  {
    name: "Outlook",
    icon: <MicrosoftIcon />,
    connected: false,
  },
  {
    name: "Yahoo Mail",
    icon: <EmailIcon />,
    connected: false,
  },
  {
    name: "iCloud Mail",
    icon: <EmailIcon />,
    connected: false,
  },
];

const paletteConst = {
  bg: "#000",
  paper: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
};

const contrastMap = {
  low: { text: "rgba(255,255,255,0.72)", border: "rgba(255,255,255,0.1)" },
  medium: { text: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,0.16)" },
  high: { text: "rgba(255,255,255,0.95)", border: "rgba(255,255,255,0.24)" },
};

const densityMap = {
  compact: { py: 1, px: 2, gap: 1, sectionGap: 4 },
  default: { py: 2, px: 3, gap: 2, sectionGap: 6 },
  spacious: { py: 3, px: 4, gap: 3, sectionGap: 8 },
};

const fontSizeMap = {
  small: { xs: 12, sm: 13, md: 14 },
  medium: { xs: 14, sm: 15, md: 16 },
  large: { xs: 16, sm: 17, md: 18 },
};

const Dashboard = () => {
  const { settings } = useThemeSettings();
  const palette = paletteConst;
  const contrast = contrastMap[settings.contrast];
  const density = densityMap[settings.density];
  const fontSize = fontSizeMap[settings.fontSize];

  return (
    <Box sx={{ bgcolor: palette.bg, minHeight: "100vh", color: "#fff" }}>
      <Container maxWidth="md" sx={{ py: density.sectionGap }}>
        <Box sx={{ mb: density.sectionGap }}>
          <Typography variant="h3" sx={{ fontSize: { xs: fontSize.xs + 8, md: fontSize.md + 8 }, fontWeight: 300, letterSpacing: "-0.02em", mb: 1 }}>
            Orbit
          </Typography>
          <Typography variant="body1" sx={{ color: contrast.text, fontSize: fontSize.md, fontWeight: 300 }}>
            Unified email intelligence
          </Typography>
        </Box>

        <Divider sx={{ borderColor: palette.border, mb: density.sectionGap }} />

        <Box sx={{ mb: density.sectionGap }}>
          <Typography variant="overline" sx={{ color: contrast.text, letterSpacing: "0.2em", mb: density.py * 2, display: "block", fontSize: fontSize.xs }}>
            CONNECTED ACCOUNTS
          </Typography>
          <Grid container spacing={density.gap}>
            {providers.map((provider) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={provider.name}>
                <Card
                  sx={{
                    bgcolor: palette.paper,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 0,
                    transition: "border-color 0.3s ease",
                    "&:hover": {
                      borderColor: contrast.border,
                    },
                  }}
                >
                  <CardContent sx={{ p: density.py }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: density.gap, mb: density.py }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.9)",
                          width: 40,
                          height: 40,
                          border: `1px solid ${palette.border}`,
                        }}
                      >
                        {provider.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500, letterSpacing: "0.02em", fontSize: fontSize.sm }}>
                          {provider.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                          {provider.connected ? (
                            <CheckCircleIcon sx={{ fontSize: 12, color: contrast.text }} />
                          ) : (
                            <LinkOffIcon sx={{ fontSize: 12, color: contrast.text }} />
                          )}
                          <Typography variant="caption" sx={{ color: contrast.text, fontSize: fontSize.xs }}>
                            {provider.connected ? "Connected" : "Not Connected"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                  <Divider sx={{ borderColor: palette.border }} />
                  <CardActions sx={{ p: 0 }}>
                    <Button
                      size="small"
                      variant="text"
                      fullWidth
                      sx={{
                        borderRadius: 0,
                        py: density.py,
                        color: provider.connected ? contrast.text : "#fff",
                        fontSize: fontSize.xs,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {provider.connected ? "DISCONNECT" : "CONNECT"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: palette.border, mb: density.sectionGap }} />

        <Grid container spacing={density.gap}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: density.px * 2, border: `1px solid ${palette.border}` }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: density.py }}>
                <ChatIcon sx={{ fontSize: 20, color: contrast.text }} />
                <Typography variant="overline" sx={{ color: contrast.text, letterSpacing: "0.2em", fontSize: fontSize.xs }}>
                  AI CHAT
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: contrast.text, mb: density.py * 2, lineHeight: 1.7, maxWidth: 400, fontSize: fontSize.sm }}>
                Chat with your emails using AI. Ask questions about your inbox, summarize threads, and more.
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                to="/chat"
                startIcon={<ChatIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderColor: palette.border,
                  color: "#fff",
                  borderRadius: 0,
                  px: 3,
                  py: density.py,
                  fontSize: fontSize.xs,
                  letterSpacing: "0.1em",
                  "&:hover": {
                    borderColor: contrast.border,
                    bgcolor: palette.paper,
                  },
                }}
              >
                OPEN AI CHAT
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: density.px * 2, border: `1px solid ${palette.border}` }}>
              <Typography variant="overline" sx={{ color: contrast.text, letterSpacing: "0.2em", mb: density.py, display: "block", fontSize: fontSize.xs }}>
                COMING SOON
              </Typography>
              <Typography variant="body2" sx={{ color: contrast.text, lineHeight: 1.7, maxWidth: 400, fontSize: fontSize.sm }}>
                Calendar events, task management, and meeting summaries are under development.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
