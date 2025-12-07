export function cacheModuleTemplate() {
  return `
import { Module } from '@nestjs/common';
import { CacheUtilsService, RedisService } from '../services';

@Module({
  providers: [CacheUtilsService, RedisService],
})
export class CacheModule { }

`.trim();
}