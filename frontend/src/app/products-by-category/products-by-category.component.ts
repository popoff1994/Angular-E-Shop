import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products-by-category.component.html',
  styleUrl: './products-by-category.component.css',
  providers: [ProductService, CartService]
})
export class ProductsByCategoryComponent {
  products: Product[] = [];
  quantities: {[productId: number]: number} = {};

  constructor(private productService: ProductService, private cartService: CartService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];
      this.fetchProductsByCategory(categoryId);
    });
  }
  
  fetchProductsByCategory(categoryId: number) {
    this.productService.getProductsByCategory(categoryId).subscribe(products => {
      this.products = products;
      console.log(this.products);
    });
  }
  getProductImageUrl(product: Product): string {
    console.log("product",product);
    return product.IMAGE_URLS.length > 0 ? product.IMAGE_URLS[0] : 'path/to/placeholder/image.png';
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
}
