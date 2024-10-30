/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
// @ts-nocheck

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

import thunks from 'thunks';

import { StreamParserWritable } from './stream-parser.js';

const { thunk } = thunks;

const BUF_RIFF = Buffer.from('RIFF', 'utf8');
const BUF_WEBP = Buffer.from('WEBP', 'utf8');
const BUF_VP8 = Buffer.from('VP8 ', 'utf8');
const BUF_VP8L = Buffer.from('VP8L', 'utf8');
const BUF_VP8X = Buffer.from('VP8X', 'utf8');
const BUF_ANIM = Buffer.from('ANIM', 'utf8');
const BUF_ANMF = Buffer.from('ANMF', 'utf8');
const BUF_ALPH = Buffer.from('ALPH', 'utf8');
const BUF_ICCP = Buffer.from('ICCP', 'utf8');
const BUF_EXIF = Buffer.from('EXIF', 'utf8');
const BUF_XMP = Buffer.from('XMP ', 'utf8');

interface Callback<T> {
  (e: any): void;
  (e: any, data: T): void;
}

export type Input = Buffer;

export type ChunkType =
  | 'VP8'
  | 'VP8L'
  | 'VP8X'
  | 'ANIM'
  | 'ANMF'
  | 'ALPH'
  | 'ICCP'
  | 'EXIF'
  | 'XMP';

export enum ANMFBlendingMethod {
  ALPHA_BLENDING = 0,
  DO_NOT_BLEND = 1,
}

export enum ANMFDisposalMethod {
  AS_IS = 0,
  FILL_BACKGROUND_COLOR = 1,
}

export enum ALPHPreProcessing {
  NO_PRE_PROCESSING = 0,
  LEVEL_REDUCTION = 1,
}

export enum ALPHFilteringMethod {
  NONE = 0,
  HORIZONTAL = 1,
  VERTICAL = 2,
  GRADIENT = 3,
}

export enum ALPHCompressionMethod {
  NO_COMPRESSION = 0,
  WEBP_LOSELESS = 1,
}

export interface RIFFContainer {
  size: number;
}

export interface Chunk {
  type: ChunkType;
  offset: number;
  size: number;
}

export interface VP8Bitstream {
  keyframe: number; // 0 for key frames, 1 for interframes
  version: number; // 0 ~ 3
  showFrame: number; // 0 when current frame is not for display, 1 when current frame is for display
  firstPartSize: number;
  width: number;
  horizontalScale: number;
  height: number;
  verticalScale: number;
}

export interface VP8LBitstream {
  width: number;
  height: number;
  alpha: number;
  version: number;
}

export interface VP8XBitstream {
  rsv1: number;
  icc: number;
  alpha: number;
  exif: number;
  xmp: number;
  animation: number;
  rsv2: number;
  rsv3: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface ANIMBitstream {
  backgroundColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  loopCount: number;
}

export interface ANMFBitstream {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  duration: number;
  rsv1: number;
  blending: number;
  disposal: number;
}

export interface ALPHBitstream {
  rsv1: number;
  preprocessing: number;
  filtering: number;
  compression: number;
}

export interface VP8Chunk extends Chunk {
  type: 'VP8';
  format: 'lossy';
  width: number;
  height: number;
  bitstream: VP8Bitstream;
}

export interface VP8LChunk extends Chunk {
  type: 'VP8L';
  format: 'lossless';
  width: number;
  height: number;
  alpha: boolean;
  bitstream: VP8LBitstream;
}

export interface VP8XChunk extends Chunk {
  type: 'VP8X';
  format: 'extended';
  width: number;
  height: number;
  icc: boolean;
  alpha: boolean;
  exif: boolean;
  xmp: boolean;
  animation: boolean;
  bitstream: VP8XBitstream;
}

export interface ANIMChunk extends Chunk {
  type: 'ANIM';
  backgroundColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  loop: number;
  bitstream: ANIMBitstream;
}

export interface ANMFChunk extends Chunk {
  type: 'ANMF';
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  duration: number;
  blend: ANMFBlendingMethod;
  dispose: ANMFDisposalMethod;
  bitstream: ANMFBitstream;
}

export interface ALPHChunk extends Chunk {
  type: 'ALPH';
  preprocessing: ALPHPreProcessing;
  filter: ALPHFilteringMethod;
  compress: ALPHCompressionMethod;
  bitstream: ALPHBitstream;
}

export interface ICCPChunk extends Chunk {
  // tslint:disable-line
  type: 'ICCP';
}

export interface EXIFChunk extends Chunk {
  type: 'EXIF';
}

export interface XMPChunk extends Chunk {
  type: 'XMP';
}

export type WebPChunk =
  | VP8Chunk
  | VP8LChunk
  | VP8XChunk
  | ANIMChunk
  | ANMFChunk
  | ALPHChunk
  | ICCPChunk
  | EXIFChunk
  | XMPChunk;

export interface WebP {
  riff: RIFFContainer;
  chunks: WebPChunk[];
  summary: {
    width?: number;
    height?: number;
    isAnimated: boolean;
    isLossless: boolean;
    hasAlpha: boolean;
    frames: number;
    chunks: {
      [K in ChunkType]: number;
    };
  };
}

// tslint:disable:no-bitwise
export class WebPInfo extends StreamParserWritable {
  public static async isAnimated(input: Input): Promise<boolean> {
    const { summary } = await this.from(input);

    return summary.isAnimated;
  }

  public static async isLossless(input: Input): Promise<boolean> {
    const { summary } = await this.from(input);

    return summary.isLossless;
  }

  public static from(input: Input): Promise<WebP> {
    return new Promise<WebP>((resolve, reject) => {
      const parser = new this();

      function onError(e: Error) {
        parser.removeListener('error', onError);
        parser.removeListener('format', onFormat);

        reject(e);
      }

      function onFormat(format: WebP) {
        parser.removeListener('error', onError);
        parser.removeListener('format', onFormat);

        resolve(format);
      }

      parser.on('error', onError);
      parser.on('format', onFormat);

      if (Buffer.isBuffer(input)) {
        parser.end(input);
        return;
      }
    });
  }

  private log(...args: any) {}

  private readonly FRAME_COUNTABLE_CHUNK_TYPES = new Map<ChunkType, true>(
    ['VP8', 'VP8L', 'ANMF'].map((t) => [t, true] as [ChunkType, true]),
  );

  private offset = 0;
  private maxSeekableOffset = -1; // same as file size - 1

  private pending?: {
    size: number;
    done: Callback<any>;
  };

  constructor() {
    super();

    thunk.seq([
      thunk((done: Callback<RIFFContainer>) => this.readRIFFHeader()(done)),
      thunk((done: Callback<void>) => this.readWebPSignature()(done)),
      thunk((done: Callback<WebPChunk[]>) => this.readWebPChunk()(done)),
    ])((e: Error, values: [RIFFContainer, void, WebPChunk[]]) => {
      if (e) {
        this.emit('error', e);
        return this.skipBytes(Infinity);
      }

      const [riff, , chunks] = values;

      const { isAnimated, isLossless, hasAlpha, width, height } = chunks.reduce(
        (hash, c, index) => {
          if (
            index === 0 &&
            (c.type === 'VP8' || c.type === 'VP8L' || c.type === 'VP8X')
          ) {
            hash.width = c.width;
            hash.height = c.height;
          }

          if (c.type === 'VP8L') {
            hash.isLossless = true;
          }

          if (c.type === 'ALPH' || (c.type === 'VP8X' && c.alpha)) {
            hash.hasAlpha = true;
          }

          if (c.type === 'ANMF') {
            hash.isAnimated = true;
          }

          return hash;
        },
        {
          isAnimated: false,
          isLossless: false,
          hasAlpha: false,
        } as {
          isAnimated: boolean;
          isLossless: boolean;
          hasAlpha: boolean;
          width?: number;
          height?: number;
        },
      );

      const summary = {
        isAnimated,
        isLossless,
        hasAlpha,
        width,
        height,
        frames: chunks.filter((c) =>
          this.FRAME_COUNTABLE_CHUNK_TYPES.has(c.type),
        ).length,
        chunks: chunks.reduce(
          (hash, chunk) => {
            const type = chunk.type as ChunkType;

            hash[type]++;

            return hash;
          },
          {
            VP8: 0,
            VP8L: 0,
            VP8X: 0,
            ALPH: 0,
            ANIM: 0,
            ANMF: 0,
            ICCP: 0,
            EXIF: 0,
            XMP: 0,
          } as {
            [k in ChunkType]: number;
          },
        ),
      };

      this.emit('format', {
        riff,
        chunks,
        summary,
      });

      return this.skipBytes(Infinity);
    })((e: Error) => {
      if (e) {
        this.emit('error', e);
      }
    });
  }

  public override end(...args: any[]) {
    if (args.length && typeof args[args.length - 1] === 'function') {
      return super.end(
        ...args.slice(0, args.length - 1),
        (...cbArgs: any[]) => {
          this.final();
          args[args.length - 1](...cbArgs);
        },
      );
    }

    return super.end(...args, () => {
      this.final();
    });
  }

  private final() {
    if (this.pending) {
      if (this.pending.size !== Infinity) {
        this.pending.done(
          new Error(`stream is closed before read ${this.pending.size} bytes`),
        );
      }

      this.pending = undefined;
    }
  }

  private readBytes(size: number) {
    return thunk((done: Callback<Buffer>) => {
      if (this.pending) {
        return done(new Error('there is already readBytes callback set'));
      }

      this.pending = { size, done };
      this._bytes(size, (buf) => {
        this.pending = undefined;
        this.offset += buf.length;

        done(null, buf);
      });
    });
  }

  private skipBytes(size: number) {
    return thunk((done: Callback<void>) => {
      if (this.pending) {
        return done(new Error('there is already readBytes callback set'));
      }

      this.pending = { size, done };
      this._skipBytes(size, () => {
        this.pending = undefined;
        this.offset += size;

        done(null);
      });
    });
  }

  private readRIFFHeader() {
    // 4 bytes - "RIFF" signature
    // 4 bytes - RIFF Payload Size
    return this.readBytes(8)((e: Error, buf: Buffer) => {
      if (e) {
        throw e;
      }

      this.log('starting parsing RIFF Header');

      const bufFourCC = buf.slice(0, 4);

      const isRIFF = Buffer.compare(bufFourCC, BUF_RIFF) === 0;

      this.log('FourCC: ', bufFourCC.toString('utf8'));

      if (!isRIFF) {
        throw new Error('Given stream is not RIFF compatible.');
      }

      const riffChunkSize = buf.readUInt32LE(4);
      this.log('detected RIFF chunk size: %d', riffChunkSize);

      if (riffChunkSize <= 8) {
        // "WEBP" Signature (4 bytes) + WebP Chunk Type (4 bytes)
        throw new Error('Invalid RIFF Chunk size');
      }

      const riffContainer: RIFFContainer = { size: riffChunkSize + 8 };
      this.emit('riff', riffContainer);
      this.maxSeekableOffset = riffChunkSize + 8 - 1;

      return riffContainer;
    });
  }

  private readWebPSignature() {
    // 4 bytes - "WEBP" signature
    return this.readBytes(4)((e: Error, buf: Buffer) => {
      if (e) {
        throw e;
      }

      const isWebP = Buffer.compare(buf, BUF_WEBP) === 0;

      if (!isWebP) {
        throw new Error('Given stream is not WebP');
      }
    });
  }

  private readWebPChunk(memo: WebPChunk[] = []): any {
    // sadly thunk typing is not good
    if (this.offset > this.maxSeekableOffset) {
      this.log(
        'reached max seekable offset (current: %d, max: %d)',
        this.offset,
        this.maxSeekableOffset,
      );

      return memo;
    }

    // 8 bytes - WebP Chunk Header
    //   - 4 bytes - FourCC for Chunk
    //   - 4 bytes - Chunk Size w/o header
    return this.readBytes(8)((e: Error, buf: Buffer) => {
      if (e) {
        throw e;
      }

      const bufChunkType = buf.slice(0, 4);
      const chunkPayloadSize = buf.readUInt32LE(4);

      const chunkOffset = this.offset - buf.length;

      // If Chunk Size is odd, a single padding byte.
      const chunkSize =
        (chunkPayloadSize % 2 === 0 ? chunkPayloadSize : chunkPayloadSize + 1) +
        8;

      this.log(
        'detected chunk (%s) payload size: %d, offset: %d',
        bufChunkType.toString('utf8'),
        chunkSize,
        chunkOffset,
      );

      if (Buffer.compare(BUF_VP8, bufChunkType) === 0) {
        return this.readVP8Bitstream()(
          (err: Error, bitstream: VP8Bitstream): VP8Chunk => {
            if (err) {
              throw err;
            }

            return {
              type: 'VP8',
              format: 'lossy',
              offset: chunkOffset,
              size: chunkSize,
              width: bitstream.width,
              height: bitstream.height,
              bitstream,
            };
          },
        );
      } else if (Buffer.compare(BUF_VP8L, bufChunkType) === 0) {
        return this.readVP8LBitstream()(
          (err: Error, bitstream: VP8LBitstream): VP8LChunk => {
            if (err) {
              throw err;
            }

            return {
              type: 'VP8L',
              format: 'lossless',
              offset: chunkOffset,
              size: chunkSize,
              width: bitstream.width,
              height: bitstream.height,
              alpha: !!bitstream.alpha,
              bitstream,
            };
          },
        );
      } else if (Buffer.compare(BUF_VP8X, bufChunkType) === 0) {
        return this.readVP8XBitstream()(
          (err: Error, bitstream: VP8XBitstream): VP8XChunk => {
            if (err) {
              throw err;
            }

            return {
              type: 'VP8X',
              format: 'extended',
              offset: chunkOffset,
              size: chunkSize,
              width: bitstream.canvasWidth,
              height: bitstream.canvasHeight,
              icc: bitstream.icc === 1,
              alpha: bitstream.alpha === 1,
              exif: bitstream.exif === 1,
              xmp: bitstream.xmp === 1,
              animation: bitstream.animation === 1,
              bitstream,
            };
          },
        );
      } else if (Buffer.compare(BUF_ANIM, bufChunkType) === 0) {
        return this.readANIMBitstream()(
          (err: Error, bitstream: ANIMBitstream): ANIMChunk => {
            if (e) {
              throw e;
            }

            return {
              type: 'ANIM',
              offset: chunkOffset,
              size: chunkSize,
              backgroundColor: bitstream.backgroundColor,
              loop: bitstream.loopCount === 0 ? Infinity : bitstream.loopCount,
              bitstream,
            };
          },
        );
      } else if (Buffer.compare(BUF_ANMF, bufChunkType) === 0) {
        return this.readANMFBitstream()(
          (err: Error, bitstream: ANMFBitstream): ANMFChunk => {
            if (e) {
              throw e;
            }

            return {
              type: 'ANMF',
              offset: chunkOffset,
              size: chunkSize,
              width: bitstream.width,
              height: bitstream.height,
              duration: bitstream.duration,
              offsetX: bitstream.offsetX,
              offsetY: bitstream.offsetY,
              dispose:
                bitstream.disposal === 0
                  ? ANMFDisposalMethod.AS_IS
                  : ANMFDisposalMethod.FILL_BACKGROUND_COLOR,
              blend:
                bitstream.blending === 0
                  ? ANMFBlendingMethod.ALPHA_BLENDING
                  : ANMFBlendingMethod.DO_NOT_BLEND,
              bitstream,
            };
          },
        );
      } else if (Buffer.compare(BUF_ALPH, bufChunkType) === 0) {
        return this.readALPHBitstream()(
          (err: Error, bitstream: ALPHBitstream): ALPHChunk => {
            if (e) {
              throw e;
            }

            return {
              type: 'ALPH',
              offset: chunkOffset,
              size: chunkSize,
              preprocessing:
                bitstream.preprocessing === 0
                  ? ALPHPreProcessing.NO_PRE_PROCESSING
                  : ALPHPreProcessing.LEVEL_REDUCTION,
              filter: (() => {
                switch (bitstream.filtering) {
                  case ALPHFilteringMethod.HORIZONTAL:
                    return ALPHFilteringMethod.HORIZONTAL;
                  case ALPHFilteringMethod.VERTICAL:
                    return ALPHFilteringMethod.VERTICAL;
                  case ALPHFilteringMethod.GRADIENT:
                    return ALPHFilteringMethod.HORIZONTAL;
                  default:
                    return ALPHFilteringMethod.NONE;
                }
              })(),
              compress:
                bitstream.compression === 0
                  ? ALPHCompressionMethod.NO_COMPRESSION
                  : ALPHCompressionMethod.WEBP_LOSELESS,
              bitstream,
            };
          },
        );
      } else if (Buffer.compare(BUF_ICCP, bufChunkType) === 0) {
        // @todo Handle ICC Profile Payload
        const chunk: ICCPChunk = {
          type: 'ICCP',
          offset: chunkOffset,
          size: chunkSize,
        };

        return thunk(chunk);
      } else if (Buffer.compare(BUF_EXIF, bufChunkType) === 0) {
        // @todo Handle EXIF
        const chunk: EXIFChunk = {
          type: 'EXIF',
          offset: chunkOffset,
          size: chunkSize,
        };

        return thunk(chunk);
      } else if (Buffer.compare(BUF_XMP, bufChunkType) === 0) {
        // @todo Handle XMP
        const chunk: XMPChunk = {
          type: 'XMP',
          offset: chunkOffset,
          size: chunkSize,
        };

        return thunk(chunk);
      } else {
        const chunkTypeHex = bufChunkType.toString('hex');
        const chunkType = bufChunkType.toString('utf8');

        throw new Error(
          `Unsupported WebP chunk type ${chunkType} (0x${chunkTypeHex})`,
        );
      }
    })((e: Error, chunk: WebPChunk) => {
      if (e) {
        throw e;
      }

      // emit chunk event and collect them
      this.emit('chunk', chunk);
      memo.push(chunk);

      // skip remaining chunk bytes, if exists.
      const remainingBytes = chunk.offset + chunk.size - this.offset;

      if (remainingBytes > 0) {
        return this.skipBytes(remainingBytes);
      }
    })((e: Error) => {
      if (e) {
        throw e;
      }

      return this.readWebPChunk(memo);
    });
  }

  private readVP8Bitstream() {
    // 3 bytes (24 bits) - "Uncompressed Data Chunk" on VP8 Bitstream
    return this.readBytes(3)((e: Error, bufFrameHeader: Buffer) => {
      if (e) {
        throw e;
      }

      const frameTag =
        bufFrameHeader.readUInt8(0) |
        (bufFrameHeader.readUInt8(1) << 8) |
        (bufFrameHeader.readUInt8(2) << 16);

      const keyframe = frameTag & 0x01;
      const version = (frameTag >> 1) & 0x7;
      const showFrame = (frameTag >> 4) & 0x1;
      const firstPartSize = (frameTag >> 5) & 0x7ffff;

      this.log(
        'Parsed VP8 Bitstream Header: keyframe: %s, version: %s, showFrame: %s, firstPartSize: %s',
        keyframe,
        version,
        showFrame,
        firstPartSize,
      );

      if (keyframe === 1) {
        throw new Error(
          "expected VP8 bitstream has keyframe, but couldn't be found",
        );
      }

      // If given frame is Keyframe (Intraframe), It has 7 bytes data for additional information
      return this.readBytes(7)((err: Error, bufKeyframeTag: Buffer) => {
        if (err) {
          throw err;
        }

        const hasValidStartCode =
          Buffer.compare(
            bufKeyframeTag.slice(0, 3),
            Buffer.from([0x9d, 0x01, 0x2a]),
          ) === 0;

        if (!hasValidStartCode) {
          this.log(bufKeyframeTag.slice(0, 3));
          throw new Error(
            "expected VP8 intraframe start code, but couldn't be found",
          );
        }

        const horizontalSizeCode = bufKeyframeTag.readUInt16LE(3);

        const width = horizontalSizeCode & 0x3fff;
        const horizontalScale = horizontalSizeCode >> 14;

        const verticalSizeCode = bufKeyframeTag.readUInt16LE(5);
        const height = verticalSizeCode & 0x3fff;
        const verticalScale = verticalSizeCode >> 14;

        this.log(
          'width: %d, horizontalScale: %d, height: %d, verticalScale: %d',
          width,
          horizontalScale,
          height,
          verticalScale,
        );

        return {
          keyframe,
          version,
          showFrame,
          firstPartSize,
          width,
          horizontalScale,
          height,
          verticalScale,
        };
      });
    });
  }

  private readVP8LBitstream() {
    // 1 byte - One byte signature 0x2f.
    return this.readBytes(1)((e: Error, bufVP8LSignature: Buffer) => {
      if (e) {
        throw e;
      }

      const hasValidVP8LSignature = bufVP8LSignature.readUInt8(0) === 0x2f;

      if (!hasValidVP8LSignature) {
        throw new Error('expected VP8L signature, but could not found');
      }

      // The first 28 bits of the bitstream specify the width and height of the image.
      // Width and height are decoded as 14-bit integers
      // last 4 bits are alpha hint (1 bit) + version (3 bit)
      return this.readBytes(4);
    })((e: Error, bufBitstreamHead: Buffer): VP8LBitstream => {
      if (e) {
        throw e;
      }

      const bits = bufBitstreamHead.readUInt32LE(0);

      this.log('buf: ', bufBitstreamHead);

      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      const alpha = (bits >> 28) & 0x01;
      const version = (bits >> 29) & 0x7;

      // The version_number is a 3 bit code that must be set to 0.
      // Any other value should be treated as an error. [AMENDED]
      if (version !== 0) {
        throw new Error(
          'expected VP8L bitstream version to 0, but got non-zero value',
        );
      }

      this.log(
        'width: %d, height: %d, alpha: %s, version: %d',
        width,
        height,
        alpha,
        version,
      );

      return {
        width,
        height,
        alpha,
        version,
      };
    });
  }

  private readVP8XBitstream() {
    // 80 bits
    //
    // 2 bits - Reserved (1)
    // 1 bit - ICC Profile flag
    // 1 bit - Alpha flag
    // 1 bit - EXIF metadata flag
    // 1 bit - XMP metadata flag
    // 1 bit - Animation flag
    // 1 bit - Reserved (2)
    // 24 bits - Reserved (3)
    // 24 bits - Canvas Width (actual canvas width should add 1 to read value)
    // 24 bits - Canvas Height (actual canvas height should add 1 to read value)
    return this.readBytes(10)((e: Error, buf: Buffer): VP8XBitstream => {
      if (e) {
        throw e;
      }

      const flagBits = buf.readUInt8(0);

      this.log('flagBits: ', flagBits.toString(2));

      const rsv1 = flagBits >> 6;

      if (rsv1 !== 0) {
        throw new Error('First reserved bits (2 bits) should be zero');
      }

      const icc = (flagBits >> 5) & 0x01;
      const alpha = (flagBits >> 4) & 0x01;
      const exif = (flagBits >> 3) & 0x01;
      const xmp = (flagBits >> 2) & 0x01;
      const animation = (flagBits >> 1) & 0x01;
      const rsv2 = flagBits & 0x01;

      this.log(
        'rsv1: %d, icc: %d, alpha: %d, exif: %d, xmp: %d, animation: %d, rsv2: %d',
        rsv1,
        icc,
        alpha,
        exif,
        xmp,
        animation,
        rsv2,
      );

      if (rsv2 !== 0) {
        throw new Error('Second reserved bit (1 bit) should be zero');
      }

      const rsv3 =
        buf.readUInt8(1) | (buf.readUInt8(2) << 8) | (buf.readUInt8(3) << 16);

      if (rsv3 !== 0) {
        throw new Error('Third reserved bit (24 bits) should be zero');
      }

      const canvasWidth =
        (buf.readUInt8(4) |
          (buf.readUInt8(5) << 8) |
          (buf.readUInt8(6) << 16)) +
        1;

      const canvasHeight =
        (buf.readUInt8(7) |
          (buf.readUInt8(8) << 8) |
          (buf.readUInt8(9) << 16)) +
        1;

      this.log(
        'canvas width: %d, canvas height: %d',
        canvasWidth,
        canvasHeight,
      );

      return {
        rsv1,
        icc,
        alpha,
        exif,
        xmp,
        animation,
        rsv2,
        rsv3,
        canvasWidth,
        canvasHeight,
      };
    });
  }

  private readANIMBitstream() {
    // 6 bytes (48 bits)
    // 32 bits - Background Color (rgba, byte order)
    // 16 bits - Loop Count
    return this.readBytes(6)((e: Error, buf: Buffer): ANIMBitstream => {
      if (e) {
        throw e;
      }

      const r = buf.readUInt8(0);
      const g = buf.readUInt8(1);
      const b = buf.readUInt8(2);
      const a = buf.readUInt8(3);

      const backgroundColor = { r, g, b, a };
      const loopCount = buf.readUInt16LE(4);

      return {
        backgroundColor,
        loopCount,
      };
    });
  }

  private readANMFBitstream() {
    // 16 bytes (128 bits)
    //
    // 24 bits - Frame Offset X
    // 24 bits - Frame Offset Y
    // 24 bits - Frame Width minus one
    // 24 bits - Frame Height minus one
    // 24 bits - Frame Duration
    // 6 bits - Reserved
    // 1 bit - Blending method
    // 1 bit - Disposal method
    return this.readBytes(16)((e: Error, buf: Buffer): ANMFBitstream => {
      if (e) {
        throw e;
      }

      const frameX =
        buf.readUInt8(0) | (buf.readUInt8(1) << 8) | (buf.readUInt8(2) << 16);

      const frameY = buf.readUInt8(3) | buf.readUInt8(4) | buf.readUInt8(5);

      const frameWidth =
        (buf.readUInt8(6) | buf.readUInt8(7) | buf.readUInt8(8)) + 1;

      const frameHeight =
        (buf.readUInt8(9) | buf.readUInt8(10) | buf.readUInt8(11)) + 1;

      const frameDuration =
        buf.readUInt8(12) | buf.readUInt8(13) | buf.readUInt8(14);

      const tailBits = buf.readUInt8(15);

      const rsv1 = tailBits >> 2;

      if (rsv1 !== 0) {
        throw new Error('reserved bits (6 bits) should be zero');
      }

      const blending = (tailBits >> 6) & 0x01;
      const disposal = (tailBits >> 7) & 0x01;

      return {
        offsetX: frameX,
        offsetY: frameY,
        width: frameWidth,
        height: frameHeight,
        duration: frameDuration,
        rsv1,
        blending,
        disposal,
      };
    });
  }

  private readALPHBitstream() {
    // 1 byte (8 bits)
    //
    // 2 bits - Reserved
    // 2 bits - pre-processing method
    // 2 bits - filtering method
    // 2 bits - compression method
    return this.readBytes(1)((e: Error, buf: Buffer): ALPHBitstream => {
      if (e) {
        throw e;
      }

      const bits = buf.readUInt8(0);

      const rsv1 = bits >> 6;
      const preprocessing = (bits >> 4) & 0x3;
      const filtering = (bits >> 2) & 0x3;
      const compression = bits & 0x3;

      if (rsv1 !== 0) {
        throw new Error('reserved bits (2 bits) should be zero');
      }

      return {
        rsv1,
        preprocessing,
        filtering,
        compression,
      };
    });
  }
}
