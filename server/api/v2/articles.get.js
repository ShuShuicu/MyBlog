export default defineEventHandler(async (event) => {
    const { public: { baseURL } } = useRuntimeConfig()
    const query = getQuery(event)
    const { page = 1, pageSize = 10 } = query

    try {
        const response = await $fetch('/posts', {
            baseURL,
            params: {
                page,
                pageSize,
            },
        })

        return response
    } catch (error) {
        console.error('Failed to fetch posts:', error)
        throw createError({ statusCode: 400, message: 'Failed to fetch posts' })
    }
})