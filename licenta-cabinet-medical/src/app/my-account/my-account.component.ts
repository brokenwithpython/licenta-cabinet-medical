import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { ProgramareService } from "../programare/programare.service";

@Component({
  selector: 'my-account',
  templateUrl: 'my-account.component.html',
  styleUrls: ['my-account.component.css']
})
export class MyAccountComponent implements OnInit, OnDestroy{

  constructor(private authService: AuthService, public programareService: ProgramareService) {
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
  isLoading = false;
  form: FormGroup;
  personalData;


  ngOnInit() {

    this.personalData = this.authService.getPersonalData(this.authService.getIsMedicAuth());
    this.personalInfoSubs = this.authService.getInfosListner().subscribe(data => {
      this.personalData = data;
      this.form = new FormGroup({
        firstName: new FormControl(this.personalData[4], {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
        lastName:  new FormControl(this.personalData[5], {validators: [Validators.required, Validators.pattern('^[A-Za-z -]+$')]}),
        phoneNumber: new FormControl(this.personalData[0], {validators: [Validators.required, Validators.maxLength(12), Validators.minLength(10), Validators.pattern('^\s*[0-9+]+$')]}),
        cnp: new FormControl(this.personalData[1], {validators: [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern('^[0-9]+$')]}),
        county: new FormControl(this.personalData[2], {validators: [Validators.required]}),
        address: new FormControl(this.personalData[3], {validators: [Validators.required]})
      });
      this.form.disable();
    });
    this.form.disable();
  }

  onChange() {

  }

  disableEditing() {
    this.asd = !this.asd;
    if (this.asd) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  submitChanges() {
    if (this.form.valid) {
      this.authService.putPersonalData(this.form.get('firstName').value, this.form.get('lastName').value,
                                        this.form.get('phoneNumber').value, this.form.get('cnp').value,
                                         this.form.get('address').value, this.form.get('county').value);
      this.asd = !this.asd;
      this.form.disable();
    } else {
      console.log(this.form.value);
    }
  }

  ngOnDestroy() {
    this.personalInfoSubs.unsubscribe();
  }


}
