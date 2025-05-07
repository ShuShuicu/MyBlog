<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const search = ref('');
const dialog = ref(false); // 用于控制对话框的显示状态

const toggleDrawer = () => {
    drawer.value = !drawer.value;
};

const navItems = [
    { title: 'Home', icon: 'mdi-home', link: '/' },
    { title: 'About', icon: 'mdi-account', link: '/about' },
];

const listItems = [
    { title: 'Home', icon: 'mdi-home', link: '/' },
    { title: 'About', icon: 'mdi-account', link: '/about' },
    { title: 'Search', icon: 'mdi-magnify', link: '/search' },
];

const router = useRouter();

const handleSearch = () => {
    if (search.value) {
        router.push({ path: '/search', query: { keywords: search.value } });
        dialog.value = false; // 关闭对话框
    }
};
</script>

<template>
    <v-app-bar scroll-behavior="hide" app>
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>
            <NuxtLink to="/">鼠子Blog</NuxtLink>
        </v-app-bar-title>
        <template v-slot:append>
            <div class="AppNavItem" v-if="$vuetify.display.mdAndUp">
                    <NuxtLink v-for="item in navItems" :to="item.link" :key="item.title">
                        <v-btn :prepend-icon="item.icon" variant="text" class="text-none">{{ item.title }}</v-btn>
                    </NuxtLink>
            </div>

            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn icon="mdi-magnify" variant="flat" v-bind="activatorProps"></v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                    <v-card prepend-icon="mdi-magnify" title="搜索">
                        <v-card-text>
                            <v-text-field label="请输入关键词" v-model="search" clearable></v-text-field>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn @click="dialog = false">关闭</v-btn>
                            <v-btn color="primary" @click="handleSearch">搜索</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>

            <ThemeSwitcher />

        </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'left' : undefined">
        <v-list nav>
            <NuxtLink v-for="item in listItems" :key="item.title" :title="item.title" :icon="item.icon" :to="item.link">
                <v-list-item :prepend-icon="item.icon" :title="item.title" :value="item.title" />
            </NuxtLink>
        </v-list>
        <template v-slot:append>
            <div class="pa-2" style="text-align: center;">
                {{ new Date().getFullYear() }} — <strong>鼠子Blog</strong>
            </div>
        </template>
    </v-navigation-drawer>
</template>
