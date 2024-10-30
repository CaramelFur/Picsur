import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AsyncFailable,
    Fail,
    FT,
    HasFailed,
} from 'picsur-shared/dist/types/failable';
import { FindResult } from 'picsur-shared/dist/types/find-result';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import { Repository } from 'typeorm';
import { EApiKeyBackend } from '../../database/entities/apikey.entity.js';
import { EUserBackend } from '../../database/entities/users/user.entity.js';

@Injectable()
export class ApiKeyDbService {
  private readonly logger = new Logger(ApiKeyDbService.name);

  constructor(
    @InjectRepository(EApiKeyBackend)
    private readonly apikeyRepo: Repository<EApiKeyBackend>,
  ) {}

  async createApiKey(userid: string): AsyncFailable<EApiKeyBackend<string>> {
    const apikey = new EApiKeyBackend<string>();
    apikey.user = userid;
    apikey.created = new Date();
    // YYYY-MM-DD- followed by a random number
    apikey.name =
      new Date().toISOString().slice(0, 10) +
      '_' +
      Math.round(Math.random() * 100);
    apikey.key = generateRandomString(32); // Might collide, probably not

    /*
    And yes it might be more secure here to sha256 the key, to ensure that they are not leaked upon db breach
    But this would mean that the user has to keep track of it themselves, and it makes many other things less smooth
    So just foking protect ya database, and we'll be fine
    */

    try {
      return this.apikeyRepo.save(apikey);
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  async findOne(
    id: string,
    userid: string | undefined,
  ): AsyncFailable<EApiKeyBackend<string>> {
    try {
      const apikey = await this.apikeyRepo.findOne({
        where: {
          user:
            userid !== undefined
              ? // This is stupid, but typeorm do typeorm
                ({ id: userid } as any)
              : undefined,
          id,
        },
        loadRelationIds: true,
      });
      if (!apikey) return Fail(FT.NotFound, 'API key not found');
      return apikey as EApiKeyBackend<string>;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  async findMany(
    count: number,
    page: number,
    userid: string | undefined,
  ): AsyncFailable<FindResult<EApiKeyBackend<string>>> {
    if (count < 1 || page < 0) return Fail(FT.UsrValidation, 'Invalid page');
    if (count > 100) return Fail(FT.UsrValidation, 'Too many results');

    try {
      const [apikeys, amount] = await this.apikeyRepo.findAndCount({
        where: {
          user:
            userid !== undefined
              ? // This is stupid, but typeorm do typeorm
                ({ id: userid } as any)
              : undefined,
        },
        order: { created: 'DESC' },
        skip: count * page,
        take: count,
        loadRelationIds: true,
      });

      return {
        results: apikeys as EApiKeyBackend<string>[],
        total: amount,
        page,
        pages: Math.ceil(amount / count),
      };
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  async updateApiKey(
    id: string,
    name: string,
    userid: string | undefined,
  ): AsyncFailable<EApiKeyBackend<string>> {
    const apikey = await this.findOne(id, userid);
    if (HasFailed(apikey)) return apikey;

    try {
      apikey.name = name;

      return this.apikeyRepo.save(apikey);
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  async deleteApiKey(
    id: string,
    userid: string | undefined,
  ): AsyncFailable<EApiKeyBackend<string>> {
    const apikeyToDelete = await this.findOne(id, userid);
    if (HasFailed(apikeyToDelete)) return apikeyToDelete;

    const apiKeyCopy = { ...apikeyToDelete };
    try {
      await this.apikeyRepo.remove(apikeyToDelete);
      return apiKeyCopy as EApiKeyBackend<string>;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  async resolve(key: string): AsyncFailable<EApiKeyBackend<EUserBackend>> {
    try {
      const apikey = await this.apikeyRepo.findOne({
        where: { key },
        relations: ['user'],
      });
      if (!apikey) return Fail(FT.NotFound, 'API key not found');

      this.updateLastUsed(apikey);

      return apikey as EApiKeyBackend<EUserBackend>;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  private updateLastUsed(apikey: EApiKeyBackend) {
    (async () => {
      apikey.last_used = new Date();
      this.apikeyRepo.save(apikey);
    })().catch(this.logger.error.bind(this.logger));
  }
}
