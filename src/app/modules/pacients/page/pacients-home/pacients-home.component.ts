import {Component, OnDestroy, OnInit} from '@angular/core';
import {PacientService} from "../../../../services/pacients/pacients.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Subject, takeUntil} from "rxjs";
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {Router} from "@angular/router";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";
import {EventAction} from "../../../../../models/interfaces/reports/event/EventAction";
import {PacientsFormComponent} from "../../components/pacients-form/pacients-form/pacients-form.component";
import {ReportsDataTransferService} from "../../../../shared/reports/reports-data-transfer.service";
import {DeletePacient} from "../../../../../models/interfaces/pacients/event/deletePacient";
import {ProgressBarModule} from "primeng/progressbar";
import {ReportFormComponent} from "../../../reports/components/report-form/report-form.component";

@Component({
  selector: 'app-pacients-home',
  templateUrl: './pacients-home.component.html',
  styleUrls: ['./pacients-home.component.scss'],
  providers: [ToastMessage, ConfirmationModal]
})
export class PacientsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  isLoading = false
  loadingMode: ProgressBarModule = 'indeterminate';
  public pacientsData: Array<GetPacientsResponse> = [];
  public productsData = []

  constructor(
    private pacientSerivce: PacientService,
    private productsDtService: ReportsDataTransferService,
    private dialogService: DialogService,
    private toastMessage: ToastMessage,
    private confirmationModal: ConfirmationModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAllPacients();
  }


  getAllPacients() {
    this.isLoading = true
    this.pacientSerivce
      .getAllPacients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response : any) => {
          if (response.length > 0) {
            this.pacientsData = response;
            this.isLoading = false
          }
        },
        error: (err : []) => {
          console.log(err);
          this.isLoading = false
          this.toastMessage.ErrorMessage('Erro ao buscar Pacientes!')
          this.router.navigate(['/dashboard']);
        },
      });
  }
  handleDeleteCategoryAction(event: DeletePacient): void {
    if (event.pacientName != null) {
      console.log(event)
        this.confirmationModal.confirmDelete(`Confirma a exclusão da categoria: ${event?.pacientName}`, () => this.deletePacient(event?.pacient_id));

    } else {
      this.toastMessage.ErrorMessage(`Não é possível excluir o Paciente ${event.pacientName}`);
    }
  }

  deletePacient(pacient_id: number): void {
    if (pacient_id) {
      this.pacientSerivce
        .deletePacient({pacient_id})
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getAllPacients();
            this.toastMessage.SuccessMessage('Paciente  removida com sucesso!')
          },
          error: (err: string) => {
            console.log(err);
            this.getAllPacients();
            this.toastMessage.ErrorMessage('Erro ao remover paciente !')
          },
        });

      this.getAllPacients();
    }
  }

  handleReportAction(event :EventAction): void{
    console.log('Evento bateu' , event)
    if (event) {
      this.ref = this.dialogService.open(ReportFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event:{
            action : event.action,
            // id: event.reportId
          }
        },
      });

      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAllPacients(),
      });
    }
  }
  handlePacientAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(PacientsFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
        },
      });

      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAllPacients(),
      });
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


