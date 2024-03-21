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

  public pacientAction!: { event: EditPacientAction };
  public reportAction !: { event: EditReportAction }
  public pacientForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    uf: ['', Validators.required],
    phone: ['', Validators.required],
    birth: ['', [Validators.required, this.dateValidator]],

    gender: ['', Validators.required],
    profession: ['', Validators.required],
  });
  public reportForm = this.formBuilder.group({
    medicalHistory: ['teste', Validators.required],
    currentMedications: ['teste', Validators.required],
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

    // if(this.pacientAction?.event?.action == this.editReportAction) || this.pacientAction?.event?.action == this.addReportAction)
    // {
    //   this.loadPa
    // }
    // if (
    //   this.pacientAction?.event?.action === this.editPacientAction &&
    //   this.pacientAction?.event?.pacientName !== null &&
    //   this.pacientAction?.event?.pacientName !== undefined &&
    //   this.pacientAction?.event?.id !== undefined
    // )
    {
      // this.loadPacientData(this.pacientAction.event.id);
    }
  }

  handleSubmitReportAction(): void {
    if (this.reportAction?.event?.action === this.editReportAction) this.handleSubmitEditReport()
    if (this.reportAction?.event?.action === this.addReportAction) this.handleSubmitAddReport()

  }

  dateValidator(control: AbstractControl) {
    const dateString = control.value;
    if (dateString) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato yyyy-mm-dd
      if (!dateRegex.test(dateString)) {
        return {invalidFormat: true};
      }
    }
    return null;
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
            this.pacientForm.reset();
            this.toastMessage.ErrorMessage('Erro ao criar ficha')
          }
        })
      this.reportForm.reset();
    }
  }


  // loadPacientData(pacientId: number): void {
  //   this.reportService.getReportById(pacientId, this.reportForm)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (pacientData: GetPacientsResponse) => {
  //         console.log('Dados do paciente carregados:', pacientData);
  //       },
  //       error: (error) => {
  //         console.error('Erro ao carregar dados do paciente:', error);
  //       }
  //     });
  // }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

