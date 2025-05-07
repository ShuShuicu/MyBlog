<script setup>
import dayjs from 'dayjs';

const props = defineProps({
    posts: {
        type: Array,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: '',
    },
});

const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD');
};
</script>

<template>
    <div v-if="error">
        <v-alert type="error" :text="error" />
    </div>

    <div v-else-if="loading">
        <v-skeleton-loader type="article" class="mb-3" />
    </div>

    <div v-else-if="posts.length > 0">
        <NuxtLink v-for="post in posts" :key="post.cid" :to="`/article/${post.cid}`" class="mb-3 post-link">
            <v-card class="post-card">
                <v-card-item>
                    <v-card-title>{{ post.title }}</v-card-title>
                    <v-card-subtitle>
                        {{ formatDate(post.created) }}
                    </v-card-subtitle>
                </v-card-item>
                <v-card-text>
                    {{ post.digest || '暂无摘要' }}
                </v-card-text>
            </v-card>
        </NuxtLink>
    </div>

    <div v-else>
        <v-alert type="info" text="暂无文章" />
    </div>
</template>

<style scoped>
.post-link {
    text-decoration: none;
    display: block;
}

.post-card {
    transition: transform 0.2s;
}

.post-card:hover {
    transform: translateY(-2px);
}
</style>