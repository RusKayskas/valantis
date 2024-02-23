<template>
  <div class="page-products">
    <h1>Products</h1>
    <div class="page-products__grid">
      <div v-if="isLoading">Loading...</div>
      <Product v-for="product in products" :key="product.id" :product="product" v-else />
    </div>
    <button @click="prevPage" :disabled="page === 1">Prev</button>
    <span>{{ page }}</span>
    <button @click="nextPage">Next</button>
    <button @click="filterProducts('price', 17500.0)">Filter by Price</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { md5 } from 'js-md5';
import Product from './components/Product.vue';
import type { TProduct } from './types';

const isLoading = ref<boolean>(true);
const products = ref<TProduct[]>([]);
const page = ref(1);
const pageSize = 50;
const totalProducts = ref(0);
const xAuth = md5('Valantis_' + new Date().toISOString().slice(0, 10).replace(/-/g, ''));

async function fetchData() {
  try {
    const response = await axios.post(
      'http://api.valantis.store:40000/',
      { action: 'get_ids', params: { offset: (page.value - 1) * pageSize, limit: pageSize } },
      { headers: { 'X-Auth': xAuth } }
    );
    const data = response.data.result;
    totalProducts.value = data.length;
    const productIds = data;
    await fetchProducts(productIds);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

async function fetchProducts(ids: string[]) {
  try {
    isLoading.value = true;
    const response = await axios.post(
      'http://api.valantis.store:40000/',
      { action: 'get_items', params: { ids } },
      { headers: { 'X-Auth': xAuth } }
    );
    products.value = response.data.result;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
}

async function nextPage() {
  page.value++;
  await fetchData();
}

async function prevPage() {
  page.value--;
  await fetchData();
}

async function filterProducts(field: string, value: string | number) {
  try {
    isLoading.value = true;
    const response = await axios.post(
      'http://api.valantis.store:40000/',
      { action: 'filter', params: { [field]: value } },
      { headers: { 'X-Auth': xAuth } }
    );
    const filteredIds = response.data.result;
    await fetchProducts(filteredIds);
  } catch (error) {
    console.error('Error filtering products:', error);
  }
}

onMounted(fetchData);
</script>