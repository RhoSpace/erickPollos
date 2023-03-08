import { inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductApi } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private urlApi = 'https://scintillating-lily-104ccc.netlify.app/';
  private http = inject(HttpClient); 

  constructor(
    // private http: HttpClient,
  ) { }

  registerProduct(product: ProductApi): Observable<ProductApi[]>{
    let direction = this.urlApi + "api/products";
    return this.http.post<ProductApi[]>(direction, product);
  }

  getAllProduct(): Observable<ProductApi[]> {
    let direction = this.urlApi + "api/products"
    return this.http.get<ProductApi[]>(direction);
  }

  deleteProduct(id: any): Observable<ProductApi> {
    let direction = this.urlApi + `api/products/${id}`;
    return this.http.delete<ProductApi>(direction);
  }

  updateProduct(product: ProductApi): Observable<ProductApi> {
    let direction = this.urlApi + `api/products/${product._id}`;
    return this.http.put<ProductApi>(direction, product)
  }

  // medotodos no probados
  getUniqueProduct(id: number): Observable<ProductApi> {
    let direction = this.urlApi + `api/products/${id}`;
    return this.http.get<ProductApi>(direction);
  }


}
