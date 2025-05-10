import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, Subscription, tap } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  SNACKBAR_DURATION: 3000,
  MESSAGES: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Not a valid email',
  },
};

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  authForm!: FormGroup;
  isLoading: boolean = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(VALIDATION.PASSWORD_MIN_LENGTH)]],
    });
  }

  onSubmit() {}

  getEmailErrorMessage() {
    const email = this.authForm.get('email');
    if (email?.hasError('required')) {
      return VALIDATION.MESSAGES.EMAIL_REQUIRED;
    }
    return email?.hasError('email') ? VALIDATION.MESSAGES.EMAIL_INVALID : '';
  }
}
