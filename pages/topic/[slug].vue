<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSeoMeta } from '#imports';

// 提取SEO配置到公共函数
const useSeo = (title, description, keywords) => {
    useSeoMeta({
        title,
        titleTemplate: '%s - 鼠子Blog',
        keywords,
        description,
        ogTitle: title,
        ogDescription: description,
    });
};

definePageMeta({
    ssr: true,
});

const route = useRoute();
const router = useRouter();
const slug = route.params.slug;

// 从路由参数获取页码，默认为1
const page = ref(parseInt(route.query.page) || 1);
const pageSize = ref(5);
const posts = ref([]);
const loading = ref(false);
const error = ref(null);
const totalPages = ref(0);
const totalItems = ref(0);
const categoryInfo = ref(null);

// 获取分类数据 (SSR兼容)
const { data: categoryData } = await useAsyncData(
    'categoryData',
    async () => {
        const { data } = await $fetch(`/api/v2/topic/${slug}`, {
            params: {
                page: page.value,
                pageSize: pageSize.value
            }
        });
        return data;
    },
    {
        server: true // 确保在服务器端执行
    }
);

// 在服务器端设置SEO
if (process.server && categoryData.value) {
    const category = categoryData.value.category;
    useSeo(
        category.name,
        category.description?.replace(/<[^>]*>/g, '') || '',
        category.name
    );
}

// 加载分类信息和文章
const loadData = async () => {
    loading.value = true;
    error.value = null;

    try {
        // 使用useAsyncData确保SSR兼容
        const { data } = await useFetch(`/api/topic/${slug}`, {
            params: {
                page: page.value,
                pageSize: pageSize.value
            },
            key: `category-${slug}-page-${page.value}` // 唯一key确保正确缓存
        });

        if (data.value?.code === 200) {
            const response = data.value.data;

            // 设置分类信息
            categoryInfo.value = response.category;

            // 更新分页信息
            totalPages.value = response.pagination?.totalPages || 0;
            totalItems.value = response.pagination?.total || 0;

            // 处理文章列表数据
            posts.value = response.list?.map(post => ({
                cid: post.cid,
                title: post.title,
                slug: post.slug,
                formattedDate: formatDate(post.created),
                digest: post.excerpt || truncateText(post.content, 100),
                content: post.content
            })) || [];
        } else {
            throw new Error(data.value?.message || '获取数据失败');
        }
    } catch (err) {
        error.value = err.message || '加载数据失败，请稍后重试。';
    } finally {
        loading.value = false;
    }
};

// 日期格式化辅助函数
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// 内容截断辅助函数
const truncateText = (text, maxLength) => {
    if (!text) return '';
    // 移除HTML标签
    const plainText = text.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
};

// 客户端动态设置 SEO 信息
watch(categoryInfo, (newCategoryInfo) => {
    if (newCategoryInfo && process.client) {
        useSeo(
            newCategoryInfo.name,
            newCategoryInfo.description?.replace(/<[^>]*>/g, '') || '',
            newCategoryInfo.name
        );
    }
}, { immediate: true });

// 处理分页变化
const handlePageChange = (newPage) => {
    // 更新路由参数
    router.push({
        params: { slug },
        query: { page: newPage }
    });
};

// 监听路由参数变化
watch(() => route.query.page, (newPage) => {
    page.value = parseInt(newPage) || 1;
    loadData();
}, { immediate: true });

// 监听分类slug变化
watch(
    () => route.params.slug,
    (newSlug) => {
        slug = newSlug;
        page.value = 1;
        posts.value = [];
        loadData();
    }
);

// 初始加载数据
await loadData();
</script>

<template>
    <div v-if="error">
        <a-alert type="error">
            <template #title>
                Error
            </template>
            {{ error }}
        </a-alert>
    </div>

    <div v-else>
        <v-card class="mx-auto mb-6">
            <v-img height="240px" class="align-end text-white" src="https://bing.img.run/rand.php" cover>
                <v-card-title class="text-h4 font-weight-bold">
                    {{ categoryInfo?.name }}
                </v-card-title>
                <v-card-text class="text-body-1" v-html="categoryInfo?.description"></v-card-text>
            </v-img>
        </v-card>

        <ArticleList :posts="posts" :loading="loading" :error="error" />

        <div class="pagination-wrapper">
            <v-pagination v-model="page" :length="totalPages" :total-visible="5"
                @update:model-value="handlePageChange" />
        </div>
    </div>
</template>

<style scoped>
.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin: 24px 0;
}
</style>