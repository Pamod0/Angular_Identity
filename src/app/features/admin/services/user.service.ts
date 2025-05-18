import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { User } from '../users/user.model';
import { PagedResponse } from '../../../core/models/paged-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _apirl: string = environment.apiUrl || 'https://localhost:44369/api';
  private _subUrl: string = 'user';

  private http = inject(HttpClient);

  getAll() {
    return this.http
      .get<PagedResponse<User[]>>(`${this._apirl}/${this._subUrl}/getAll`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (error.status === 0) {
      // Client-side or network error
      return throwError(() => new Error('Network error. Please check your connection.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Users not found.'));
    } else {
      let message = '';
      if (!error.error?.message) {
        message = error.message || 'An unexpected error occurred.';
      } else {
        message = 'An unexpected error occurred.';
      }
      return throwError(() => new Error(message));
    }
  }
}
