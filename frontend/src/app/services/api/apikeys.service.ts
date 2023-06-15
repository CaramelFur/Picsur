import { Injectable } from '@angular/core';
import {
  ApiKeyCreateResponse,
  ApiKeyDeleteRequest,
  ApiKeyDeleteResponse,
  ApiKeyInfoRequest,
  ApiKeyInfoResponse,
  ApiKeyListRequest,
  ApiKeyListResponse,
  ApiKeyUpdateRequest,
  ApiKeyUpdateResponse,
} from 'picsur-shared/dist/dto/api/apikeys.dto';
import { EApiKey } from 'picsur-shared/dist/entities/apikey.entity';
import { AsyncFailable } from 'picsur-shared/dist/types/failable';
import { FindResult } from 'picsur-shared/dist/types/find-result';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiKeysService {
  constructor(private readonly api: ApiService) {}

  public async getApiKeys(
    count: number,
    page: number,
    userID?: string,
  ): AsyncFailable<FindResult<EApiKey>> {
    return await this.api.post(
      ApiKeyListRequest,
      ApiKeyListResponse,
      '/api/apikeys/list',
      {
        count,
        page,
        user_id: userID,
      },
    ).result;
  }

  public async getApiKey(id: string): AsyncFailable<EApiKey> {
    return await this.api.post(
      ApiKeyInfoRequest,
      ApiKeyInfoResponse,
      '/api/apikeys/info',
      {
        id,
      },
    ).result;
  }

  public async createApiKey(): AsyncFailable<EApiKey> {
    return await this.api.postEmpty(ApiKeyCreateResponse, '/api/apikeys/create')
      .result;
  }

  public async updateApiKey(id: string, name: string): AsyncFailable<EApiKey> {
    return await this.api.post(
      ApiKeyUpdateRequest,
      ApiKeyUpdateResponse,
      '/api/apikeys/update',
      {
        id,
        name,
      },
    ).result;
  }

  public async deleteApiKey(id: string): AsyncFailable<Omit<EApiKey, 'id'>> {
    return await this.api.post(
      ApiKeyDeleteRequest,
      ApiKeyDeleteResponse,
      '/api/apikeys/delete',
      {
        id,
      },
    ).result;
  }
}
