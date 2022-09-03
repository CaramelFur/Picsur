import { Component } from '@angular/core';
import { EApiKey } from 'picsur-shared/dist/entities/apikey.entity';
import { ApiKeysService } from 'src/app/services/api/apikeys.service';
import { Logger } from 'src/app/services/logger/logger.service';

@Component({
  templateUrl: './settings-sharex.component.html',
  styleUrls: ['./settings-sharex.component.scss'],
})
export class SettingsShareXComponent {
  private readonly logger = new Logger(SettingsShareXComponent.name);

  public apikeys: EApiKey[] = [];

  constructor(private readonly apikeysService: ApiKeysService) {}

  private async loadApiKeys() {
  }
}
