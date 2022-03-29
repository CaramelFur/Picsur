import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { UserPassModel } from 'src/app/models/forms-dto/userpass.dto';
import { PermissionService } from 'src/app/services/api/permission.service';
import { UserService } from 'src/app/services/api/user.service';
import { UtilService } from 'src/app/util/util.service';
import { RegisterControl } from '../../../models/forms/register.control';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  showLogin = false;

  model = new RegisterControl();

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
      console.warn(user);
      this.utilService.showSnackBar(
        'Register failed, please try again',
        SnackBarType.Error
      );
      return;
    }

    if (!this.userService.isLoggedIn) {
      const loginResult = this.userService.login(data.username, data.password);
      if (HasFailed(loginResult)) {
        console.warn(loginResult);
        this.utilService.showSnackBar(
          'Failed to login after register',
          SnackBarType.Error
        );
      }
    } else {
      this.utilService.showSnackBar(
        'Register successful',
        SnackBarType.Success
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
