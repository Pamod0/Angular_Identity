import { Component, ViewChild, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSidenav,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatBadgeModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
    MatRippleModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  isDarkTheme = false;
  isCollapsed = false;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/', notifications: 0 },
    { icon: 'bar_chart', label: 'Analytics', route: '/analytics', notifications: 0 },
    { icon: 'people', label: 'Users', route: '/admin/users', notifications: 0 },
    { icon: 'shopping_cart', label: 'Orders', route: '/orders', notifications: 0 },
    { icon: 'inventory', label: 'Products', route: '/products', notifications: 0 },
    { icon: 'settings', label: 'Settings', route: '/settings', notifications: 0 },
  ];

  private authService = inject(AuthService);

  constructor() {
    this.checkScreenSize();
    this.loadThemePreference();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    if (window.innerWidth < 1024 && this.isCollapsed) {
      this.isCollapsed = false;
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  toggleSidenavCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('darkTheme', this.isDarkTheme.toString());
    this.applyTheme();
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('darkTheme');
    this.isDarkTheme = savedTheme === 'true';
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  getTotalNotifications(): number {
    return this.menuItems.reduce((sum, item) => sum + item.notifications, 0);
  }

  logOut(): void {
    this.authService.logout();
  }
}
