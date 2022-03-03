import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { ImageService } from './image.service';
import { UserService } from './user.service';
import { KeyService } from './key.service';

@NgModule({
  providers: [ApiService, ImageService, UserService, KeyService],
  imports: [CommonModule],
})
export class ApiModule {}
