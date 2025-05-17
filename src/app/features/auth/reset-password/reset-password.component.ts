import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  SNACKBAR_DURATION: 5000,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  MESSAGES: {
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    PASSWORD_PATTERN:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
    PASSWORDS_MISMATCH: 'Passwords do not match',
  },
};

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  email!: string;
  token!: string;
  authForm!: FormGroup;
  isLoading: boolean = false;
  hidePassword = true;
  hideConfirmPassword = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.captureQueryParams();
    this.createForm();
  }

  captureQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.token = decodeURIComponent(params['token']);
    });

    if (!this.email || !this.token) {
      this.snackBar.open('Invalid password reset link', 'Close', {
        duration: 5000,
      });
      // this.router.navigate(['/auth/login']);
    }
  }

  createForm() {
    this.authForm = this.fb.group(
      {
        newPassword: [
          '',
          Validators.required,
          Validators.minLength(VALIDATION.PASSWORD_MIN_LENGTH),
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.email, this.token, this.authForm.value.newPassword).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'Close', {
          duration: VALIDATION.SNACKBAR_DURATION,
        });
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.snackBar.open(error, 'Close', {
          duration: VALIDATION.SNACKBAR_DURATION,
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  getPasswordErrorMessage() {
    const password = this.authForm.get('password');
    if (password?.hasError('required')) {
      return VALIDATION.MESSAGES.PASSWORD_REQUIRED;
    }
    if (password?.hasError('minlength')) {
      return VALIDATION.MESSAGES.PASSWORD_TOO_SHORT;
    }
    if (password?.hasError('pattern')) {
      return VALIDATION.MESSAGES.PASSWORD_PATTERN;
    }
    return '';
  }

  getConfirmPasswordErrorMessage() {
    const confirmPassword = this.authForm.get('confirmPassword');
    if (confirmPassword?.hasError('required')) {
      return VALIDATION.MESSAGES.CONFIRM_PASSWORD_REQUIRED;
    }
    return confirmPassword?.hasError('passwordMismatch')
      ? VALIDATION.MESSAGES.PASSWORDS_MISMATCH
      : '';
  }
}
