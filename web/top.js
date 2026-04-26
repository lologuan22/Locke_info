import * as api from './js/api/index.js';
import { login } from './js/api/index.js';

window.addEventListener('pageshow', function () {
    setTimeout(() => {
        if (performance.navigation.type === 2) {
            location.reload();
        }
    }, 10);
});

let currentPage = 1;
const BASE_URL = 'http://172.17.79.7:8080';

// ======================
// 保持登录状态（修复头像刷新丢失）
// ======================
function keepLoginStatus() {
    try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');
        if (user && token) {
            document.querySelector('.log').style.display = 'none';
            const avatar = document.getElementById('userAvatar');
            const savedAvatar = localStorage.getItem('localAvatar');
            const finalAvatar = savedAvatar || user.avatar || './img/default-avatar.png';
            avatar.src = finalAvatar;
            avatar.style.display = 'block';
        }
    } catch (e) { }
}

// ======================
// 登录弹窗控制
// ======================
window.openModal = function () {
    document.getElementById("loginModal").style.display = "flex";
}
window.closeModal = function () {
    document.getElementById("loginModal").style.display = "none";
}

// ======================
// 登录 & 注册逻辑
// ======================
const msgDiv = document.getElementById("msg");
const loginBtn = document.getElementById("loginBtn");

window.handleLogin = async function (event) {
    event.preventDefault();
    const isRegister = document.getElementById("confirmPwdGroup").style.display !== "none";

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    const confirmPwd = document.getElementById("confirmPwd").value;

    if (password.length < 6 || /[\u4e00-\u9fa5]/.test(password)) {
        msgDiv.style.color = "#E74C3C";
        msgDiv.innerText = "密码至少6位，且不能包含中文！";
        setTimeout(() => msgDiv.innerText = "", 3000);
        loginBtn.disabled = false;
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
    }
};

// ======================
// 宠物卡片列表
// ======================
const getBgColor = (type) => {
    const colorMap = {
        '水': '#81A0B3', '火': '#934548', '草': '#6CB799', '翼': '#f8f8d1',
        '电': '#250930', '冰': '#e6f7ff', '武': '#ffead1', '光': '#F4E6BD',
        '土': '#7a4a27', '虫': '#5a5923', '龙': '#da2828', '幽灵': '#703b7e',
        '恶魔': '#48195c','毒': '#8f218f','石':'#502525'
    };
    return colorMap[type] || '#fff';
};

const renderList = (list) => {
    const container = document.getElementById('display-list');
    if (!container) return;
    if (!list || list.length === 0) { container.innerHTML = '<p>暂无数据</p>'; return; }
    container.innerHTML = list.map(item => `
      <div class="card" style="background:${getBgColor(item.type1)}" onclick="showDetail(${item.id})">
        <div class="img-placeholder"><img src="${BASE_URL}${item.imageUrl || ''}" alt="${item.name}"></div>
        <strong>${item.name}</strong>
      </div>
    `).join('');
};

export const loadList = async () => {
    const container = document.getElementById('display-list');
    if (!container) return;

    const params = {
        current: 1, size: 1000,
        name: document.getElementById('nameSearch')?.value.trim() || undefined,
        type: document.getElementById('typeSearch')?.value || undefined,
        sort: 'id', order: 'asc'
    };
    try {
        const res = await api.getPokemonList(params);
        renderList(res.data?.records || []);
    } catch (err) {
        const ctn = document.getElementById('display-list');
        if (ctn) ctn.innerHTML = '<p>请求失败</p>';
    }
};

window.showDetail = (id) => location.href = `details.html?id=${id}`;
window.loadList = loadList;

// ======================
// 切换登录/注册
// ======================
window.toggleMode = function () {
    const group = document.getElementById("confirmPwdGroup");
    const btn = document.getElementById("loginBtn");
    const text = document.getElementById("toggleText");
    const h2 = document.querySelector(".login-form h2");

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

document.getElementById("toggleText").onclick = toggleMode;

// ======================
// 头像面板功能
// ======================
let popup = document.getElementById('avatarPopup');
let avatarImg = document.getElementById('userAvatar');
let popupAvatar = document.getElementById('popupAvatar');
let popupName = document.getElementById('popupName');
let avatarInput = document.getElementById('avatarInput');
let changeAvatarBtn = document.getElementById('changeAvatarBtn');
let logoutBtn = document.getElementById('logoutBtn');

window.toggleAvatarPopup = function () {
    if (popup) popup.classList.toggle('show');
}

document.addEventListener('click', (e) => {
    if (avatarImg && popup && !avatarImg.contains(e.target) && !popup.contains(e.target)) {
        popup.classList.remove('show');
    }
});

// 修复：头像刷新不丢失
function initUserPanel() {
    try {
        let user = JSON.parse(localStorage.getItem('userInfo'));
        if (user && popupName && popupAvatar) {
            popupName.innerText = user.nickname || '用户';
            const savedAvatar = localStorage.getItem('localAvatar');
            popupAvatar.src = savedAvatar || user.avatar || './img/default-avatar.png';
        }
    } catch (e) { }
}

changeAvatarBtn.onclick = () => avatarInput.click();

// 最终版：头像本地上传（永不丢失、不请求后端）
avatarInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const localUrl = URL.createObjectURL(file);
        avatarImg.src = localUrl;
        popupAvatar.src = localUrl;
        localStorage.setItem('localAvatar', localUrl);
        popup.classList.remove('show');
    } catch (err) {
        console.error(err);
    }
};

// ======================
// 退出登录（清理本地头像）
// ======================
logoutBtn.onclick = async () => {
    try {
        const { logout } = await import('./js/api/index.js');
        await logout();
    } catch (e) { }

    localStorage.removeItem("token");
    localStorage.setItem("userInfo", "{}");
    localStorage.removeItem("localAvatar");
    location.reload();
};

// ======================
// 页面加载
// ======================
window.addEventListener('DOMContentLoaded', () => {
    keepLoginStatus();
    initUserPanel();
    loadList();
});

// ======================
// 修改昵称（本地稳定版）
// ======================
const editNickBtn = document.getElementById('editNickBtn');
const newNickInput = document.getElementById('newNickInput');

editNickBtn.onclick = async () => {
    const newNick = newNickInput.value.trim();
    if (!newNick) {
        alert('昵称不能为空');
        return;
    }
    if (newNick.length > 12) {
        alert('昵称不能超过12位');
        return;
    }

    try {
        let user = JSON.parse(localStorage.getItem('userInfo')) || {};
        user.nickname = newNick;
        localStorage.setItem('userInfo', JSON.stringify(user));
        popupName.innerText = newNick;
        newNickInput.value = '';
        alert('昵称修改成功！');
    } catch (err) {
        console.error(err);
    }
};