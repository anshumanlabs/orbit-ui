import {
  Container,
  Paper,
  Typography,
} from "@mui/material";

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4">
          Orbit Dashboard
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Gmail Connected Successfully
        </Typography>

        <Typography sx={{ mt: 1 }}>
          Future Features:
        </Typography>

        <ul>
          <li>Read Emails</li>
          <li>Calendar Events</li>
          <li>Task Management</li>
          <li>AI Chat</li>
          <li>Meeting Summaries</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Dashboard;