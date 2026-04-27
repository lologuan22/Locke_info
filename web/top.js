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
// 保持登录状态（修复：去掉 /api/ 前缀）
// ======================
function keepLoginStatus() {
    try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');
        if (user && token) {
            document.querySelector('.log').style.display = 'none';
            const avatar = document.getElementById('userAvatar');
            if (user.avatar) {
                let avatarUrl = user.avatar.replace("/api", "");
                avatar.src = BASE_URL + avatarUrl;
            } else {
                avatar.src = './img/default-avatar.png';
            }
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
            await loadList();
            await loadBackpack();

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
// 宠物卡片样式
// ======================
const getBgColor = (type) => {
    const colorMap = {
        '水': '#81A0B3', '火': '#934548', '草': '#6CB799', '翼': '#f8f8d1',
        '电': '#250930', '冰': '#e6f7ff', '武': '#ffead1', '光': '#F4E6BD',
        '土': '#7a4a27', '虫': '#5a5923', '龙': '#da2828', '幽灵': '#703b7e',
        '恶魔': '#48195c', '毒': '#8f218f', '石': '#502525'
    };
    return colorMap[type] || '#fff';
};

// 渲染精灵列表
const renderList = (list, ownedIds = []) => {
    const container = document.getElementById('display-list');
    if (!container) return;
    if (!list || list.length === 0) {
        container.innerHTML = '<p>暂无数据</p>';
        return;
    }

    container.innerHTML = list.map(item => {
        const isOwned = ownedIds.includes(Number(item.id));
        return `
      <div class="card" style="background:${getBgColor(item.type1)}">
        <div class="img-placeholder" onclick="showDetail(${item.id})">
          <img src="${BASE_URL}${item.imageUrl || ''}" alt="${item.name}">
        </div>
        <strong>${item.name}</strong>
        ${!isOwned ? `<div class="add-btn" onclick="addToMyBag(${item.id},event)">+</div>` : ''}
      </div>
    `;
    }).join('');
};

// 渲染背包
export const renderBackpack = (list) => {
    const container = document.getElementById('backpack-list');
    if (!container) return;
    if (!list || list.length === 0) {
        container.innerHTML = '<p>收藏夹里还没有这类精灵</p>';
        return;
    }

    container.innerHTML = list.map(item => `
    <div class="card" style="background:${getBgColor(item.type1)}">
      <div class="img-placeholder" onclick="showDetail(${item.id})">
        <img src="${BASE_URL}${item.imageUrl || ''}" alt="${item.name}">
      </div>
      <strong>${item.name}</strong>
      <div class="del-btn" onclick="removeFromMyBag(${item.id},event)">−</div>
    </div>
  `).join('');
};

// 添加到收藏
window.addToMyBag = async (pokemonId, e) => {
    e.stopPropagation();
    try {
        await api.addToBackpack(pokemonId);
        await Promise.all([loadList(), loadBackpack()]);
    } catch (err) {
        console.error(err);
        alert('操作失败');
    }
};

// 移除出背包
window.removeFromMyBag = async (pokemonId, e) => {
    e.stopPropagation();
    try {
        await api.removeFromBackpack(pokemonId);
        await Promise.all([loadList(), loadBackpack()]);
    } catch (err) {
        console.error(err);
        alert('操作失败');
    }
};

// 加载背包（支持筛选）
export const loadBackpack = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            document.getElementById('backpack-list').innerHTML = '<p>请先登录查看收藏</p>';
            return;
        }

        const name = document.getElementById('backpackNameSearch').value.trim();
        const type = document.getElementById('backpackTypeSearch').value;

        const res = await api.getUserBackpack({ current: 1, size: 100 });
        let list = res.data?.records || [];

        if (name) list = list.filter(item => item.name.includes(name));
        if (type) list = list.filter(item => item.type1 === type);

        renderBackpack(list);
    } catch (err) {
        document.getElementById('backpack-list').innerHTML = '<p>请先登录</p>';
        console.error('加载收藏失败', err);
    }
};
window.loadBackpack = loadBackpack;

// 加载精灵列表
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
        const list = res.data?.records || [];

        let ownedIds = [];
        try {
            if (localStorage.getItem('token')) {
                const backpackRes = await api.getUserBackpack({ current: 1, size: 100 });
                ownedIds = (backpackRes.data?.records || []).map(item => Number(item.id));
            }
        } catch (e) {
            console.log('获取背包失败', e);
        }

        renderList(list, ownedIds);
    } catch (err) {
        console.error('加载列表失败', err);
        container.innerHTML = '<p>请求失败</p>';
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
// 头像面板
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

// 初始化用户面板（修复：去掉 /api/）
function initUserPanel() {
    try {
        let user = JSON.parse(localStorage.getItem('userInfo')) || {};
        popupName.innerText = user.nickname || '用户';
        if (user.avatar) {
            let avatarUrl = user.avatar.replace("/api", "");
            popupAvatar.src = BASE_URL + avatarUrl;
            avatarImg.src = BASE_URL + avatarUrl;
        } else {
            popupAvatar.src = './img/default-avatar.png';
            avatarImg.src = './img/default-avatar.png';
        }
    } catch (e) { }
}

changeAvatarBtn.onclick = () => avatarInput.click();

// ========== 头像上传（修复：去掉 /api/） ==========
avatarInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录！");
        return;
    }

    try {
        // 1. 上传图片，拿到后端返回的地址
        const uploadRes = await api.uploadAvatar(file);
        if (uploadRes.code !== 200) {
            alert("图片上传失败");
            return;
        }
        const avatarPath = uploadRes.data;

        // 2. 关键！调用 updateProfile，把地址存进用户信息
        const updateRes = await api.updateProfile({
            avatar: avatarPath
        });
        if (updateRes.code !== 200) {
            alert("用户信息更新失败");
            return;
        }

        // 3. 重新拉取最新的用户信息（确保本地和数据库一致）
        const userRes = await api.getCurrentUserInfo();
        localStorage.setItem('userInfo', JSON.stringify(userRes.data));

        // 4. 前端显示头像
        const realPath = avatarPath.replace("/api", "");
        const fullUrl = BASE_URL + realPath;
        avatarImg.src = fullUrl;
        popupAvatar.src = fullUrl;

        popup.classList.remove('show');
        alert("✅ 头像上传并保存成功！");

        // 刷新显示
        keepLoginStatus();
        initUserPanel();
    } catch (err) {
        console.error(err);
        alert("上传异常，请重试！");
    }
};

// 退出登录
logoutBtn.onclick = async () => {
    try {
        await api.logout();
    } catch (e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    location.reload();
};

// 页面加载
window.addEventListener('DOMContentLoaded', () => {
    keepLoginStatus();
    initUserPanel();
    loadList();
    loadBackpack();
});

// 修改昵称
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

// 清空收藏
window.clearBackpack = async () => {
    if (!confirm('⚠️ 确定要清空【所有收藏】吗？\n此操作不可恢复！')) return;
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('请先登录！');
            return;
        }
        const res = await api.getUserBackpack({ current: 1, size: 100 });
        const list = res.data?.records || [];
        if (list.length === 0) {
            alert('收藏夹已经是空的啦！');
            return;
        }
        for (let item of list) {
            await api.removeFromBackpack(item.id);
        }
        await Promise.all([loadList(), loadBackpack()]);
        alert('✅ 清空收藏成功！');
    } catch (err) {
        console.error(err);
        alert('❌ 清空失败');
    }
};