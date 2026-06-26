import { Redis } from '@upstash/redis';

export const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Helper for chat requests
export const getChatRequestKey = (hardwareId: string) => `chat_req:${hardwareId}`;
export const ALL_REQUESTS_KEY = 'chat_requests_list';
export const REST_MODE_KEY = 'system_rest_mode';
