import { Article } from './Article'

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}
  
