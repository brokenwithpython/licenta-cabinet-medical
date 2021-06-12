import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "src/app/auth/auth.service";
import { __asyncValues } from "tslib";
import { mimeType } from "../mime-type.validator";

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit{

  form: FormGroup;
  imagePreview: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string},
  public dialogRef: MatDialogRef<ConfirmDialogComponent>, private authService: AuthService) {

  }

  ngOnInit(): void {

  }
}
