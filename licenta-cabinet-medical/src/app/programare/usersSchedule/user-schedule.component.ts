import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatAccordion, MatExpansionPanel } from "@angular/material/expansion";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { ProgramareService } from "../programare.service";
import * as $ from 'jquery';
import { formatWithOptions } from "node:util";
import { MatDialog } from "@angular/material/dialog";
import { ProgramareDialogComponent } from "../programareDialog/programare-dialog.component";
import { Router } from "@angular/router";
import { EditProgDialogComponent } from "../programareEditareMedicDialog/editProgMedic.component";
import { EditAddInfoScheduleComponent } from "../editare-adaugare-info-programare/edit-add-info-schedule.component";

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

  constructor(private programareService: ProgramareService, public authService: AuthService, public dialog: MatDialog,
              private router: Router) {  }
  isLoading = false;
  schedules;
  private schedulesSubs: Subscription;
  panelOpenState = false;


  ngOnInit() {
    this.schedules = this.getUsersSchedules();
    this.schedulesSubs = this.programareService.getAllScheduleListner().subscribe(res => {
      this.schedules = res;
      console.log(this.schedules);
      this.isLoading = false;
    })
  }

  getUsersSchedules() {
    this.isLoading = true;
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

  deleteSchedule(schedule) {
    const dialogRef = this.dialog.open(ProgramareDialogComponent, {
      width:'325px',
      data: { title: "Stergere programare"
              ,text: "Doriti sa stergeti programarea din data: " + schedule.date + " ora : " + schedule.hour +  " ?"}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        this.isLoading = true;
        this.programareService.deleteSchedule(schedule);
        this.ngOnInit();
      }
    });
  }

  editSchedule(schedule) {
    const dialogRef = this.dialog.open(ProgramareDialogComponent, {
      width:'325px',
      data: { title: "Editare programare"
              ,text: "Doriti sa editati programarea din data: " + schedule.date + " ora : " + schedule.hour +  " ?" +
            " Asta va duce la stergerea programarii curente!"}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        this.isLoading = true;
        this.programareService.deleteSchedule(schedule);
        this.router.navigate(['/programare'])
      }
    });
  }

  editScheduleInfo(schedule) {
    const dialogRef = this.dialog.open(EditProgDialogComponent, {
      width:'325px',
      data: { title: "Editare programare",
              text: "Doriti sa editati/adaugati informatii acestei programari?",
            }
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        console.log(schedule.contraindicatii);
        const editDialogRef = this.dialog.open(EditAddInfoScheduleComponent, {
          width:'700px',
          height: '600px',
          data: { title: "Editare programare",
                  text: "Doriti sa editati/adaugati informatii acestei programari?",
                  note: schedule.note,
                  contraindicatii: schedule.contraindicatii,
                  indicatii: schedule.indicatii
                }
        });

        editDialogRef.afterClosed().subscribe(result => {
          if(result) {
            if(result[0]) {
              schedule.note = result[1];
              schedule.contraindicatii = result[2];
              schedule.indicatii = result[3];
              this.programareService.putInfoSchedule(schedule);
            }
          }
        });
      }
    });
  }


  ngOnDestroy() {
    this.schedulesSubs.unsubscribe();
  }
}
