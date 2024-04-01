import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  GetAllProductsResponse,
  GetReportResponse
} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {EventAction} from "../../../../../models/interfaces/reports/event/EventAction";
import {
  DeleteReportAction
} from "../../../../../models/interfaces/reports/event/DeleteProductAction";
import {ReportsService} from "../../../../services/reports/reports.service";


@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['report-table.scss']
})
export class ReportTableComponent {
  @Input() reports: Array<GetReportResponse> = [];
  @Output() reportEvent = new EventEmitter<EventAction>()
  @Output() deleteReportEvent = new EventEmitter<DeleteReportAction>()
  showProfissionalReports = false
  public selectedReport!: GetReportResponse;
  displayModal: boolean = false;

  constructor(private reportService: ReportsService) {
  }


  handleShowAllReports(): void {
    this.reportService.getAllReports().subscribe({
      next: (allReportData) => {
        this.showProfissionalReports = false
        this.reports = allReportData;
      },
      error: (error) => {
        console.error('Erro ao obter fichas do usuário:', error);
      }
    });
  }

  handleReportEvent(action: string, id?: number): void {
    if (action && action !== '') this.reportEvent.emit({action, id})
  }

  openModal(report: GetReportResponse) {
    this.selectedReport = report;
    this.displayModal = true;
  }
  handleDeleteReport(reportId: number, pacientName: string): void {
    if(reportId !== null && pacientName !== "")
    {
      this.deleteReportEvent.emit({
        reportId,
        pacientName,
      })
    }
  }

}
