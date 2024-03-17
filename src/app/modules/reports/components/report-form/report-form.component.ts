import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, take, takeUntil} from "rxjs";
import {PacientService} from "../../../../services/pacients/pacients.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {GetPacientsResponse} from "../../../../../models/interfaces/pacients/get-pacient-service.service";
import {CreateProductRequest} from "../../../../../models/interfaces/reports/request/CreateProductRequest";
import {ReportsService} from "../../../../services/reports/reports.service";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {EventAction} from "../../../../../models/interfaces/reports/event/EventAction";
import {
  GetAllProductsResponse,
  GetAllReportsResponse
} from "../../../../../models/interfaces/reports/response/GetAllProductsResponse";
import {ReportsDataTransferService} from "../../../../shared/reports/reports-data-transfer.service";
import {ReportEvent} from "../../../../../models/interfaces/enums/products/ProductEvent.js";
import {EditProductRequest} from "../../../../../models/interfaces/reports/request/EditProductRequest";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {SaleProductRequest} from "../../../../../models/interfaces/reports/request/SaleProductRequest";

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: [],
  providers: [ToastMessage]
})
export class ReportFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetPacientsResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  public productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };
  public productSelectedDatas!: GetAllProductsResponse;
  public productsDatas: Array<GetAllProductsResponse> = [];
  public reportData: Array<GetAllReportsResponse> = []
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });
  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ["", Validators.required]
  })
  public reportForm = this.formBuilder.group({
    medicalHistory: ['', Validators.required],
    currentMedications: ['', Validators.required],
    cardiovascularIssues: [false],
    diabetes: [false],
    familyHistoryCardiovascularIssues: [false],
    familyHistoryDiabetes: [false],
    physicalActivity: ['', Validators.required],
    smoker: [false],
    alcoholConsumption: [0, Validators.min(0)],
    emergencyContactName: ['', Validators.required],
    emergencyContactPhone: ['', Validators.required],
    observations: ['']
  })

  public addProductAction = ReportEvent.ADD_REPORT_EVENT;
  public editProductAction = ReportEvent.EDIT_REPORT_EVENT;
  public deleteReportAction = ReportEvent.DELETE_REPORT_EVENT;
  public renderDropdown = false
  public saleProductSelected !: GetAllProductsResponse

  constructor(
    private pacientService: PacientService,
    private productsService: ReportsService,
    private productsDtService: ReportsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig,
    private toastMessage: ToastMessage,
  ) {
  }

  ngOnInit(): void {
    this.productAction = this.ref.data;
    // this.getAllCategories();
    this.renderDropdown = true
  }

  getAllCategories(): void {
    this.pacientService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
            if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productDatas) {
              console.log('foi')
              // this.getProductSelectedDatas(this.productAction?.event?.id as string);
            }
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount),
      };

      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.toastMessage.SuccessMessage('Produto criado com sucesso!')
            }
          },
          error: (err) => {
            console.log(err);
            this.toastMessage.ErrorMessage('Erro ao criar produto!')
          },
        });
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: String(this.editProductForm.value.name),
        price: String(this.editProductForm.value.price),
        description: String(this.editProductForm.value.description as string),
        product_id: this.productAction?.event?.id,
        amount: Number(this.editProductForm.value.amount),
        category_id: String(this.editProductForm.value.category_id)
      };

      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastMessage.SuccessMessage('Produto editado com sucesso!')
            this.editProductForm.reset();
          },
          error: (err) => {
            this.toastMessage.ErrorMessage('Erro ao editar produto')
            this.editProductForm.reset();
            console.log(err);
          },
        });
    }
  }


  // getProductSelectedDatas(productId: number): void {
  //   const allProducts = this.productAction?.productDatas;
  //
  //
  //   if (allProducts.length > 0) {
  //     const productFiltered = allProducts.filter(
  //       (element) => element?.id === productId
  //     );
  //
  //     if (productFiltered) {
  //       this.productSelectedDatas = productFiltered[0];
  //
  //       this.editProductForm.setValue({
  //         name: this.productSelectedDatas?.name,
  //         price: this.productSelectedDatas?.price,
  //         amount: this.productSelectedDatas?.amount,
  //         description: this.productSelectedDatas?.description,
  //         category_id: this.productSelectedDatas?.category.id
  //       });
  //     }
  //   }
  // }

  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
            this.productsDtService.setProductsDatas(this.productsDatas);
          }
        },
      });
  }

  getReportData(): void {
    this.productsService
      .getAllReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.reportData = response;
            this.reportData &&
            this.productsDtService.setProductsDatas(this.productsDatas);
          }
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
