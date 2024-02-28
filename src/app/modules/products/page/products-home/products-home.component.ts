import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductsService} from "../../../../services/products/products.service";
import {ProductsDataTransferService} from "../../../../shared/products/products-data-transfer.service";
import {Router} from "@angular/router";
import {GetAllProductsResponse} from "../../../../../models/interfaces/products/response/GetAllProductsResponse";
import {ConfirmationService} from "primeng/api";
import {EventAction} from "../../../../../models/interfaces/products/event/EventAction";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ProductFormComponent} from "../../components/product-form/product-form.component";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {ConfirmationModal} from "../../../../services/confirmation/confirmation-service.service";


@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: [],
  providers: [ToastMessage, ConfirmationModal]
})
export class ProductsHomeComponent implements OnDestroy, OnInit {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private toastMessage: ToastMessage,
    private confirmationModal: ConfirmationModal
  ) {
  }

  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  getServiceProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsData();
    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else this.getAPIProductsDatas();
  }

  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDtService.setProductsDatas(response);
          }
        },
        error: (err) => {
          console.log(err);
          this.toastMessage.ErrorMessage("Erro ao buscar produtos")
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productDatas: this.productsDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIProductsDatas(),
      });
    }
  }

  handleDeleteProductAction(event: { product_id: string; productName: string; }): void {
    if (event) {
      this.confirmationModal.confirmDelete(`Confirma a exclusão do produto: ${event?.productName}?`, () => {
        this.deleteProduct(event?.product_id)
      })
    }
  }

  deleteProduct(product_id: string) {
    if (product_id) {
      this.productsService
        .deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.toastMessage.SuccessMessage('Produto removido com sucesso!')
              this.getAPIProductsDatas();
            }
          },
          error: (err) => {
            console.log(err);
            this.toastMessage.ErrorMessage('Erro ao remover produto!')
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

