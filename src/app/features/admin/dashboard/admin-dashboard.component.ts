import { Component, ViewChild, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

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
  selector: 'app-admin-dashboard',
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
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  isDarkTheme = false;
  isCollapsed = false;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', notifications: 0 },
    { icon: 'bar_chart', label: 'Analytics', route: '/analytics', notifications: 2 },
    { icon: 'people', label: 'Users', route: '/users', notifications: 0 },
    { icon: 'shopping_cart', label: 'Orders', route: '/orders', notifications: 5 },
    { icon: 'inventory', label: 'Products', route: '/products', notifications: 0 },
    { icon: 'settings', label: 'Settings', route: '/settings', notifications: 0 },
  ];

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
}
