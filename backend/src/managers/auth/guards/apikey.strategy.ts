import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { EUser, EUserSchema } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { IsApiKey } from 'picsur-shared/dist/validators/api-key.validator';
import { ApiKeyDbService } from '../../../collections/apikey-db/apikey-db.service.js';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer.js';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'apikey',
) {
  private readonly logger = new Logger(ApiKeyStrategy.name);

  constructor(private readonly apikeyDB: ApiKeyDbService) {
    super(
      {
        header: 'Authorization',
        prefix: 'Api-Key ',
      },
      false,
      (
        apikey: string,
        verified: (err: Error | null, user?: object, info?: object) => void,
      ) => {
        this.validate(apikey)
          .then((user) => {
            verified(null, user === false ? undefined : user);
          })
          .catch((err) => {
            verified(err, undefined);
          });
      },
    );
  }

  async validate(apikey: string): Promise<EUser | false> {
    const apiValidation = await IsApiKey().safeParseAsync(apikey);
    if (!apiValidation.success) {
      this.logger.warn('Invalid apikey format: ' + apikey);
      return false;
    }

    const apikeyResult = await this.apikeyDB.resolve(apikey);
    if (HasFailed(apikeyResult)) {
      this.logger.warn('Invalid apikey: ' + apikey);
      return false;
    }

    const user = EUserBackend2EUser(apikeyResult.user);

    const userValidation = await EUserSchema.safeParseAsync(user);
    if (!userValidation.success) {
      this.logger.error('Invalid user: ' + JSON.stringify(user));
      return false;
    }

    return userValidation.data;
  }
}
