import { createClient } from 'redis';

// Use environment variables for Redis connection details
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({
  url: redisUrl,
  // Additional options like retry strategy can be configured here
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('reconnecting', () => console.log('Reconnecting to Redis...'));
redisClient.on('end', () => console.log('Disconnected from Redis'));

async function connectRedis() {
  try {
    await redisClient.connect();
    // Perform any post-connection initialization here if needed
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    // Implement your error handling or retry logic here
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
