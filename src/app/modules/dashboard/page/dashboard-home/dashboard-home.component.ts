import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductsService} from "../../../../services/products/products.service";
import {MessageService} from "primeng/api";
import {GetAllProductsResponse} from "../../../../../models/interfaces/products/response/GetAllProductsResponse";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ProductsDataTransferService} from "../../../../shared/products/products-data-transfer.service";
import {Subject, takeUntil} from "rxjs";
import {ChartData, ChartOptions} from "chart.js";
import {ToastMessage} from "../../../../services/toast-message/toast-message";


@Component({
  selector: 'app-dashboard-home',
  templateUrl: 'dashboard-home.component.html',
  styleUrls: [],
  providers: [ToastMessage]
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()
  public productsList: Array<GetAllProductsResponse> = []
  public productsChartData !: ChartData
  public productsChartOptions!: ChartOptions

  constructor(private productsService: ProductsService,
              private messageService: MessageService,
              private productsDataService: ProductsDataTransferService,
              private toastMessage: ToastMessage) {
  }

  ngOnInit(): void {
    this.getProductsData();
  }

  private getProductsData() {
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsList = response;
            this.productsDataService.setProductsDatas(this.productsList)
            this.setProductsChartConfig();
          }
        },
        error: (err) => {
          console.log(err);
          this.toastMessage.ErrorMessage("Erro ao buscar produtos")
        }
      });
  }

  private setProductsChartConfig(): void {
    if (this.productsList.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color')
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
      this.productsChartData = {
        labels: this.productsList.map((element) => element?.name),
        datasets: [
          {
            label: "Quantidade",
            backgroundColor: documentStyle.getPropertyValue("--indigo-400"),
            borderColor: documentStyle.getPropertyValue("--indigo-400"),
            hoverBackgroundColor: documentStyle.getPropertyValue("--indigo-500"),
            data: this.productsList.map((element) => element?.amount)
          }
        ]
      };
      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {legend: {labels: {color: textColor}}},
        scales: {
          x: this.createAxisConfig(textColorSecondary, surfaceBorder),
          y: this.createAxisConfig(textColorSecondary, surfaceBorder)
        }
      };

    }
  }

  private createAxisConfig(tickColor: string, gridColor: string) {
    return {ticks: {color: tickColor, font: {weight: 500}}, grid: {color: gridColor}};
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
