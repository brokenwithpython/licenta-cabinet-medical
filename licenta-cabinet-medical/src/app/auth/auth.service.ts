import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { UserInfo } from "./user-info.model";
import { MedicInfo } from "./medic-info.model";
import {saveAs} from "file-saver";




const BACKEND_URL = environment.apiUrl + 'user/';
const BACKEND_URL_MEDIC = environment.apiUrl + 'medic/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatusListner = new Subject<boolean>();
  private retriveInfosListner = new Subject();
  private profileImageListner = new Subject();
  private token: string;
  private userId: string;
  private isMedic: string;
  private tokenTimer: NodeJS.Timer;
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {

  }


  createUser(email: string, password: string,
              phoneNumber: string, lastName: string,
              firstName: string, CNP: string, county: string,
              address: string, specialization: string, isMedic: boolean) {

    if (isMedic) {
      const medicInfo: MedicInfo = {email: email, password: password,
                                phoneNumber: phoneNumber, lastName: lastName,
                                firstName: firstName, CNP: CNP,
                                county: county, address: address,
                                specialization: specialization, isMedic: isMedic};
      this.http.post<{}>(BACKEND_URL_MEDIC + 'sign-up', medicInfo)
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListner.next(false);
      });
    } else {
      const userInfo: UserInfo = {email: email, password: password,
                                phoneNumber: phoneNumber, lastName: lastName,
                                firstName: firstName, CNP: CNP,
                                county: county, address: address, isMedic: isMedic};
      this.http.post<{}>(BACKEND_URL + 'sign-up', userInfo)
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListner.next(false);
      });
    }
  }

  login(email: string, password: string, isMedic: boolean) {
    const authData: AuthData = {email: email, password: password};
    let backendApiLink
    if(isMedic) {
      backendApiLink= BACKEND_URL_MEDIC;
    } else {
      backendApiLink = BACKEND_URL;
    }
    this.http.post<{token: string, userId: string, expiresIn: number, isMedic: string}>(backendApiLink + 'login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          this.isMedic = response.isMedic;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId, this.isMedic);
          this.router.navigate(['/home']);
        }
      }, error => {
        this.authStatusListner.next(false);
      });
  }

  getPersonalData(isMedic) {
    let backendApiLink
    if(isMedic) {
      backendApiLink= BACKEND_URL_MEDIC;
    } else {
      backendApiLink = BACKEND_URL;
    }
    const queryParams = `?userId=${this.getUserId()}`;
    this.http.get<{message: string, personalData: []}>(backendApiLink + 'getPersonalInfo/' + queryParams)
      .subscribe(res => {
        this.retriveInfosListner.next(res.personalData);
        return res.personalData;
      })
  }

  putPersonalData(firstName: string, lastName: string,
                  phoneNumber: string, CNP: string,
                  address: string, county: string) {
    const myData = {
      userId: this.userId,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      CNP: CNP,
      address: address,
      county: county
    }
    let backendApiLink
    if(this.getIsMedicAuth()) {
      backendApiLink= BACKEND_URL_MEDIC;
    } else {
      backendApiLink = BACKEND_URL;
    }
    this.http.put(backendApiLink + "putPersonalInfo", myData).subscribe(data => {

    })


  }

  uploadProfilePhoto(file) {
    let backendlink = BACKEND_URL;
    if(this.getIsMedicAuth()) {
      backendlink = BACKEND_URL_MEDIC
    }
    const postProfileImage = new FormData();
    postProfileImage.append("image", file, file.name.split('.')[0] + '-' + this.getUserId());
    postProfileImage.append("id", this.getUserId());
    this.http.post(backendlink + 'uploadProfilePhoto', postProfileImage).subscribe((result) => {
      this.getPersonalData(this.getIsMedicAuth());
    })

  }

  downloadProfilePhoto() {
    const queryParam = `?userId=${this.getUserId()}`
    this.http.get(BACKEND_URL + 'downloadPhoto' + queryParam, {
      responseType: 'blob',
    }).subscribe(file => {
      let image = saveAs(file, 'profileImage.png');
      this.profileImageListner.next(image);
      return image;
    })
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isMedic = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    // console.log("asd");
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
        this.isMedic = authInformation.isMedic;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListner.next(true);
      }
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const isMedic = localStorage.getItem('isMedic');
    if (!token || !expirationDate || !userId) {
      return;
    } else {
      return {token: token, expirationDate: new Date(expirationDate), userId: userId, isMedic: isMedic};
    }
  }

  private setAuthTimer(duration) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, isMedic: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('isMedic', isMedic);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
    localStorage.removeItem('isMedic');
  }

  resetPassword(email, isMedic) {
    let user = {
      email: email,
      isMedic: isMedic
    }
    this.http.post(environment.apiUrl + 'sendEmail/resetPassword', user).subscribe(response => {
      console.log(response);
    });
  }

  sendMessage (email,  message, isMedic) {
    let userData = {
      email: email,
      message: message,
      isMedic: isMedic
    }
    this.http.post(environment.apiUrl + 'sendEmail/sendMessage', userData).subscribe(response => {
      console.log(response)
    });
  }

  resetChangePassword(password, token, isMedic) {
    let user = {
      password: password,
      token: token,
      isMedic: isMedic
    }
    this.http.post(environment.apiUrl + 'sendEmail/resetChangePassword', user).subscribe(response => {
      console.log(response);
    })
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsMedicAuth() {
    if(localStorage.getItem('isMedic')) {
      return localStorage.getItem('isMedic') === 'true';
    }
    return false;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getInfosListner() {
    return this.retriveInfosListner.asObservable();
  }

  getProfileImageListner() {
    return this.profileImageListner.asObservable();
  }

  getUserId() {
    return this.userId;
  }


}
