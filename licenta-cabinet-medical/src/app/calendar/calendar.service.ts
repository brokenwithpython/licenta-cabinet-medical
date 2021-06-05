import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  public date = new Date();
  public months = [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie"
  ];
  // public firstDayIndex = this.date.ge;
  days = "";


  calculateCurrentMonth(indexOfMonth, currentYear) {
    let lastDay = new Date(currentYear, indexOfMonth + 1, 0).getDate();
    let daysCurrentMonth = Array.from({length: lastDay}, (_, i) => i+1);
    return daysCurrentMonth;
  }

  calculatePrevMonth(indexOfMonth, currentYear) {
    let prevLastDay = new Date(currentYear, indexOfMonth, 0).getDate();
    var firstDay = new Date(currentYear, indexOfMonth, 1).getDay();
    firstDay += 6;
    if(firstDay >= 7) {
      firstDay -=7;
    }
    let daysPrevMonth = Array.from({length: firstDay}, (_, i) => prevLastDay - i).reverse();
    return daysPrevMonth;
  }

  calculateNextMonth(indexOfMonth, currentYear) {
    let lengthOfCurrentMonth = this.calculateCurrentMonth(indexOfMonth, currentYear).length;
    let lengthOfPrevMonth = this.calculatePrevMonth(indexOfMonth, currentYear).length;
    let daysNextMonth = Array.from({length: 42 - lengthOfCurrentMonth - lengthOfPrevMonth},
                                    (_, i) => i + 1);
    // console.log(daysNextMonth);
    return daysNextMonth;
  }

  // calculateCurrentMonthPrevOrNext(indexOfMonth) {
  //   let lastDay = new Date(this.date.getFullYear(), indexOfMonth + 1, 0).getDate();
  //   let daysCurrentMonth = Array.from({length: lastDay}, (_, i) => i+1);
  //   return daysCurrentMonth;
  // }



}
