import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from 'react-oidc-context'
import { ThemeProvider } from './context/ThemeContext'

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPE,
  scope: import.meta.env.VITE_COGNITO_SCOPE,
  extraQueryParams: { identity_provider: "COGNITO" },
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  metadata: {
    issuer: import.meta.env.VITE_COGNITO_AUTHORITY,
    authorization_endpoint: `${import.meta.env.VITE_COGNITO_AUTHORITY}/oauth2/authorize`,
    token_endpoint: `${import.meta.env.VITE_COGNITO_AUTHORITY}/oauth2/token`,
    userinfo_endpoint: `${import.meta.env.VITE_COGNITO_AUTHORITY}/oauth2/userInfo`,
    end_session_endpoint: `${import.meta.env.VITE_COGNITO_AUTHORITY}/logout`,
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
