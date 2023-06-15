import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { BehaviorSubject, Subject } from 'rxjs';
import { StaticInfoService } from '../../../services/api/static-info.service';
import { UserAdminService } from '../../../services/api/user-manage.service';
import { Logger } from '../../../services/logger/logger.service';
import { BootstrapService } from '../../../util/bootstrap.service';
import { DialogService } from '../../../util/dialog-manager/dialog.service';
import { ErrorService } from '../../../util/error-manager/error.service';
import { Throttle } from '../../../util/throttle';

@Component({
  templateUrl: './settings-users.component.html',
  styleUrls: ['./settings-users.component.scss'],
})
export class SettingsUsersComponent implements OnInit {
  private readonly logger = new Logger(SettingsUsersComponent.name);

  private UndeletableUsersList: string[] = [];

  public readonly displayedColumns: string[] = ['username', 'roles', 'actions'];
  public readonly pageSizeOptions: number[] = [5, 10, 25, 100];
  public readonly startingPageSize = this.pageSizeOptions[2];
  public readonly rolesTruncate = 5;

  public dataSubject = new BehaviorSubject<EUser[]>([]);
  public updateSubject = new Subject<PageEvent>();
  public totalUsers = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly userManageService: UserAdminService,
    private readonly staticInfo: StaticInfoService,
    private readonly router: Router,
    private readonly errorService: ErrorService,
    private readonly dialogService: DialogService,
    // Public because used in template
    public readonly bootstrapService: BootstrapService,
  ) {}

  ngOnInit() {
    this.subscribeToUpdate();

    Promise.all([
      this.fetchUsers(this.startingPageSize, 0),
      this.initSpecialUsers(),
    ]).catch(this.logger.error);
  }

  public addUser() {
    this.router.navigate(['/settings/users/add']);
  }

  public editUser(user: EUser) {
    this.router.navigate(['/settings/users/edit', user.id]);
  }

  public async deleteUser(user: EUser) {
    const pressedButton = await this.dialogService.showDialog({
      title: `Are you sure you want to delete ${user.username}?`,
      description: 'This action cannot be undone.',
      buttons: [
        {
          name: 'cancel',
          text: 'Cancel',
        },
        {
          color: 'warn',
          name: 'delete',
          text: 'Delete',
        },
      ],
    });

    if (pressedButton === 'delete') {
      const result = await this.userManageService.deleteUser(user.id ?? '');
      if (HasFailed(result)) {
        this.errorService.showFailure(result, this.logger);
      } else {
        this.errorService.success('User deleted');
      }
    }

    const success = await this.fetchUsers(
      this.paginator.pageSize,
      this.paginator.pageIndex,
    );
    if (!success) {
      this.paginator.firstPage();
    }
  }

  @AutoUnsubscribe()
  private subscribeToUpdate() {
    return this.updateSubject
      .pipe(Throttle(500))
      .subscribe(async (pageEvent: PageEvent) => {
        const success = await this.fetchUsers(
          pageEvent.pageSize,
          pageEvent.pageIndex,
        );
        if (!success) {
          if (pageEvent.previousPageIndex === pageEvent.pageIndex - 1) {
            this.paginator.previousPage();
          } else {
            this.paginator.firstPage();
          }
        }
      });
  }

  private async fetchUsers(
    pageSize: number,
    pageIndex: number,
  ): Promise<boolean> {
    const response = await this.userManageService.getUsers(pageSize, pageIndex);
    if (HasFailed(response)) {
      this.errorService.showFailure(response, this.logger);
      return false;
    }

    if (response.results.length > 0) {
      this.dataSubject.next(response.results);
      this.totalUsers = response.total;
      return true;
    }

    return false;
  }

  private async initSpecialUsers() {
    const specialUsers = await this.staticInfo.getSpecialUsers();
    this.UndeletableUsersList = specialUsers.UndeletableUsersList;
  }

  isSystem(user: EUser): boolean {
    return this.UndeletableUsersList.includes(user.username);
  }
}
