import {Component, OnDestroy, OnInit} from '@angular/core';
import {PacientService} from "../../../../services/categories/categories.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Subject, takeUntil} from "rxjs";
import {GetPacientsResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {Router} from "@angular/router";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";
import {EventAction} from "../../../../../models/interfaces/products/event/EventAction";
import {CategoryFormComponent} from "../../components/category-form/category-form/category-form.component";
import {ProductsDataTransferService} from "../../../../shared/products/products-data-transfer.service";
import {DeletePacient} from "../../../../../models/interfaces/categories/event/deletePacient";

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.scss'],
  providers: [ToastMessage, ConfirmationModal]
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public categoriesData: Array<GetPacientsResponse> = [];
  public productsData = []

  constructor(
    private pacientSerivce: PacientService,
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
    this.pacientSerivce
      .getAllPacients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response : any) => {
          if (response.length > 0) {

            this.categoriesData = response;
          }
        },
        error: (err : []) => {
          console.log(err);
          this.toastMessage.ErrorMessage('Erro ao buscar Pacientes!')
          this.router.navigate(['/dashboard']);
        },
      });
  }
  handleDeleteCategoryAction(event: DeletePacient): void {
    if (event && event.pacientName !== 'Macbooks' && event.pacientName !== 'Notebooks') {
        this.confirmationModal.confirmDelete(`Confirma a exclusão da categoria: ${event?.pacientName}`, () => this.deletePacient(event?.pacient_id));
      // }
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
            this.getAllCategories();
            this.toastMessage.SuccessMessage('Paciente  removida com sucesso!')
          },
          error: (err: string) => {
            console.log(err);
            this.getAllCategories();
            this.toastMessage.ErrorMessage('Erro ao remover paciente !')
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


