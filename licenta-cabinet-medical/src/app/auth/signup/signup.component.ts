import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../auth.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{

  private authStatusSub: Subscription;
  isLoading = false;
  form: FormGroup;
  continuePressed = false;
  samePasswords = false;
  matcher = new MyErrorStateMatcher();


  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: new FormControl(null, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
      lastName:  new FormControl(null, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
      passwords: new FormGroup({
        password: new FormControl('', {validators: [Validators.required]}),
        confirmPassword: new FormControl('', {validators: [Validators.required]})
      }, {validators: this.checkPasswords}),
      email:  new FormControl(null, {validators: [Validators.required, Validators.email]}),
      phoneNumber: new FormControl(null, {validators: [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]+$')]}),
      cnp: new FormControl(null, {validators: [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern('^[0-9]+$')]}),
      address: new FormControl(null, {validators: [Validators.required]})
    });
  }


  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
      // this.form = new FormGroup({
      //   firstName: new FormControl(null, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
      //   lastName:  new FormControl(null, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
      //   email:  new FormControl(null, {validators: [Validators.required, Validators.email]}),
      //   password: new FormControl('', {validators: [Validators.required]}),
      //   confirmPassword: new FormControl('', {validators: [Validators.required]}),
      //   phoneNumber: new FormControl(null, {validators: [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]+$')]}),
      //   cnp: new FormControl(null, {validators: [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern('^[0-9]+$')]}),
      //   address: new FormControl(null, {validators: [Validators.required]})
      // });
  }

  onSignup() {
    console.log(this.form.value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  continueButtonPressed() {
    if (!this.form.get('email').invalid &&
      !this.form.get('phoneNumber').invalid &&
      !this.form.get('passwords.password').invalid &&
      !this.form.get('passwords.confirmPassword').invalid) {
    this.continuePressed = true;
    console.log(this.form.value)
    }
  }

  // checkPasswords (control: FormControl): {[s: string] : boolean} {
  //   if(this.form) {
  //     if (control.value !== this.form.get("password").value) {
  //       return {'notSame': true};
  //     }
  //   }
  //   return null;
  // }


  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }



}
