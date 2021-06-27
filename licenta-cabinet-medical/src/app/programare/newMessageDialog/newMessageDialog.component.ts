import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "src/app/auth/auth.service";
import { FinalizareTrimitereMesajDialogComponent } from "../finalizareTrimitereMesaj/finalizareTrimitereMesajDialog.component";

@Component({
  selector: 'programare-dialog',
  templateUrl: './newMessageDialog.component.html',
  styleUrls: ['./newMessageDialog.component.css']
})
export class NewMessageDialogComponent {

  form: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {email: string, isMedic: boolean},
  public dialogRef: MatDialogRef<NewMessageDialogComponent>, private authService: AuthService, public dialog: MatDialog) {

    this.form = new FormGroup({
      message: new FormControl(null, {validators: [Validators.required]}),
    })
  }

  onSendMessage() {
    this.authService.sendMessage(this.data.email, this.form.get('message').value, this.data.isMedic);
    this.dialogRef.close();
    const anotherDialogRef = this.dialog.open(FinalizareTrimitereMesajDialogComponent, {
      width: '325px',
      data: {title: "Trimitere mesaj",
              text: "Mesajul a fost trimis cu succes catre " + this.data.email}
    });

    anotherDialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });

  }

}
