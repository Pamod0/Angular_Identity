import { Component, inject, Inject, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name', 'email', '2fa'];
  // users: User[] = [];

  dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private userService = inject(UserService);
  private subscription = new Subscription();

  ngAfterViewInit() {
    this.getAll();
    this.dataSource.paginator = this.paginator;
  }

  getAll() {
    const usersSub = this.userService.getAll().subscribe({
      next: (response) => {
        console.log('Users:', response.data);
        this.dataSource.data = response.data;
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
