import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule } from 'src/app/services/api/api.module';
import { FooterComponent } from './footer.component';


@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, ApiModule],
  exports: [FooterComponent],
})
export class FooterModule {}
