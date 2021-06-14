import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { ChangeResetPasswordComponent } from "./auth/changeResetPassword/change-reset-password.component";
import { LoginComponent } from "./auth/login/login.component";
import { ResetPasswordComponent } from "./auth/resetPassword/reset-password.component";
import { ChatComponent } from "./chat/chat.component";
import { MainScreenComponent } from "./main-screen/main-screen.component";
import { MyAccountComponent } from "./my-account/my-account.component";
import { ProgramareComponent } from "./programare/programare.component";
import { UserScheduleComponent } from "./programare/usersSchedule/user-schedule.component";
import { SelectMedicAndHourComponent } from "./select-medic-and-hour/select-medic-and-hour.component";


const appRoutes: Routes = [
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainScreenComponent},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'programare', component: ProgramareComponent, canActivate: [AuthGuard]},
  {path: 'selectare', component: SelectMedicAndHourComponent , canActivate: [AuthGuard]},
  {path: 'my-account', component: MyAccountComponent , canActivate: [AuthGuard]},
  {path: 'schedules', component: UserScheduleComponent , canActivate: [AuthGuard]},
  {path: 'resetPassword', component: ResetPasswordComponent, pathMatch: "full"},
    // children: [{path: '**', component: ChangeResetPasswordComponent}]},
  {path: 'resetPassword/:isMedic/:token', component: ChangeResetPasswordComponent, pathMatch: "full"},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/home'}
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
