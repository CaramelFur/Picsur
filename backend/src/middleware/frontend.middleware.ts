import { StreamableFile } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createReadStream } from 'fs';
import path from 'path';
import Config from 'src/env';

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

const resolvePath = (file: string) =>
  path.resolve(Config.static.frontendRoot, file);

export function FrontendMiddleware(
  req: FastifyRequest,
  res: FastifyReply,
  next: () => void,
) {
  const { url } = req;

  for (let i = 0; i < Config.static.backendRoutes.length; i++) {
    if (url.startsWith(`/${Config.static.backendRoutes[i]}`)) {
      return next();
    }
  }

  const { ext } = path.parse(url);

  if (ext != '') {
    // it has a file extension --> resolve the file
    // Fastifty
    res.send(new StreamableFile(createReadStream(resolvePath(url))));
  } else {
    // in all other cases, redirect to the index.html!
    res.send(new StreamableFile(createReadStream(resolvePath('index.html'))));
  }

  next();
}
