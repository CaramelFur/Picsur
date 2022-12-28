import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { E401Component } from './401.component';
import { E404Component } from './404.component';
import { ErrorsRoutingModule } from './errors.routing.module';

@NgModule({
  declarations: [E404Component, E401Component],
  imports: [CommonModule, ErrorsRoutingModule],
})
export default class ErrorsRouteModule {}
