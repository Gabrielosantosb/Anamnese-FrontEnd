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
import {
  AddPacientRequest, EditPacientRequest,
  GetPacientsResponse
} from "../../../../../../models/interfaces/pacients/get-pacient-service.service";
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
  public estados = Object.values(UF)
  public gender: string[] = ["Masculino", "Feminino", "Outro"];
  public showReportForm: boolean = false;
  public pacientAction!: { event: EditPacientAction };


  public pacientForm = this.formBuilder.group({
    username: ['', Validators.required],
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
    this.pacientService.getPacientById(pacientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pacientData: GetPacientsResponse) => {
          console.log('Dados do paciente carregados:', pacientData);
          this.pacientForm.patchValue({
            username: pacientData.username,
            email: pacientData.email,
            address: pacientData.address,
            uf: pacientData.uf,
            phone: pacientData.phone,
            birth: pacientData.birth,
            gender: pacientData.gender,
            profession: pacientData.profession
          });
          this.showReportForm = true;
        },
        error: (error) => {
          console.error('Erro ao carregar dados do paciente:', error);
        }
      });
  }

  // loadPacientData(pacientId: number): void {
  //   this.pacientService.getPacientById(pacientId, this.pacientForm)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (pacientData: GetPacientsResponse) => {
  //         console.log('Dados do paciente carregados:', pacientData);
  //         this.showReportForm = true;
  //       },
  //       error: (error) => {
  //         console.error('Erro ao carregar dados do paciente:', error);
  //       }
  //     });
  // }

  handleSubmitPacientAction(): void {
    if (this.pacientAction?.event?.action === this.addPacientAction) this.handleSubmitAddPacient();
    if (this.pacientAction?.event?.action === this.editPacientAction) this.handleSubmitEditPacient();
    return;
  }


  handleSubmitAddPacient(): void {
    if (this.pacientForm?.value && this.pacientForm?.valid) {
      this.isLoading = true

      const requestCreatePacient = this.pacientForm.value as AddPacientRequest;
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
    const requestEditPacient = this.pacientForm.value as EditPacientRequest;
    requestEditPacient.pacient_id =  this.pacientAction?.event?.id
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
