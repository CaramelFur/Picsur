import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
} from 'axios';
import { ApiResponseSchema } from 'picsur-shared/dist/dto/api/api.dto';
import { FileType2Ext } from 'picsur-shared/dist/dto/mimes.dto';
import {
  AsyncFailable,
  FT,
  Fail,
  Failure,
  HasFailed,
  HasSuccess,
} from 'picsur-shared/dist/types/failable';
import { ZodDtoStatic } from 'picsur-shared/dist/util/create-zod-dto';
import { ParseMime2FileType } from 'picsur-shared/dist/util/parse-mime';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { z } from 'zod';
import { ApiBuffer } from '../../models/dto/api-buffer.dto';
import { ApiError } from '../../models/dto/api-error.dto';
import { MultiPartRequest } from '../../models/dto/multi-part-request.dto';
import { Logger } from '../logger/logger.service';
import { KeyStorageService } from '../storage/key-storage.service';

/*
  Proud of this, it works so smoooth
*/

interface RunningRequest<R> {
  uploadProgress: Observable<number>;
  downloadProgress: Observable<number>;
  result: AsyncFailable<R>;
  cancel: () => void;
}

function MapRunningRequest<R, T>(
  runningRequest: RunningRequest<R>,
  map: (r: R) => AsyncFailable<T>,
): RunningRequest<T> {
  return {
    ...runningRequest,
    result: runningRequest.result.then(async (result) => {
      if (HasFailed(result)) return result;
      return map(result);
    }),
  };
}

function CreateFailedRunningRequest<R>(failure: Failure) {
  const subject = new Subject<number>();
  subject.complete();
  return {
    uploadProgress: subject.asObservable(),
    downloadProgress: subject.asObservable(),
    result: Promise.resolve(failure),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    cancel: () => {},
  } as RunningRequest<R>;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  private errorSubject = new Subject<ApiError>();

  public get networkErrors() {
    return this.errorSubject.asObservable();
  }

  constructor(
    private readonly keyService: KeyStorageService,
    @Inject(WINDOW) private readonly windowRef: Window,
  ) {}

  public get<T extends z.AnyZodObject>(
    type: ZodDtoStatic<T>,
    url: string,
  ): RunningRequest<z.infer<T>> {
    return this.fetchSafeJson(type, url, { method: 'GET' });
  }

  public head(url: string): RunningRequest<AxiosResponseHeaders> {
    return this.fetchHead(url, { method: 'HEAD' });
  }

  public getBuffer(url: string): RunningRequest<ApiBuffer> {
    return this.fetchBuffer(url, { method: 'GET' });
  }

  public post<T extends z.AnyZodObject, W extends z.AnyZodObject>(
    sendType: ZodDtoStatic<T>,
    receiveType: ZodDtoStatic<W>,
    url: string,
    data: z.infer<T>,
  ): RunningRequest<z.infer<W>> {
    const sendSchema = sendType.zodSchema;

    const validateResult = sendSchema.safeParse(data);
    if (!validateResult.success) {
      return CreateFailedRunningRequest(
        Fail(FT.SysValidation, 'Something went wrong', validateResult.error),
      );
    }

    return this.fetchSafeJson(receiveType, url, {
      method: 'POST',
      data: validateResult.data,
    });
  }

  public postEmpty<T extends z.AnyZodObject>(
    type: ZodDtoStatic<T>,
    url: string,
  ): RunningRequest<z.infer<T>> {
    return this.fetchSafeJson(type, url, { method: 'POST' });
  }

  public postForm<T extends z.AnyZodObject>(
    receiveType: ZodDtoStatic<T>,
    url: string,
    data: MultiPartRequest,
  ): RunningRequest<z.infer<T>> {
    return this.fetchSafeJson(receiveType, url, {
      method: 'POST',
      data: data.createFormData(),
    });
  }

  private fetchSafeJson<T extends z.AnyZodObject>(
    type: ZodDtoStatic<T>,
    url: string,
    options: AxiosRequestConfig,
  ): RunningRequest<z.infer<T>> {
    const resultSchema = ApiResponseSchema(type.zodSchema as z.AnyZodObject);
    type resultType = z.infer<typeof resultSchema>;

    const result = this.fetchJsonAs<resultType>(url, options);

    return MapRunningRequest(result, async (r) => {
      const validateResult = resultSchema.safeParse(r);
      if (!validateResult.success) {
        return Fail(
          FT.SysValidation,
          'Something went wrong',
          validateResult.error,
        );
      }

      if (validateResult.data.success === false)
        return Fail(FT.Unknown, r.data.message);

      return validateResult.data.data;
    });
  }

  private fetchJsonAs<T>(
    url: string,
    options: AxiosRequestConfig,
  ): RunningRequest<T> {
    const response = this.fetch(url, {
      ...options,
      responseType: 'json',
    });

    return MapRunningRequest(response, async (r) => r.data);
  }

  private fetchBuffer(
    url: string,
    options: AxiosRequestConfig,
  ): RunningRequest<ApiBuffer> {
    const response = this.fetch(url, {
      ...options,
      responseType: 'arraybuffer',
    });

    return MapRunningRequest(response, async (r) => {
      const mimeType = r.headers['Content-Type']?.toString() ?? 'other/unknown';
      let name = r.headers['Content-Disposition'];
      if (!name) {
        name = url.split('/').pop() ?? 'unnamed';
      }

      const filetype = ParseMime2FileType(mimeType);
      if (HasSuccess(filetype)) {
        const ext = FileType2Ext(filetype.identifier);
        if (HasSuccess(ext)) {
          if (!name.endsWith(ext)) {
            name += '.' + ext;
          }
        }
      }

      return {
        buffer: r.data,
        mimeType,
        name,
      };
    });
  }

  private fetchHead(
    url: string,
    options: AxiosRequestConfig,
  ): RunningRequest<AxiosResponseHeaders> {
    const response = this.fetch(url, options);

    return MapRunningRequest(response, async (r) => {
      return r.headers as AxiosResponseHeaders;
    });
  }

  private fetch(
    url: string,
    options: AxiosRequestConfig,
  ): RunningRequest<AxiosResponse> {
    const key = this.keyService.get();
    const isJSON = typeof options.data === 'string';

    const headers: any = options.headers || {};
    if (key !== null)
      headers['Authorization'] = `Bearer ${this.keyService.get()}`;
    if (isJSON) headers['Content-Type'] = 'application/json';
    options.headers = headers;

    const uploadProgress = new BehaviorSubject<number>(0);
    const downloadProgress = new BehaviorSubject<number>(0);
    const abortController = new AbortController();

    const resultPromise: AsyncFailable<AxiosResponse> = (async () => {
      try {
        const result = await axios.request({
          url,
          onDownloadProgress: (e) => {
            downloadProgress.next((e.loaded / (e.total ?? 1000000)) * 100);
          },
          onUploadProgress: (e) => {
            uploadProgress.next((e.loaded / (e.total ?? 1000000)) * 100);
          },
          signal: abortController.signal,
          ...options,
        });

        uploadProgress.complete();
        downloadProgress.complete();

        if (result.status < 200 || result.status >= 300) {
          return Fail(FT.Network, 'Recieved a non-ok response');
        }
        return result;
      } catch (e) {
        return Fail(FT.Network, e);
      }
    })();

    return {
      result: resultPromise,
      uploadProgress,
      downloadProgress,
      cancel: () => {
        abortController.abort();
        uploadProgress.complete();
        downloadProgress.complete();
      },
    };
  }
}
