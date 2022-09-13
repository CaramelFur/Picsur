import { Inject, Injectable } from '@nestjs/common';
import exp from 'constants';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import {
  AsyncFailable,
  Fail,
  Failable,
  FT,
  HasFailed,
} from 'picsur-shared/dist/types';
import { URLRegex, UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { SysPreferenceDbService } from '../../collections/preference-db/sys-preference-db.service';

@Injectable()
export class UsageService {
  constructor(private readonly sysPref: SysPreferenceDbService) {}

  async getTrackingUrl(): AsyncFailable<string | null> {
    const trackingUrl = await this.sysPref.getStringPreference(
      SysPreference.TrackingUrl,
    );
    if (HasFailed(trackingUrl)) return trackingUrl;

    if (trackingUrl === '') return null;

    if (!URLRegex.test(trackingUrl)) {
      return Fail(FT.UsrValidation, undefined, 'Invalid tracking URL');
    }

    return trackingUrl;
  }

  async getTrackingID(): AsyncFailable<string | null> {
    const trackingID = await this.sysPref.getStringPreference(
      SysPreference.TrackingId,
    );
    if (HasFailed(trackingID)) return trackingID;

    if (trackingID === '') return null;

    if (!UUIDRegex.test(trackingID)) {
      return Fail(FT.UsrValidation, undefined, 'Invalid tracking ID');
    }

    return trackingID;
  }
}
