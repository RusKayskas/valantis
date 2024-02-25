<template>
  <div class="product" :id="product.id">
    <p class="product__details" v-html="product.product"/>
    <p class="product__price">{{ product.price }}&#8381; </p>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import type { TProduct } from '../types';
  defineProps<{
    product: TProduct
  }>();
</script>

<style>
  .product {
    border: 1px solid #fff;
    padding: 10px;
  }
</style>