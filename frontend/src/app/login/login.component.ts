import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    const usernameLowercase = this.username.toLowerCase();
    this.authService.login(usernameLowercase, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        
        this.router.navigate(['/']); 
      },
      error: (error) => {
        console.error('Login failed', error);
        
      }
    });
  }
 }