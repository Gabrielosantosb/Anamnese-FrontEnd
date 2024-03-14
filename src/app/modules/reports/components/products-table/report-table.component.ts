import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetAllProductsResponse} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {ReportEvent} from "../../../../../models/interfaces/enums/products/ProductEvent.js";
import {EventAction} from "../../../../../models/interfaces/reports/event/EventAction";
import {DeleteProductAction} from "../../../../../models/interfaces/reports/event/DeleteProductAction";

@Component({
  selector: 'app-products-table',
  templateUrl: './report-table.component.html',
  styleUrls: []
})
export class ReportTableComponent {
  @Input() products: Array<GetAllProductsResponse> = []
  @Output() productEvent = new EventEmitter<EventAction>()
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>()
  public productsSelected!: GetAllProductsResponse;
  public addProductAction = ReportEvent.ADD_REPORT_EVENT
  public editProductAction = ReportEvent.EDIT_REPORT_EVENT

  handleProductEvent(action: string, id?: number): void {
    if (action && action !== '')
    {
      const productEventData = id && id !== null ? {action, id} : {action}
      this.productEvent.emit(productEventData)
    }
  }
  handleDeleteProduct(product_id: string, productName: string): void {
    if(product_id !== "" && productName !== "")
    {
      this.deleteProductEvent.emit({
        product_id,
        productName,
      })
    }
  }

}
