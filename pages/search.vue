<script setup>
import { ref, watch } from 'vue';
import { useSeoMeta, useRoute, useRouter } from '#imports';
import dayjs from 'dayjs';

// SEO配置
const useSeo = (title, description, keywords) => {
    useSeoMeta({
        title,
        keywords,
        description,
    });
};

useSeo('搜索', '鼠子の个人Blog, 分享经验记录生活。', '鼠子Blog, 技术, Vue, Nuxt, php, Typecho, WordPress');

const route = useRoute();
const router = useRouter();

const rules = [
    (v) => !!v || '请输入关键词',
    (v) => (v && v.length <= 20) || '关键词最多20个字符',
];

const searchQuery = ref(route.query.keywords || '');
const searchResults = ref([]);
const loading = ref(false);
const error = ref(null);
const hasSearched = ref(false);
const totalResults = ref(0);
const currentPage = ref(parseInt(route.query.page) || 1);
const pageSize = 10;

// 确保只在客户端执行搜索
const isClient = process.client;

const performSearch = async () => {
    if (!isClient) return;

    if (!searchQuery.value) {
        error.value = null;
        searchResults.value = [];
        hasSearched.value = false;
        return;
    }

    loading.value = true;
    error.value = null;
    hasSearched.value = true;

    try {
        const { data } = await useFetch(`/api/v2/search/${encodeURIComponent(searchQuery.value)}`, {
            params: {
                page: currentPage.value,
                pageSize
            },
            key: `search-${searchQuery.value}-${currentPage.value}`
        });

        if (data.value?.code === 200) {
            searchResults.value = data.value.data.list.map(post => ({
                ...post,
                formattedDate: dayjs(post.created).format('YYYY-MM-DD'),
                digest: post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
            }));
            totalResults.value = data.value.data.pagination.total;
        }
    } catch (err) {
        error.value = err.message || '搜索失败，请稍后重试。';
    } finally {
        loading.value = false;
    }
};

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    router.push({
        query: {
            keywords: searchQuery.value,
            page: newPage
        }
    });
};

// 只在客户端初始化搜索
if (isClient && searchQuery.value) {
    performSearch();
}

watch(() => route.query, (newQuery) => {
    if (!isClient) return;

    if (newQuery.keywords !== undefined) {
        searchQuery.value = newQuery.keywords || '';
        currentPage.value = parseInt(newQuery.page) || 1;
        if (searchQuery.value) {
            performSearch();
        }
    }
}, { immediate: true });
</script>

<template>
    <div>
        <v-card style="margin-bottom: 10px;">
            <v-card-actions>
                <v-text-field v-model="searchQuery" :rules="rules" hide-details="auto" label="输入关键词..."
                    @keyup.enter="handlePageChange(1)"></v-text-field>
                <v-btn color="primary" @click="handlePageChange(1)" :loading="loading">搜索</v-btn>
            </v-card-actions>
        </v-card>

        <div v-if="error" class="error-message">
            <v-card>
                <a-alert type="error">
                    <template #title>
                        Error
                    </template>
                    {{ error }}
                </a-alert>
            </v-card>
        </div>

        <div v-if="hasSearched">
            <ArticleList :posts="searchResults" :loading="loading" :error="error" />

            <div class="pagination-wrapper">
                <a-pagination v-if="$vuetify.display.mdAndUp" size="large" v-model:current="currentPage"
                    :total="totalResults" :page-size="pageSize" show-total @change="handlePageChange" />
                <v-pagination v-else v-model="currentPage" :length="Math.ceil(totalResults / pageSize)" :total-visible="3"
                    @update:model-value="handlePageChange" />
            </div>
        </div>

        <div v-else-if="loading">
            <v-skeleton-loader type="article"></v-skeleton-loader>
        </div>
        <div v-else>
            <SearchCategories />
        </div>
    </div>
</template>

<style scoped>
.error-message,
.no-results {
    margin-bottom: 20px;
}

.post-card {
    cursor: pointer;
    margin-bottom: 10px;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}
</style>