import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit, OnDestroy {

  private authListnerSubs: Subscription;
  userIsAuthenticated = false;


  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }

}

