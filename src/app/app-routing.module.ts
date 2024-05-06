import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./modules/home/home.component";
import {AuthGuardService} from "./guards/auth-guard.service";
import {NotfoundComponent} from "./comon-pages/notfound/notfound.component";
import {UserComponent} from "./modules/user/user.component";
const routes: Routes = [
  {
    path : "",
    redirectTo:"dashboard",
    pathMatch:"full"
  },
  {
    path : "home",
    component: HomeComponent,
  },
  {
    path : "user",
    component: UserComponent,
  },

  {
    path : "dashboard",
    loadChildren: ()=> import('./modules/dashboard/dashboard.module')
      .then((m)=> m.DashboardModule),
    canActivate:[AuthGuardService]
  },
  {
    path : "report",
    loadChildren: ()=> import('./modules/reports/reports.module')
      .then((m)=> m.ReportsModule),
    canActivate:[AuthGuardService]
  },
  // {
  //   path : "user",
  //   loadChildren: ()=> import('./modules/user/user.module')
  //     .then((m)=> m.UserModule),
  //   canActivate:[AuthGuardService]
  // },
  {
    path : "pacients",
    loadChildren: ()=> import('./modules/pacients/pacients.module')
      .then((m)=> m.PacientsModule),
    canActivate:[AuthGuardService]
  },
  {
    path: "404",
    loadChildren:() => import('../app/comon-pages/notfound/not-found.module')
      .then((m) => m.NotFoundModule),
  },
  { path: "**", component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
