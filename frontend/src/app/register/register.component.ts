import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { user } from '../models/user';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  })
export class RegisterComponent {
  user: user = {
    username: '',
    password: '',
    email: '',
    role: 'user'
  };
  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    if (this.user.username && this.user.password) {
      this.authService.createUser(this.user.username, this.user.password, this.user.email, this.user.role).subscribe({
        next: (response) => {
          console.log('User created', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('User creation failed', error);
          alert('User creation failed');
        },
      });
      console.log('User:', this.user);
    } else {
      // Handle case where form data is incomplete
      alert('Please fill in all fields.');
    }
  }

}
