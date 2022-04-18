import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CopyFieldModule } from 'src/app/components/copy-field/copy-field.module';
import { FabModule } from 'src/app/components/fab/fab.module';
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
    MatIconModule,
    FabModule
  ],
})
export class ViewRouteModule {}
