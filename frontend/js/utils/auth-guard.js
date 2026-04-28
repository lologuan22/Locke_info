/**
 * 页面鉴权守卫 - 未登录自动跳转登录页
 */
import { Auth } from './auth.js';

const LOGIN_PAGE = '../login/login.html';

if (!Auth.getToken()) {
  // 未登录，携带当前路径跳转（便于登录后回跳）
  const currentPath = encodeURIComponent(globalThis.location.href);
  globalThis.location.replace(`${LOGIN_PAGE}?redirect=${currentPath}`);
}
