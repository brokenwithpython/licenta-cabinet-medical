import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { stringify } from "@angular/compiler/src/util";
import { ThrowStmt } from "@angular/compiler";


const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatusListner = new Subject<boolean>();
  private token: string;
  private userId: string;
  private tokenTimer: NodeJS.Timer;
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {

  }


  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{}>(BACKEND_URL + 'sign-up', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListner.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    console.log(authData);
    this.http.post<{token: string, userId: string, expiresIn: number}>(BACKEND_URL + 'login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration );
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListner.next(false);
      });
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListner.next(true);
      }
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || !userId) {
      return;
    } else {
      return {token: token, expirationDate: new Date(expirationDate), userId: userId};
    }
  }

  private setAuthTimer(duration) {
    this.tokenTimer = setTimeout(() => {
      console.log(duration);
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getUserId() {
    return this.userId;
  }


}
