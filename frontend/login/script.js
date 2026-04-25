// 路径确保指向你提供的 index.js
import { login } from "../js/api/index.js"; 
import { Auth } from "../js/utils/auth.js";

const msgDiv = document.getElementById("msg");
const btn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

async function handleLogin(event) {
  event.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  btn.disabled = true;
  btn.innerText = "登录中...";
  msgDiv.innerText = "";

  try {
    // 关键：index.js 里的 login 接收的是一个对象 (loginDTO)
    // 之前 400 错误很可能是因为参数格式没对上后端要求的 @RequestBody
    const res = await login({ username, password });

    if (res.code === 200) {
      msgDiv.style.color = "#27AE60";
      msgDiv.innerText = "登录成功，正在跳转...";

      // 存储 Token 和用户信息
      Auth.setToken(res.data.token);
      Auth.setUser(res.data.userInfo);

      setTimeout(() => {
        // 确保跳转路径正确
        window.location.href = "../home/home.html";
      }, 1000);
    } else {
      msgDiv.style.color = "#E74C3C";
      msgDiv.innerText = res.message || "登录失败";
      btn.disabled = false;
      btn.innerText = "登 录";
    }
  } catch (error) {
    console.error("登录异常:", error);
    msgDiv.style.color = "#E74C3C";
    msgDiv.innerText = "网络错误或服务器异常";
    btn.disabled = false;
    btn.innerText = "登 录";
  }
}

// 必须挂载到 window，否则 login.html 的 onsubmit 找不到函数
window.handleLogin = handleLogin;