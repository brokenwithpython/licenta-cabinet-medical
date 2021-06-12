import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { ProgramareService } from "src/app/programare/programare.service";
import { AuthService } from "../auth.service";
import { SuccessCreateAccountDialog } from "./successSchedule/success-create.component";

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
  medicOrNot = false;


  constructor(private authService: AuthService, private fb: FormBuilder, public programareService: ProgramareService, public dialog: MatDialog) {
    this.form = this.fb.group({
      firstName: new FormControl(null, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
      lastName:  new FormControl(null, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
      passwords: new FormGroup({
        password: new FormControl('', {validators: [Validators.required]}),
        confirmPassword: new FormControl('', {validators: [Validators.required]})
      }, {validators: this.checkPasswords}),
      email:  new FormControl(null, {validators: [Validators.required, Validators.email]}),
      phoneNumber: new FormControl('+40', {validators: [Validators.required, Validators.maxLength(12), Validators.minLength(10), Validators.pattern('^\s*[0-9+]+$')]}),
      cnp: new FormControl(null, {validators: [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern('^[0-9]+$')]}),
      county: new FormControl('', {validators: [Validators.required]}),
      address: new FormControl(null, {validators: [Validators.required]}),
      specialization: new FormControl(''),
      isMedic: new FormControl(false)
    });
  }


  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    // console.log(this.form.value);
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      const dialogRef = this.dialog.open(SuccessCreateAccountDialog, {
        width:'325px',
        data: {
          email: form.value.email,
          name: form.value.lastName + ' ' + form.value.firstName
        }});
      this.authService.createUser(form.value.email, form.value.passwords.password,
                                  form.value.phoneNumber, form.value.lastName,
                                  form.value.firstName, form.value.cnp,
                                  form.value.county, form.value.address,
                                  form.value.specialization, form.value.isMedic);

    }
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
    // console.log(this.form.value)
    }
  }

  backToFirstForm() {
    this.continuePressed = false;
  }

  toggleButtonPressed() {
    this.medicOrNot = !this.medicOrNot;
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }



}
