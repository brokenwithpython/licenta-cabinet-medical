import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ProgramareService } from '../programare/programare.service';

@Component({
  selector: 'app-select-medic-and-hour',
  templateUrl: './select-medic-and-hour.component.html',
  styleUrls: ['./select-medic-and-hour.component.css']
})
export class SelectMedicAndHourComponent implements OnInit, AfterContentChecked {

  breakpoint;

  constructor(public programareService: ProgramareService) {
  }

  options = this.programareService.getScheduleOptions();

  ngOnInit() {
  }

  ngAfterContentChecked() {
    this.breakpoint = (window.innerWidth <= 770) ? 1 : 4;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 770) ? 1 : 4;
  }

  myFunction(medic) {
    console.log(medic);
    // this.programareService.getSchedulingVariants("option2", "asd", "asd");
  }
}
