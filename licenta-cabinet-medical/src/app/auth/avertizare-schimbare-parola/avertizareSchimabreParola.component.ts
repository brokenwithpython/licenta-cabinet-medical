import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProgramareService } from "src/app/programare/programare.service";

@Component({
  selector: 'upload-pdf-dialog',
  templateUrl: 'avertizareSchimabreParola.component.html',
  styleUrls: ['avertizareSchimabreParola.component.css']
})
export class AvertizareSchimbareParola {

  okOrNot = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {date: string, localitate: string},
  public dialogRef: MatDialogRef<AvertizareSchimbareParola>) {}
  form: FormGroup;

  ngOnInit() {
  }

  onSavePost() {
    this.okOrNot = false;
    this.dialogRef.close();
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
