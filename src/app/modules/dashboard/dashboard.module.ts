import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import {RouterModule} from "@angular/router";
import {DASHBOARD_ROUTES} from "./dashboard-routing/dashboard.routing";
import {SidebarModule} from "primeng/sidebar";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {CardModule} from "primeng/card";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import {CookieService} from "ngx-cookie-service";
import {ChartModule} from "primeng/chart";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(DASHBOARD_ROUTES),
        // PrimeNG
        SidebarModule,
        ButtonModule,
        ToolbarModule,
        CardModule,
        ToastModule,
        ChartModule,
        // SharedModule
        SharedModule,
        ConfirmDialogModule,
        SharedModule
    ],
  providers:[MessageService, CookieService, ConfirmationService]
})
export class DashboardModule { }
