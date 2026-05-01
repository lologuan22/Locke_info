export const CONFIG = {
     
    BASE_URL: 'https://boot.ash-xiong.de5.net',
    TIMEOUT: 10000
};

export const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${CONFIG.BASE_URL}${url}`;
};