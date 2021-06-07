import { Component, OnInit, ViewChild } from "@angular/core";
import { MatAccordion } from "@angular/material/expansion";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { ProgramareService } from "../programare.service";

@Component({
  selector: 'user-schedule',
  templateUrl: './user-schedule.component.html',
  styleUrls: ['./user-schedule.component.css']
})
export class UserScheduleComponent implements OnInit{
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private programareService: ProgramareService, private authService: AuthService) {  }

  schedules;
  private schedulesSubs: Subscription;

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
}
