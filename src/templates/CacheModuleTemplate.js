export function cacheModuleTemplate() {
  return `
import { Global, Module } from '@nestjs/common';
import { CacheUtilsService, RedisService } from '../services';

@Global()
@Module({
  providers: [CacheUtilsService, RedisService],
  exports: [CacheUtilsService, RedisService]
})
export class CacheModule { }

`.trim();
}