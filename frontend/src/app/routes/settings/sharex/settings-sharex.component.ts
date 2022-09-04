import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { EApiKey } from 'picsur-shared/dist/entities/apikey.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { scan } from 'rxjs/operators';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { ApiKeysService } from 'src/app/services/api/apikeys.service';
import { PermissionService } from 'src/app/services/api/permission.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { SimpleUtilService } from 'src/app/util/util-module/simple-util.service';
import { UtilService } from 'src/app/util/util-module/util.service';
import { BuildShareX } from './sharex-builder';

@Component({
  templateUrl: './settings-sharex.component.html',
  styleUrls: ['./settings-sharex.component.scss'],
})
export class SettingsShareXComponent implements OnInit {
  private readonly logger = new Logger(SettingsShareXComponent.name);

  public apikeys = new BehaviorSubject<EApiKey[]>([]);
  public apikeys$ = this.apikeys.asObservable().pipe(
    scan((acc, curr) => {
      return [...acc, ...curr];
    }, [] as EApiKey[]),
  );

  public loaded = 0;
  public available = -1;

  public key: string | null = null;

  constructor(
    private readonly apikeysService: ApiKeysService,
    private readonly utilService: UtilService,
    private readonly simpleUtil: SimpleUtilService,
    private readonly permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.getNextBatch();
  }

  onSelectionChange(event: MatSelectChange) {
    this.key = event.value;
  }

  async onExport() {
    if (this.key === null) return;

    const permissions = await this.permissionService.getLoadedSnapshot();
    const canUseDelete = permissions.includes(Permission.ImageDeleteKey);

    const sharexConfig = BuildShareX(
      this.simpleUtil.getHost(),
      this.key,
      canUseDelete,
    );

    this.simpleUtil.downloadBuffer(
      JSON.stringify(sharexConfig),
      'Pisur-ShareX-target.sxcu',
      'application/json',
    );

    this.utilService.showSnackBar(
      'Exported ShareX config',
      SnackBarType.Success,
    );
  }

  async getNextBatch() {
    const newApiKeys = await this.apikeysService.getApiKeys(
      50,
      Math.floor(this.loaded / 50),
    );
    if (HasFailed(newApiKeys)) {
      this.utilService.showSnackBar(newApiKeys.getReason(), SnackBarType.Error);
      return;
    }
    this.loaded += newApiKeys.results.length;
    this.available = newApiKeys.total;

    this.apikeys.next(newApiKeys.results);
  }
}
