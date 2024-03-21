import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {PacientsEvent} from "../../../../../../models/interfaces/enums/pacients/PacientEvent";
import {EditPacientAction} from "../../../../../../models/interfaces/pacients/event/editPacient";
import {ToastMessage} from "../../../../../services/toast-message/toast-message";
import {ConfirmationModal} from "../../../../../services/confirmation/confirmation-service.service";
import {PacientService} from "../../../../../services/pacients/pacients.service";
import {ProgressBar, ProgressBarModule} from "primeng/progressbar";
import {GetPacientsResponse} from "../../../../../../models/interfaces/pacients/get-pacient-service.service";
import {UF} from "../../../../../../models/interfaces/enums/UF/uf";
import {EditReportAction} from "../../../../../../models/interfaces/reports/event/EditReportAction";
import {ReportEvent} from "../../../../../../models/interfaces/enums/products/ProductEvent.js";

@Component({
  selector: 'app-pacients-form',
  templateUrl: './pacients-form.component.html',
  styleUrls: ['./pacients-form.component.scss'],
  providers: [ToastMessage, ConfirmationModal]
})
export class PacientsFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  isLoading = false
  loadingMode: ProgressBarModule = 'indeterminate';

  public addPacientAction = PacientsEvent.ADD_PACIENT_ACTION;
  public editPacientAction = PacientsEvent.EDIT_PACIENT_ACTION;
  public addReportAction = ReportEvent.ADD_REPORT_EVENT;
  public editReportAction = ReportEvent.EDIT_REPORT_EVENT;

  public estados = Object.values(UF)
  public gender: string[] = ["Masculino", "Feminino", "Outro"];

  public pacientAction!: { event: EditPacientAction };
  public reportAction !: {event: EditReportAction}
  public showPacientForm  = false;
  public showReportForm = false;
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
    private confirmationModal: ConfirmationModal,
    private toastMessage: ToastMessage
  ) {}


  ngOnInit(): void {
    this.pacientAction = this.ref.data;
    console.log('pacientAction', this.pacientAction?.event?.action)
    if (
      this.pacientAction?.event?.action === this.editPacientAction ||
      this.pacientAction?.event?.action === this.addPacientAction
    ) {
      if (
        this.pacientAction?.event?.action === this.editPacientAction &&
        this.pacientAction?.event?.pacientName !== null &&
        this.pacientAction?.event?.pacientName !== undefined &&
        this.pacientAction?.event?.id !== undefined
      ) {
        this.loadPacientData(this.pacientAction.event.id);
      }
    }
  }

  dateValidator(control :AbstractControl) {
    const dateString = control.value;
    if (dateString) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato yyyy-mm-dd
      if (!dateRegex.test(dateString)) {
        return { invalidFormat: true };
      }
    }
    return null;
  }

  loadPacientData(pacientId: number): void {
    this.pacientService.getPacientById(pacientId, this.pacientForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pacientData: GetPacientsResponse) => {
          console.log('Dados do paciente carregados:', pacientData);
        },
        error: (error) => {
          console.error('Erro ao carregar dados do paciente:', error);
        }
      });
  }

  handleSubmitPacientAction(): void {
    if (this.pacientAction?.event?.action === this.addPacientAction) this.handleSubmitAddPacient();
    if (this.pacientAction?.event?.action === this.editPacientAction) this.handleSubmitEditPacient();
    return;
  }
  handleSubmitReportAction(): void {
    if(this.reportAction?.event?.action === this.editPacientAction) this.handleSubmitEditReport()
    if(this.reportAction?.event?.action === this.addReportAction) this.handleSubmitAddReport()

  }
  handleSubmitAddReport(): void {
    console.log('bateu')
    if (this.reportForm?.value && this.reportForm?.valid) {
      console.log('Adicionar relatório:', this.reportForm.value);
      this.reportForm.reset();
    }
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



  handleSubmitAddPacient(): void {
    if (this.pacientForm?.value && this.pacientForm?.valid) {
      this.isLoading = true
      const requestCreatePacient: { username: string, email: string, address: string, uf: string, phone: string, birth: string, gender: string, profession: string } = {
        username: this.pacientForm.value.name as string,
        email: this.pacientForm.value.email as string,
        address: this.pacientForm.value.address as string,
        uf: this.pacientForm.value.uf as string,
        phone: this.pacientForm.value.phone as string,
        profession: this.pacientForm.value.profession as string,
        birth: this.pacientForm.value.birth as string,
        gender: this.pacientForm.value.gender as string,
      };

      this.pacientService
        .createPacient(requestCreatePacient)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response:any) => {
            if (response) {
              this.pacientForm.reset();
              this.toastMessage.SuccessMessage('Paciente criado com sucesso!')
              this.isLoading = false
            }
          },
          error: (err: Error) => {
            console.log(err);
            this.pacientForm.reset();
            this.toastMessage.ErrorMessage('Erro ao criar Paciente!')
          },
        });
    }
  }

  handleSubmitEditPacient(): void {
    if (
      this.pacientForm?.value &&
      this.pacientForm?.valid &&
      this.pacientAction?.event?.id
    ) {
      const requestEditPacient: { pacient_id: number, username: string, email: string, address: string, uf: string, phone: string, birth: string, gender: string, profession: string } = {
        pacient_id: this.pacientAction?.event?.id,
        username: this.pacientForm?.value?.name as string,
        email: this.pacientForm.value.email as string,
        address: this.pacientForm.value.address as string,
        uf: this.pacientForm.value.uf as string,
        phone: this.pacientForm.value.phone as string,
        profession: this.pacientForm.value.profession as string,
        birth: this.pacientForm.value.birth as string,
        gender: this.pacientForm.value.gender as string,
      };
      console.log(requestEditPacient)
      this.pacientService
        .editPacient(requestEditPacient)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.pacientForm.reset();
            this.toastMessage.SuccessMessage('Paciente editada com sucesso!')
          },
          error: (err: any) => {
            console.log(err);
            this.pacientForm.reset();
            this.toastMessage.ErrorMessage('Erro ao editar Paciente!')
          },
        });
    }
  }

  setPacientName(pacientName: string): void {
    if (pacientName) {
      const formValues = {
        name: this.pacientForm.value.name || '',
        email: this.pacientForm.value.email || '',
        address: this.pacientForm.value.address || '',
        uf: this.pacientForm.value.uf || '',
        phone: this.pacientForm.value.phone|| '',
        birth: this.pacientForm.value.birth || '',
        gender: this.pacientForm.value.gender|| '',
        profession: this.pacientForm.value.profession|| '',
      };
      console.log(formValues)
      this.pacientForm.setValue(formValues);
    }
  }
  loadReportData(reportId: number): void{
    console.log('Carregar dados do relatório para edição:', reportId);


  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
