import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { SystemUsersList } from 'picsur-shared/dist/dto/specialusers.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject, Subject, throttleTime } from 'rxjs';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { UserManageService } from 'src/app/services/api/usermanage.service';
import { UtilService } from 'src/app/util/util.service';

@Component({
  templateUrl: './settings-users.component.html',
  styleUrls: ['./settings-users.component.scss'],
})
export class SettingsUsersComponent implements OnInit {
  public readonly displayedColumns: string[] = ['username', 'roles', 'actions'];
  public readonly pageSizeOptions: number[] = [5, 10, 25, 100];
  public readonly startingPageSize = this.pageSizeOptions[2];
  public readonly rolesTruncate = 5;

  public dataSubject = new BehaviorSubject<EUser[]>([]);
  public updateSubject = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userManageService: UserManageService,
    private utilService: UtilService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.subscribeToUpdate();
    this.fetchUsers(this.startingPageSize, 0);
  }

  public addUser() {
    this.router.navigate(['/settings/users/add']);
  }

  public editUser(user: EUser) {
    this.router.navigate(['/settings/users/edit', user.username]);
  }

  public async deleteUser(user: EUser) {
    const pressedButton = await this.utilService.showDialog({
      title: `Are you sure you want to delete ${user.username}?`,
      description: 'This action cannot be undone.',
      buttons: [
        {
          color: 'red',
          name: 'delete',
          text: 'Delete',
        },
        {
          color: 'primary',
          name: 'cancel',
          text: 'Cancel',
        },
      ],
    });

    if (pressedButton === 'delete') {
      const result = await this.userManageService.deleteUser(user.username);
      if (HasFailed(result)) {
        this.utilService.showSnackBar(
          'Failed to delete user',
          SnackBarType.Error
        );
      } else {
        this.utilService.showSnackBar('User deleted', SnackBarType.Success);
      }
    }

    const success = await this.fetchUsers(
      this.paginator.pageSize,
      this.paginator.pageIndex
    );
    if (!success) {
      this.paginator.firstPage();
    }
  }

  @AutoUnsubscribe()
  private subscribeToUpdate() {
    return this.updateSubject
      .pipe(throttleTime(500, undefined, { leading: true, trailing: true }))
      .subscribe(async (pageEvent: PageEvent) => {
        let success = await this.fetchUsers(
          pageEvent.pageSize,
          pageEvent.pageIndex
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
    pageIndex: number
  ): Promise<boolean> {
    const result = await this.userManageService.getUsers(pageSize, pageIndex);
    if (HasFailed(result)) {
      this.utilService.showSnackBar(
        'Failed to fetch users',
        SnackBarType.Error
      );
      return false;
    }

    if (result.length > 0) {
      this.dataSubject.next(result);
      return true;
    }

    return false;
  }

  isSystem(user: EUser): boolean {
    return SystemUsersList.includes(user.username);
  }
}
