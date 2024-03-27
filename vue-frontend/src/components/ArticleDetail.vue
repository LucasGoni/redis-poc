<template>
  <div class="article-detail" v-if="article">
    <h1>{{ article.title }}</h1>
    <img v-if="article.urlToImage" :src="article.urlToImage" alt="Article image" />
    <p>{{ article.description }}</p>
    <p>{{ article.content }}</p>
    <a :href="article.url" target="_blank">Read more</a>
    <button class="button-go-back" @click="goBack">Go Back</button> <!-- New button to go back -->
  </div>
  <div v-else>
    <p>No article details available</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Article } from '../interface/Article';
import { useRouter, Router } from 'vue-router'; // Import useRouter from vue-router

export default defineComponent({
  name: 'ArticleDetail',
  props: {
    article: {
      type: Object as () => Article,
      required: true
    }
  },
  setup() {
    const router: Router = useRouter(); // Get router instance

    // Function to go back to the previous page
    const goBack = (): void => {
      router.go(-1); // Go back to the previous page in the history
    };

    return {
      goBack // Expose goBack function to the template
    };
  }
});
</script>

<style scoped>
@import '../assets/css/ArticleDetail.css';
</style>
