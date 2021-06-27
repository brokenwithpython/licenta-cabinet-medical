import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'edit-add-info-schedule-component',
  templateUrl: './edit-add-info-schedule.component.html',
  styleUrls: ['edit-add-info-schedule.component.css']
})
export class EditAddInfoScheduleComponent {

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, text: string,
                                                      note: string, contraindicatii: string, indicatii: string},
  public dialogRef: MatDialogRef<EditAddInfoScheduleComponent>) {

    console.log(data.contraindicatii);
    this.form = new FormGroup({
      note: new FormControl(data.note),
      contraindicatii: new FormControl(data.contraindicatii),
      indicatii: new FormControl(data.indicatii)
    })
  }


  onSignup(form) {

  }


}
