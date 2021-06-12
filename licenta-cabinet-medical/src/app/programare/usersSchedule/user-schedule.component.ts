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
import { FormControl, FormGroup } from "@angular/forms";
import { FileSelectDirective , FileUploader } from "ng2-file-upload";
import { environment } from "src/environments/environment";
import { UploadPdfDialog } from "../uploadPdfDialog/uploadPdf-dialog.component";

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

  isLoading = false;
  schedules;
  private schedulesSubs: Subscription;
  panelOpenState = false;
  currentDay = new Date().getDate();
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();

  pastSchedules = [];
  nextSchedules = [];
  todaySchedules = [];
  constructor(private programareService: ProgramareService, public authService: AuthService, public dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.schedules = this.getUsersSchedules();
    this.schedulesSubs = this.programareService.getAllScheduleListner().subscribe(res => {
      this.schedules = res;
      this.isLoading = false;
      for(let schedule of this.schedules) {
        if (this.currentDay === parseInt(schedule.date.split(' ')[0])  && this.currentMonth === parseInt(schedule.date.split(' ')[1])) {
          this.todaySchedules.push(schedule);
        } else if (this.currentMonth < parseInt(schedule.date.split(' ')[1])) {
          this.nextSchedules.push(schedule);
        } else if(this.currentMonth > parseInt(schedule.date.split(' ')[1])) {
          this.pastSchedules.push(schedule);
        } else if(this.currentMonth === parseInt(schedule.date.split(' ')[1]) && this.currentDay < parseInt(schedule.date.split(' ')[0])) {
          this.nextSchedules.push(schedule);
        } else if(this.currentMonth === parseInt(schedule.date.split(' ')[1]) && this.currentDay > parseInt(schedule.date.split(' ')[0])) {
          this.pastSchedules.push(schedule);
        }
      }

    })
  }

  downloadPdf(documentPath) {
    this.programareService.downloadPdf(documentPath.split('http://localhost:3000/backend/pdfFiles/')[1]);
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

  openDialogUpload(schedule) {
    const dialogRef = this.dialog.open(UploadPdfDialog, {
      width: '325px',
      data: {name: schedule.userName,
              id: schedule._id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(result[0]) {

        }
      }
    });
  }

  onPdfPicked(event: Event) {
    // const file = (event.target as HTMLInputElement).files[0];
    // this.form.patchValue({image: file});
    // this.form.get('pdf').updateValueAndValidity();
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.pdfPreview = reader.result as string;
    // };
    // reader.readAsDataURL(file);
  }


  ngOnDestroy() {
    this.schedulesSubs.unsubscribe();
  }
}
