import { FastifyHelmetOptions } from '@fastify/helmet';

export const HelmetOptions: FastifyHelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'base-uri': ["'self'"],
      'block-all-mixed-content': [],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
      'img-src': ["'self'", 'data:', 'blob:'],
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'upgrade-insecure-requests': [],
    },
    useDefaults: false,
    reportOnly: false,
  },
  // Require any external content to have CORS set
  crossOriginEmbedderPolicy: true,
  // Destroy reference to global object on new page
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  // Dont fully understand the purpose of this
  // But pretty sure we dont need it
  expectCt: false,
  // Do not send referrer header
  referrerPolicy: true,
  // Ensure browser doesnt connect with HTTP
  hsts: true,
  noSniff: true,
  originAgentCluster: true,
  // Prevent prefetching of dns
  dnsPrefetchControl: true,
  // We aint targeting IE, but it cant hurt
  ieNoOpen: true,
  // Only allow in iframe of same origin
  frameguard: true,
  permittedCrossDomainPolicies: true,
  hidePoweredBy: true,
  // Requires nonce for every stylesheet, this is too much work so we disable it
  enableCSPNonces: false,
  xssFilter: true,
};
