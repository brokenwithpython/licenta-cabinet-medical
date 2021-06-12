import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { ProgramareService } from "../programare/programare.service";
import { ConfirmDialogComponent } from "./confirmDialog/confirm-dialog.component";
import { UploadImageDialog } from "./uploadImageDialog/upload-image-dialog.component";

@Component({
  selector: 'my-account',
  templateUrl: 'my-account.component.html',
  styleUrls: ['my-account.component.css']
})
export class MyAccountComponent implements OnInit, OnDestroy{

  constructor(public authService: AuthService, public programareService: ProgramareService, public dialog: MatDialog, private sanitizer: DomSanitizer) {
    this.form = new FormGroup({
      firstName: new FormControl(null),
      lastName:  new FormControl(null),
      phoneNumber: new FormControl(null),
      cnp: new FormControl(null),
      county: new FormControl(null),
      address: new FormControl(null)
    });
  }
  asd = false;
  private personalInfoSubs: Subscription;
  private profileImageSubs: Subscription;
  isLoading = false;
  form: FormGroup;
  public personalData;
  public imagePath = ''

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  ngOnInit() {

    this.personalData = this.authService.getPersonalData(this.authService.getIsMedicAuth());
    this.personalInfoSubs = this.authService.getInfosListner().subscribe(data => {
      this.personalData = data;
      this.imagePath = this.personalData.imagePath;
      console.log(this.personalData.imagePath === '')
      this.form = new FormGroup({
        firstName: new FormControl(this.personalData.firstName, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
        lastName:  new FormControl(this.personalData.lastName, {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
        phoneNumber: new FormControl(this.personalData.phoneNumber, {validators: [Validators.required, Validators.maxLength(12), Validators.minLength(10), Validators.pattern('^\s*[0-9+]+$')]}),
        cnp: new FormControl(this.personalData.CNP, {validators: [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern('^[0-9]+$')]}),
        county: new FormControl(this.personalData.county, {validators: [Validators.required]}),
        address: new FormControl(this.personalData.address, {validators: [Validators.required]})
      });
      this.form.disable();
    });
    this.form.disable();
  }

  onChange() {

  }

  openDialogUpload() {
    const dialogRef = this.dialog.open(UploadImageDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(result[0]) {

        }
      }
    });
  }


  enableEditing() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.asd = true
        this.form.enable();
      }
    });
  }

  disableEditing() {
    this.asd = false;
    this.form.disable();
  }

  submitChanges() {
    if (this.form.valid) {
      this.authService.putPersonalData(this.form.get('firstName').value, this.form.get('lastName').value,
                                        this.form.get('phoneNumber').value, this.form.get('cnp').value,
                                         this.form.get('address').value, this.form.get('county').value);
      this.disableEditing()
    } else {
      console.log(this.form.value);
    }
  }

  ngOnDestroy() {
    this.personalInfoSubs.unsubscribe();
  }


}
