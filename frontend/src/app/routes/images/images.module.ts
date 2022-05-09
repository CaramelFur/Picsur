import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PicsurImgModule } from 'src/app/components/picsur-img/picsur-img.module';
import { ImagesComponent } from './images.component';
import { ImagesRoutingModule } from './images.routing.module';
import { MasonryPipe } from './masonry.pipe';
import { MomentModule } from 'ngx-moment';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ResizeObserverModule } from '@ng-web-apis/resize-observer';
import { MasonryModule } from 'src/app/components/masonry/masonry.module';

@NgModule({
  declarations: [ImagesComponent, MasonryPipe],
  imports: [
    CommonModule,
    ImagesRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    ResizeObserverModule,
    MasonryModule,
    PicsurImgModule,
    MomentModule,
  ],
})
export class ImagesRouteModule {}
