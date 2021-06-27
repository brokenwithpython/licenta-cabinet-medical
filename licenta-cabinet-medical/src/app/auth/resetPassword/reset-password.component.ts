import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../auth.service";
import { AvertizareSchimbareParola } from "../avertizare-schimbare-parola/avertizareSchimabreParola.component";
import { ChangeResetPasswordComponent } from "../changeResetPassword/change-reset-password.component";

@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

form: FormGroup;

constructor(private authService: AuthService, private dialog: MatDialog) {}

ngOnInit () {
  this.form = new FormGroup({
    email: new FormControl(null, {validators: [Validators.required]}),
    isMedic: new FormControl(false)
  });
}


onReset() {
  const dialogRef = this.dialog.open(AvertizareSchimbareParola, {
    width:'325px'});
  dialogRef.afterClosed().subscribe(result =>{
    this.authService.resetPassword(this.form.get('email').value, this.form.get('isMedic').value);
  });
}


}
