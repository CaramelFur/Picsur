import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type ReqType = Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
>;
