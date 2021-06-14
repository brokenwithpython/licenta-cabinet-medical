import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

form: FormGroup;

constructor(private authService: AuthService) {}

ngOnInit () {
  this.form = new FormGroup({
    email: new FormControl(null, {validators: [Validators.required]}),
    isMedic: new FormControl(false)
  });
}


onReset() {
  this.authService.resetPassword(this.form.get('email').value, this.form.get('isMedic').value);
}


}
