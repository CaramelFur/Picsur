import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { PermissionService } from 'src/app/services/api/permission.service';
import { UserService } from 'src/app/services/api/user.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly logger = new Logger(HeaderComponent.name);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly errorService: ErrorService,
  ) {}

  @Input('enableHamburger') public set enableHamburger(value: boolean) {
    this._enableHamburger = value;
    this.changeDetector.markForCheck();
  }
  public _enableHamburger: boolean = true;
  @Output('onHamburgerClick') onHamburgerClick = new EventEmitter<void>();

  @Input('loading') public loading: boolean = false;

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

  ngOnInit(): void {
    this.subscribeUser();
    this.subscribePermissions();
  }

  @AutoUnsubscribe()
  subscribeUser() {
    return this.userService.live.subscribe((user) => {
      this.currentUser = user;

      this.changeDetector.markForCheck();
    });
  }

  @AutoUnsubscribe()
  subscribePermissions() {
    return this.permissionService.live.subscribe((permissions) => {
      this.canLogIn = permissions.includes(Permission.UserLogin);
      this.canAccessSettings = permissions.includes(Permission.Settings);
      this.canUpload = permissions.includes(Permission.ImageUpload);
      this.canRegister = permissions.includes(Permission.UserRegister);

      this.changeDetector.markForCheck();
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
    if (HasFailed(user))
      return this.errorService.showFailure(user, this.logger);

    this.errorService.success('Logout successful');
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
