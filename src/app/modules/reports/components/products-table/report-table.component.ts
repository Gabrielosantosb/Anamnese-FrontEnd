import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  GetAllProductsResponse,
  GetReportResponse
} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {ReportEvent} from "../../../../../models/interfaces/enums/products/ProductEvent.js";
import {EventAction} from "../../../../../models/interfaces/reports/event/EventAction";
import {DeleteProductAction} from "../../../../../models/interfaces/reports/event/DeleteProductAction";
import {PacientService} from "../../../../services/pacients/pacients.service";
import {ReportsService} from "../../../../services/reports/reports.service";
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";

@Component({
  selector: 'app-products-table',
  templateUrl: './report-table.component.html',
  styleUrls: []
})
export class ReportTableComponent {
  @Input() products: Array<GetAllProductsResponse> = []
  @Input() public reports: Array<GetReportResponse> = [];
  @Output() reportEvent = new EventEmitter<EventAction>()
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>()
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT
  showProfissionalReports = false
  public reportSelected!: GetAllProductsResponse;
  constructor(private reportService: ReportsService) {
  }


  handleShowAllReports(): void {
    this.reportService.getAllReports().subscribe({
      next: (allReportData) => {
        this.showProfissionalReports = false
        this.reports = allReportData;
        console.log(this.reports)
      },
      error: (error) => {
        console.error('Erro ao obter fichas do usuário:', error);
      }
    });
  }



  handleReportEvent(action: string, id?: number): void {
    if (action && action !== '') this.reportEvent.emit({action, id})
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
