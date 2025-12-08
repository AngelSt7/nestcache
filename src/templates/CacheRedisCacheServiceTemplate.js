export function cacheRedisCacheServiceTemplate() {
  return `
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class RedisCacheService {
    constructor(
        private readonly redisService: RedisService
    ) { }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redisService.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, ttlSeconds?: number) {
        const stringified = JSON.stringify(value);
        if (ttlSeconds) {
            await this.redisService.set(key, stringified, 'EX', ttlSeconds);
        } else {
            await this.redisService.set(key, stringified);
        }
    }

    async deleteKeys(keys: string[]) {
        for (const base of keys) {
            const pattern = \`cache::\${base}*\`;
            const keys = await this.redisService.keys(pattern);

            if (keys.length > 0) {
                await this.redisService.del(...keys);
            }
        }
    }

}
`.trim();
}