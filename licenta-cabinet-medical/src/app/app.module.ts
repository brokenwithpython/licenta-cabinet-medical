import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgramareComponent } from './programare/programare.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { BottomNavbarComponent } from './bottom-navbar/bottom-navbar.component';
import { CalendarComponent } from './calendar/calendar.component';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { SelectMedicAndHourComponent } from './select-medic-and-hour/select-medic-and-hour.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { CalendarDialogComponent } from './calendar/calendar-dialog/calendar-dialog.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { SelectHourDialogComponent } from './select-medic-and-hour/select-hour-dialog/select-hour-dialog.component';
import { UserScheduleComponent } from './programare/usersSchedule/user-schedule.component';
import { ProgramareDialogComponent } from './programare/programareDialog/programare-dialog.component';
import { EditProgDialogComponent } from './programare/programareEditareMedicDialog/editProgMedic.component';
import { EditAddInfoScheduleComponent } from './programare/editare-adaugare-info-programare/edit-add-info-schedule.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainScreenComponent,
    ProgramareComponent,
    BottomNavbarComponent,
    CalendarComponent,
    SelectMedicAndHourComponent,
    CalendarDialogComponent,
    MyAccountComponent,
    SelectHourDialogComponent,
    UserScheduleComponent,
    ProgramareDialogComponent,
    EditProgDialogComponent,
    EditProgDialogComponent,
    EditAddInfoScheduleComponent

  ],
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    NgxMaterialTimepickerModule
  ],
  providers: [ {provide: MAT_DATE_LOCALE, useValue: 'ro'},
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
],
  bootstrap: [AppComponent],
  entryComponents: [CalendarDialogComponent, SelectHourDialogComponent,
     ProgramareDialogComponent, EditProgDialogComponent, EditAddInfoScheduleComponent]
})
export class AppModule { }

