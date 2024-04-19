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
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";
import {ConfirmationModal} from "../../services/confirmation/confirmation-service.service";
import {TableModule} from "primeng/table";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {TooltipModule} from "primeng/tooltip";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";


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
        SharedModule,
        ChartModule,
    ],
  // providers:[CookieService, ConfirmationService, DialogService]
  providers:[ConfirmationService, DialogService,ConfirmationModal]
})
export class DashboardModule { }
