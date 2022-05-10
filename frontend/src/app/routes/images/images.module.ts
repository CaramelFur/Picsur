import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MomentModule } from 'ngx-moment';
import { MasonryModule } from 'src/app/components/masonry/masonry.module';
import { PaginatorModule } from 'src/app/components/paginator/paginator.module';
import { PicsurImgModule } from 'src/app/components/picsur-img/picsur-img.module';
import { ImagesComponent } from './images.component';
import { ImagesRoutingModule } from './images.routing.module';

@NgModule({
  declarations: [ImagesComponent],
  imports: [
    CommonModule,
    ImagesRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MasonryModule,
    PaginatorModule,
    PicsurImgModule,
    MomentModule,
  ],
})
export class ImagesRouteModule {}
