import express, { Request, Response, Router } from 'express';
import axios, { AxiosResponse } from 'axios';
import { redisClient } from '../redis/redisClient';
import { QueryParams } from '../interface/QueryParams';
import { NewsApiResponse } from '../interface/NewsApiResponse';
import { EndpointResponse } from '../interface/EndpointResponse';
import { validateSearchParams } from '../middleware/Query';

const router: Router = express.Router();

router.get('/', validateSearchParams, async (req: Request, res: Response) => {
  const queryParams: QueryParams = {
    apiKey: process.env.NEWS_API_KEY || '',
    ...req.query,
  };

  const cacheKey: string = `news:${JSON.stringify(queryParams)}`;
  let endpointResponse: EndpointResponse | undefined;
  let apiResponseTime: string = '';
  let cacheResponseTime: string = '';

  try {
    const cacheStartTime: [number, number] = process.hrtime();
    let cachedNews: string | null = null;

    try {
      cachedNews = await redisClient.get(cacheKey);
    } catch (cacheError) {
      console.error('Error retrieving data from cache:', cacheError);
    }

    const cacheEndTime: [number, number] = process.hrtime();
    const cacheElapsedMilliseconds: number = calculateElapsedMilliseconds(cacheStartTime, cacheEndTime);
    cacheResponseTime = `${cacheElapsedMilliseconds} ms`;

    if (cachedNews) {
      console.log(`Cache hit for query "${cacheKey}".`);
      const news: NewsApiResponse = JSON.parse(cachedNews);
      endpointResponse = {
        source: `${process.env.REDIS_SOURCE}`,
        data: news,
        responseTime: cacheResponseTime,
      };

      res.json(endpointResponse);
      return;

    } else {
      console.log(`Cache miss for query "${cacheKey}". Fetching from API.`);
      const apiStartTime: [number, number] = process.hrtime();
      let apiResponse: AxiosResponse<NewsApiResponse>;

      try {
        apiResponse = await axios.get(`${process.env.NEWS_API_URL}`, { params: queryParams });
      } catch (apiError) {
        console.error('Error fetching data from API:', apiError);
        throw new Error('Failed to fetch news from API');
      }

      const apiEndTime: [number, number] = process.hrtime();
      const apiElapsedMilliseconds: number = calculateElapsedMilliseconds(cacheStartTime, cacheEndTime);
      apiResponseTime = `${apiElapsedMilliseconds} ms`;

      const news: NewsApiResponse = apiResponse.data;

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(news)); // Set cache for 1 hour

      endpointResponse = {
        source: `${process.env.API_SOURCE}`,
        data: news,
        responseTime: apiResponseTime,
      };

      res.json(endpointResponse);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }

  function calculateElapsedMilliseconds(startTime: [number, number], endTime: [number, number]): number {
    const startMilliseconds = (startTime[0] * 1000) + (startTime[1] / 1000000);
    const endMilliseconds = (endTime[0] * 1000) + (endTime[1] / 1000000);
    return endMilliseconds - startMilliseconds;
  }
  

});

export default router;
