import * as api from "./js/api/index.js";

export const AuthService = {
  // 基础配置
  BASE_URL: "http://172.17.79.7:8080",

  // 保存登录数据
  saveSession(token, userInfo) {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  },

  // 清除登录数据
  clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  },

  // 核心注册逻辑
  async registerUser(username, password) {
    const res = await api.register({ username, password, nickname: username });
    if (res.code !== 200) throw new Error(res.message || "注册失败");
    return res;
  },

  // 核心登录逻辑
  async loginUser(username, password) {
    const res = await api.login({ username, password });
    if (res.code === 200) {
      const token = res.data.token;
      // 先存 Token，保证后续请求拦截器能拿到
      localStorage.setItem("token", token);

      // 再去获取用户信息
      const userRes = await api.getCurrentUserInfo();

      // 最后保存完整 Session（包含用户信息）
      this.saveSession(token, userRes.data);
      return userRes.data;
    } else {
      throw new Error(res.message || "登录失败");
    }
  },
};
