import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { PermissionService } from 'src/app/services/api/permission.service';
import { UserService } from 'src/app/services/api/user.service';
import { UtilService } from 'src/app/util/util-module/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input('enableHamburger') enableHamburger: boolean = false;
  @Output('onHamburgerClick') onHamburgerClick = new EventEmitter<void>();

  private currentUser: EUser | null = null;

  public canLogIn: boolean = false;
  public canAccessSettings: boolean = false;
  public canUpload: boolean = false;
  public canRegister: boolean = false;

  public get user() {
    return this.currentUser;
  }

  public get isLoggedIn() {
    return this.currentUser !== null;
  }

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly utilService: UtilService,
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
      this.canLogIn = permissions.includes(Permission.UserLogin);
      this.canAccessSettings = permissions.includes(Permission.Settings);
      this.canUpload = permissions.includes(Permission.ImageUpload);
      this.canRegister = permissions.includes(Permission.UserRegister);
    });
  }

  doLogin() {
    this.router.navigate(['/user/login']);
  }

  doRegister() {
    this.router.navigate(['/user/register']);
  }

  async doLogout() {
    const user = await this.userService.logout();
    if (HasFailed(user)) {
      this.utilService.showSnackBar(user.getReason(), SnackBarType.Error);
      return;
    }

    this.utilService.showSnackBar('Logout successful', SnackBarType.Success);
  }

  doSettings() {
    this.router.navigate(['/settings']);
  }

  doUpload() {
    this.router.navigate(['/upload']);
  }

  doImages() {
    this.router.navigate(['/images']);
  }
}
