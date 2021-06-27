import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProgramareService } from "../programare.service";

@Component({
  selector: 'upload-pdf-dialog',
  templateUrl: 'uploadPdf-dialog.component.html',
  styleUrls: ['uploadPdf-dialog.component.css']
})
export class UploadPdfDialog {

  form: FormGroup;
  pdfName: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string, id: string},
  public dialogRef: MatDialogRef<UploadPdfDialog>, private programareService: ProgramareService) {
    this.form = new FormGroup({
      pdf: new FormControl(null)
    })
  }
  onPdfPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({pdf: file});
    this.form.get('pdf').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.pdfName = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    const finalName = this.form.get('pdf').value.name.split('.')[0] + '-' + this.data.id;
    this.programareService.addPdfToSchedule(this.form.get('pdf').value, this.data.id);
  }
}
