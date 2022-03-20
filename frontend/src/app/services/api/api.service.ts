import { Injectable } from '@angular/core';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ApiResponse, ApiSuccessResponse } from 'picsur-shared/dist/dto/api';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { Subject } from 'rxjs';
import { ApiError } from 'src/app/models/api-error';
import { MultiPartRequest } from '../../models/multi-part-request';
import { KeyService } from './key.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly logger = console;

  private errorSubject = new Subject<ApiError>();

  public get networkErrors() {
    return this.errorSubject.asObservable();
  }

  constructor(private keyService: KeyService) {}

  public async get<T extends Object>(
    type: ClassConstructor<T>,
    url: string
  ): AsyncFailable<T> {
    return this.fetchSafeJson(type, url, { method: 'GET' });
  }

  public async post<T extends Object, W extends Object>(
    sendType: ClassConstructor<T>,
    receiveType: ClassConstructor<W>,
    url: string,
    data: object
  ): AsyncFailable<W> {
    const sendClass = plainToClass(sendType, data);
    const errors = await strictValidate(sendClass);
    if (errors.length > 0) {
      this.logger.warn(errors);
      return Fail('Something went wrong');
    }

    return this.fetchSafeJson(receiveType, url, {
      method: 'POST',
      body: JSON.stringify(sendClass),
    });
  }

  public async postForm<T extends Object>(
    receiveType: ClassConstructor<T>,
    url: string,
    data: MultiPartRequest
  ): AsyncFailable<T> {
    return this.fetchSafeJson(receiveType, url, {
      method: 'POST',
      body: data.createFormData(),
    });
  }

  private async fetchSafeJson<T extends Object>(
    type: ClassConstructor<T>,
    url: RequestInfo,
    options: RequestInit
  ): AsyncFailable<T> {
    let result = await this.fetchJsonAs<ApiResponse<T>>(url, options);
    if (HasFailed(result)) return result;

    if (result.success === false) return Fail(result.data.message);

    const resultClass = plainToClass<
      ApiSuccessResponse<T>,
      ApiSuccessResponse<T>
    >(ApiSuccessResponse, result);

    const resultErrors = await strictValidate(resultClass);
    if (resultErrors.length > 0) {
      this.logger.warn('result', resultErrors);
      return Fail('Something went wrong');
    }

    const dataClass = plainToClass(type, result.data);
    const dataErrors = await strictValidate(dataClass);
    if (dataErrors.length > 0) {
      this.logger.warn('data', dataErrors);
      return Fail('Something went wrong');
    }

    return result.data;
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
