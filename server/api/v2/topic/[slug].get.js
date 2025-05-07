export default defineEventHandler(async (event) => {
    const { public: { baseURL } } = useRuntimeConfig();
    const { slug } = event.context.params;

    try {
        const response = await $fetch(`/category/${slug}`, {
            baseURL,
        });

        if (response.code === 200) {
            return {
                code: 200,
                data: response.data, // 确保返回的数据包含 code 和 data
            };
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch category:', error);
        throw createError({ statusCode: 500, message: 'Failed to fetch category' });
    }
});