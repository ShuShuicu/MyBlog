import { defineNuxtPlugin } from '#app'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

export default defineNuxtPlugin((app) => {
    app.vueApp.use(ArcoVue)
})