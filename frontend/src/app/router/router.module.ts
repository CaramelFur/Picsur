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
import { CopyFieldModule } from '../components/copyfield/copyfield.module';
import { MatButtonModule } from '@angular/material/button';
import { UtilModule } from '../util/util.module';
import { LoginComponent } from '../routes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';

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
