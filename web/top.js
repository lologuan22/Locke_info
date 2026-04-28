import * as api from './js/api/index.js';
import { login } from './js/api/index.js';

window.addEventListener('pageshow', function () {
    setTimeout(() => {
        if (performance.navigation.type === 2) {
            location.reload();
        }
    }, 10);
});

// ✅ 修复：还原你正确的后端IP（核心！）
const BASE_URL = 'http://172.17.79.7:8080';

// ======================
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
                // ✅ 修复：avatar → avatarUrl
                if (user.avatarUrl) {
                    avatar.src = BASE_URL + user.avatarUrl;
                    avatar.onerror = () => avatar.src = './img/default-avatar.png';
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

    if (password.length < 6 || /[\u4e00-\u9fa5]/i.test(password)) {
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

            console.log("【登录】获取最新用户信息...");

            // ✅ 强制拉取后端最新用户数据（头像一定在这里）
            const { getCurrentUserInfo } = await import('./js/api/index.js');
            const userRes = await getCurrentUserInfo();
            
            if (userRes && userRes.code === 200 && userRes.data) {
                console.log("【登录】后端返回最新用户信息：", userRes.data);
                console.log("【登录】头像路径：", userRes.data.avatarUrl); // ✅ 修复
                localStorage.setItem('userInfo', JSON.stringify(userRes.data));
            } else {
                console.error("【登录】获取用户信息失败！");
            }

            keepLoginStatus();
            initUserPanel();

            if (window.loadList && window.loadList) {
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
// ======================
function initUserPanel() {
    try {
        let user = JSON.parse(localStorage.getItem('userInfo')) || {};
        const popupName = document.getElementById('popupName');
        const avatarImg = document.getElementById('userAvatar');
        const popupAvatar = document.getElementById('popupAvatar');
        if (popupName) popupName.innerText = user.nickname || '用户';

        // ✅ 修复：avatar → avatarUrl
        const fullUrl = user.avatarUrl ? BASE_URL + user.avatarUrl : './img/default-avatar.png';
        
        if (popupAvatar) {
            popupAvatar.src = fullUrl;
            popupAvatar.onerror = () => popupAvatar.src = './img/default-avatar.png';
        }
        if (avatarImg) {
            avatarImg.src = fullUrl;
            avatarImg.onerror = () => avatarImg.src = './img/default-avatar.png';
        }
    } catch (e) { }
}
window.toggleAvatarPopup = function () {
    const popup = document.getElementById('avatarPopup');
    if (popup) popup.classList.toggle('show');
}

// ======================
// 更新资料
// ======================
async function updateUserProfile(data) {
    console.log("【资料更新】开始执行，传入数据：", data);
    try {
        const token = localStorage.getItem('token');
        console.log("【资料更新】当前token：", token);
        
        const res = await api.updateProfile(data);
        console.log("【资料更新】后端完整返回：", res);

        if (res.code === 200) {
            console.log("【资料更新】成功！");
            const user = JSON.parse(localStorage.getItem('userInfo'));
            const newUser = { ...user, ...data };
            localStorage.setItem('userInfo', JSON.stringify(newUser));
            console.log("【资料更新】本地存储已更新，最新userInfo：", newUser);
            initUserPanel();
        } else {
            console.log("【资料更新】后端返回失败：", res.message);
        }
    } catch (e) {
        console.error("【资料更新】捕获异常：", e);
    }
}

// ======================
// 更换头像
// ======================
async function handleChangeAvatar() {
    console.log("=====================================");
    console.log("【头像上传】触发更换头像");
    
    const token = localStorage.getItem("token");
    const input = document.getElementById('avatarInput');

    if (!token) {
        console.log("【头像上传】未登录，终止上传");
        alert("请先登录！");
        input.value = '';
        return;
    }
    if (!input || !input.files || !input.files[0]) {
        console.log("【头像上传】未选择文件，终止");
        return;
    }

    const file = input.files[0];
    console.log("【头像上传】选中文件：", file.name, "大小：", file.size, "类型：", file.type);

    try {
        console.log("【头像上传】开始调用上传接口 api.uploadAvatar");
        const res = await api.uploadAvatar(file);
        console.log("【头像上传】接口返回完整数据：", res);
        console.log("【头像上传】后端返回的头像路径：", res?.data);

        if (res?.code === 200) {
            console.log("【头像上传】上传成功，准备更新用户资料");
            // ✅ 修复：avatar → avatarUrl
            await updateUserProfile({ avatarUrl: res.data });
            console.log("【头像上传】头像已保存到后端 & 本地更新完成");
            alert("头像修改成功！");
        } else {
            console.log("【头像上传】后端返回失败：", res?.message);
            alert(res?.message || "头像上传失败");
        }
    } catch (err) {
        console.error("【头像上传】请求报错：", err);
        alert("头像上传异常，请重试");
    } finally {
        input.value = '';
        console.log("【头像上传】文件输入框已清空");
    }
    console.log("=====================================");
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
}

// ======================
// 页面加载
// ======================
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const { getCurrentUserInfo } = await import('./js/api/index.js');
            const userRes = await getCurrentUserInfo();
            if (userRes.code === 200 && userRes.data) {
                localStorage.setItem('userInfo', JSON.stringify(userRes.data));
                console.log("【页面初始化】已同步后端最新头像：", userRes.data.avatarUrl);
            }
        } catch (e) {
            console.error("【初始化】拉取用户信息失败", e);
        }
    }

    keepLoginStatus();
    initUserPanel();

    const toggleText = document.getElementById("toggleText");
    if (toggleText) toggleText.onclick = toggleMode;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = logout;

    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.onclick = () => avatarInput.click();
    }
    if (avatarInput) avatarInput.onchange = handleChangeAvatar;

    const editNickBtn = document.getElementById('editNickBtn');
    if (editNickBtn) editNickBtn.onclick = handleEditNickname;
});