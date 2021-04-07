import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { MainScreenComponent } from "./main-screen/main-screen.component";


const appRoutes: Routes = [
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainScreenComponent},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  // {path: '**', redirectTo: '/home'}
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
