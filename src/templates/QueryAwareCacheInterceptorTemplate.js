export function queryAwareCacheInterceptorTemplate() {
  return `
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { tap } from 'rxjs/operators';
import { CACHE_KEY_META, CACHE_TTL_META } from '../decorators';
import { CacheUtilsService, RedisService } from '../services';
import { CACHE_KEYS } from '../config';

@Injectable()
export class QueryAwareCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly cacheUtilsService: CacheUtilsService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method !== 'GET') return next.handle();

    const handler = context.getHandler();
    const baseKey = this.reflector.get<CACHE_KEYS>(CACHE_KEY_META, handler) ?? 'default';
    const ttl = this.reflector.get<number>(CACHE_TTL_META, handler) ?? 60;

    const query = request.query;
    const resource = Object.values(request.params).join('/');
    const finalKey = this.cacheUtilsService.generateCacheKey(baseKey, query, resource);

    const cached = await this.redisService.get(finalKey);

    return next.handle().pipe(
      tap(async (data) => {
        await this.redisService.set(finalKey, JSON.stringify(data), 'EX', ttl);
      }),
    );
  }
}
`.trim();
}
