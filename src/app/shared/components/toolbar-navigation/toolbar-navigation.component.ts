import {Component} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmationModal} from "../../../services/confirmation/confirmation-service.service";
import {DialogService} from "primeng/dynamicdialog";
import {ReportFormComponent} from "../../../modules/reports/components/report-form/report-form.component";
import {ReportEvent} from "../../../../models/interfaces/enums/products/ProductEvent.js";


@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar.scss'],
  providers: [ConfirmationModal,]
})
export class ToolbarNavigationComponent {

  constructor(private confirmationModal: ConfirmationModal, private dialogService: DialogService) {
  }

  logout(): void {
    this.confirmationModal.confirmLogout("Tem certeza que deseja sair?")
  }



}
