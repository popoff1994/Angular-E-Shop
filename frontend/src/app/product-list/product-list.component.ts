import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  quantities: {[productId: number]: number} = {};
  isLoggedIn = false;
  private authSubscription: Subscription;
  isAdmin: boolean = false;

  constructor(private productService: ProductService, private cartService: CartService, private authService: AuthService) {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }
    ngOnInit() {
      this.productService.getProducts().subscribe((data: Product[]) => {
        this.products = data.map(product => ({
          ...product,

          IMAGE_URLS: product.IMAGE_URLS || []
        }));
        this.isAdmin = this.authService.userHasRole('admin');
      });
    }
    checkUserRole(role: string): boolean {
      return this.authService.userHasRole(role);
    }

    addToCart(product: Product, quantity: number): void {
      if (!this.authService.isLoggedIn()) {
        alert('Please log in to add items to the cart');
        return;
      }
      this.cartService.addToCart(product, quantity).subscribe({
        next: () => {
          alert('Product added to cart');
          this.cartService.fetchCartItems().subscribe(items => {
          });
        },
        error: (err) => {
          console.error('Error adding product to cart:', err);
          alert('Error adding product to cart: ' + (err.error.message || err.message));
        }
      });
    }
    
    getProductImageUrl(product: Product): string {
      console.log("product",product);
      return product.IMAGE_URLS.length > 0 ? product.IMAGE_URLS[0] : 'path/to/placeholder/image.png';
    }

ngOnDestroy() {
  this.authSubscription.unsubscribe();
}
    
}

