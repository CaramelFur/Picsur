import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ApiModule } from '../api/api.module';
import { CopyFieldModule } from '../components/copyfield/copyfield.module';
import { PageNotFoundComponent } from '../components/pagenotfound/pagenotfound.component';
import { PageNotFoundModule } from '../components/pagenotfound/pagenotfound.module';
import { LoginComponent } from '../routes/login/login.component';
import { ProcessingComponent } from '../routes/processing/processing.component';
import { UploadComponent } from '../routes/upload/upload.component';
import { ViewComponent } from '../routes/view/view.component';
import { UtilModule } from '../util/util.module';

// TODO: split up router

const routes: Routes = [
  { path: '', component: UploadComponent },
  {
    path: 'processing',
    component: ProcessingComponent,
  },
  { path: 'view/:hash', component: ViewComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    CommonModule,
    NgxDropzoneModule,
    UtilModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundModule,
    CopyFieldModule,
    ApiModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [
    UploadComponent,
    ProcessingComponent,
    ViewComponent,
    LoginComponent,
  ],
  exports: [RouterModule],
})
export class AppRouterModule {}
