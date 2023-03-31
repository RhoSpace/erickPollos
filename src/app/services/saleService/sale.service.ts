import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleApi } from '../../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  // private urlApi = 'http://localhost:9000/';
  private urlApi = 'https://api-pollos-sale.onrender.com/';
  private http = inject(HttpClient);

  constructor() { }

  registerSale(sale: SaleApi): Observable<SaleApi[]> {
    return this.http.post<SaleApi[]>(this.urlApi + `api/sales`, sale);
  }

  getAllSales(): Observable<SaleApi[]> {
    return this.http.get<SaleApi[]>(this.urlApi + `api/sales`);
  }

  getUniqueSale(id: any): Observable<SaleApi> {
    return this.http.get<SaleApi>(this.urlApi + `api/sales/${id}`);
  }

  deleteSale(id: any): Observable<SaleApi> {
    return this.http.delete<SaleApi>(this.urlApi + `api/sales/${id}`);
  }

  updateSale(sale: SaleApi): Observable<SaleApi> {
    return this.http.put<SaleApi>(this.urlApi + `api/sales/${sale._id}`, sale)
  }

}
