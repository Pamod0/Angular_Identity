import { Component, inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { PagedRequest } from '../../../core/models/paged-request.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'userName', 'email', 'twoFactorEnabled'];
  dataSource = new MatTableDataSource<User>([]);
  totalRecords = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private userService = inject(UserService);
  private subscription = new Subscription();

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.getAll());
    this.getAll();
    this.dataSource.sort = this.sort;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
