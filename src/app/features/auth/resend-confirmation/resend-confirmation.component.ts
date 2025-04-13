import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResendConfirmationEmailRequest } from '../../../core/models/auth.model';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-resend-confirmation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './resend-confirmation.component.html',
  styleUrl: './resend-confirmation.component.scss',
})
export class ResendConfirmationComponent {
  resendForm: FormGroup;
  isLoading = false;
  isEmailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.resendForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.resendForm.invalid) {
      return;
    }

    this.isLoading = true;
    const request: ResendConfirmationEmailRequest = {
      email: this.resendForm.value.email,
    };

    this.authService.resendConfirmationEmail(request).subscribe({
      next: (response) => {
        this.isEmailSent = true;
        this.snackBar.open(
          response.message || 'Confirmation email resent successfully. Please check your inbox.',
          'Close',
          {
            duration: 5000,
          },
        );
      },
      error: (err) => {
        this.snackBar.open(
          err.error.message ||
            'Failed to resend confirmation email. The email may already be confirmed or invalid.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          },
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
