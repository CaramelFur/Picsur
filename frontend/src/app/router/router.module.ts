import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from '../routes/upload/upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ProcessingComponent } from '../routes/processing/processing.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiModule } from '../api/api.module';
import { PageNotFoundModule } from '../components/pagenotfound/pagenotfound.module';
import { PageNotFoundComponent } from '../components/pagenotfound/pagenotfound.component';
import { ViewComponent } from '../routes/view/view.component';
import { CopyFieldModule } from '../components/copy-field/copy-field.module';
import { MatButtonModule } from '@angular/material/button';
import { UtilModule } from '../util/util.module';

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
    UtilModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    PageNotFoundModule,
    CopyFieldModule,
    ApiModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [UploadComponent, ProcessingComponent, ViewComponent],
  exports: [RouterModule],
})
export class AppRouterModule {}
