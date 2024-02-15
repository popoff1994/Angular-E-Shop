import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  template: `
  <div class="content-wrapper">
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  </div>
  <app-footer></app-footer>`,
  standalone: true,
  styleUrl: '../../src/styles.css',
  imports: [RouterModule, NavbarComponent, FooterComponent],
})
export class AppComponent {
  title = 'Product-Shop';
}

