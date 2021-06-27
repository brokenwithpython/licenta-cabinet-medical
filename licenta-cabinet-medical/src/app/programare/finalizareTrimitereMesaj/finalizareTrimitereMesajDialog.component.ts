import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'programare-dialog',
  templateUrl: './finalizareTrimitereMesajDialog.component.html',
  styleUrls: ['./finalizareTrimitereMesajDialog.component.css']
})
export class FinalizareTrimitereMesajDialogComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, text: string},
  public dialogRef: MatDialogRef<FinalizareTrimitereMesajDialogComponent>) {}

}
