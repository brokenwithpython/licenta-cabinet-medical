import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'success-create',
  templateUrl: './success-create.component.html',
  styleUrls: ['./success-create.component.css']
})
export class SuccessCreateAccountDialog {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {email: string, name: string},
              public dialogRef: MatDialogRef<SuccessCreateAccountDialog>) {
  }

}
