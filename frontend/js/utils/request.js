import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm";

import { CONFIG } from "../config.js";

const service = axios.create({
  baseURL: CONFIG.BASE_URL, // 后端地址
  timeout: 10000, // 超时时间
});

// 请求拦截器：自动注入 Token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 假设你存在这里
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：统一处理返回结果
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 这里可以根据后端的 Result 结构进行统一判断
    // 比如：if (res.code !== 200) { alert(res.message); }
    return res;
  },
  (err) => {
    console.group("网络请求异常诊断");
    console.error("错误消息:", err.message);
    console.log("请求地址 (URL):", err.config?.url);
    console.log("请求方法 (Method):", err.config?.method);
    console.log("完整请求头 (Headers):", err.config?.headers);

    if (err.response) {
      console.log("服务器返回状态码:", err.response.status);
      console.log("服务器返回数据:", err.response.data);
    }
    console.groupEnd();
    return Promise.reject(err);
  },
);

export default service;
