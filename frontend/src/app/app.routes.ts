import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsByCategoryComponent } from './products-by-category/products-by-category.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'create-product', component: CreateProductComponent },
    { path: 'cart', component: CartComponent},
    { path: 'Contact', component: ContactComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'product-details/:productId', component: ProductDetailsComponent},
    { path: 'products/category/:categoryId', component: ProductsByCategoryComponent},
    { path: 'categories', component: CategoriesComponent},
];

export const AppRoutingModule = RouterModule.forRoot(routes);