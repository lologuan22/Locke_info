export const Auth = {
  setToken(token) { localStorage.setItem("token", token); },
  getToken() { return localStorage.getItem("token"); },
  removeToken() { localStorage.removeItem("token"); },
  
  setUser(userInfo) {
    localStorage.setItem("nickname", userInfo.nickname);
    localStorage.setItem("avatarUrl", userInfo.avatarUrl);
  },
  getNickname() { return localStorage.getItem("nickname"); },
  getAvatarUrl() { return localStorage.getItem("avatarUrl"); },
  
  // 清除所有登录信息（用于退出登录）
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    localStorage.removeItem("avatarUrl");
  }
};
