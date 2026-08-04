import { apiClient } from './api';

export const authForgotPassword = (email) => {
  return apiClient.post('/auth/forgot-password', { email });
};

export const authResetPassword = (token, newPassword) => {
  return apiClient.post('/auth/reset-password', { token, newPassword });
};

export const authVerifyEmail = (token) => {
  return apiClient.get('/auth/verify-email', { params: { token } });
};

export const authResendVerification = (email) => {
  return apiClient.post('/auth/resend-verification', { email });
};
