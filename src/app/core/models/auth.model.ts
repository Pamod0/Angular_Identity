export interface AuthErrorResponse {
  error?: {
    message?: string;
    code?: string;
    status?: number;
  };
  status?: number;
  statusText?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  expiresIn?: number;
}

export interface EmailConfirmationRequest {
  userId: string;
  token: string;
}

export interface ResendConfirmationEmailRequest {
  email: string;
}

export interface AuthResponse {
  message: string;
  success: boolean;
}
