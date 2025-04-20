import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailConfirmationRequest } from '../../../core/models/auth.model';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent {
  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.confirmEmail();
  }

  confirmEmail(): void {
    this.isLoading = true;
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!userId || !token) {
      this.errorMessage =
        'Invalid confirmation link. Please check your email for the correct link.';
      this.isLoading = false;
      return;
    }

    const request: EmailConfirmationRequest = { userId, token };

    this.authService.confirmEmail(request).subscribe({
      next: (response) => {
        this.isSuccess = true;
        this.snackBar.open('Email confirmed successfully! You can now log in.', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage =
          err.error.message ||
          'Email confirmation failed. The link may have expired or is invalid.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
