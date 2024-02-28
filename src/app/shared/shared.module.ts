import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ToolbarModule} from "primeng/toolbar";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DialogService} from "primeng/dynamicdialog";
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { ProductFormComponent } from '../modules/products/components/product-form/product-form.component';
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ToastMessage} from "../services/toast-message/toast-message";
import { ShortenPipe } from './pipes/shorten/shorten.pipe';







@NgModule({
  declarations: [
    ToolbarNavigationComponent,
    ProductFormComponent,
    ShortenPipe,

  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // PrimeNg
        ToolbarModule,
        CardModule,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        DropdownModule,
        InputTextareaModule
    ],
  exports: [
    ToolbarNavigationComponent,
    ShortenPipe
  ],
  // exports:[ToolbarNavigationComponent],
  providers: [DialogService, CurrencyPipe,ToastMessage]
})
export class SharedModule { }
