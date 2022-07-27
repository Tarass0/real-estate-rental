import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import * as fromPages from './pages';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [HomeComponent, ...fromPages.components],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['geometry'],
    }),
  ],
})
export class HomeModule {}
