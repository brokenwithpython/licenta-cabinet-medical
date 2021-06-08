import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatAccordion, MatExpansionPanel } from "@angular/material/expansion";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { ProgramareService } from "../programare.service";
import * as $ from 'jquery';
import { formatWithOptions } from "node:util";

export interface IsPanelOpen {
  id: string;
  isOpen: boolean
}

@Component({
  selector: 'user-schedule',
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.css']
})
export class UserScheduleComponent implements OnInit, OnDestroy{
  @ViewChild(MatExpansionPanel) panel: MatExpansionPanel;

  constructor(private programareService: ProgramareService, private authService: AuthService) {  }

  schedules;
  private schedulesSubs: Subscription;
  panelOpenState = false;


  ngOnInit() {
    this.schedules = this.getUsersSchedules();
    this.schedulesSubs = this.programareService.getAllScheduleListner().subscribe(res => {
      this.schedules = res;
      console.log(this.schedules);
    })
  }

  getUsersSchedules() {
    if(this.authService.getIsMedicAuth()) {
      this.schedules = this.programareService.getMedicSchedules();
    } else {
      this.schedules = this.programareService.getUserSchedules();
    }
  }

  designPanel(schedule) {
      if(this.panelOpenState == true) {
        document.getElementById('panelSchedule-' + schedule._id.toString()).style.backgroundColor = "#B4D4F2";
      } else {
        document.getElementById('panelSchedule-' + schedule._id.toString()).style.backgroundColor = "#ffff";
      }
  }


  ngOnDestroy() {
    this.schedulesSubs.unsubscribe();
  }
}
