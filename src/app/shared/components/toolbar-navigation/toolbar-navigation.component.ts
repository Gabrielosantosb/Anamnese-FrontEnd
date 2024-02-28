import {Component} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmationModal} from "../../../services/confirmation/confirmation-service.service";
import {DialogService} from "primeng/dynamicdialog";
import {ProductFormComponent} from "../../../modules/products/components/product-form/product-form.component";
import {ProductEvent} from "../../../../models/interfaces/enums/products/ProductEvent.js";


@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: [],
  providers: [ConfirmationModal,]
})
export class ToolbarNavigationComponent {

  constructor(private confirmationModal: ConfirmationModal, private dialogService: DialogService) {
  }

  logout(): void {
    this.confirmationModal.confirmLogout("Tem certeza que deseja sair?")
  }

  handleSaleProduct(): void {
    this.dialogService.open(ProductFormComponent, {
      header: ProductEvent.SALE_PRODUCT_EVENT,
      width: '70%',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: {action: ProductEvent.SALE_PRODUCT_EVENT}
      }
    })
  }
}
