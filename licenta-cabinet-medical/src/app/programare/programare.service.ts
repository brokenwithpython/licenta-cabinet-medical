import { HttpClient } from "@angular/common/http";
import { stringify } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { Data, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Schedule } from "./programare.model";

const BACKEND_URL = environment.apiUrl + 'schedule/';


@Injectable({
  providedIn: 'root'
})
export class ProgramareService {

  scheduleOptions = [];

  constructor(private http: HttpClient, private router: Router,) {}


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

  addSchedule() {
    const scheduleData: Schedule = {
      dateAndHour: "123",
      address: "asdasd",
      problem: "mare problema",
      medicId: "asdasd",
      userId: null
  };
    this.http.post(BACKEND_URL + 'create', scheduleData)
      .subscribe(responseData => {
        console.log(responseData);
      })
  }

  getSchedulingVariants(problema: string, judet: string, date: Date, consultatieOnline: boolean) {
    const queryParams = `?problema=${problema}&judet=${judet}&date=${date}&consultatieOnline=${consultatieOnline}`;
    this.http.get<{message: string, options: [] }>(BACKEND_URL + 'select/' + queryParams).subscribe(datelemele => {
      this.scheduleOptions = datelemele.options;
      console.log(this.scheduleOptions);
      this.router.navigate(['/selectare']);
    })
  }

  getScheduleOptions() {
    return this.scheduleOptions;
  }
}
