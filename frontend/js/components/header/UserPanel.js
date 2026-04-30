// UserPanel.js
import * as api from "../../api/index.js";
import { AuthService } from "./authService.js";

export default {
  props: ["userInfo", "avatarUrl"],
  emits: ["update"],
  template: `
    <div class="user-area" ref="panelRef">
        <img :src="avatarUrl" class="user-avatar" @click="showPopup = !showPopup">
        <div class="avatar-popup" :class="{ 'show': showPopup }">
            <div class="user-info">
                <img class="avatar-big" :src="avatarUrl">
                <div class="username">{{ userInfo.nickname || userInfo.username }}</div>
            </div>
            <div class="nickname-edit-wrap">
                <input type="text" v-model="newNickname" :placeholder="userInfo.nickname || '设置新昵称'">
                <button @click="updateNick">保存</button>
            </div>
            <input type="file" ref="fileInput" style="display:none" @change="upload">
            <button class="btn btn-change" @click="$refs.fileInput.click()">更换头像</button>
            <button class="btn btn-logout" @click="logout">退出登录</button>
        </div>
    </div>`,
  setup(props, { emit }) {
    const { ref, onMounted, onUnmounted } = Vue; // 引入生命周期钩子
    const showPopup = ref(false);
    const panelRef = ref(null); // 定义根元素的引用
    const newNickname = ref("");

    // 切换弹窗显示/隐藏
    const togglePopup = () => {
      showPopup.value = !showPopup.value;
    };

    const handleClickOutside = (event) => {
      // 如果点击的目标不在 panelRef 包含的范围内，则关闭弹窗
      if (panelRef.value && !panelRef.value.contains(event.target)) {
        showPopup.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    // 1. 更新头像逻辑
    // UserPanel.js 内部的 upload 函数优化
    const upload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const fd = new FormData();
        fd.append("file", file);

        // 1. 上传文件
        const res = await api.uploadAvatar(fd);

        // 业务错误拦截：如果后端返回 code 不是 200
        if (res.code !== 200) {
          throw new Error(res.message || "服务器文件上传失败");
        }

        const newAvatarPath = res.data;

        // 2. 更新用户信息
        const updateRes = await api.updateProfile({
          avatarUrl: newAvatarPath,
        });

        if (updateRes.code === 200) {
          // 成功提示
          emit("update", updateRes.data);
          alert("头像更新成功！");
        } else {
          // 这里的 else 也要处理：虽然请求通了，但业务逻辑没成功
          throw new Error(updateRes.message || "用户信息更新失败");
        }
      } catch (err) {
        // 3. 失败提示：统一捕获所有错误（网络错误、404、500、业务 Throw 的 Error）
        console.error("头像上传过程出错:", err);
        alert("头像更新失败：" + (err.message || "未知错误"));
      }
    };

    // 2. 更新昵称逻辑
    const updateNick = async () => {
      if (!newNickname.value.trim()) {
        alert("请输入新昵称");
        return;
      }

      try {
        const res = await api.updateProfile({ nickname: newNickname.value });
        if (res.code === 200) {
          emit("update", res.data);
          newNickname.value = ""; // 清空输入框
          alert("昵称修改成功！");
        } else {
          alert(res.message || "修改失败");
        }
      } catch (err) {
        console.error("更新昵称出错:", err);
        alert("网络请求失败");
      }
    };

    const logout = () => {
      AuthService.clearSession();
      window.location.reload();
    };

    return { panelRef, showPopup, newNickname, upload, updateNick, logout };
  },
};
