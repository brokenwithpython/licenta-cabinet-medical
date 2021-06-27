import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Moment } from 'moment';
import { ProgramareService } from './programare.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'app-programare',
  templateUrl: './programare.component.html',
  styleUrls: ['./programare.component.css']

})
export class ProgramareComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  minDate: Date;
  maxDate: Date;

  myFilter = (d: Moment | null): boolean => {
    let day = null;
    if(d) {
      day = d.day();
    } else {
      day = new Date().getDay();
    }
    return day !== 0 && day !== 6;
  }


  constructor(public programareService: ProgramareService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 0, new Date().getMonth() + 3, 0);

   }



  ngOnInit(): void {
    let calendarDate = new Date();
    if (new Date().getDay() == 6) {
      calendarDate.setDate(calendarDate.getDate() + 2);
    } else if (new Date().getDay() == 0) {
      calendarDate.setDate(calendarDate.getDate() + 1);
    }
    this.form = new FormGroup({
      problema: new FormControl(null, {validators: [Validators.required]}),
      judet: new FormControl(null, {validators: [Validators.required]}),
      data: new FormControl(calendarDate, {validators: [Validators.required]}),
      consultatieOnline: new FormControl(false)
    });
  }


  onSavePost() {
    if (this.form.valid) {
      this.programareService.getSchedulingVariants(this.form.get('problema').value,
                                                    this.form.get('judet').value,
                                                    this.form.get('data').value,
                                                    this.form.get('consultatieOnline').value);
    } else {
      console.log(this.form.value);
    }
  }

}
