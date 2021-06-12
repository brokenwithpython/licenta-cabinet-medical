import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as $ from 'jquery';
import { ConfirmDialogComponent } from '../my-account/confirmDialog/confirm-dialog.component';
import { ProgramareService } from '../programare/programare.service';
import { SelectHourDialogComponent } from './select-hour-dialog/select-hour-dialog.component';
import { SuccessScheduleDialog } from './successSchedule/success-schedule.component';

@Component({
  selector: 'app-select-medic-and-hour',
  templateUrl: './select-medic-and-hour.component.html',
  styleUrls: ['./select-medic-and-hour.component.css']
})
export class SelectMedicAndHourComponent implements OnInit, AfterContentChecked {

  breakpoint;

  constructor(public programareService: ProgramareService, public dialog: MatDialog) {
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

  postSchedule(medic) {
    // console.log(medic);

  }


  selectHour(medic) {
    const dialogRef = this.dialog.open(SelectHourDialogComponent, {
      width:'250px',
      data: {hours: medic.finalHours}});
    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        if (result[0]) {
          medic.ora = result[1];
          const dialogRef = this.dialog.open(SuccessScheduleDialog, {
            width:'350px',
            data: {
              hour: medic.ora,
              date: medic.date
            }});
          document.getElementById('medicCard' + medic.cardId).style.backgroundColor = "#B4D4F2";
          document.getElementById('medicCard' + medic.cardId).style.transition = "background-color 3s ease-out";
          this.programareService.addSchedule(medic);
        }
      }

    });
  }
}
