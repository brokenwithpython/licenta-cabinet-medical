import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.css']

})
export class CalendarDialogComponent implements OnInit {

  okOrNot = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {date: string, localitate: string},
  public dialogRef: MatDialogRef<CalendarDialogComponent>, public authService: AuthService) {}
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      problema: new FormControl(null, {validators: [Validators.required]}),
      localitate: new FormControl(null, {validators: [Validators.required]}),
      data: new FormControl(this.data.date , {validators: [Validators.required]}),
      consultatieOnline: new FormControl(false)
    });
  }

  onSavePost() {
    this.okOrNot = false;
    this.dialogRef.close();
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
