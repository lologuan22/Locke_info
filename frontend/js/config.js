export const CONFIG = {
     
    BASE_URL: 'http://172.18.66.70:8080',
    TIMEOUT: 10000
};

export const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${CONFIG.BASE_URL}${url}`;
};