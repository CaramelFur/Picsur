import { Routes } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { PageNotFoundComponent } from '../components/pagenotfound/pagenotfound.component';
import { PermissionGuard } from '../guards/permission.guard';
import { LoginComponent } from '../routes/login/login.component';
import { ProcessingComponent } from '../routes/processing/processing.component';
import { RegisterComponent } from '../routes/register/register.component';
import { UploadComponent } from '../routes/upload/upload.component';
import { ViewComponent } from '../routes/view/view.component';

// TODO: split up router
export const routes: Routes = [
  { path: '', component: UploadComponent },
  {
    path: 'processing',
    component: ProcessingComponent,
  },
  {
    path: 'view/:hash',
    component: ViewComponent,
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.ImageView] },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.UserLogin] },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.UserRegister] },
  },
  { path: '**', component: PageNotFoundComponent },
];
