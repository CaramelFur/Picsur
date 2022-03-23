import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import Fuse from 'fuse.js';
import { CopyFieldModule } from 'src/app/components/copyfield/copyfield.module';
import { ViewComponent } from './view.component';
import { ViewRoutingModule } from './view.routing.module';
const a = Fuse;
@NgModule({
  declarations: [ViewComponent],
  imports: [CommonModule, CopyFieldModule, ViewRoutingModule, MatButtonModule],
})
export class ViewRouteModule {}
