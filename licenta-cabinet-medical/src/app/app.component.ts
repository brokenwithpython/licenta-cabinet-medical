import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  private authListnerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.autoAuthUser();
    // console.log(this.authService.getIsAuth());
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      console.log(isAuthenticated);
    });
  }
}
