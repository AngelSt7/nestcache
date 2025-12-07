export function redisServiceTemplate(port = 12000) {
  return `
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super({
      host: "localhost",
      port: ${port},
    });

    this.on('connect', () => console.log('✅ Connected to Redis'));
    this.on('ready', () => console.log('🚀 Redis ready to use!'));
    this.on('error', (err) => {
      console.error('❌ Redis error:', err);
      process.exit(1);
    });
    this.on('reconnecting', () => console.warn('🔄 Reconnecting to Redis...'));
  }
}
`.trim();
}
