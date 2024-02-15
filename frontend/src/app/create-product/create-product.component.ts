import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
  providers: [ProductService, AuthService]
})
export class CreateProductComponent {
  product: Product = {
    PRODUCT_ID: 0,
    NAME: '',
    PRICE: 0,
    SHORT_DESCRIPTION: '',
    LONG_DESCRIPTION: '',
    SPECS: {},
    CATEGORY_ID: 0,
    IMAGE_URLS: [],
  };
  constructor(private productService: ProductService, private authService: AuthService) {}
  
  addImageUrl(): void {
    this.product.IMAGE_URLS.push('');
  }
  removeImageUrl(index: number): void {
    if (index > -1) {
      this.product.IMAGE_URLS.splice(index, 1);
    }
  }
  

  createProduct(product: Product): void {
    this.productService.createProduct(product).subscribe({
      next: (response) => {
        console.log('Product created', response);
        alert('Product created succesfully');
      },
      error: (error) => {
        console.error('Product creation failed', error);
        alert('Product creation failed');
      },
    });
  }
}
