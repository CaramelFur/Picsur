import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiKeyCreateResponse,
  ApiKeyDeleteRequest,
  ApiKeyDeleteResponse,
  ApiKeyInfoRequest,
  ApiKeyInfoResponse,
  ApiKeyListRequest,
  ApiKeyListResponse
} from 'picsur-shared/dist/dto/api/apikeys.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { ThrowIfFailed } from 'picsur-shared/dist/types';
import { ApiKeyDbService } from '../../../collections/apikey-db/apikey-db.service';
import {
  HasPermission,
  RequiredPermissions
} from '../../../decorators/permissions.decorator';
import { ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';

@Controller('api/apikeys')
@RequiredPermissions(Permission.ApiKey)
export class ApiKeysController {
  constructor(private readonly apikeyDB: ApiKeyDbService) {}

  @Post('info')
  @Returns(ApiKeyInfoResponse)
  async getApiKeyInfo(
    @ReqUserID() userid: string,
    @Body() body: ApiKeyInfoRequest,
    @HasPermission(Permission.ApiKeyAdmin) isAdmin: boolean,
  ): Promise<ApiKeyInfoResponse> {
    return ThrowIfFailed(
      await this.apikeyDB.findOne(body.key, isAdmin ? undefined : userid),
    );
  }

  @Post('list')
  @Returns(ApiKeyListResponse)
  async listApiKeys(
    @ReqUserID() userid: string,
    @Body() body: ApiKeyListRequest,
    @HasPermission(Permission.ApiKeyAdmin) isAdmin: boolean,
  ): Promise<ApiKeyListResponse> {
    if (!isAdmin) body.user_id = userid;

    return ThrowIfFailed(
      await this.apikeyDB.findMany(body.count, body.page, body.user_id),
    );
  }

  @Post('create')
  @Returns(ApiKeyCreateResponse)
  async createApiKey(
    @ReqUserID() userID: string,
  ): Promise<ApiKeyCreateResponse> {
    return ThrowIfFailed(await this.apikeyDB.createApiKey(userID));
  }

  @Post('delete')
  @Returns(ApiKeyDeleteResponse)
  async deleteApiKey(
    @ReqUserID() userID: string,
    @Body() body: ApiKeyDeleteRequest,
    @HasPermission(Permission.ApiKeyAdmin) isAdmin: boolean,
  ): Promise<ApiKeyDeleteResponse> {
    return ThrowIfFailed(
      await this.apikeyDB.deleteApiKey(body.key, isAdmin ? undefined : userID),
    );
  }
}
