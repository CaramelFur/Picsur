import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { HasFailed } from 'picsur-shared/dist/types';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { UserPassModel } from 'src/app/models/forms-dto/userpass.dto';
import { PermissionService } from 'src/app/services/api/permission.service';
import { UserService } from 'src/app/services/api/user.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { UtilService } from 'src/app/util/util-module/util.service';
import { RegisterControl } from '../../../models/forms/register.control';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private readonly logger = new Logger(RegisterComponent.name);

  public showLogin = false;

  public readonly model = new RegisterControl();

  constructor(
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly router: Router,
    private readonly utilService: UtilService,
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
      this.showLogin = permissions.includes(Permission.UserLogin);
    });
  }

  async onSubmit() {
    const data = this.model.getData();
    if (HasFailed(data)) {
      return;
    }

    const user = await this.userService.register(data.username, data.password);
    if (HasFailed(user)) {
      this.logger.error(user.getReason());
      this.utilService.showSnackBar(
        'Register failed, please try again',
        SnackBarType.Error,
      );
      return;
    }

    if (!this.userService.isLoggedIn) {
      const loginResult = await this.userService.login(
        data.username,
        data.password,
      );
      if (HasFailed(loginResult)) {
        this.logger.error(loginResult.getReason());
        this.utilService.showSnackBar(
          'Failed to login after register',
          SnackBarType.Error,
        );
      }

      this.utilService.showSnackBar(
        'Register successful',
        SnackBarType.Success,
      );
    } else {
      this.utilService.showSnackBar(
        'Register successful, did not log in',
        SnackBarType.Success,
      );
    }

    this.router.navigate(['/']);
  }

  async onLogin() {
    this.router.navigate(['/user/login'], {
      state: this.model.getRawData(),
    });
  }
}
