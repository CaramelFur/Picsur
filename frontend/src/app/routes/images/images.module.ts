import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PicsurImgModule } from 'src/app/components/picsur-img/picsur-img.module';
import { ImagesComponent } from './images.component';
import { ImagesRoutingModule } from './images.routing.module';
import { MasonryPipe } from './masonry.pipe';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [ImagesComponent, MasonryPipe],
  imports: [
    CommonModule,
    ImagesRoutingModule,
    MatCardModule,
    MatButtonModule,
    PicsurImgModule,
    MomentModule,
  ],
})
export class ImagesRouteModule {}
