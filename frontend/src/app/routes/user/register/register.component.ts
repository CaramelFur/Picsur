import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { debounceTime } from 'rxjs';
import { RegisterControl } from '../../../models/forms/register.control';
import { UserPassModel } from '../../../models/forms-dto/userpass.dto';
import { PermissionService } from '../../../services/api/permission.service';
import { UserService } from '../../../services/api/user.service';
import { Logger } from '../../../services/logger/logger.service';
import { ErrorService } from '../../../util/error-manager/error.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private readonly logger = new Logger(RegisterComponent.name);

  public showLogin = false;
  public loading = false;

  public readonly model = new RegisterControl();

  constructor(
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly router: Router,
    private readonly errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    const state = history.state as UserPassModel;
    if (state) {
      this.model.putData(state);
      history.replaceState(null, '');
    }

    this.subscribeUsernameCheck();
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

    this.loading = true;
    const user = await this.userService.register(data.username, data.password);
    if (HasFailed(user)) {
      this.loading = false;

      return this.errorService.showFailure(user, this.logger);
    }

    if (!this.userService.isLoggedIn) {
      const loginResult = await this.userService.login(
        data.username,
        data.password,
      );
      if (HasFailed(loginResult)) {
        this.loading = false;

        return this.errorService.showFailure(loginResult, this.logger);
      }

      this.errorService.success('Register successful');
    } else {
      this.errorService.success('Register successful, did not log in');
    }

    this.loading = false;

    this.router.navigate(['/']);
  }

  async onLogin() {
    this.router.navigate(['/user/login'], {
      state: this.model.getRawData(),
    });
  }

  @AutoUnsubscribe()
  private subscribeUsernameCheck() {
    return this.model.username.valueChanges
      .pipe(debounceTime(500))
      .subscribe(async (value) => {
        if (this.model.username.errors || value === null) return;

        const result = await this.userService.checkNameIsAvailable(value);
        if (HasFailed(result))
          return this.errorService.showFailure(result, this.logger);

        if (!result) {
          this.model.username.setErrors({ unavailable: true });
        }
      });
  }
}
