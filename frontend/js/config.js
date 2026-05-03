export const CONFIG = {
     
    // BASE_URL: 'https://project.ash-xiong.de5.net',
    // BASE_URL: 'http://localhost:8080',
    BASE_URL: '',
    TIMEOUT: 10000
};

export const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${CONFIG.BASE_URL}${url}`;
};