import express, { Request, Response } from 'express';
import axios from 'axios';
import {redisClient} from '../config/redisClient';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { query } = req.query;
  const cacheKey = `news:${query}`;
  
  try {
    const cachedNews = await redisClient.get(cacheKey);
    if (cachedNews) {
      return res.json({ source: 'cache', data: JSON.parse(cachedNews) });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const news = response.data;
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(news)); // Cache for 1 hour

    res.json({ source: 'api', data: news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;
