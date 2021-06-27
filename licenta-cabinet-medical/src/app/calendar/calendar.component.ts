import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarService } from './calendar.service';
import {MatMenuTrigger} from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';
import { ProgramareService } from '../programare/programare.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  monthNumber = this.calendarService.date.getMonth();
  currentYear = this.calendarService.date.getFullYear();
  currentMonth = this.calendarService.months[this.calendarService.date.getMonth()];
  currentDate = this.calendarService.date.toDateString();
  currentDay = this.calendarService.date.getDate();

  curentMonthDays = this.calendarService.calculateCurrentMonth(this.monthNumber, this.currentYear);
  prevMonthDays = this.calendarService.calculatePrevMonth(this.monthNumber, this.currentYear);
  nextMonthDays = this.calendarService.calculateNextMonth(this.monthNumber, this.currentYear);



  constructor(public calendarService: CalendarService, public dialog: MatDialog
    ,public programareService: ProgramareService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let day = document.getElementById("day" + this.currentDay.toString());
    day.className += "today";
  }

  nextMonth() {
    this.monthNumber += 1;
    if(this.monthNumber === 12) {
      this.monthNumber = 0;
      this.currentYear += 1;
    }
    this.currentMonth = this.calendarService.months[this.monthNumber];
    this.curentMonthDays = this.calendarService.calculateCurrentMonth(this.monthNumber,this.currentYear);
    this.prevMonthDays = this.calendarService.calculatePrevMonth(this.monthNumber, this.currentYear);
    this.nextMonthDays = this.calendarService.calculateNextMonth(this.monthNumber, this.currentYear);
  }

  prevMonth() {
    this.monthNumber -= 1;
    if(this.monthNumber === -1) {
      this.monthNumber = 11;
      this.currentYear -= 1;
    }
    this.currentMonth = this.calendarService.months[this.monthNumber];
    this.curentMonthDays = this.calendarService.calculateCurrentMonth(this.monthNumber,this.currentYear);
    this.prevMonthDays = this.calendarService.calculatePrevMonth(this.monthNumber, this.currentYear);
    this.nextMonthDays = this.calendarService.calculateNextMonth(this.monthNumber, this.currentYear);
  }

  dayClick(event) {

    let date = event.srcElement.id.toString().slice(3) + " " + (this.monthNumber) + " " + this.currentYear;
    let dTemp = date.split(" ");
    let dFinal = new Date(parseInt(dTemp[2]), parseInt(dTemp[1]), parseInt(dTemp[0]));
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width:'325px',
      data: {date: date,
              localitate: this.programareService.judete}});
    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        if (result[0]) {
          this.programareService.getSchedulingVariants(result[2], result[1], dFinal, result[3]);
        }
      }

    });

  }

  openDialog() {

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
  }
}
