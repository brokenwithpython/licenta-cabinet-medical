import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarService } from './calendar.service';

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



  constructor(public calendarService: CalendarService) {
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
    console.log(event.srcElement.id.toString().slice(3) + " " + (this.monthNumber + 1) + " " + this.currentYear);

  }

}
