import {
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";

import { loginWithGoogle } from "../services/authService";

const Login = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          Orbit AI
        </Typography>

        <Typography sx={{ mb: 4 }}>
          Connect Gmail and Calendar to start
          using your personal AI assistant.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={loginWithGoogle}
        >
          Connect Google Account
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;