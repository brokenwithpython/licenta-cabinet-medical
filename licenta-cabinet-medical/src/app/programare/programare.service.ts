import { HttpClient } from "@angular/common/http";
import { stringify } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Data, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Schedule } from "./programare.model";

const BACKEND_URL = environment.apiUrl + 'schedule/';


@Injectable({
  providedIn: 'root'
})
export class ProgramareService {

  scheduleOptions = [];

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
    const scheduleData: Schedule = {
      date: medic.date,
      hour: medic.ora,
      address: medic.address,
      problem: medic.specialization,
      medicId: medic.medicId,
      userId: this.authService.getUserId()
  };
    this.http.post(BACKEND_URL + 'create', scheduleData)
      .subscribe(responseData => {
        this.router.navigate(['/home']);
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
      });
      this.router.navigate(['/selectare']);
    })
  }

  getScheduleOptions() {
    return this.scheduleOptions;
  }
}
