import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;
const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('reconnecting', () => console.log('Reconnecting to Redis...'));
redisClient.on('end', () => console.log('Disconnected from Redis'));

async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    // TODO: Implement error handling or retry logic 
  }
}

connectRedis();

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.disconnect();
  console.log('Redis client disconnected and application exiting');
  process.exit(0);
});

export { redisClient };






