import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmailConfirmationRequest, ResendConfirmationEmailRequest } from '../models/auth.model';

// Constants
const AUTH_CONSTANTS = {
  STORAGE_KEYS: {
    TOKEN: 'auth-token',
    REFRESH_TOKEN: 'refresh-token',
    USER_DATA: 'user-data',
  },
  API_ENDPOINTS: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
};

// Interfaces
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  userId: string;
  roles: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Dependencies
  private http = inject(HttpClient);
  private router = inject(Router);

  // Properties
  private apiUrl = environment.apiUrl || 'https://localhost:44369';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Authentication state methods
  private hasToken(): boolean {
    return !!localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN);
  }

  getUserData(): { userId: string; email: string; expiration: string } | null {
    const userData = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  // Auth operations
  register(registerData: RegisterRequest): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${AUTH_CONSTANTS.API_ENDPOINTS.REGISTER}`, registerData)
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { email, password };

    return this.http
      .post<any>(`${this.apiUrl}/${AUTH_CONSTANTS.API_ENDPOINTS.LOGIN}`, loginRequest)
      .pipe(
        tap((response: AuthResponse) => {
          this.storeAuthData(response);
          this.isLoggedInSubject.next(true);
        }),
        catchError(this.handleError),
      );
  }

  logout(): void {
    // Optionally call logout endpoint if server needs to invalidate tokens
    // this.http.post(`${this.apiUrl}${AUTH_CONSTANTS.API_ENDPOINTS.LOGOUT}`, {}).subscribe();

    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.USER_DATA);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  sendForgotPasswordEmail(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/ForgotPassword`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/ResetPassword`, {
      email,
      token,
      newPassword,
    });
  }

  // Token management
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
    const refreshRequest: RefreshTokenRequest = { refreshToken: refreshToken || '' };

    return this.http
      .post<TokenResponse>(`${this.apiUrl}${AUTH_CONSTANTS.API_ENDPOINTS.REFRESH}`, refreshRequest)
      .pipe(
        tap((response: TokenResponse) => {
          localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN, response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
          }
        }),
        catchError(this.handleError),
      );
  }

  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

    const userData = {
      userId: response.userId,
      roles: response.roles,
      expiration: response.expiration,
    };
    localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  // Email confirmation
  confirmEmail(
    request: EmailConfirmationRequest,
  ): Observable<{ message: string; success: boolean }> {
    return this.http.post<{ message: string; success: boolean }>(
      `${this.apiUrl}/auth/ConfirmEmail`,
      request,
    );
  }

  resendConfirmationEmail(
    request: ResendConfirmationEmailRequest,
  ): Observable<{ message: string; success: boolean }> {
    return this.http.post<{ message: string; success: boolean }>(
      `${this.apiUrl}/auth/ResendConfirmationEmail`,
      request,
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        if (error.error.errors) {
          // Handle validation errors from ASP.NET Core Identity
          const validationErrors = error.error.errors;
          const errorMessages: string[] = [];

          for (const key in validationErrors) {
            if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
              errorMessages.push(...validationErrors[key]);
            }
          }

          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join(' ');
          }
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
