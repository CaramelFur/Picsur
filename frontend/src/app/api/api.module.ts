import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { ImageService } from './image.service';

@NgModule({
  providers: [ApiService, ImageService],
  imports: [CommonModule],
})
export class ApiModule {}
