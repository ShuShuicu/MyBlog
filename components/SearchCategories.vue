<script setup>
import { useFetch } from '#app';

const { data: categorys, pending, error } = useFetch('/api/v2/categorys', {
  transform: (data) => {
    if (data.code === 200) {
      // 移除 description 中的 HTML 标签
      data.data = data.data.map(category => ({
        ...category,
        description: category.description.replace(/<[^>]*>/g, ''),
      }));
    }
    return data;
  },
});
</script>

<template>
  <v-row v-if="!pending && !error">
    <v-col v-for="category in categorys.data" :key="category.mid" cols="6" sm="6" md="3" lg="3">
      <NuxtLink :to="`/topic/${category.slug}`">
        <v-card>
          <template #title>{{ category.name }}</template>
          <template #subtitle>{{ category.description }}</template>
        </v-card>
      </NuxtLink>
    </v-col>
  </v-row>
  <v-row v-else-if="pending">
    <v-col cols="12">
      <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col cols="12">
      <p>Error loading categories: {{ error.message }}</p>
    </v-col>
  </v-row>
</template>