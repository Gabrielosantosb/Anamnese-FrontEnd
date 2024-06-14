import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ReportsService} from "../../../../services/reports/reports.service";
import {
  GetReportResponse
} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {EventAction} from "../../../../../models/interfaces/reports/event/EventAction";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ReportFormComponent} from "../../components/report-form/report-form.component";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";
import {DeleteReportAction} from "../../../../../models/interfaces/reports/event/DeleteReportAction";


@Component({
  selector: 'app-reports-home',
  templateUrl: './reports-home.component.html',
  styleUrls: [],
  providers: [ToastMessage, ConfirmationModal]
})
export class ReportsHomeComponent implements OnDestroy, OnInit {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public reportData: Array<GetReportResponse> = []
  isLoading = false

  constructor(
    private reportService: ReportsService,
    private dialogService: DialogService,
    private toastMessage: ToastMessage,
    private confirmationModal: ConfirmationModal
  ) {
  }

  ngOnInit(): void {
    this.getAllReports();
  }


  getAllReports() {
    this.isLoading = true
    this.reportService
      .getAllReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: GetReportResponse[]) => {
          if (response) {
            this.reportData = response
            this.isLoading = false
          }
        },
        error: (err: Error) => {
          this.toastMessage.ErrorMessage("Erro ao buscar fichas")
        }
      })
  }


  handleReportAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ReportFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$));
    }
  }

  handleDeleteReportAction(event: DeleteReportAction): void {
    if (event) {
      this.confirmationModal.confirmDelete(`Confirma a exclusão da ficha de: ${event?.pacientName}?`, () => {
        this.deleteReport(event?.reportId);
      });
    } else {
      this.toastMessage.ErrorMessage(`Não é possível excluir a ficha.`);

    }
  }

  deleteReport(reportId: number) {
    if (reportId) {
      this.reportService
        .deleteReport(reportId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getAllReports()
            this.toastMessage.SuccessMessage('Ficha removida com sucesso!')
          },
          error: (err) => {
            this.toastMessage.ErrorMessage('Erro ao remover ficha!')
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

