// header-component.js
import * as api from "../js/api/index.js";
import { AuthService } from "./authService.js";

const BASE_URL = "http://172.17.79.7:8080";

// 辅助函数：处理头像路径
function getFullAvatarUrl(path) {
  if (!path) return "./img/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
// header-component.js 顶部添加
const cssUrl = "./header-styles.css"; // 确保路径指向你真正的 CSS 文件
if (!document.querySelector(`link[href="${cssUrl}"]`)) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
}
const templateContent = await fetch("./header-template.html").then((res) =>
  res.text(),
);

export default {
  template: templateContent,
  setup() {
    const { ref, reactive, onMounted, computed } = Vue;

    // --- 1. 核心响应式状态 ---
    const state = reactive({
      showModal: false,
      showAvatarPopup: false,
      isLoggedIn: false,
      isRegister: false, // 切换登录/注册模式
      loading: false,
      message: "",
      msgType: "", // 'success' | 'error'
      userInfo: {},
      newNickname: "",
    });

    const loginForm = reactive({
      username: "",
      password: "",
      confirmPwd: "",
    });

    // --- 2. 计算属性 ---
    const userAvatarUrl = computed(() => {
      return getFullAvatarUrl(state.userInfo.avatarUrl);
    });

    // --- 3. 核心逻辑方法 ---

    // 初始化：检查登录状态
    const initAuth = () => {
      try {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        const token = localStorage.getItem("token");
        if (user && token) {
          state.isLoggedIn = true;
          state.userInfo = user;
        }
      } catch (e) {
        console.error("初始化登录状态失败", e);
      }
    };

    // 切换登录/注册模式
    const toggleMode = () => {
      state.isRegister = !state.isRegister;
      state.message = "";
      loginForm.password = "";
      loginForm.confirmPwd = "";
    };

    // 处理登录/注册提交
    const handleLoginSubmit = async () => {
      const { username, password, confirmPwd } = loginForm;

      // 基础校验
      if (password.length < 6 || /[\u4e00-\u9fa5]/.test(password)) {
        state.message = "密码至少6位，且不能包含中文！";
        state.msgType = "error";
        return;
      }

      state.loading = true;
      state.message = "";

      try {
        if (state.isRegister) {
          // 注册分支
          if (password !== confirmPwd) throw new Error("两次密码不一致！");
          await AuthService.registerUser(username, password);
          state.message = "✅ 注册成功！请登录";
          state.msgType = "success";
          setTimeout(() => {
            state.isRegister = false;
            state.loading = false;
          }, 1000);
        } else {
          // 登录分支
          await AuthService.loginUser(username, password);
          state.message = "✅ 登录成功！";
          state.msgType = "success";

          // 同步状态
          initAuth();
          setTimeout(() => {
            state.showModal = false;
            state.loading = false;
          }, 1000);
        }
      } catch (error) {
        state.message = error.message;
        state.msgType = "error";
        state.loading = false;
      }
    };

    // 退出登录
    const handleLogout = async () => {
      try {
        await api.logout();
      } catch (e) {
        console.error("退出接口失败", e);
      }
      AuthService.clearSession();
      window.location.reload();
    };

    // 更换头像
    const handleAvatarChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await api.uploadAvatar(formData);
        if (res.code === 200) {
          // 更新本地和状态
          const updatedUser = { ...state.userInfo, avatarUrl: res.data };
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
          state.userInfo = updatedUser;
          alert("头像更新成功！");
        }
      } catch (err) {
        console.error("上传失败", err);
      }
    };

    // 修改昵称 (新增逻辑)
    const handleUpdateNickname = async () => {
      if (!state.newNickname.trim()) return;
      // 这里调用你的 api 接口
      console.log("修改昵称为:", state.newNickname);
      // 成功后更新本地存储
    };

    // --- 4. 生命周期 ---
    onMounted(() => {
      initAuth();
      // 触发旧代码中的 headerLoaded 兼容
      window.dispatchEvent(new Event("headerLoaded"));
    });

    return {
      state,
      loginForm,
      userAvatarUrl,
      toggleMode,
      handleLoginSubmit,
      handleLogout,
      handleAvatarChange,
      handleUpdateNickname,
    };
  },
};
