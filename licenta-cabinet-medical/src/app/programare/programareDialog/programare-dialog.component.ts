import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'programare-dialog',
  templateUrl: './programare-dialog.component.html',
  styleUrls: ['./programare-dialog.component.css']
})
export class ProgramareDialogComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, text: string},
  public dialogRef: MatDialogRef<ProgramareDialogComponent>) {}

}
