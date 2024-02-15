import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AuthService } from './app/auth.service';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    AuthService,
    provideHttpClient(
      withFetch(),
      ),
    importProvidersFrom(
      RouterModule.forRoot(routes),
    ),
    
  ]
}).catch(err => console.error(err));


