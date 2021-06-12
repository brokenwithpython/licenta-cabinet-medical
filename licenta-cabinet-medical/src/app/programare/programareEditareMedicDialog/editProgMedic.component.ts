import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'edit-programare-medic-dialog',
  templateUrl: './editProgMedic.component.html',
  styleUrls: ['./editProgMedic.component.css']
})
export class EditProgDialogComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, text: string},
  public dialogRef: MatDialogRef<EditProgDialogComponent>) {}

}
