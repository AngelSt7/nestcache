export function redisServiceTemplate(port = 12000) {
  return `
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    super({
      host: 'localhost',
      port: ${port},
    });

    this.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.on('ready', () => {
      this.logger.log('Redis ready to use!');
    });

    this.on('error', (err) => {
      this.logger.error('❌ Redis error: ' + err.message);
      process.exit(1);
    });

    this.on('reconnecting', () => {
      this.logger.warn('🔄 Reconnecting to Redis...');
    });
  }
}
`.trim();
}
