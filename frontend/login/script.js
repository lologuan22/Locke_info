import { loginApi } from "../js/api/user.js";
import { Auth } from "../js/utils/auth.js";

// 如果已经登录了，直接踢回主页


function initLoginModule() {
  const msgDiv = document.getElementById("msg");
  const btn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // 抽离按钮状态切换逻辑
  const toggleBtn = (isLoading) => {
    btn.disabled = isLoading;
    btn.innerText = isLoading ? "登录中..." : "登 录";
  };

  // 抽离消息提示逻辑
  const showMsg = (text, color) => {
    msgDiv.style.color = color;
    msgDiv.innerText = text;
  };

  // 核心登录逻辑
  async function handleLogin(event) {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    toggleBtn(true);
    showMsg("", "");

    try {
      const res = await loginApi(username, password);

      if (res.code === 200) {
        showMsg("登录成功，正在跳转...", "#27AE60");

        // 调用封装好的存储方法
        Auth.setToken(res.data.token);
        Auth.setUser(res.data.userInfo);

        const redirect = new URLSearchParams(window.location.search).get(
          "redirect",
        );

        setTimeout(() => {
          globalThis.location.href = redirect
            ? decodeURIComponent(redirect)
            : "../home/home.html";
        }, 1000);
      } else {
        showMsg(res.message, "#E74C3C");
        toggleBtn(false);
      }
    } catch (error) {
      showMsg("网络错误，请检查后端是否启动！", "#E74C3C");
      toggleBtn(false);
    }
  }

  window.handleLogin = handleLogin;
}

initLoginModule();
