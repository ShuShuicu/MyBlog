<script setup>
const icons = [
    {
        title: 'GitHub',
        icon: 'mdi-github',
        link: 'https://github.com/ShuShuicu'
    },
    {
        title: 'Bilibili',
        icon: 'mdi-video-box',
        link: 'https://space.bilibili.com/435502585'
    },
]
const icp = `
<a href="https://beian.miit.gov.cn/" target="_blank" rel="external nofollow noopener">
    鲁ICP备2023052135号
</a>
`
</script>

<template>
    <v-footer class="d-flex flex-column mt-auto" height="64px">
        <div class="d-flex w-100 align-center px-4 py-2">
            <strong v-html="icp"></strong>
            <div class="d-flex ga-2 ms-auto">
                <NuxtLink v-for="icon in icons" :key="icon" :to="icon.link" target="_blank">
                    <v-btn :icon="icon.icon" size="small" variant="plain"></v-btn>
                </NuxtLink>
            </div>
        </div>
    </v-footer>
</template>