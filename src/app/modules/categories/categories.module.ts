import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesHomeComponent } from './page/categories-home/categories-home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CATEGORIES_ROTES} from "./categories.routing";
import {SharedModule} from "../../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";
import {DropdownModule} from "primeng/dropdown";
import {ConfirmationService} from "primeng/api";
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import {RippleModule} from "primeng/ripple";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { CategoryFormComponent } from './components/category-form/category-form/category-form.component';
import {InputTextModule} from "primeng/inputtext";
import {TooltipModule} from "primeng/tooltip";



@NgModule({
  declarations: [
    CategoriesHomeComponent,
    CategoriesTableComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CATEGORIES_ROTES),
    SharedModule,
    HttpClientModule,
    // -----PrimeNG------
    CardModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    DynamicDialogModule,
    DropdownModule,
    RippleModule,
    ConfirmDialogModule,
    InputTextModule,
    TooltipModule
  ],
  providers : [DialogService, ConfirmationService]
})
export class CategoriesModule { }
