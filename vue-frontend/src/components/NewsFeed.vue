<template>
  <div>
    <input v-model="searchQuery" placeholder="Enter search term..." />
    <button @click="fetchNews">Search</button>
    <div v-if="loading">Loading...</div>
    <div v-for="article in articles" :key="article.url" class="news-article">
      <h3>{{ article.title }}</h3>
      <p>{{ article.description }}</p>
      <!-- Add more article details here -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NewsFeed',
  data() {
    return {
      searchQuery: '',
      articles: [],
      loading: false,
    };
  },
  methods: {
    async fetchNews() {
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:3000/api/news`, {
          params: { query: this.searchQuery },
        });
        this.articles = response.data.data.articles;
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.news-article {
  margin-bottom: 20px;
}
</style>
