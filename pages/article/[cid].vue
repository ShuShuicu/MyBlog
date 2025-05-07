<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAsyncData, useSeoMeta } from '#imports';
import * as Prism from 'prismjs';
import { nextTick } from 'vue';
import dayjs from 'dayjs';

// SEO配置函数
const useSeo = (title, description, keywords) => {
    useSeoMeta({
        title,
        titleTemplate: '%s - 鼠子Blog',
        keywords,
        description,
    });
};

definePageMeta({
    ssr: true,
});

const route = useRoute();
const router = useRouter();
const cid = route.params.cid;

// 获取文章数据
const { data: response, error: fetchError } = await useAsyncData(`article-${cid}`, () =>
    $fetch(`/api/article/${cid}`)
);

// 错误状态
const error = ref(null);

// 提取文章数据
const article = computed(() => {
    if (response.value?.code === 200) {
        return response.value.data;
    }
    return null;
});

// 判断是否为文章类型
const isPost = computed(() => {
    return article.value?.type === 'post';
});

// 错误处理
watch([fetchError, response], ([newFetchError, newResponse]) => {
    if (newFetchError) {
        error.value = newFetchError;
        if (newFetchError.statusCode === 404) {
            router.push('/error');
        } else {
            router.push('/error');
        }
    } else if (newResponse && newResponse.code !== 200) {
        error.value = new Error('Failed to load article');
        router.push('/error');
    } else if (!isPost.value) {
        error.value = new Error('Not a post type');
        router.push('/error');
    }
}, { immediate: true });

// 动态设置SEO信息
const seoInfo = computed(() => {
    if (article.value) {
        return {
            title: article.value.title,
            description: article.value.excerpt || article.value.content.replace(/<[^>]*>/g, '').substring(0, 150),
            keywords: article.value.categories?.map(cat => cat.name).join(', ') || '',
        };
    }
    return null;
});

watch(seoInfo, (newSeoInfo) => {
    if (newSeoInfo) {
        useSeo(newSeoInfo.title, newSeoInfo.description, newSeoInfo.keywords);
    }
}, { immediate: true });

// 格式化日期
const formattedDate = computed(() => {
    if (!article.value?.created) return '';
    return dayjs(article.value.created).format('YYYY-MM-DD');
});

// 代码高亮处理
const highlightCode = async () => {
    await nextTick();
    if (process.client && window.Prism) {
        window.Prism.highlightAll();
    }
};

// 监听article变化，重新高亮代码
watch(article, highlightCode);

// 组件挂载后高亮代码
onMounted(highlightCode);

// 图片灯箱相关代码
const imgs = ref([]); // 用于存储图片列表
const index = ref(0); // 当前显示的图片索引

// 处理图片点击事件
const showLightbox = (imgIndex) => {
    index.value = imgIndex;
    imgs.value = Array.from(document.querySelectorAll('.typo img')).map(img => img.src);
};
</script>

<template>
    <div v-if="error">
        <v-alert type="error" :text="error.message" />
    </div>

    <div v-else-if="article && isPost">
        <v-card :title="article.title">
            <template #subtitle>
                {{ formattedDate }} ·
                <span v-for="(cat, index) in article.categories" :key="cat.slug">
                    <NuxtLink :to="`/topic/${cat.slug}`">{{ cat.name }}</NuxtLink>
                    <span v-if="index < article.categories.length - 1"> | </span>
                </span>
            </template>
            <v-card-text>
                <div class="typo" v-viewer>
                    <div v-html="article.content"></div>
                </div>
                <div class="separator">THE END</div>
                <div class="content-ds">
                    <p><span>© 转载请保留原链接</span></p>
                    <div class="content-ds-button">
                        <BiliPay />
                    </div>
                    <div class="content-ds-count"><span>还没有人充电，快来当第一个充电的人吧！</span></div>
                </div>
            </v-card-text>
        </v-card>
    </div>

    <div v-else>
        <v-skeleton-loader type="article" />
    </div>
</template>

<style scoped>
.separator {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.separator::after,
.separator::before {
    content: '';
    background: #7272721a;
    max-width: 20%;
    height: 2px;
    margin: 0 1em;
    flex: 1;
}

.content-ds {
    display: flex;
    justify-content: center;
    flex-flow: column;
    margin-top: 10px;
    padding: 20px;
    border-radius: 3px;
    position: relative;
}

.content-ds-count {
    font-size: 12px;
    margin: 17px 0 5px;
}

.content-ds-button {
    position: absolute;
    right: 20px;
    top: 8px;
}

@media screen and (max-width: 768px) {
    .content-ds-button {
        top: 0;
        margin-top: 2em;
    }
}
</style>