import * as api from "./js/api/index.js";
import { AuthService } from "./authService.js";

window.handleLogin = async function (event) {
  event.preventDefault();

  // 1. 获取 DOM 引用
  const msgDiv = document.getElementById("msg");
  const loginBtn = document.getElementById("loginBtn");
  const isRegister =
    document.getElementById("confirmPwdGroup").style.display !== "none";
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPwd = document.getElementById("confirmPwd").value;

  // 2. 基础验证
  if (password.length < 6 || /[\u4e00-\u9fa5]/.test(password)) {
    return showMessage("密码至少6位，且不能包含中文！", "error");
  }

  // 3. 开启 Loading 状态
  setLoading(true, isRegister);

  try {
    if (isRegister) {
      // 注册分支
      if (password !== confirmPwd) throw new Error("两次密码不一致！");
      await AuthService.registerUser(username, password);
      showMessage("✅ 注册成功！请登录", "success");
      setTimeout(() => {
        toggleMode();
        setLoading(false, false);
      }, 1000);
    } else {
      // 登录分支
      await AuthService.loginUser(username, password);
      showMessage("✅ 登录成功！", "success");

      // 刷新页面 UI
      keepLoginStatus();
      initUserPanel();
      setTimeout(window.closeModal, 1000);
    }
  } catch (error) {
    showMessage(error.message, "error");
    setLoading(false, isRegister);
  }
};

// 辅助函数：统一处理消息提示
function showMessage(text, type) {
  const msgDiv = document.getElementById("msg");
  msgDiv.style.color = type === "success" ? "#27AE60" : "#E74C3C";
  msgDiv.innerText = text;
  if (type === "error") setTimeout(() => (msgDiv.innerText = ""), 3000);
}

// 辅助函数：统一处理按钮状态
function setLoading(isLoading, isRegister) {
  const btn = document.getElementById("loginBtn");
  btn.disabled = isLoading;
  if (isLoading) {
    btn.innerText = isRegister ? "注册中..." : "登录中...";
  } else {
    btn.innerText = isRegister ? "注 册" : "登 录";
  }
}

window.addEventListener("pageshow", function () {
  setTimeout(() => {
    if (performance.navigation.type === 2) {
      location.reload();
    }
  }, 10);
});

const BASE_URL = "http://172.17.79.7:8080";

// ======================
// 保持登录状态
// ======================
function keepLoginStatus() {
  try {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    if (user && token) {
      const logDom = document.querySelector(".log");
      if (logDom) logDom.style.display = "none";
      const avatar = document.getElementById("userAvatar");
      if (avatar) {
        if (user.avatar) {
          let avatarUrl = user.avatar.replace("/api", "");
          avatar.src = BASE_URL + avatarUrl;
        } else {
          avatar.src = "./img/default-avatar.png";
        }
        avatar.style.display = "block";
      }
    }
  } catch (e) {}
}

// ======================
// 登录弹窗
// ======================
window.openModal = function () {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "flex";
};
window.closeModal = function () {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
};

// ======================
// 切换登录/注册
// ======================
window.toggleMode = function () {
  const group = document.getElementById("confirmPwdGroup");
  const btn = document.getElementById("loginBtn");
  const text = document.getElementById("toggleText");
  const h2 = document.querySelector(".login-form h2");
  if (!group || !btn || !text || !h2) return;

  if (group.style.display === "none") {
    group.style.display = "block";
    btn.innerText = "注 册";
    h2.innerText = "洛克王国 WIKI 注册";
    text.innerText = "已有账号？返回登录";
  } else {
    group.style.display = "none";
    btn.innerText = "登 录";
    h2.innerText = "洛克王国 WIKI 登录";
    text.innerText = "没有账号？注册新账号";
  }
};

// ======================
// 头像面板
// ======================
function initUserPanel() {
  try {
    let user = JSON.parse(localStorage.getItem("userInfo")) || {};
    const popupName = document.getElementById("popupName");
    const avatarImg = document.getElementById("userAvatar");
    const popupAvatar = document.getElementById("popupAvatar");
    if (popupName) popupName.innerText = user.nickname || "用户";

    const avatarUrl = user.avatar ? user.avatar.replace("/api", "") : "";
    const fullUrl = avatarUrl
      ? BASE_URL + avatarUrl
      : "./img/default-avatar.png";
    if (popupAvatar) popupAvatar.src = fullUrl;
    if (avatarImg) avatarImg.src = fullUrl;
  } catch (e) {}
}

window.toggleAvatarPopup = function () {
  const popup = document.getElementById("avatarPopup");
  if (popup) popup.classList.toggle("show");
};

// ======================
// 退出登录
// ======================
window.logout = async function () {
  try {
    await api.logout();
  } catch (e) {}
  AuthService.clearSession(); // 统一管理
  location.reload();
};

// ======================
// 页面加载
// ======================
document.addEventListener("DOMContentLoaded", () => {
  keepLoginStatus();
  initUserPanel();

  // 安全绑定事件
  const toggleText = document.getElementById("toggleText");
  if (toggleText) toggleText.onclick = toggleMode;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = logout;

  const changeAvatarBtn = document.getElementById("changeAvatarBtn");
  const avatarInput = document.getElementById("avatarInput");
  if (changeAvatarBtn && avatarInput) {
    changeAvatarBtn.onclick = () => avatarInput.click();
  }
});
