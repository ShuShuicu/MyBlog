<script setup>
import { useTheme } from 'vuetify'
import { onMounted, computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue' // 引入 arco-design 的 Message 组件

const theme = useTheme()
const savedTheme = ref(null)

// 延迟到 mounted 阶段再读取 localStorage
onMounted(() => {
    savedTheme.value = localStorage.getItem('app-theme') || 'dark'
    if (savedTheme.value && theme.global.name.value !== savedTheme.value) {
        theme.global.name.value = savedTheme.value
    }
    // 设置 arco-theme 的默认值
    document.body.setAttribute('arco-theme', savedTheme.value)
})

const currentTheme = computed(() => theme.global.name.value)

function toggleTheme() {
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
    theme.global.name.value = newTheme
    // 动态修改 arco-theme
    document.body.setAttribute('arco-theme', newTheme)
    if (process.client) {
        localStorage.setItem('app-theme', newTheme)
    }
    // 触发 arco-design 的提示组件
    Message.success(`已切换为 ${newTheme === 'dark' ? '深色' : '浅色'} 模式`)
}
</script>

<template>
    <v-btn @click="toggleTheme" :icon="currentTheme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'" variant="flat"></v-btn>
</template>