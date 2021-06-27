import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'success-schedule',
  templateUrl: './success-schedule.component.html',
  styleUrls: ['./success-schedule.component.css']
})
export class SuccessScheduleDialog {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {hour: string, date: string},
              public dialogRef: MatDialogRef<SuccessScheduleDialog>) {
  }

  onSavePost() {

  }


}
