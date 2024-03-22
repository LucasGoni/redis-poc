<template>
  <div class="news-search">
    <div class="search-fields">
      <div v-if="responseInfo" class="performance-metrics">
      <p>Data Source: {{ responseInfo.source }}</p>
      <p v-if="responseInfo.source === 'api'">API Response Time: {{ responseInfo.responseTime }}</p>
      <p v-if="responseInfo.source === 'redis'">Redis Response Time: {{ responseInfo.responseTime }}</p>
    </div>
      <label for="search-keywords" class="visually-hidden">Search by keywords or phrases</label>
      <input id="search-keywords" v-model="searchParams.q" type="text" placeholder="Search by keywords or phrases" aria-label="Search by keywords or phrases" />

      <label for="from-date" class="visually-hidden">From date</label>
      <input id="from-date" v-model="searchParams.from" type="date" placeholder="From date" aria-label="From date" />

      <label for="to-date" class="visually-hidden">To date</label>
      <input id="to-date" v-model="searchParams.to" type="date" placeholder="To date" aria-label="To date" />

      <label for="sort-by" class="visually-hidden">Sort by</label>
      <select id="sort-by" v-model="searchParams.sortBy" aria-label="Sort by">
        <option value="" disabled>Select sort order</option>
        <option value="relevancy">Relevancy</option>
        <option value="popularity">Popularity</option>
        <option value="publishedAt">Published At</option>
      </select>
    </div>
    <button class="button-search" @click="fetchNews">Search</button>

    <div v-if="loading">Loading...</div>
    <div v-if="errorMessage">{{ errorMessage }}</div>

    <div v-for="article in articles" :key="article.url" class="news-article">
      <router-link :to="{ name: 'ArticleDetail', params: { articleData: encodeURIComponent(JSON.stringify(article)) }}" @click="navigateToArticleDetail(article)">
        <h2>{{ article.title }}</h2>
      </router-link>

      <p>{{ article.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, reactive, ref } from 'vue';
import { Article } from '../interface/Article';
import router from '../router/router';

export default defineComponent({
  name: 'NewsSearch',
  setup() {
    const searchParams = reactive({
      q: '',
      from: '',
      to: '',
      sortBy: '',
      language: '',
      sources: '',
      country: '',
    });

    const articles = ref<Article[]>([]);
    const loading = ref(false);
    const errorMessage = ref('');
    const responseInfo = ref<any>(null);

    async function fetchNews() {
      loading.value = true;
      errorMessage.value = '';

      try {
        const startAPICall = performance.now();
        const response = await axios.get(`${process.env.VUE_APP_SERVER_URL}`, {
          params: { ...searchParams },
        });
        const endAPICall = performance.now();

        articles.value = response.data.data.articles || [];

        const timeTaken = endAPICall - startAPICall;

        responseInfo.value = {
          source: response.data.source, // Get source from backend response
          responseTime: timeTaken.toFixed(2), // Store API response time (rounded to 2 decimal places)
        };
        
      } catch (error) {
        console.error('Error fetching news:', error);
        errorMessage.value = 'Failed to fetch news. Please try again later.';
      } finally {
        loading.value = false;
      }
    }

    function navigateToArticleDetail(article: Article) {
      const articleData = encodeURIComponent(JSON.stringify(article));
      console.log("Navigating to ArticleDetail with article data:", article);
      router.push({ 
        name: 'ArticleDetail', 
        params: { articleData } });
    }

    return {
      searchParams,
      articles,
      loading,
      errorMessage,
      fetchNews,
      navigateToArticleDetail,
      responseInfo // Make sure to return this new method
    };
  },
});
</script>

<style scoped>
@import '../assets/css/NewsSearch.css';
</style>