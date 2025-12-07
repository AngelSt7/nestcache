export function cachedDecoratorTemplate() {
  return `
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { CACHE_KEYS, TTL } from '../config';
import { QueryAwareCacheInterceptor } from '../interceptors';

export const CACHE_KEY_META = 'cache_base_key';
export const CACHE_TTL_META = 'cache_ttl';

export function Cached(baseKey: CACHE_KEYS, ttlSeconds = TTL.ONE_MINUTE) {
  return applyDecorators(
    SetMetadata(CACHE_KEY_META, baseKey),
    SetMetadata(CACHE_TTL_META, ttlSeconds),
    UseInterceptors(QueryAwareCacheInterceptor)
  );
}
`.trim();
}