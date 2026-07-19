import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import GmailIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";

const providers = [
  {
    name: "Gmail",
    icon: <GmailIcon />,
    connected: true,
    color: "#EA4335",
  },
  {
    name: "Outlook",
    icon: <MicrosoftIcon />,
    connected: false,
    color: "#0078D4",
  },
  {
    name: "Yahoo Mail",
    icon: <EmailIcon />,
    connected: false,
    color: "#6001D2",
  },
  {
    name: "iCloud Mail",
    icon: <EmailIcon />,
    connected: false,
    color: "#3693F3",
  },
];

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <EmailIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4">Orbit Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your connected email accounts
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Email Accounts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {providers.map((provider) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={provider.name}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: provider.color, color: "#fff", width: 40, height: 40 }}>
                    {provider.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{provider.name}</Typography>
                    <Chip
                      icon={provider.connected ? <CheckCircleIcon fontSize="small" /> : <LinkOffIcon fontSize="small" />}
                      label={provider.connected ? "Connected" : "Not Connected"}
                      color={provider.connected ? "success" : "default"}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small" variant={provider.connected ? "outlined" : "contained"} fullWidth>
                  {provider.connected ? "Disconnect" : "Connect"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <ChatIcon color="primary" />
              <Typography variant="h6">AI Chat</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Chat with your emails using AI. Ask questions about your inbox, summarize threads, and more.
            </Typography>
            <Button variant="contained" component={Link} to="/chat" startIcon={<ChatIcon />}>
              Open AI Chat
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Future Features
            </Typography>
            <Typography variant="body2" color="text.secondary">
              More integrations and tools are coming soon.
            </Typography>
            <Box component="ul" sx={{ pl: 2, mt: 1, color: "text.secondary" }}>
              <li>Calendar Events</li>
              <li>Task Management</li>
              <li>Meeting Summaries</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
