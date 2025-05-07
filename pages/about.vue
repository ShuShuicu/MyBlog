<script setup>
import { ref, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
// 提取SEO配置到公共函数
const useSeo = (title, description, keywords) => {
    useSeoMeta({
        title,
        titleTemplate: '%s - 鼠子Blog',
        keywords,
        description,
    });
};

useSeo('鼠子(Tomoriゞ)的个人介绍', '关于鼠子的一些介绍', '鼠子, ShuShuicu, Tomori');

const repos = ref([]);
const error = ref(null);
const loading = ref(true); // 加载状态

// 获取GitHub仓库信息
const fetchRepos = async () => {
    try {
        const { data } = await useFetch('https://api.github.com/users/ShuShuicu/repos');
        repos.value = data.value.map(repo => ({
            ...repo,
            color: getRandomColor(), // 为每个仓库随机分配颜色
        }));
    } catch (err) {
        error.value = err.message || '获取仓库信息失败，请稍后重试。';
    } finally {
        loading.value = false; // 加载完成
    }
};

// 生成随机颜色
const getRandomColor = () => {
    const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];
    return colors[Math.floor(Math.random() * colors.length)];
};

// 友情链接
const links = [
    {
        name: 'Bilibili',
        url: 'https://space.bilibili.com/435502585',
        description: '哔哩哔哩 (゜-゜)つロ 干杯~',
    },
    {
        name: '若海の技术写真',
        url: 'https://www.rehiy.com/',
        description: '一个全栈攻城狮的纯技术干货分享'
    },
    {
        name: '大绵羊博客',
        url: 'https://dmyblog.cn/',
        description: '大绵羊博客，这是一个聚焦于个人技术分享与生活记录的博客。在这里，我会分享关于前端开发、WordPress使用技巧、以及编程心得的点滴。同时，我也记录下生活中的小确幸和成长故事',
    },
    {
        name: '于小丘Blog',
        url: 'https://www.yxqi.cn/',
        description: 'printf("为了尚未完成的未来");',
    },
    {
        name: '筱信日记',
        url: 'https://www.hxino.com/',
        description: '分享知识创造无限价值',
    },
    {
        name: '苏晨博客网',
        url: 'https://www.scbkw.cn/',
        description: '苏晨博客致力于分享优质实用的互联网资源，内容包括有网站搭建、建站源码、样式特效、主题美化、实用工具、素材资源、技术教程，致力打造一个IT博客!',
    },
    {
        name: '墨星博客',
        url: 'https://moxingbk.com/',
        description: '设计，创新，动力，为主题美化设想！',
    },
    {
        name: '系统观察屋',
        url: 'https://www.xtgcw.cn/',
        description: '提供教程与资源类的网站，为个人学习与个人博客网站，欢迎大家浏览。',
    },
];

// 挂载获取GitHub仓库信息
onMounted(
    fetchRepos
);
</script>

<template>

    <v-card>
        <v-img class="align-end text-white" height="320" src="https://bing.img.run/rand.php" cover>
            <v-card-title class="text-h4 font-weight-bold">About Me</v-card-title>
        </v-img>
        <v-card-text>
            <p>你好呀，我是鼠子(Tomoriゞ), 一只轻音厨~</p>
            <p>业余时间写写代码，<del>DeepSeek/ChatGPT选手, 啥都会点就是不精通...</del></p>
        </v-card-text>
    </v-card>

    <div class="mt-4" style="text-align: center;">网上邻居<br><small>不支持提交友链, 仅仅收录朋友的站点</small></div>

    <v-row class="mt-1">
        <v-col v-for="item in links" cols="6" sm="6" md="3" lg="3">
            <v-card append-icon="mdi-open-in-new" :href="item.url" :subtitle="item.description" target="_blank"
                :title="item.name"></v-card>
        </v-col>
    </v-row>

    <!-- 追番，先鸽了
    <div class="mt-4">
        <Bangumi />
    </div> -->

    <v-card class="mt-4">
        <v-card-title>GitHub Repositories</v-card-title>
        <v-card-text>
            <div v-if="error">
                <p>{{ error }}</p>
            </div>
            <div v-else-if="loading">
                <v-skeleton-loader type="article"></v-skeleton-loader>
            </div>
            <div v-else-if="repos.length > 0">
                <v-timeline align="start" density="compact">
                    <v-timeline-item v-for="repo in repos" :key="repo.id" :dot-color="repo.color" size="x-small">
                        <div class="mb-4">
                            <div class="font-weight-normal">
                                <strong>{{ repo.name }}</strong>
                            </div>
                            <div>{{ repo.description || '暂无描述' }}</div>
                            <div>
                                <a :href="repo.html_url" target="_blank">{{ repo.html_url }}</a>
                            </div>
                            <div style="margin-top: 10px;">
                                <v-chip size="small" class="mr-2" color="teal" prepend-icon="mdi-web">
                                    {{ repo.language || 'Null' }}
                                </v-chip>
                                <v-chip size="small" class="mr-2" color="orange" prepend-icon="mdi-star">
                                    {{ repo.stargazers_count }}
                                </v-chip>
                                <v-chip size="small" class="mr-2" color="primary" prepend-icon="mdi-folder-star">
                                    {{ repo.forks_count }}
                                </v-chip>
                            </div>
                        </div>
                    </v-timeline-item>
                </v-timeline>
            </div>
            <div v-else>
                <p>null</p>
            </div>
        </v-card-text>
    </v-card>
</template>