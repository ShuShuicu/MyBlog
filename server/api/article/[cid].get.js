export default defineEventHandler(async (event) => {
    const { public: { baseURL } } = useRuntimeConfig();
    
    // 两种获取cid的方式都试试
    const cid = event.context.params?.cid || getRouterParam(event, 'cid');
    
    if (!cid) {
        console.log('Received params:', event.context.params); // 调试日志
        throw createError({ statusCode: 400, message: 'Missing article ID' });
    }

    try {
        const response = await $fetch(`/content/${cid}`, {
            baseURL,
        });

        // 直接返回API内容
        return response;
        
    } catch (error) {
        console.error('API Error:', error);
        if (error.response?.status === 500) {
            throw createError({ statusCode: 500, message: 'Internal Server Error' });
        }
        throw createError({ 
            statusCode: error.response?.status || 400, 
            message: error.message || 'Failed to fetch article' 
        });
    }
});