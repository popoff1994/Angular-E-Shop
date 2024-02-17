import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products/'; 


  constructor(private http: HttpClient) { }
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/create`, product);
  }
  getProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`).pipe(
      map(data => {
        if (data.SPECS && typeof data.SPECS === 'string') {
          data.SPECS = JSON.parse(data.SPECS);
        }
        return data;
      })
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

}
