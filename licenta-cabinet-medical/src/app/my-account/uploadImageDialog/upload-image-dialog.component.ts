import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "src/app/auth/auth.service";
import { __asyncValues } from "tslib";
import { mimeType } from "../mime-type.validator";

@Component({
  selector: 'upload-image-dialog',
  templateUrl: 'upload-image-dialog.component.html',
  styleUrls: ['upload-image-dialog.component.css']
})
export class UploadImageDialog implements OnInit{

  form: FormGroup;
  imagePreview: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string},
  public dialogRef: MatDialogRef<UploadImageDialog>, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    this.authService.uploadProfilePhoto(this.form.get('image').value);
  }
}
