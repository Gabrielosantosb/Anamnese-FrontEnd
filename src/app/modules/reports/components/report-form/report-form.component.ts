import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, take, takeUntil} from "rxjs";
import {PacientService} from "../../../../services/pacients/pacients.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {SaleProductRequest} from "../../../../../models/interfaces/reports/request/SaleProductRequest";
import {ProgressBarModule} from "primeng/progressbar";
import {PacientsEvent} from "../../../../../models/interfaces/enums/pacients/PacientEvent";
import {UF} from "../../../../../models/interfaces/enums/UF/uf";
import {EditPacientAction} from "../../../../../models/interfaces/pacients/event/editPacient";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";
import {ReportsService} from "../../../../services/reports/reports.service";
import {ReportEvent} from "../../../../../models/interfaces/enums/products/ProductEvent.js";
import {EditReportAction} from "../../../../../models/interfaces/reports/event/EditReportAction";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import numbers = _default.defaults.animations.numbers;
import {GetAllReportsResponse} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: [],
  providers: [ToastMessage]
})
export class ReportFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  isLoading = false
  loadingMode: ProgressBarModule = 'indeterminate';

  public addReportAction = ReportEvent.ADD_REPORT_EVENT;
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT;
  public reportAction !: { event: EditReportAction }

  public reportForm = this.formBuilder.group({
    medicalHistory: ['', Validators.required],
    currentMedications: ['', Validators.required],
    cardiovascularIssues: [false],
    diabetes: [false],
    familyHistoryCardiovascularIssues: [false],
    familyHistoryDiabetes: [false],
    physicalActivity: ['teste', Validators.required],
    smoker: [false],
    alcoholConsumption: [0, Validators.min(0)],
    emergencyContactName: ['teste', Validators.required],
    emergencyContactPhone: ['teste', Validators.required],
    observations: ['teste']
  })


  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private pacientService: PacientService,
    private reportService: ReportsService,
    private confirmationModal: ConfirmationModal,
    private toastMessage: ToastMessage
  ) {
  }

  ngOnInit(): void {
    this.reportAction = this.ref.data;
    if(this.reportAction.event.action == this.editReportAction && this.reportAction.event.id)
    {
      this.loadReportData(this.reportAction.event.id)
    }

    // if(this.reportAction?.event?.action == this.editReportAction || this.reportAction?.event?.action == this.addReportAction)
    // {
    //   if(this.reportAction?.event?.id && ){
    //     this.loadReportData(this.reportAction.event.id)
    //   }
    // }

  }

  handleSubmitReportAction(): void {
    if (this.reportAction?.event?.action === this.editReportAction) this.handleSubmitEditReport()
    if (this.reportAction?.event?.action === this.addReportAction) this.handleSubmitAddReport()

  }


  handleSubmitEditReport(): void {
    if (
      this.reportForm?.value &&
      this.reportForm?.valid &&
      this.reportAction?.event?.id
    ) {
      console.log('Editar relatório:', this.reportForm.value);
      this.reportForm.reset();
    }
  }

  handleSubmitAddReport(): void {
    var pacientId  = this.reportAction?.event?.id
    if (this.reportForm?.value && this.reportForm?.valid && pacientId) {
      const requestCreateForm = this.reportForm.value as {
        medicalHistory: string;
        currentMedications: string;
        cardiovascularIssues: boolean;
        address: string;
        diabetes: boolean;
        familyHistoryCardiovascularIssues: boolean;
        familyHistoryDiabetes: boolean;
        physicalActivity: string;
        smoker: boolean;
        alcoholConsumption: number;
        emergencyContactName: string;
        emergencyContactPhone: string;
        observations: string;
      };
      console.log('Adicionar relatório:', requestCreateForm)
      this.reportService.createReport(pacientId, requestCreateForm).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if(response){
              this.reportForm.reset();
              this.toastMessage.SuccessMessage('Ficha criada com sucesso!')
            }
          },
          error:(err) =>{
            console.log(err)
            this.reportForm.reset();
            this.toastMessage.ErrorMessage('Erro ao criar ficha')
          }
        })
      this.reportForm.reset();
    }
  }


  loadReportData(pacientId: number): void {
    console.log('Id' , this.reportAction?.event?.id)

    this.reportService.getReportByPacientId(pacientId, this.reportForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reportData: GetAllReportsResponse) => {
          console.log('Dados ficha carregados:', reportData);
        },
        error: (error) => {
          console.error('Erro ao  dados da ficha:', error);
        }
      });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

