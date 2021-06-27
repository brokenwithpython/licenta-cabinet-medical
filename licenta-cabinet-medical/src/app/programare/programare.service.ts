import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Schedule } from "./programare.model";
import {saveAs} from "file-saver";

const BACKEND_URL = environment.apiUrl + 'schedule/';


@Injectable({
  providedIn: 'root'
})
export class ProgramareService {

  scheduleOptions = [];
  private allSchedulesListner = new Subject();
  userSchedules = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  public oreDeLucru = [
    "8.30",
    "9.00",
    "9.30",
    "10.00",
    "10.30",
    "11.00",
    "11.30",
    "12.00",
    "13.30",
    "14.00",
    "14.30",
    "15.00",
    "15.30",
    "16.00",
    "16.30",
    "17.00",
  ]


  public judete = [
    "Bucuresti",
    "Iasi",
    "Prahova",
    "Cluj",
    "Constanta",
    "Timis",
    "Dolj",
    "Suceava",
    "Bacau",
    "Arges",
    "Bihor",
    "Mures",
    "Brasov",
    "Galati",
    "Dambovita",
    "Maramures",
    "Neamt",
    "Buzau",
    "Olt",
    "Arad",
    "Hunedoara",
    "Botosani",
    "Sibiu",
    "Vaslui",
    "Ilfov",
    "Teleorman",
    "Valcea",
    "Satu Mare",
    "Alba",
    "Gorj",
    "Vrancea",
    "Braila",
    "Harghita",
    "Calarasi",
    "Caras-Severin",
    "Bistrita-Nasaud",
    "Giurgiu",
    "Ialomita",
    "Mehedinti",
    "Salaj",
    "Tulcea",
    "Covasna"
  ].sort();

  addSchedule(medic) {
    // console.log(medic.online)
    console.log(medic.date);
    const scheduleData: Schedule = {
      date: medic.date,
      hour: medic.ora,
      address: medic.address,
      problem: medic.specialization,
      onlineSchedule: medic.onlineSchedule,
      medicId: medic.medicId,
      userId: this.authService.getUserId()
  };
    this.http.post(BACKEND_URL + 'create', scheduleData)
      .subscribe(responseData => {
        this.router.navigate(['/schedules']);
      })
  }

  addPdfToSchedule(pdf, id) {
    const postPDF = new FormData();
    postPDF.append("pdf", pdf, pdf.name.split('.pdf')[0] + '-' + id);
    postPDF.append("id", id);

    this.http.post(environment.apiUrl + 'documents/uploadPdf', postPDF).subscribe(response => {
      // console.log(response);
    })
  }

  getSchedulingVariants(problema: string, judet: string, date: Date, consultatieOnline: boolean) {
    const queryParams = `?problema=${problema}&judet=${judet}&date=${date}&consultatieOnline=${consultatieOnline}`;
    let tempHours = [...this.oreDeLucru];
    this.http.get<{message: string, options: [] }>(BACKEND_URL + 'select/' + queryParams).subscribe(datelemele => {
      this.scheduleOptions = datelemele.options;
      this.scheduleOptions.forEach((medic, index) => {
        if(medic.hoursToExclude[0]) {
          for(let excludedHour of medic.hoursToExclude) {
            tempHours = tempHours.filter(hour => {
              return hour !== excludedHour;
            })
          }
        }
        medic.finalHours = tempHours;
        medic.onlineSchedule = consultatieOnline;
        tempHours = [...this.oreDeLucru];
      });
      this.router.navigate(['/selectare']);
    })
  }

  putInfoSchedule(schedule) {
    this.http.put(BACKEND_URL + 'add-info/', schedule).subscribe(result => {
      console.log(result);
    });
  }

  getUserSchedules() {
    const queryParams = `?userId=${this.authService.getUserId()}`;
    this.http.get<{message: string, schedules: []}>(BACKEND_URL + 'user/my-schedules/' + queryParams).subscribe(res => {
      this.scheduleOptions = res.schedules;
      let finalObject = {};
      let finalSchedules = []
      let fileNames = []
      this.scheduleOptions.forEach(schedule => {

        schedule.pdfPaths.forEach(path => {
          fileNames.push(path.split('pdfFiles/')[1].split('-')[0] + '.pdf');
          // schedule.filesName.push(path.split('pdfFiles/')[1].split('-')[0] + '.pdf');
        });
        finalObject = {
          ...schedule,
          fileNames: fileNames
        };
        fileNames = [];
        finalSchedules.push(finalObject);
      })
      this.allSchedulesListner.next(finalSchedules);
      return finalSchedules;
    });
  }

  downloadPdf(filePath) {
    // console.log(environment.apiUrl)
    const queryParams = `?filePath=${filePath}`;

    this.http.get(environment.apiUrl + 'documents/downloadPdf/' + queryParams,{
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/pdf')
    }).subscribe(file => {
      saveAs(file, filePath);
    });
  }

  getMedicSchedules() {
    if(this.authService.getIsMedicAuth()) {
      const queryParams = `?medicId=${this.authService.getUserId()}`;
      this.http.get<{message: string, schedules: []}>(BACKEND_URL + 'medic/my-schedules/' + queryParams).subscribe(res => {
        this.scheduleOptions = res.schedules;
        let finalObject = {};
        let finalSchedules = []
        let fileNames = []
        this.scheduleOptions.forEach(schedule => {

          schedule.pdfPaths.forEach(path => {
            fileNames.push(path.split('pdfFiles/')[1].split('-')[0] + '.pdf');
            // schedule.filesName.push(path.split('pdfFiles/')[1].split('-')[0] + '.pdf');
          });
          finalObject = {
            ...schedule,
            fileNames: fileNames
          };
          fileNames = [];
          finalSchedules.push(finalObject);
        })
        this.allSchedulesListner.next(finalSchedules);
        return finalSchedules;
      });
    }
  }

  deleteSchedule(schedule) {
    const queryParamns = `?scheduleId=${schedule._id}`;
    this.http.delete(BACKEND_URL + 'delete-schedule/' + queryParamns).subscribe(res => {
      if(!this.authService.getIsMedicAuth()) {
        this.allSchedulesListner.next(this.getUserSchedules());
      } else {
        this.allSchedulesListner.next(this.getMedicSchedules());
      }
    });
  }

  getAllScheduleListner() {
    return this.allSchedulesListner.asObservable();
  }

  getScheduleOptions() {
    return this.scheduleOptions;
  }
}
