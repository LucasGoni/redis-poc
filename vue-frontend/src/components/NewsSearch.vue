<template>
  <div v-if="responseInfo" class="performance-metrics">
      <p>Data Source: {{ responseInfo.source }}</p>
      <p>Response Time: {{ formatMilliseconds(parseInt(responseInfo.responseTime)) }}</p>
  </div>
  <div class="news-search">
    <div class="search-fields">
      <label for="search-keywords">Search by keywords or phrases</label>
      <input id="search-keywords" class="input-field" v-model="searchParams.q" type="text" placeholder="Search by keywords or phrases" aria-label="Search by keywords or phrases"/>

      <label for="from-date">From date</label>
      <input id="from-date" class="input-field" v-model="searchParams.from" type="date" placeholder="From date" aria-label="From date" />

      <label for="to-date">To date</label>
      <input id="to-date" class="input-field" v-model="searchParams.to" type="date" placeholder="To date" aria-label="To date" />

      <label for="sort-by">Sort by</label>
      <select v-model="searchParams.sortBy" aria-label="Sort by">
        <option value=""></option>
        <option value="relevancy">Relevancy</option>
        <option value="popularity">Popularity</option>
        <option value="publishedAt">Published At</option>
      </select>
    </div>
    
    <button class="button-search" @click="fetchNews">Search</button>

    <div v-if="loading">Loading...</div>
    <div v-if="errors.length > 0">
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <div v-for="article in articles" :key="article.url" class="news-article">
      <router-link :to="{ name: 'ArticleDetail', params: { articleData: encodeURIComponent(JSON.stringify(article)) }}" @click="navigateToArticleDetail(article)">
        <h2>{{ article.title }}</h2>
      </router-link>
      <p>{{ article.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse } from 'axios';
import { defineComponent, reactive, ref } from 'vue';
import { Article } from '../interface/Article';
import { SearchParams } from '../interface/SearchParams';
import { ResponseInfo } from '../interface/ResponseInfo';
import { validateSearchParams, ValidationResult } from '../utils/validateSearchParams';
import router from '../router/router';

export default defineComponent({
  name: 'NewsSearch',
  setup() {
    const searchParams = reactive<SearchParams>({
      q: '',
      from: '',
      to: '',
      sortBy: '',
      language: '',
      sources: '',
      country: '',
    });

    const articles = ref<Article[]>([]);
    const loading = ref<boolean>(false);
    const errors = ref<string[]>([]);
    const responseInfo = ref<ResponseInfo | null>(null);

    async function fetchNews(): Promise<void> {
      loading.value = true;
      errors.value = [];

      let validationResult: ValidationResult | null = validateSearchParams(searchParams);
      if (validationResult && validationResult.errors.length > 0) {
        errors.value = validationResult.errors;
        loading.value = false;
        return;
      }

      try {
        const response: AxiosResponse = await axios.get(`${process.env.VUE_APP_SERVER_URL}`, {
          params: { ...searchParams },
        });
        
        responseInfo.value = {
          data: response.data.data,
          source: response.data.source,
          responseTime: response.data.responseTime,
        };
        
        articles.value = responseInfo.value.data.articles || [];
        console.log(responseInfo.value.responseTime);
      } catch (error: any) {
        console.error('Error fetching news:', error);
        errors.value = ['Failed to fetch news. Please try again later.'];
      } finally {
        loading.value = false;
      }
    }

    function navigateToArticleDetail(article: Article): void {
      const articleData = encodeURIComponent(JSON.stringify(article));
      console.log("Navigating to ArticleDetail with article data:", article);
      router.push({ 
        name: 'ArticleDetail', 
        params: { articleData } });
    }

    function formatMilliseconds(milliseconds: number): string {
      const formattedMilliseconds = milliseconds.toFixed(2); 
      return `${formattedMilliseconds} ms`;
    }

     // Listen for keyup event on the document
     document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        fetchNews();
      }
    });
  
    return {
      searchParams,
      articles,
      loading,
      errors,
      fetchNews,
      navigateToArticleDetail,
      responseInfo,
      formatMilliseconds
    };
  },
});
</script>

<style scoped>
@import '../assets/css/NewsSearch.css';
</style>