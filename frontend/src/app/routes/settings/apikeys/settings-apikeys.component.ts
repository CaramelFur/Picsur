import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { EApiKey } from 'picsur-shared/dist/entities/apikey.entity';
import { Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiKeysService } from 'src/app/services/api/apikeys.service';
import { UserService } from 'src/app/services/api/user.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { BootstrapService } from 'src/app/util/bootstrap.service';
import { DialogService } from 'src/app/util/dialog-manager/dialog.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';
import { Throttle } from 'src/app/util/throttle';

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
    private readonly apikeysService: ApiKeysService,
    private readonly userService: UserService,
    private readonly clipboard: Clipboard,
    private readonly errorService: ErrorService,
    private readonly dialogService: DialogService,
    // Public because used in template
    public readonly bootstrapService: BootstrapService,
  ) {}

  ngOnInit() {
    this.subscribeToUpdate();

    this.fetchApiKeys(this.startingPageSize, 0);
  }

  public async addApiKey() {
    const result = await this.apikeysService.createApiKey();
    if (HasFailed(result))
      return this.errorService.showFailure(result, this.logger);

    const success = await this.fetchApiKeys(
      this.paginator.pageSize,
      this.paginator.pageIndex,
    );
    if (!success) {
      this.paginator.firstPage();
    }

    const clipboardResult = this.clipboard.copy(result.key);
    if (!clipboardResult) {
      return this.errorService.showFailure(
        Fail(FT.Internal, 'Failed to copy api key to clipboard'),
        this.logger,
      );
    }

    this.errorService.success('Api key created and copied to clipboard');
  }

  public copyKey(apikey: string) {
    const result = this.clipboard.copy(apikey);
    if (!result) {
      return this.errorService.showFailure(
        Fail(FT.Internal, 'Failed to copy api key to clipboard'),
        this.logger,
      );
    }

    this.errorService.success('Api key copied to clipboard');
  }

  public async deleteApiKey(apikeyId: string) {
    const pressedButton = await this.dialogService.showDialog({
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
        this.errorService.showFailure(result, this.logger);
      } else {
        this.errorService.success('Api key deleted');
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

    if (HasFailed(result))
      return this.errorService.showFailure(result, this.logger);

    this.errorService.success('Api key name updated');
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
    if (HasFailed(response)){
       this.errorService.showFailure(response, this.logger);
       return false;
    }

    this.dataSubject.next(response.results);
    this.totalApiKeys = response.total;
    return true;
  }
}
