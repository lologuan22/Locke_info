import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm';



const service = axios.create({
  baseURL: 'http://172.17.79.7:8080', // 后端地址
  timeout: 10000 // 超时时间
});

// 请求拦截器：自动注入 Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // 假设你存在这里
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器：统一处理返回结果
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 这里可以根据后端的 Result 结构进行统一判断
    // 比如：if (res.code !== 200) { alert(res.message); }
    return res;
  },
  error => {
    console.error('网络请求异常:', error);
    return Promise.reject(error);
  }
);

export default service;