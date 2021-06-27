import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen-no-auth.component.html',
  styleUrls: ['./main-screen-no-auth.component.css']
})
export class MainScreenNoAuthComponent implements OnInit, OnDestroy {

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

