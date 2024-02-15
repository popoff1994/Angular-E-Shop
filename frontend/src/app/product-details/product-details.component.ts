import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./product-details.component.css'],
  providers: [ProductService]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  objectKeys = Object.keys;
  selectedImageIndex: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getProductDetails();
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
  

  private getProductDetails(): void {
    const productIdParam = this.route.snapshot.paramMap.get('productId');
    if (productIdParam) {
      const productId = parseInt(productIdParam, 10);
      this.productService.getProduct(productId).subscribe({
        next: (data) => {
          if (data.SPECS && typeof data.SPECS === 'string') {
            data.SPECS = JSON.parse(data.SPECS);
          }
          this.product = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }
}
