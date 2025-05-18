import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../users/user.model';
import { PagedResponse } from '../../../core/models/paged-response.model';
import { PagedRequest } from '../../../core/models/paged-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _apirl: string = environment.apiUrl || 'https://localhost:44369/api';
  private _subUrl: string = 'user';

  private http = inject(HttpClient);

  getAll(request: PagedRequest): Observable<PagedResponse<User[]>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('pageSize', request.pageSize.toString());

    if (request.searchText) {
      params = params.set('searchText', request.searchText);
    }

    if (request.exactMatch !== undefined) {
      params = params.set('exactMatch', request.exactMatch.toString());
    }

    return this.http
      .get<PagedResponse<User[]>>(`${this._apirl}/${this._subUrl}/getAll`, { params })
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
