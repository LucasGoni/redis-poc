import { Article } from './Article';

export interface EndpointResponse {
  source: string;
  responseTime: string;
  data: {
    status: string;
    totalResults: number;
    articles: Article[];
  };
}
  