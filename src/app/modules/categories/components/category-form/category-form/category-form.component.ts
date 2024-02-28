import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
import {CategoriesService} from "../../../../../services/categories/categories.service";
import {CategoryEvent} from "../../../../../../models/interfaces/enums/categories/CategoryEvent";
import {EditCategoryAction} from "../../../../../../models/interfaces/categories/event/editCategory";
import {ToastMessage} from "../../../../../services/toast-message/toast-message";
import {ConfirmationModal} from "../../../../../services/confirmation/confirmation-service.service";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  providers: [ToastMessage, ConfirmationModal]
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryAction!: { event: EditCategoryAction };
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private confirmationModal: ConfirmationModal,
    private toastMessage: ToastMessage
  ) {}

  ngOnInit(): void {
    this.categoryAction = this.ref.data;

    if (
      (this.categoryAction?.event?.action === this.editCategoryAction && this.categoryAction?.event?.categoryName !== null) || undefined)
      this.setCategoryName(this.categoryAction?.event?.categoryName as string);

  }

  handleSubmitCategoryAction(): void {
    if (this.categoryAction?.event?.action === this.addCategoryAction) this.handleSubmitAddCategory();
    if (this.categoryAction?.event?.action === this.editCategoryAction) this.handleSubmitEditCategory();
    return;
  }

  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      const requestCreateCategory: { name: string } = {
        name: this.categoryForm.value.name as string,
      };

      this.categoriesService
        .createCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset();
              this.toastMessage.SuccessMessage('Categoria criada com sucesso!')
            }
          },
          error: (err) => {
            console.log(err);
            this.categoryForm.reset();
            this.toastMessage.ErrorMessage('Erro ao criar categoria!')
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

      this.categoriesService
        .editCategory(requestEditCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.categoryForm.reset();
            this.toastMessage.SuccessMessage('Categoria editada com sucesso!')
          },
          error: (err) => {
            console.log(err);
            this.categoryForm.reset();
            this.toastMessage.ErrorMessage('Erro ao editar categoria!')
          },
        });
    }
  }

  setCategoryName(categoryName: string): void {
    if (categoryName) {
      this.categoryForm.setValue({
        name: categoryName,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

