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
    const upload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const fd = new FormData();
        fd.append("file", file);

        // 第一步：上传文件到服务器
        const res = await api.uploadAvatar(fd);
        if (res.code === 200) {
          const newAvatarPath = res.data; // 后端返回的新路径

          // 第二步：将新路径更新到用户信息中
          const updateRes = await api.updateProfile({
            avatarUrl: newAvatarPath,
          });
          if (updateRes.code === 200) {
            // 第三步：通知父组件更新 UI 和缓存
            emit("update", updateRes.data);
            alert("头像更新成功！");
          }
        }
      } catch (err) {
        console.error("头像上传失败:", err);
        alert("头像更新失败，请稍后再试");
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
