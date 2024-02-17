import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category';
import { ProductService } from '../product.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  providers: [CategoryService, ProductService]
})
export class CategoriesComponent {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data.map(category => ({
        ...category
      }));
      console.log(this.categories);
    }, (err) => console.error(err));
  }
  onCategoryClick(categoryId: number): void {
    this.router.navigate(['/products/category', categoryId]);
  }
  
}
