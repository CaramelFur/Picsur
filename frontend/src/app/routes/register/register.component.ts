import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission, Permissions } from 'picsur-shared/dist/dto/permissions';
import { HasFailed } from 'picsur-shared/dist/types';
import { PermissionService } from 'src/app/api/permission.service';
import { UserService } from 'src/app/api/user.service';
import { UserPassModel } from 'src/app/models/forms/userpass';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { UtilService } from 'src/app/util/util.service';
import { RegisterControl } from '../../models/forms/register.model';

@Component({
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private readonly logger = console;

  private permissions: Permissions = [];

  public get showLogin() {
    return this.permissions.includes(Permission.UserLogin);
  }

  model = new RegisterControl();
  registerFail = false;

  constructor(
    private userService: UserService,
    private permissionService: PermissionService,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    const state = history.state as UserPassModel;
    if (state) {
      this.model.putData(state);
      history.replaceState(null, '');
    }

    this.onPermissions();
  }

  @AutoUnsubscribe()
  onPermissions() {
    return this.permissionService.live.subscribe((permissions) => {
      this.permissions = permissions;
    });
  }

  async onSubmit() {
    const data = this.model.getData();
    if (HasFailed(data)) {
      return;
    }

    const user = await this.userService.register(data.username, data.password);
    if (HasFailed(user)) {
      this.logger.warn(user);
      this.registerFail = true;
      return;
    }

    this.utilService.showSnackBar('Register successful', SnackBarType.Success);

    if (!this.userService.isLoggedIn) {
      const loginResult = this.userService.login(data.username, data.password);
      if (HasFailed(loginResult)) {
        this.logger.warn(loginResult);
        this.utilService.showSnackBar('Failed to login', SnackBarType.Error);
      }
    }

    this.router.navigate(['/']);
  }

  async onLogin() {
    this.router.navigate(['/login'], {
      state: this.model.getRawData(),
    });
  }
}
