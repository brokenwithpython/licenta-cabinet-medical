import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-programare',
  templateUrl: './programare.component.html',
  styleUrls: ['./programare.component.css']
})
export class ProgramareComponent implements OnInit {

  isLoading = false;
  form: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      first_name: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      last_name: new FormControl(null, {validators: [Validators.required]}),
    })
  }


  onSavePost() {
    console.log("nimic");
  }

}

