import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { MainScreenComponent } from "./main-screen/main-screen.component";
import { MyAccountComponent } from "./my-account/my-account.component";
import { ProgramareComponent } from "./programare/programare.component";
import { SelectMedicAndHourComponent } from "./select-medic-and-hour/select-medic-and-hour.component";


const appRoutes: Routes = [
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainScreenComponent},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'programare', component: ProgramareComponent},
  {path: 'selectare', component: SelectMedicAndHourComponent},
  {path: 'my-account', component: MyAccountComponent},
  {path: '**', redirectTo: '/home'}
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
