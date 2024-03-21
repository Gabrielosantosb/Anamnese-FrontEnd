import {Injectable} from '@angular/core';
import {BehaviorSubject, map, take} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ReportsDataTransferService {
  // Dolar Quando retorna um observable
  // public productsDataEmitter$ =
  //   new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  // public productsDatas: Array<GetAllProductsResponse> = [];


  // public getProductsData() {
  //   this.productsDataEmitter$
  //     .pipe(
  //       take(1),
  //       map((data) => data?.filter((product) => product.amount > 0))
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         if (response) this.productsDatas = response;
  //       }
  //     });
  //   return this.productsDatas;
  // }
}
