import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn = false;
  private authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.ngZone.run(() => {
        this.isLoggedIn = isLoggedIn;
      });
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logged out', response);
        this.router.navigate(['/login']);
      },
      error: (error) => console.error('Logout failed', error),
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
