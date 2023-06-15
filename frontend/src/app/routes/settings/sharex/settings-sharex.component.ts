import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FileType2Ext, ImageFileType } from 'picsur-shared/dist/dto/mimes.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { EApiKey } from 'picsur-shared/dist/entities/apikey.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { BehaviorSubject } from 'rxjs';
import { scan } from 'rxjs/operators';
import { ApiKeysService } from '../../../services/api/apikeys.service';
import { InfoService } from '../../../services/api/info.service';
import { PermissionService } from '../../../services/api/permission.service';
import { Logger } from '../../../services/logger/logger.service';
import { ErrorService } from '../../../util/error-manager/error.service';
import { UtilService } from '../../../util/util.service';
import { BuildShareX } from './sharex-builder';

@Component({
  templateUrl: './settings-sharex.component.html',
  styleUrls: ['./settings-sharex.component.scss'],
})
export class SettingsShareXComponent implements OnInit {
  private readonly logger = new Logger(SettingsShareXComponent.name);

  public selectedFormat: string = ImageFileType.PNG;
  public formatOptions: {
    value: string;
    key: string;
  }[] = [];

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
    private readonly permissionService: PermissionService,
    private readonly infoService: InfoService,
    private readonly utilService: UtilService,
    private readonly errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.formatOptions = this.utilService.getBaseFormatOptions();
    this.getNextBatch();
  }

  onSelectionChange(event: MatSelectChange) {
    this.key = event.value;
  }

  async onExport() {
    if (this.key === null) return;

    const permissions = await this.permissionService.getLoadedSnapshot();
    const canUseDelete = permissions.includes(Permission.ImageDeleteKey);

    const ext = FileType2Ext(this.selectedFormat);
    if (HasFailed(ext)) {
      ext.print(this.logger);
    }

    const sharexConfig = BuildShareX(
      this.infoService.getHostname(),
      this.key,
      '.' + ext,
      canUseDelete,
    );

    this.utilService.downloadBuffer(
      JSON.stringify(sharexConfig),
      'Pisur-ShareX-target.sxcu',
      'application/json',
    );

    this.errorService.success('Exported ShareX config');
  }

  async getNextBatch() {
    const newApiKeys = await this.apikeysService.getApiKeys(
      50,
      Math.floor(this.loaded / 50),
    );
    if (HasFailed(newApiKeys))
      return this.errorService.showFailure(newApiKeys, this.logger);
    this.loaded += newApiKeys.results.length;
    this.available = newApiKeys.total;

    this.apikeys.next(newApiKeys.results);
  }
}
