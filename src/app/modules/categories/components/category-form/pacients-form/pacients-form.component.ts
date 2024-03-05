import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
import {PacientsEvent} from "../../../../../../models/interfaces/enums/pacients/PacientEvent";
import {EditCategoryAction} from "../../../../../../models/interfaces/categories/event/editCategory";
import {ToastMessage} from "../../../../../services/toast-message/toast-message";
import {ConfirmationModal} from "../../../../../services/confirmation/confirmation-service.service";
import {PacientService} from "../../../../../services/categories/categories.service";
import {ProgressBar, ProgressBarModule} from "primeng/progressbar";

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

  public categoryAction!: { event: EditCategoryAction };
  public categoryForm = this.formBuilder.group({
    name: ['gabriel', Validators.required],
    email: ['gabriel@gmail.com', Validators.required],
    adress: ['QNJ', Validators.required],
    uf: ['DF', Validators.required],
    phone: ['123123123123', Validators.required],
    birth: ['26102002', Validators.required],
    gender: ['M', Validators.required],
    profession: ['Vagabumdo', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private pacientService: PacientService,
    private confirmationModal: ConfirmationModal,
    private toastMessage: ToastMessage
  ) {}

  ngOnInit(): void {
    this.categoryAction = this.ref.data;

    if (
      (this.categoryAction?.event?.action === this.editPacientAction && this.categoryAction?.event?.categoryName !== null) || undefined)
      this.setPacientName(this.categoryAction?.event?.categoryName as string);

  }

  handleSubmitPacientAction(): void {
    if (this.categoryAction?.event?.action === this.addPacientAction) this.handleSubmitAddPacient();
    if (this.categoryAction?.event?.action === this.editPacientAction) this.handleSubmitEditCategory();
    return;
  }

  handleSubmitAddPacient(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      this.isLoading = true
      const requestCreateCategory: { username: string, email: string, adress: string, uf: string, phone: string, birth: string, gender: string, profession: string } = {
        username: this.categoryForm.value.name as string,
        email: this.categoryForm.value.email as string,
        adress: this.categoryForm.value.adress as string,
        uf: this.categoryForm.value.uf as string,
        phone: this.categoryForm.value.phone as string,
        profession: this.categoryForm.value.profession as string,
        birth: this.categoryForm.value.birth as string,
        gender: this.categoryForm.value.gender as string,
      };

      this.pacientService
        .createPacient(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response:any) => {
            if (response) {
              this.categoryForm.reset();
              this.toastMessage.SuccessMessage('Paciente criado com sucesso!')
              this.isLoading = false
            }
          },
          error: (err: any) => {
            console.log(err);
            this.categoryForm.reset();
            this.toastMessage.ErrorMessage('Erro ao criar Paciente!')
          },
        });
    }
  }

  handleSubmitEditCategory(): void {
    if (
      this.categoryForm?.value &&
      this.categoryForm?.valid &&
      this.categoryAction?.event?.id
    ) {
      const requestEditCategory: { name: string; category_id: string } = {
        name: this.categoryForm?.value?.name as string,
        category_id: this.categoryAction?.event?.id,
      };

      this.pacientService
        .editCategory(requestEditCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.categoryForm.reset();
            this.toastMessage.SuccessMessage('Categoria editada com sucesso!')
          },
          error: (err: any) => {
            console.log(err);
            this.categoryForm.reset();
            this.toastMessage.ErrorMessage('Erro ao editar categoria!')
          },
        });
    }
  }

  setPacientName(categoryName: string): void {
    if (categoryName) {
      const formValues = {
        name: this.categoryForm.value.name || '',
        email: this.categoryForm.value.email || '',
        adress: this.categoryForm.value.adress || '',
        uf: this.categoryForm.value.uf || '',
        phone: this.categoryForm.value.phone|| '',
        birth: this.categoryForm.value.birth || '',
        gender: this.categoryForm.value.gender|| '',
        profession: this.categoryForm.value.profession|| '',
      };
      this.categoryForm.setValue(formValues);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

