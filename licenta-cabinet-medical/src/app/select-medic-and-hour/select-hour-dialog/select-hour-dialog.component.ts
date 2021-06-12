import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-select-hour-dialog',
  templateUrl: './select-hour-dialog.component.html',
  styleUrls: ['./select-hour-dialog.component.css']
})
export class SelectHourDialogComponent {

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {hours: []},
              public dialogRef: MatDialogRef<SelectHourDialogComponent>) {

    this.form = new FormGroup({
      ora: new FormControl([...data.hours][0] , {validators: [Validators.required]}),
    })
  }

  onSavePost() {

  }


}
