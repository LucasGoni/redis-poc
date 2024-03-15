<template>
    <div>
      <input v-model="query" placeholder="Search news...">
      <button @click="fetchNews">Search</button>
      <div v-for="article in articles" :key="article.url">
        <h2>{{ article.title }}</h2>
        <p>{{ article.description }}</p>
        <!-- Add more article details here -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        query: '',
        articles: [],
      };
    },
    methods: {
      async fetchNews() {
        const response = await fetch(`/news?q=${this.query}`);
        const data = await response.json();
        this.articles = data.articles;
      },
    },
  };
  </script>
  