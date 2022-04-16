import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CopyFieldModule } from 'src/app/components/copyfield/copyfield.module';
import { PicsurImgModule } from 'src/app/components/picsur-img/picsur-img.module';
import { ViewComponent } from './view.component';
import { ViewRoutingModule } from './view.routing.module';
@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    CopyFieldModule,
    ViewRoutingModule,
    MatButtonModule,
    PicsurImgModule,
  ],
})
export class ViewRouteModule {}
