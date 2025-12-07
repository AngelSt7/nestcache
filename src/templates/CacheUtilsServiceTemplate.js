export function cacheUtilsServiceTemplate() {
  return `
import { Injectable } from '@nestjs/common';
import { CACHE_KEYS } from '../config';
import { RedisService } from './redis.service';

@Injectable()
export class CacheUtilsService {

    constructor(
        private readonly redisService: RedisService
    ) { }

    generateCacheKey(base: CACHE_KEYS, query: Record<string, any>, resourceId?: string) {
        const sortedEntries = Object.entries(query)
            .filter(([_, v]) => v !== undefined && v !== null)
            .sort(([a], [b]) => a.localeCompare(b));

        const queryString = sortedEntries
            .map(([k, v]) => \`\${k.toLowerCase()}=\${String(v).toLowerCase()}\`)
            .join('&');

        const idPart = resourceId ? \`/\${resourceId}\` : '';
        const key = \`cache::\${base}\${idPart}\${queryString ? ':' + queryString : ''}\`;

        return key;
    }

    async deleteKeys(bases: string | string[]) {
        const basesArray = Array.isArray(bases) ? bases : [bases];

        for (const base of basesArray) {
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
