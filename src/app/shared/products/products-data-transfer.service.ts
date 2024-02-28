import {Injectable} from '@angular/core';
import {BehaviorSubject, map, take} from "rxjs";
import {GetAllProductsResponse} from "../../../models/interfaces/products/response/GetAllProductsResponse";

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  // Dolar Quando retorna um observable
  public productsDataEmitter$ =
    new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  public productsDatas: Array<GetAllProductsResponse> = [];

  setProductsDatas(products: Array<GetAllProductsResponse>): void {
    if (products) this.productsDataEmitter$.next(products)
    this.getProductsData()

  }

  public getProductsData() {
    this.productsDataEmitter$
      .pipe(
        take(1),
        map((data) => data?.filter((product) => product.amount > 0))
      )
      .subscribe({
        next: (response) => {
          if (response) this.productsDatas = response;
        }
      });
    return this.productsDatas;
  }
}
