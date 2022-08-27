/*

-- SOURCE: https://github.com/mooyoul/node-webpinfo
-- LICENSE:

The MIT License (MIT)
Copyright © 2018 MooYeol Prescott Lee, http://debug.so <mooyoul@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

import * as Stream from 'stream';
// @ts-ignore
import StreamParser from 'stream-parser';

export interface IStreamParserWritable {
  new (...args: any[]): IStreamParserWritableBase;
}

export interface IStreamParserWritableBase {
  _bytes(n: number, cb: (buf: Buffer) => void): void;
  _skipBytes(n: number, cb: () => void): void;
}

class StreamParserWritableClass extends Stream.Writable {
  constructor() {
    super();
    StreamParser(this);
  }
}

// HACK: The "stream-parser" module *patches* prototype of given class on call
// So basically original class does not have any definition about stream-parser injected methods.
// thus that's why we cast type here
export const StreamParserWritable =
  StreamParserWritableClass as typeof Stream.Writable & IStreamParserWritable;
