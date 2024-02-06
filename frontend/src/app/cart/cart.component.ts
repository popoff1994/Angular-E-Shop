import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { CartItem } from '../models/cart-item';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class CartComponent {
  items: CartItem[] = [];
  quantities: any;

  constructor(private cartService: CartService) {
    this.items = this.cartService.getItems();
    this.quantities = {};
    this.items.forEach(item => {
    this.quantities[item.PRODUCT_ID] = item.QUANTITY;
    });
  }

  removeItemFromCart(product: Product): void {
    this.cartService.removeFromCart(product.PRODUCT_ID).subscribe({
        next: () => {
            alert('Item removed from cart');
            this.loadCartItems();
        },
        error: (error) => {
            console.error('Error removing item from cart:', error);
            alert('Error removing item from cart');
        }
    });
}

  getTotal(): number {
    return this.items.reduce((acc, current) => acc + (current.PRICE * current.QUANTITY), 0);
  }
  
  removeAllFromCart(product: Product): void {
    this.cartService.removeAllFromCart(product.PRODUCT_ID).subscribe({
        next: () => {
            alert('All instances of the product removed from cart');
            this.loadCartItems();
        },
        error: (error) => {
            console.error('Error removing all instances from cart:', error);
            alert('Error removing all instances from cart');
        }
    });
}

  addToCart(product: Product, QUANTITY: number): void {
    this.cartService.addToCart(product, QUANTITY);
    window.alert('Your product has been added to the cart!');
  }
  addCustomQuantity(product: Product, quantity: number): void {
    if (quantity > 0) {
        this.cartService.setCartQuantity(product.PRODUCT_ID, quantity).subscribe({
            next: () => {
                alert('Quantity updated successfully');
                this.loadCartItems();
            },
            error: (error) => {
                console.error('Error updating quantity:', error);
                alert('Error updating quantity');
            }
        });
    } else {
        window.alert('Please enter a valid quantity!');
    }
}

  changeQuantity(product: Product, QUANTITY: number): void {
    this.cartService.changeQuantity(product, QUANTITY);
    this.items = this.cartService.getItems(); 
    this.quantities[product.PRODUCT_ID] = QUANTITY;
  }
  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.fetchCartItems().subscribe({
      next: (items) => {
        console.log(items);
        this.items = items;
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });
  }
  
  
  
  clearCart(): void {
    this.cartService.clearCart();
  }
}

