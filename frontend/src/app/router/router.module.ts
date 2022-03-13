import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ApiModule } from '../api/api.module';
import { CopyFieldModule } from '../components/copyfield/copyfield.module';
import { PageNotFoundModule } from '../components/pagenotfound/pagenotfound.module';
import { GuardsModule } from '../guards/guards.module';
import { LoginComponent } from '../routes/login/login.component';
import { ProcessingComponent } from '../routes/processing/processing.component';
import { RegisterComponent } from '../routes/register/register.component';
import { UploadComponent } from '../routes/upload/upload.component';
import { ViewComponent } from '../routes/view/view.component';
import { UtilModule } from '../util/util.module';
import { routes } from './routes';

@NgModule({
  imports: [
    CommonModule,
    GuardsModule,
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
    RegisterComponent,
  ],
  exports: [RouterModule],
})
export class AppRouterModule {}
