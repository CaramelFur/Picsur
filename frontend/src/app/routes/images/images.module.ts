import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImagesComponent } from './images.component';
import { ImagesRoutingModule } from './images.routing.module';

@NgModule({
  declarations: [ImagesComponent],
  imports: [CommonModule, ImagesRoutingModule],
})
export class ImagesRouteModule {}
