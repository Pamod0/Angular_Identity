import { Component, inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PagedRequest } from '../../../core/models/paged-request.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'email', '2fa'];
  dataSource = new MatTableDataSource<User>([]);
  totalRecords = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private userService = inject(UserService);
  private subscription = new Subscription();

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.getAll());
    this.getAll();
  }

  getAll() {
    const request: PagedRequest = {
      page: this.paginator?.pageIndex + 1 || 1,
      pageSize: this.paginator?.pageSize || 10,
      searchText: '',
      exactMatch: false,
    };

    const usersSub = this.userService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });

    this.subscription.add(usersSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
