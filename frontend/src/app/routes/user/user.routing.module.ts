import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
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
