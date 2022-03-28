import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: PRoutes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
