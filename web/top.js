import * as api from './js/api/index.js';
window.api = api;

window.addEventListener('pageshow', function () {
  setTimeout(() => {
    if (performance.navigation.type === 2) {
      location.reload();
    }
  }, 10);
});

const BASE_URL = 'http://172.17.79.7:8080';

// ======================
// 🔥 100%匹配后端：avatar字段 + 正确拼接路径
// ======================
function initUserPanel() {
  try {
    let user = JSON.parse(localStorage.getItem('userInfo')) || {};
    console.log("当前用户信息：", user);
    console.log("后端头像字段 avatar：", user.avatar); // 调试日志

    const popupName = document.getElementById('popupName');
    const avatarImg = document.getElementById('userAvatar');
    const popupAvatar = document.getElementById('popupAvatar');

    // 强制显示头像
    if (avatarImg) avatarImg.style.display = "block";
    if (popupAvatar) popupAvatar.style.display = "block";

    // 昵称
    if (popupName) popupName.innerText = user.nickname || '用户';

    // ======================
    // 核心正确逻辑（对照你的后端）
    // 1. 有avatar → BASE_URL + 后端返回的相对路径
    // 2. 无avatar → 本地默认头像（不拼接）
    // ======================
    let fullUrl;
    if (user.avatar) {
      // 后端返回：/api/avatars/xxx.webp → 直接拼接域名
      fullUrl = BASE_URL + user.avatar;
    } else {
      // 无头像：纯本地默认
      fullUrl = './img/default-avatar.png';
    }
    
    console.log("最终头像地址：", fullUrl);

    // 赋值头像
    if (avatarImg) avatarImg.src = fullUrl;
    if (popupAvatar) popupAvatar.src = fullUrl;

  } catch (e) {
    console.error("头像渲染失败", e);
  }
}

// ======================
// 登录状态
// ======================
function keepLoginStatus() {
  try {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const token = localStorage.getItem('token');
    if (user && token) {
      const logDom = document.querySelector('.log');
      if (logDom) logDom.style.display = 'none';
      waitForAvatar(initUserPanel);
    }
  } catch (e) { }
}

window.openModal = function () {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "flex";
}
window.closeModal = function () {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}

// ======================
// 登录逻辑
// ======================
window.handleLogin = async function (event) {
  event.preventDefault();
  const msgDiv = document.getElementById("msg");
  const loginBtn = document.getElementById("loginBtn");
  if (!msgDiv || !loginBtn) return;

  const isRegister = document.getElementById("confirmPwdGroup").style.display !== "none";
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;

  // 修复正则
  if (password.length < 6 || /[\u4e00-\u9fa5]/.test(password)) {
    msgDiv.style.color = "#E74C3C";
    msgDiv.innerText = "密码至少6位，且不能包含中文！";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerText = isRegister ? "注册中..." : "登录中...";

  try {
    if (isRegister) {
      const res = await api.register({ username, password, nickname: username });
      if (res.code === 200) {
        msgDiv.innerText = "✅ 注册成功！请登录";
        toggleMode();
      }
      loginBtn.disabled = false;
      loginBtn.innerText = "注册";
      return;
    }

    const res = await api.login({ username, password });
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token);
      // 获取用户信息（包含avatar字段）
      const userRes = await api.getCurrentUserInfo();
      localStorage.setItem('userInfo', JSON.stringify(userRes.data));

      keepLoginStatus();
      msgDiv.innerText = "✅ 登录成功！";
      
      setTimeout(() => {
        closeModal();
        loadList?.();
        loadBackpack?.();
      }, 800);
    }
  } catch (error) {
    msgDiv.innerText = "登录失败";
    console.error(error);
  }
  loginBtn.disabled = false;
  loginBtn.innerText = "登录";
};

window.toggleMode = function () {
  const g = document.getElementById("confirmPwdGroup");
  g.style.display = g.style.display === "none" ? "block" : "none";
};

window.toggleAvatarPopup = function () {
  const p = document.getElementById('avatarPopup');
  if (p) p.classList.toggle('show');
}

window.logout = async function () {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  location.reload();
}

// 等待头像元素
function waitForAvatar(callback) {
  let timer = setInterval(() => {
    if (document.getElementById('userAvatar')) {
      clearInterval(timer);
      callback();
    }
  }, 50);
}

// ======================
// 上传头像（完全匹配后端返回）
// ======================
document.addEventListener('DOMContentLoaded', () => {
  keepLoginStatus();

  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarInput = document.getElementById('avatarInput');

  if (changeAvatarBtn && avatarInput) {
    changeAvatarBtn.onclick = () => avatarInput.click();

    avatarInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // 后端返回 data: /api/avatars/xxx.webp
        const upRes = await api.uploadAvatar(file);
        const url = upRes.data; 
        
        // 更新资料
        await api.updateProfile({ avatar: url });

        // 本地保存【正确字段 avatar】
        const user = JSON.parse(localStorage.getItem('userInfo')) || {};
        user.avatar = url;
        localStorage.setItem('userInfo', JSON.stringify(user));

        initUserPanel();
        alert("✅ 头像修改成功！");
        avatarInput.value = '';
      } catch (err) {
        console.error("上传失败", err);
        alert("❌ 上传失败");
      }
    };
  }
});