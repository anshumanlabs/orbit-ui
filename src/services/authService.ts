const API_BASE_URL = "http://localhost:8000";

export const loginWithGoogle = (): void => {
  window.location.href =
    `${API_BASE_URL}/auth/google/login`;
};