export default defineEventHandler(async (event) => {
    const { public: { baseURL } } = useRuntimeConfig();
    const { keywords } = event.context.params;
    const query = getQuery(event)
    const { page = 1, pageSize = 10 } = query
    try {
        // 从baseURL获取搜索数据
        const response = await $fetch(`/search/${encodeURIComponent(keywords)}`, {
            baseURL,
            params: {
                page,
                pageSize,
            },
        });

        // 将获取的数据原样返回
        return response;

    } catch (error) {
        console.error('搜索失败:', error);
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.message || '搜索服务不可用，请稍后再试'
        });
    }
});