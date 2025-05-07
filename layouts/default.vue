<template>
    <v-layout class="rounded rounded-md">
        <AppBar />
        <v-main class="align-center justify-center">
            <v-container class="container">
                <slot />
            </v-container>
            <AppFooter />
        </v-main>
    </v-layout>
</template>
