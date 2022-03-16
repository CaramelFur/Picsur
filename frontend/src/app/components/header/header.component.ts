import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission, Permissions } from 'picsur-shared/dist/dto/permissions';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { PermissionService } from 'src/app/services/api/permission.service';
import { UserService } from 'src/app/services/api/user.service';
import { UtilService } from 'src/app/util/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private readonly logger = console;

  @Input('enableHamburger') enableHamburger: boolean = false;
  @Output('onHamburgerClick') onHamburgerClick = new EventEmitter<void>();

  private currentUser: EUser | null = null;
  private permissions: Permissions = [];

  public get user() {
    return this.currentUser;
  }

  public get isLoggedIn() {
    return this.currentUser !== null;
  }

  public get canLogIn() {
    return this.permissions.includes(Permission.UserLogin);
  }

  public get canAccessSettings() {
    return this.permissions.includes(Permission.Settings);
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private permissionService: PermissionService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.subscribeUser();
    this.subscribePermissions();
  }

  @AutoUnsubscribe()
  subscribeUser() {
    return this.userService.live.subscribe((user) => {
      this.currentUser = user;
    });
  }

  @AutoUnsubscribe()
  subscribePermissions() {
    return this.permissionService.live.subscribe((permissions) => {
      this.permissions = permissions;
    });
  }

  doLogin() {
    this.router.navigate(['/user/login']);
  }

  doLogout() {
    const user = this.userService.logout();
    if (HasFailed(user)) {
      this.utilService.showSnackBar(user.getReason(), SnackBarType.Error);
      return;
    }

    this.utilService.showSnackBar('Logout successful', SnackBarType.Success);
  }

  doSettings() {
    this.router.navigate(['/settings']);
  }
}
