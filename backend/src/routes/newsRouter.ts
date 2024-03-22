import express, { Request, Response } from 'express';
import axios from 'axios';
import { redisClient } from '../config/redisClient';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const queryParams = {
    ...req.query,
    apiKey: process.env.NEWS_API_KEY,
  };

  const cacheKey = `news:${JSON.stringify(queryParams)}`;

  try {
    console.time(`redis-get:${cacheKey}`);
    const cachedNews = await redisClient.get(cacheKey);
    console.timeEnd(`redis-get:${cacheKey}`);

    if (cachedNews) {
      console.log(`Cache hit for query "${cacheKey}".`);
      const response = JSON.parse(cachedNews);
      res.json({ source: 'redis', data: response }); // Send source: 'cache' along with the response
      return;
    }

    console.log(`Cache miss for query "${cacheKey}". Fetching from API.`);
    console.time(`api-request:${cacheKey}`);
    const response = await axios.get(`${process.env.NEWS_API_URL}`, { params: queryParams });
    console.timeEnd(`api-request:${cacheKey}`);

    const news = response.data;
    console.time(`redis-set:${cacheKey}`);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(news)); // Cache for 1 hour
    console.timeEnd(`redis-set:${cacheKey}`);

    res.json({ source: 'api', data: news }); // Send source: 'api' along with the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;
