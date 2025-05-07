export default defineEventHandler(async (event) => {
    const { public: { baseURL } } = useRuntimeConfig();
    const query = getQuery(event);
    const { page = 1, pageSize = 10, filterType = 'category', filterSlug, showDigest = 'excerpt', limit = 200 } = query;

    try {
        const response = await $fetch('/posts', {
            baseURL,
            params: {
                page,
                pageSize,
                filterType,
                filterSlug,
                showDigest,
                limit,
            },
        });

        if (response.status === 'success') {
            return {
                currentPage: response.data.page,
                totalPages: response.data.pages,
                totalItems: response.data.count,
                itemsPerPage: response.data.pageSize,
                articles: response.data.dataSet.map((post) => ({
                    ...post,
                    digest: post.digest.replace(/<[^>]+>/g, '').substring(0, 150),
                    formattedDate: `${post.date.year}-${post.date.month}-${post.date.day}`
                }))
            };
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch category posts:', error);
        throw createError({ statusCode: 500, message: 'Failed to fetch category posts' });
    }
});