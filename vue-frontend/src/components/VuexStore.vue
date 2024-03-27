// Import necessary modules
import { createStore } from 'vuex';
import axios from 'axios';

// Create Vuex store
const store = createStore({
  state: {
    searchParams: null,
    newsData: null
  },
  mutations: {
    SET_SEARCH_PARAMS(state, params) {
      state.searchParams = params;
    },
    SET_NEWS_DATA(state, data) {
      state.newsData = data;
    }
  },
  actions: {
    async fetchNews({ commit }, params) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_SERVER_URL}`, { params });
        commit('SET_NEWS_DATA', response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    }
  },
  getters: {
    searchParams: state => state.searchParams,
    newsData: state => state.newsData
  }
});

export default store;
