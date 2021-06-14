import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth.service";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'change-reset-password',
  templateUrl: 'change-reset-password.component.html',
  styleUrls: ['change-reset-password.component.css']
})
export class ChangeResetPasswordComponent implements OnInit{


  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  constructor (private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) {

    this.form = this.fb.group({
      passwords: new FormGroup({
        password: new FormControl('', {validators: [Validators.required]}),
        confirmPassword: new FormControl('', {validators: [Validators.required]})}
      , {validators: this.checkPasswords})
     });

  }

  ngOnInit() {

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }

  onChange() {
    if (!this.form.invalid)
    {
      this.authService.resetChangePassword(this.form.get("passwords.password").value,
      this.route.snapshot.params['token'],
      this.route.snapshot.params['isMedic']);
    }
  }

}
