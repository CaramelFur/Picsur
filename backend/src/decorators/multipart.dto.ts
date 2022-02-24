import { MultipartFile } from 'fastify-multipart';
import { BusboyFileStream } from '@fastify/busboy';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AsyncFailable, Fail } from 'src/types/failable';
import { HttpException } from '@nestjs/common';

export class MultiPartFileDto {
  @IsString()
  @IsNotEmpty()
  fieldname: string;

  @IsString()
  @IsNotEmpty()
  encoding: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsDefined()
  toBuffer: () => Promise<Buffer>;

  @IsDefined()
  file: BusboyFileStream;

  constructor(file: MultipartFile, exceptionOnFail: HttpException) {
    this.fieldname = file.fieldname;
    this.encoding = file.encoding;
    this.filename = file.filename;
    this.mimetype = file.mimetype;
    this.toBuffer = async () => {
      try {
        return await file.toBuffer();
      } catch (e) {
        throw exceptionOnFail;
      }
    };

    this.file = file.file;
  }
}

export class MultiPartFieldDto {
  @IsString()
  @IsNotEmpty()
  fieldname: string;

  @IsString()
  @IsNotEmpty()
  encoding: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  constructor(file: MultipartFile) {
    this.fieldname = file.fieldname;
    this.encoding = file.encoding;
    this.value = (file as any).value;
  }
}
