<script setup>
import { ref, watch } from 'vue';
import { useSeoMeta } from '#imports';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';

definePageMeta({
    ssr: true,
});

// SEO配置
const useSeo = (title, description, keywords) => {
    useSeoMeta({
        title,
        titleTemplate: '%s - 忘れてやらない',
        keywords,
        description,
    });
};

useSeo('鼠子Blog', '鼠子の个人Blog, 分享经验记录生活。', '鼠子Blog, 技术, Vue, Nuxt, php, Typecho, WordPress');

const route = useRoute();
const router = useRouter();
const pageSize = 5;
const posts = ref([]);
const loading = ref(false);
const error = ref(null);
const totalPages = ref(0);
const totalItems = ref(0);

// 获取当前页码，默认为1
const currentPage = ref(parseInt(route.query.page) || 1);

// 加载文章
const loadPosts = async () => {
    loading.value = true;
    error.value = null;

    try {
        const { data } = await useFetch('/api/v2/articles', {
            params: { page: currentPage.value, pageSize },
        });

        if (data.value && data.value.code === 200) {
            // 更新分页信息
            totalPages.value = data.value.data.pagination.totalPages;
            totalItems.value = data.value.data.pagination.total;

            // 处理文章列表数据
            posts.value = data.value.data.list.map(post => ({
                ...post,
                formattedDate: dayjs(post.created).format('YYYY-MM-DD'),
                categories: post.categories || [],
                tags: post.tags || [],
                digest: post.excerpt || post.digest || '暂无摘要',
            }));
        }
    } catch (err) {
        error.value = err.message || '加载文章失败，请稍后重试。';
    } finally {
        loading.value = false;
    }
};

// 处理分页变化
const handlePageChange = (newPage) => {
    // 更新路由参数
    router.push({
        query: { page: newPage }
    });
};

// 监听路由参数变化
watch(() => route.query.page, (newPage) => {
    currentPage.value = parseInt(newPage) || 1;
    loadPosts();
}, { immediate: true });
</script>

<template>
    <div v-if="error" class="error-message">
        <v-alert type="error" :text="error" />
    </div>

    <div v-else-if="posts.length > 0" class="posts-container">
        <ArticleList :posts="posts" :loading="loading" :error="error" />

        <div class="pagination-wrapper">
            <a-pagination v-if="$vuetify.display.mdAndUp" size="large" v-model:current="currentPage" :total="totalItems"
                :page-size="pageSize" show-total @change="handlePageChange" />
            <v-pagination v-else v-model="currentPage" :length="totalPages" :total-visible="3"
                @update:model-value="handlePageChange" />
        </div>
    </div>

    <div v-else-if="loading" class="loading-skeleton mb-4">
        <template v-for="i in 3" :key="i">
            <v-skeleton-loader type="article" />
        </template>
    </div>
</template>

<style scoped>
.post-link {
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
}

.post-card {
    transition: transform 0.3s;
}

.post-card:hover {
    transform: translateY(-3px);
}

.error-message {
    margin: 20px 0;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}
</style>