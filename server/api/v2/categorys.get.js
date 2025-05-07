export default defineEventHandler(async (event) => {
    const { public: { baseURL } } = useRuntimeConfig()

    try {
        const response = await $fetch('/category', {
            baseURL,
        })

        return response
    } catch (error) {
        console.error('Failed to fetch categorys:', error)
        throw createError({ statusCode: 400, message: 'Failed to fetch categorys' })
    }
})