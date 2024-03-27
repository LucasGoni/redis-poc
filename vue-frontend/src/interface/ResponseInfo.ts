import { Article } from '../interface/Article'

export interface ResponseInfo {
    source: string;
    responseTime: string;
    data: {
        status: string;
        totalResults: number;
        articles: Article[];
      };
  }