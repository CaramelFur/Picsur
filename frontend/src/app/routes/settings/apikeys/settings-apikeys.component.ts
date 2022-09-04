import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { EApiKey } from 'picsur-shared/dist/entities/apikey.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject, Subject } from 'rxjs';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { ApiKeysService } from 'src/app/services/api/apikeys.service';
import { UserService } from 'src/app/services/api/user.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { Throttle } from 'src/app/util/throttle';
import { BootstrapService } from 'src/app/util/util-module/bootstrap.service';
import { UtilService } from 'src/app/util/util-module/util.service';

@Component({
  templateUrl: './settings-apikeys.component.html',
  styleUrls: ['./settings-apikeys.component.scss'],
})
export class SettingsApiKeysComponent implements OnInit {
  private readonly logger = new Logger(SettingsApiKeysComponent.name);

  public readonly displayedColumns: string[] = [
    'name',
    'created',
    'last_used',
    'actions',
  ];
  public readonly pageSizeOptions: number[] = [5, 10, 25, 100];
  public readonly startingPageSize = this.pageSizeOptions[2];

  public dataSubject = new BehaviorSubject<EApiKey[]>([]);
  public updateSubject = new Subject<PageEvent>();
  public totalApiKeys: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly utilService: UtilService,
    private readonly apikeysService: ApiKeysService,
    private readonly userService: UserService,
    private readonly clipboard: Clipboard,
    // Public because used in template
    public readonly bootstrapService: BootstrapService,
  ) {}

  ngOnInit() {
    this.subscribeToUpdate();

    this.fetchApiKeys(this.startingPageSize, 0);
  }

  public async addApiKey() {
    const result = await this.apikeysService.createApiKey();
    if (HasFailed(result)) {
      this.utilService.showSnackBar(
        'Failed to create api key',
        SnackBarType.Error,
      );
      return;
    }

    const success = await this.fetchApiKeys(
      this.paginator.pageSize,
      this.paginator.pageIndex,
    );
    if (!success) {
      this.paginator.firstPage();
    }

    const clipboardResult = this.clipboard.copy(result.key);
    if (!clipboardResult) {
      this.utilService.showSnackBar(
        'Failed to copy api key to clipboard',
        SnackBarType.Error,
      );
    }

    this.utilService.showSnackBar(
      'Api key created and copied to clipboard',
      SnackBarType.Success,
    );
  }

  public copyKey(apikey: string) {
    const result = this.clipboard.copy(apikey);
    if (!result) {
      this.utilService.showSnackBar(
        'Failed to copy api key to clipboard',
        SnackBarType.Error,
      );
    } else {
      this.utilService.showSnackBar(
        'Api key copied to clipboard',
        SnackBarType.Success,
      );
    }
  }

  public async deleteApiKey(apikeyId: string) {
    const pressedButton = await this.utilService.showDialog({
      title: `Are you sure you want to delete this api key?`,
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
      const result = await this.apikeysService.deleteApiKey(apikeyId);
      if (HasFailed(result)) {
        this.utilService.showSnackBar(
          'Failed to delete api key',
          SnackBarType.Error,
        );
      } else {
        this.utilService.showSnackBar('Api key deleted', SnackBarType.Success);
      }
    }

    const success = await this.fetchApiKeys(
      this.paginator.pageSize,
      this.paginator.pageIndex,
    );
    if (!success) {
      this.paginator.firstPage();
    }
  }

  async updateKeyName(name: string, apikeyID: string) {
    const result = await this.apikeysService.updateApiKey(apikeyID, name);

    if (HasFailed(result)) {
      this.logger.warn(result.print());
      this.utilService.showSnackBar(
        'Failed to update api key name',
        SnackBarType.Error,
      );
    } else {
      this.utilService.showSnackBar(
        'Api key name updated',
        SnackBarType.Success,
      );
    }
  }

  @AutoUnsubscribe()
  private subscribeToUpdate() {
    return this.updateSubject
      .pipe(Throttle(500))
      .subscribe(async (pageEvent: PageEvent) => {
        let success = await this.fetchApiKeys(
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

  private async fetchApiKeys(
    pageSize: number,
    pageIndex: number,
  ): Promise<boolean> {
    const response = await this.apikeysService.getApiKeys(
      pageSize,
      pageIndex,
      this.userService.snapshot?.id,
    );
    if (HasFailed(response)) {
      this.utilService.showSnackBar(
        'Failed to fetch api keys',
        SnackBarType.Error,
      );
      this.logger.warn(response.print());
      return false;
    }

    this.dataSubject.next(response.results);
    this.totalApiKeys = response.total;
    return true;
  }
}
