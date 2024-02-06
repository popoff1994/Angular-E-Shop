import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'cart', component: CartComponent},
    { path: 'Contact', component: ContactComponent},
    { path: 'login', component: LoginComponent},
];

export const AppRoutingModule = RouterModule.forRoot(routes);