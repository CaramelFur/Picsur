import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from '../routes/upload/upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { ProcessingComponent } from '../routes/processing/processing.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiModule } from '../api/api.module';
import { PageNotFoundModule } from '../components/pagenotfound/pagenotfound.module';
import { PageNotFoundComponent } from '../components/pagenotfound/pagenotfound.component';
import { ViewComponent } from '../routes/view/view.component';
import { CopyFieldModule } from '../components/copy-field/copy-field.module';

const routes: Routes = [
  { path: '', component: UploadComponent },
  {
    path: 'processing',
    component: ProcessingComponent,
  },
  { path: 'view/:hash', component: ViewComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    NgxDropzoneModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PageNotFoundModule,
    CopyFieldModule,
    ApiModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [UploadComponent, ProcessingComponent, ViewComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500,
        horizontalPosition: 'left',
        panelClass: ['mat-toolbar', 'mat-primary'],
      },
    },
  ],
  exports: [RouterModule],
})
export class AppRouterModule {}
