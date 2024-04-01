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
import {
  GetReportResponse,
  ReportRequest
} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../../../environments/environments";
import {ClipboardService} from "ngx-clipboard";

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
  private readonly USER_AUTH = environments.COOKIES_VALUE.user_auth
  reportId = 0;
  pacientId = 0
  public reportForm = this.formBuilder.group({

    medicalHistory: ['', Validators.required],
    currentMedications: ['', Validators.required],
    cardiovascularIssues: [false],
    diabetes: [false],
    familyHistoryCardiovascularIssues: [false],
    familyHistoryDiabetes: [false],
    physicalActivity: ['teste', Validators.required],
    smoker: [false],
    // alcoholConsumption: [0, Validators.min(0)],
    alcoholConsumption: [0, [Validators.min(0), Validators.max(5)]], // Definindo min e max

    emergencyContactName: ['teste', Validators.required],
    emergencyContactPhone: ['teste', Validators.required],
    observations: ['teste']
  })
  private token = this.cookie.get(this.USER_AUTH)



  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private pacientService: PacientService,
    private reportService: ReportsService,
    private confirmationModal: ConfirmationModal,
    private toastMessage: ToastMessage,
    private cookie: CookieService,
    private clipboardService: ClipboardService,
  ) {
  }

  ngOnInit(): void {
    this.reportAction = this.ref.data;
    if(this.reportAction.event.id  && this.reportAction.event.action == this.addReportAction)
    {
      this.pacientId = this.reportAction.event.id
    }

    if(this.reportAction.event.action == this.editReportAction && this.reportAction.event.id)
    {
      this.loadReportData(this.reportAction.event.id)

    }

  }
  getIntegrationLink():void{
    console.log("gerou link")
    const url = `http://localhost:51216/?token=${this.token}&pacientId=${this.pacientId}`;
    this.clipboardService.copyFromContent(url)
    this.toastMessage.InfoMessage('Link para anamnese copiado com sucesso!')
  }
  handleSubmitReportAction(): void {
    if (this.reportAction?.event?.action === this.editReportAction) this.handleSubmitEditReport()
    if (this.reportAction?.event?.action === this.addReportAction) this.handleSubmitAddReport()
  }

  sendIntegrationWhatsApp(): void {
    this.pacientService.getPacientById(this.pacientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pacientData: any) => {
          const url = `http://localhost:51216/?token=${this.token}&pacientId=${this.pacientId}`;
          const message = `Olá *${pacientData.username}*, aqui está o link para a anamnese:\n${url}`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappLink = `https://api.whatsapp.com/send?phone=${encodeURIComponent(pacientData.phone)}&text=${encodedMessage}`;
          window.open(whatsappLink, '_blank');
        },
        error: (err) => {
          console.error(err);
          this.toastMessage.ErrorMessage('Erro ao enviar o link via WhatsApp');
        }
      });
    console.log('Mensagem enviada via WhatsApp');
  }
  handleSubmitEditReport(): void {
    if (this.reportId <= 0) {
      console.error('ID do relatório inválido');
      return;
    }
    const requestUpdateForm = this.reportForm.value as ReportRequest;
    console.log('Editar relatório:', requestUpdateForm);

    this.reportService.editReport(this.reportId, requestUpdateForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.reportForm.reset();
          this.toastMessage.SuccessMessage('Ficha editada com sucesso!');
        },
        error: (err) => {
          console.error(err);
          this.reportForm.reset();
          this.toastMessage.ErrorMessage('Erro ao editar ficha');
        }
      });
  }

  handleSubmitAddReport(): void {
    var pacientId  = this.reportAction?.event?.id
    if (this.reportForm?.value && this.reportForm?.valid && pacientId) {
      const requestCreateForm = this.reportForm.value as  ReportRequest
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
    this.reportService.getReportByPacientId(pacientId, this.reportForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reportData: GetReportResponse) => {
          this.reportId = reportData.reportId
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

