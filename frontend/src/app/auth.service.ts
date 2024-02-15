import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/users/login';
  private logoutUrl = 'http://localhost:3000/users/logout';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  public isLoggedIn(): boolean {
    return this.hasToken();
  }
  getUserRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles || [];
    } catch (error) {
      console.error('Error decoding token', error);
      return [];
    }
  }

  userHasRole(requiredRole: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(requiredRole);
  }
  createUser(username: string, password: string, email: string, role: string): Observable<any> {
    return this.http.post('http://localhost:3000/users/register', { username, password, email, role }, { withCredentials: true });
  }



  login(username: string, password: string): Observable<any> {
    console.log('Attempting login');
    return this.http.post(this.loginUrl, { username, password }, { withCredentials: true }).pipe(
      tap((response: any) => {
        console.log('Login successful, updating state');
        localStorage.setItem('token', response.token);
        this.isLoggedInSubject.next(true);
      })
    );
  }
  
  logout(): Observable<any> {
    console.log('Attempting logout');
    return this.http.get(this.logoutUrl, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Logout successful, updating state');
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
      })
    );
  }
  
}
