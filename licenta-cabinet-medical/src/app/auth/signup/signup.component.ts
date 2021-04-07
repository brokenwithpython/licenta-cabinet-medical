import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{

  constructor(private authService: AuthService) {}

  private authStatusSub: Subscription;
  isLoading = false;

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password);
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


}
