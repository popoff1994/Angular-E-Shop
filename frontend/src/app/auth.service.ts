import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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


  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }, { withCredentials: true }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get(this.logoutUrl, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
      })
    );
  }  
}
