import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiService } from './api.service';
import { ImageService } from './image.service';
import { KeyService } from './key.service';
import { UserService } from './user.service';

@NgModule({
  providers: [ApiService, ImageService, UserService, KeyService],
  imports: [CommonModule],
})
export class ApiModule {}
