import { createClient, RedisClientType } from 'redis';

const redisUrl: string = process.env.REDIS_URL || '';
const redisClient: RedisClientType = createClient({ 
  url: redisUrl,
 });
 let isConnectedToRedis: boolean = false;

 async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
}

redisClient.on('error', (err: Error) => {
  console.error('Test error:', err);
  if (!isConnectedToRedis) {
    setTimeout(connectRedis, 300000); // 5 minutes
  }
});

redisClient.on('connect', () => {
  isConnectedToRedis = true;
  console.log('Connected to Redis');
});

redisClient.on('end', () => {
  isConnectedToRedis = false;
  console.log('Disconnected from Redis');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.disconnect();
  console.log('Redis client disconnected and application exiting');
  process.exit(0);
});

connectRedis();

export { redisClient, isConnectedToRedis };