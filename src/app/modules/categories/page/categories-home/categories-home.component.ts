import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../services/categories/categories.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Subject, takeUntil} from "rxjs";
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {Router} from "@angular/router";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";
import {DeleteCategory} from "../../../../../models/interfaces/categories/event/deleteCategory";
import {EventAction} from "../../../../../models/interfaces/products/event/EventAction";
import {CategoryFormComponent} from "../../components/category-form/category-form/category-form.component";
import {ProductsDataTransferService} from "../../../../shared/products/products-data-transfer.service";

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.scss'],
  providers: [ToastMessage, ConfirmationModal]
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public categoriesData: Array<GetCategoriesResponse> = [];
  public productsData = []

  constructor(
    private categoriesService: CategoriesService,
    private productsDtService: ProductsDataTransferService,
    private dialogService: DialogService,
    private toastMessage: ToastMessage,
    private confirmationModal: ConfirmationModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {

            this.categoriesData = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.toastMessage.ErrorMessage('Erro ao buscar categorias!')
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleDeleteCategoryAction(event: DeleteCategory): void {
    if (event && event.categoryName !== 'Macbooks' && event.categoryName !== 'Notebooks') {
      if (this.isCategoryUsed(event.category_id)) {
        this.toastMessage.ErrorMessage(`Não é possível excluir a categoria ${event.categoryName}, pois ela está associada a um produto`);
      } else {
        this.confirmationModal.confirmDelete(`Confirma a exclusão da categoria: ${event?.categoryName}`, () => this.deleteCategory(event?.category_id));
      }
    } else {
      this.toastMessage.ErrorMessage(`Não é possível excluir a categoria ${event.categoryName}`);
    }
  }

  deleteCategory(category_id: string): void {
    if (category_id) {
      this.categoriesService
        .deleteCategory({category_id})
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getAllCategories();
            this.toastMessage.SuccessMessage('Categoria removida com sucesso!')
          },
          error: (err) => {
            console.log(err);
            this.getAllCategories();
            this.toastMessage.ErrorMessage('Erro ao remover categoria!')
          },
        });

      this.getAllCategories();
    }
  }

  handleCategoryAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(CategoryFormComponent, {
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
        next: () => this.getAllCategories(),
      });
    }
  }

  private isCategoryUsed(category_id: string): boolean {
    let productsData = this.productsDtService.getProductsData()
    return productsData.some(product => product.category.id === category_id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


