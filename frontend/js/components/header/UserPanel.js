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
              <input 
                type="file" 
                ref="fileInput" 
                style="display:none" 
                accept="image/png, image/jpeg, image/gif, image/webp" 
                @change="upload"
              >
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

    const upload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const allowTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      // 校验类型
      if (!allowTypes.includes(file.type)) {
        alert("请上传图片文件 (jpg, png, gif, webp)");
        e.target.value = "";
        return;
      }

      // 校验大小
      if (file.size > maxSize) {
        alert("图片大小不能超过 2MB");
        e.target.value = "";
        return;
      }

      try {
        const fd = new FormData();
        fd.append("file", file);

        // 2. 只有校验通过了，才调用接口上传
        const res = await api.uploadAvatar(fd);

        if (res.code !== 200) {
          throw new Error(res.message || "服务器文件上传失败");
        }

        const newAvatarPath = res.data;

        // 3. 更新用户信息
        const updateRes = await api.updateProfile({
          avatarUrl: newAvatarPath,
        });

        if (updateRes.code === 200) {
          emit("update", updateRes.data);
          alert("头像更新成功！");
        } else {
          throw new Error(updateRes.message || "用户信息更新失败");
        }
      } catch (err) {
        console.error("头像上传过程出错:", err);
        alert("头像更新失败：" + (err.message || "未知错误"));
      } finally {
        // 无论成功失败，建议清空 input，防止连续选同一个文件不触发 change 事件
        e.target.value = "";
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
