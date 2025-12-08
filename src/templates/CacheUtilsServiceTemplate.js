export function cacheUtilsServiceTemplate() {
  return `
import { Injectable } from '@nestjs/common';
import { CACHE_KEYS } from '../config';
import { RedisService } from './redis.service';

@Injectable()
export class CacheUtilsService {

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

}
`.trim();
}
