import { Injectable } from '@angular/core';
import { ApiResponseSchema } from 'picsur-shared/dist/dto/api/api.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { ZodDtoStatic } from 'picsur-shared/dist/util/create-zod-dto';
import { Subject } from 'rxjs';
import { ApiError } from 'src/app/models/dto/api-error.dto';
import { z } from 'zod';
import { MultiPartRequest } from '../../models/dto/multi-part-request.dto';
import { Logger } from '../logger/logger.service';
import { KeyService } from '../storage/key.service';

/*
  Proud of this, it works so smoooth
*/

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly logger = new Logger('ApiService');

  private errorSubject = new Subject<ApiError>();

  public get networkErrors() {
    return this.errorSubject.asObservable();
  }

  constructor(private keyService: KeyService) {}

  public async get<T extends z.AnyZodObject>(
    type: ZodDtoStatic<T>,
    url: string
  ): AsyncFailable<z.infer<T>> {
    return this.fetchSafeJson(type, url, { method: 'GET' });
  }

  public async post<T extends z.AnyZodObject, W extends z.AnyZodObject>(
    sendType: ZodDtoStatic<T>,
    receiveType: ZodDtoStatic<W>,
    url: string,
    data: z.infer<T>
  ): AsyncFailable<z.infer<W>> {
    const sendSchema = sendType.zodSchema;

    const validateResult = sendSchema.safeParse(data);
    if (!validateResult.success) {
      this.logger.warn(validateResult.error);
      return Fail('Something went wrong');
    }

    return this.fetchSafeJson(receiveType, url, {
      method: 'POST',
      body: JSON.stringify(validateResult.data),
    });
  }

  public async postForm<T extends z.AnyZodObject>(
    receiveType: ZodDtoStatic<T>,
    url: string,
    data: MultiPartRequest
  ): AsyncFailable<z.infer<T>> {
    return this.fetchSafeJson(receiveType, url, {
      method: 'POST',
      body: data.createFormData(),
    });
  }

  private async fetchSafeJson<T extends z.AnyZodObject>(
    type: ZodDtoStatic<T>,
    url: RequestInfo,
    options: RequestInit
  ): AsyncFailable<z.infer<T>> {
    const resultSchema = ApiResponseSchema(type.zodSchema as z.AnyZodObject);
    type resultType = z.infer<typeof resultSchema>;

    let result = await this.fetchJsonAs<resultType>(url, options);
    if (HasFailed(result)) return result;

    const validateResult = resultSchema.safeParse(result);
    if (!validateResult.success) {
      this.logger.warn('result', validateResult.error);
      return Fail('Something went wrong');
    }

    if (validateResult.data.success === false) return Fail(result.data.message);

    return validateResult.data.data;
  }

  private async fetchJsonAs<T>(
    url: RequestInfo,
    options: RequestInit
  ): AsyncFailable<T> {
    const response = await this.fetch(url, options);
    if (HasFailed(response)) {
      return response;
    }
    try {
      return await response.json();
    } catch (e) {
      this.logger.warn(e);
      return Fail('Something went wrong');
    }
  }

  private async fetchBuffer(
    url: RequestInfo,
    options: RequestInit
  ): AsyncFailable<ArrayBuffer> {
    const response = await this.fetch(url, options);
    if (HasFailed(response)) return response;

    try {
      return await response.arrayBuffer();
    } catch (e) {
      this.logger.warn(e);
      return Fail('Something went wrong');
    }
  }

  private async fetch(
    url: RequestInfo,
    options: RequestInit
  ): AsyncFailable<Response> {
    try {
      const key = this.keyService.get();
      const isJSON = typeof options.body === 'string';

      const headers: any = options.headers || {};
      if (key !== null)
        headers['Authorization'] = `Bearer ${this.keyService.get()}`;
      if (isJSON) headers['Content-Type'] = 'application/json';
      options.headers = headers;

      return await window.fetch(url, options);
    } catch (error: any) {
      this.errorSubject.next({
        error,
        url,
      });
      return Fail('Network Error');
    }
  }
}
