import * as api from './js/api/index.js';
window.api = api;

window.addEventListener('pageshow', function () {
  setTimeout(() => {
    if (performance.navigation.type === 2) {
      location.reload();
    }
  }, 10);
});

const BASE_URL = "http://172.17.79.7:8080";

// ======================
<<<<<<< HEAD
// 🔥 100%匹配后端：avatar字段 + 正确拼接路径
=======
// 保持登录状态
// ======================
function keepLoginStatus() {
    try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');
        if (user && token) {
            const logDom = document.querySelector('.log');
            if (logDom) logDom.style.display = 'none';
            const avatar = document.getElementById('userAvatar');
            if (avatar) {
                if (user.avatar) {
                    let avatarUrl = user.avatar.replace("/api", "");
                    avatar.src = BASE_URL + avatarUrl;
                } else {
                    avatar.src = './img/default-avatar.png';
                }
                avatar.style.display = 'block';
            }
        }
    } catch (e) { }
}

// ======================
// 登录弹窗
// ======================
window.openModal = function () {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "flex";
}
window.closeModal = function () {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
}

// ======================
// 登录 & 注册
// ======================
window.handleLogin = async function (event) {
    event.preventDefault();
    const msgDiv = document.getElementById("msg");
    const loginBtn = document.getElementById("loginBtn");
    if (!msgDiv || !loginBtn) return;

    const isRegister = document.getElementById("confirmPwdGroup").style.display !== "none";
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let confirmPwd = document.getElementById("confirmPwd");
    if(!username || !password) return;

    username = username.value.trim();
    password = password.value;
    if(confirmPwd) confirmPwd = confirmPwd.value;

    if (password.length < 6 || /[\u4e00-\u9fa5]/.test(password)) {
        msgDiv.style.color = "#E74C3C";
        msgDiv.innerText = "密码至少6位，且不能包含中文！";
        setTimeout(() => msgDiv.innerText = "", 3000);
        loginBtn.disabled = false;
        loginBtn.innerText = isRegister ? "注 册" : "登 录";
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = isRegister ? "注册中..." : "登录中...";
    msgDiv.innerText = "";

    try {
        if (isRegister) {
            if (password !== confirmPwd) {
                msgDiv.style.color = "#E74C3C";
                msgDiv.innerText = "两次密码不一致！";
                setTimeout(() => msgDiv.innerText = "", 3000);
                loginBtn.disabled = false;
                loginBtn.innerText = "注 册";
                return;
            }
            const { register } = await import('./js/api/index.js');
            const res = await register({ username, password, nickname: username });
            if (res.code === 200) {
                msgDiv.style.color = "#27AE60";
                msgDiv.innerText = "✅ 注册成功！请登录";
                setTimeout(() => {
                    toggleMode();
                    loginBtn.disabled = false;
                    loginBtn.innerText = "登 录";
                }, 1000);
            } else {
                msgDiv.style.color = "#E74C3C";
                msgDiv.innerText = res.message || "注册失败";
                loginBtn.disabled = false;
                loginBtn.innerText = "注 册";
            }
            return;
        }

        const res = await login({ username, password });
        if (res.code === 200) {
            msgDiv.style.color = "#27AE60";
            msgDiv.innerText = "✅ 登录成功！";
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo));

            const { getCurrentUserInfo } = await import('./js/api/index.js');
            const userRes = await getCurrentUserInfo();
            localStorage.setItem('userInfo', JSON.stringify(userRes.data));

            keepLoginStatus();
            initUserPanel();

            if (window.loadList && window.loadBackpack) {
                await Promise.all([window.loadList(), window.loadBackpack()]);
            }
            setTimeout(closeModal, 1000);
        } else {
            msgDiv.style.color = "#E74C3C";
            msgDiv.innerText = res.message || "登录失败";
            loginBtn.disabled = false;
            loginBtn.innerText = "登 录";
        }
    } catch (error) {
        msgDiv.style.color = "#E74C3C";
        msgDiv.innerText = "网络错误";
        loginBtn.disabled = false;
        loginBtn.innerText = isRegister ? "注 册" : "登 录";
        console.error(error);
    }
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
>>>>>>> 0448bd7 (修复)
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

<<<<<<< HEAD
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
=======
// ======================
// ✅ 最终修复：头像上传（401 解决 + 后端必收）
// ======================
async function uploadAvatarFix(file) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("请先登录！");
        return null;
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://172.17.79.7:8080/api/user/upload/avatar", {
            method: "POST",
            headers: {
                "token": token
            },
            body: formData
        });

        console.log("【上传】状态码：", res.status);
        if (!res.ok) return null;

        const result = await res.json();
        console.log("【上传】返回：", result);
        return result.code === 200 ? result.data : null;
    } catch (err) {
        console.error("【上传】错误：", err);
        return null;
    }
}

// ======================
// 更新资料
// ======================
async function updateUserProfile(data) {
    try {
        const res = await api.updateProfile(data);
        if (res.code === 200) {
            const user = JSON.parse(localStorage.getItem('userInfo'));
            const newUser = { ...user, ...data };
            localStorage.setItem('userInfo', JSON.stringify(newUser));
            initUserPanel();
        }
    } catch (e) {
        console.error(e);
    }
}

// ======================
// 更换头像
// ======================
async function handleChangeAvatar() {
    const input = document.getElementById('avatarInput');
    if (!input || !input.files || !input.files[0]) return;
    const url = await uploadAvatarFix(input.files[0]);
    if (url) await updateUserProfile({ avatar: url });
}

// ======================
// 修改昵称
// ======================
async function handleEditNickname() {
    const input = document.getElementById('newNickInput');
    if (!input) return;
    const nick = input.value.trim();
    if (nick) {
        await updateUserProfile({ nickname: nick });
        input.value = '';
    }
}

// ======================
// 退出登录
// ======================
window.logout = async function () {
    try { await api.logout(); } catch (e) { }
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    location.reload();
>>>>>>> 0448bd7 (修复)
}

// ======================
// 上传头像（完全匹配后端返回）
// ======================
document.addEventListener('DOMContentLoaded', () => {
  keepLoginStatus();

<<<<<<< HEAD
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarInput = document.getElementById('avatarInput');
=======
    const toggleText = document.getElementById("toggleText");
    if (toggleText) toggleText.onclick = toggleMode;
>>>>>>> 0448bd7 (修复)

  if (changeAvatarBtn && avatarInput) {
    changeAvatarBtn.onclick = () => avatarInput.click();

<<<<<<< HEAD
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
=======
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.onclick = () => avatarInput.click();
    }
    if (avatarInput) avatarInput.onchange = handleChangeAvatar;

    const editNickBtn = document.getElementById('editNickBtn');
    if (editNickBtn) editNickBtn.onclick = handleEditNickname;
});
>>>>>>> 0448bd7 (修复)
