export const CONFIG = {
     
    BASE_URL: 'http://5150df83.r25.cpolar.top',
    TIMEOUT: 10000
};

export const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${CONFIG.BASE_URL}${url}`;
};