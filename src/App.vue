<template>
  <div class="page-products">
    <h1>Products</h1>
    <div class="page-products__tabs">
      <button :class="
        [
          'page-products__tabs-button', 
          {'page-products__tabs-button--is-active' : activeTab === 'all' }
        ]"  
        @click="changeTab('all')">
          All Products
      </button>
      <button :class="[
        'page-products__tabs-button', 
        {'page-products__tabs-button--is-active' : activeTab !== 'all' }
        ]" 
        @click="changeTab('filtered')">
        Filter by Price
      </button>
    </div>
    <div v-if="isLoading">
      <Loader/>
    </div>
    <div class="page-products__grid" v-else>
      <template v-if="activeTab === 'all'">
        <Product v-for="product in allProducts" :key="product.id" :product="product" />
      </template>
      <template v-else-if="activeTab === 'filtered'">
        <Product v-for="product in filteredProducts" :key="product.id" :product="product" />
      </template>
    </div>
    <div class="page-contacts__pagination">
      <template v-if="activeTab === 'all'"> 
        <button @click="prevPageAll" :disabled="pageAll === 1">Prev</button>
          <span>{{ pageAll }}</span>
        <button @click="nextPageAll">Next</button>
      </template>
      <template v-else-if="activeTab === 'filtered'">
        <button @click="prevPageFiltered" :disabled="filterPage === 1">Prev</button>
        <span>{{ filterPage }}</span>
        <button @click="nextPageFiltered" :disabled="filteredProducts.length < 50">Next</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getIds, getItems, filterByField } from './api/api';
import Product from './components/Product.vue';
import Loader from './components/Loader.vue';
import type { TProduct } from './types';
const isLoading = ref<boolean>(true);
const allProducts = ref<TProduct[]>([]);
const filteredProducts = ref<TProduct[]>([]);
const pageAll = ref(1);
const pageSize = 50;
const filterPage = ref(1);

const currentFilterField = ref<string>('');
const currentFilterValue = ref<number | string>('');
const activeTab = ref<'all' | 'filtered'>('all');

async function fetchDataAll() {
  try {
    const ids = await getIds((pageAll.value - 1) * pageSize, pageSize);
    await getProducts(ids, 'all');
  } catch (error) {
    console.error('Error fetching all data', error);
  }
}

async function fetchDataFiltered() {
  try {
    const ids = await filterByField(currentFilterField.value, currentFilterValue.value);
    await getProducts(ids, 'filtered');
  } catch (error) {
    console.error('Error fetching filtered data', error);
  }
}

async function getProducts(ids: string[], tab: 'all' | 'filtered') {
  try {
    isLoading.value = true;
    const items = await getItems(ids);
    if (tab === 'all') {
      allProducts.value = items;
    } else {
      filteredProducts.value = items;
    }
    isLoading.value = false;
  } catch (error) {
    console.error('Error getting products', error);
  }
}

async function filterProducts(field: string, value: number | string) {
  try {
    currentFilterField.value = field;
    currentFilterValue.value = value;
    filterPage.value = 1;
    await fetchDataFiltered();
  } catch (error) {
    console.error('Error filtering products', error);
  }
}

async function nextPageAll() {
  isLoading.value = true;
  pageAll.value++;
  await fetchDataAll();
  isLoading.value = false;
}

async function prevPageAll() {
  isLoading.value = true;
  if (pageAll.value > 1) {
    pageAll.value--;
    await fetchDataAll();
  }
  isLoading.value = false;
}

async function nextPageFiltered() {
  isLoading.value = true;
  filterPage.value++;
  await fetchDataFiltered();
  isLoading.value = false;
}

async function prevPageFiltered() {
  isLoading.value = true;
  if (filterPage.value > 1) {
    filterPage.value--;
    await fetchDataFiltered();
  }
  isLoading.value = false;
}

function changeTab(tab: 'all' | 'filtered') {
  isLoading.value = true;
  activeTab.value = tab;
  if (tab === 'filtered') {
    filterProducts('price', 17500.0); // Начальный фильтр по цене
  } else {
    fetchDataAll();
  }
  return isLoading.value = false;
}

onMounted(fetchDataAll);
</script>

<style>
.page-products__grid {
  margin: 30px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.page-products__tabs button:not(:last-child) {
  margin-right: 20px;
}
.page-contacts__pagination >*:not(:last-child) {
  margin-right: 20px;
}
.page-products__tabs-button--is-active {
  background: #fff;
  color: black;
}
</style>