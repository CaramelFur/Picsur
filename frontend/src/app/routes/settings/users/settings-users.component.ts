import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
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
  public readonly displayedColumns: string[] = [/*'id',*/ 'username', 'actions'];
  public readonly pageSizeOptions: number[] = [5, 10, 25, 100];
  public readonly startingPageSize = this.pageSizeOptions[2];

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

  public editUser(user: EUser) {
    this.router.navigate(['/settings/users/edit', user.username]);
  }

  public addUser() {
    this.router.navigate(['/settings/users/add']);
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
}
