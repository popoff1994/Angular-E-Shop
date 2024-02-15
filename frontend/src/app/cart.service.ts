import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { CartItem } from './models/cart-item';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  private apiUrl = 'http://localhost:3000/cart';

  
  
  constructor(private http: HttpClient) { }
  addToCart(product: Product, QUANTITY: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { productId: product.PRODUCT_ID, QUANTITY }, { withCredentials: true });
  }

fetchCartItems(): Observable<CartItem[]> {
  return this.http.get<CartItem[]>(`${this.apiUrl}/items`, { withCredentials: true })
    .pipe(
      map(items => items.map(item => ({
        ...item,
        IMAGE_URLS: item.IMAGE_URLS ? item.IMAGE_URLS : []
      })))
    );
}

  
  
  
removeFromCart(productId: number): Observable<any> {
  const url = `${this.apiUrl}/remove`;
  const options = {
    body: { productId: productId },
    withCredentials: true
  };
  return this.http.delete(url, options);
}

setCartQuantity(productId: number, QUANTITY: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/quantity`, { productId, QUANTITY }, { withCredentials: true });
}



  
  changeQuantity(product: Product, QUANTITY: number): void {
    const existingItem = this.items.find(item => item.PRODUCT_ID === product.PRODUCT_ID);

    if (existingItem) {
      existingItem.QUANTITY = QUANTITY;
      if (existingItem.QUANTITY === 0) {
        this.items = this.items.filter(item => item.PRODUCT_ID !== product.PRODUCT_ID);
      }
    }
  }
  removeAllFromCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/removeAll`, { productId }, { withCredentials: true });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getItems() : CartItem[] {
    return this.items;
  }

  clearCart(): Observable<any> {
    return this.http.post(`${this.apiUrl}/clear`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.itemsSubject.next([]);
      })
    );
  }
  
}