// AuthModal.js
import { AuthService } from "./authService.js";

export default {
  props: ['show'],
  emits: ['close', 'success'],
  template: `
    <div class="modal" v-if="show" style="display: flex;">
        <div class="modal-content">
            <span class="close-btn" @click="$emit('close')">&times;</span>
            <form @submit.prevent="handleLoginSubmit" class="login-form">
                <h2>{{ isRegister ? '注册' : '登录' }}</h2>
                <div class="input-group">
                    <label>账号</label>
                    <input type="text" v-model="form.username" required>
                </div>
                <div class="input-group">
                    <label>密码</label>
                    <input type="password" v-model="form.password" required>
                </div>
                <div class="input-group" v-show="isRegister">
                    <label>确认密码</label>
                    <input type="password" v-model="form.confirmPwd">
                </div>
                <button type="submit" :disabled="loading">
                    {{ loading ? '处理中...' : (isRegister ? '注 册' : '登 录') }}
                </button>
                <div :style="{ color: msgType === 'success' ? '#27AE60' : '#E74C3C' }">{{ message }}</div>
                <div class="toggle-text" @click="isRegister = !isRegister">
                    {{ isRegister ? '返回登录' : '注册新账号' }}
                </div>
            </form>
        </div>
    </div>`,
  setup(props, { emit }) {
    const { ref, reactive } = Vue;
    const isRegister = ref(false);
    const loading = ref(false);
    const message = ref("");
    const msgType = ref("");
    const form = reactive({ username: "", password: "", confirmPwd: "" });

    const handleLoginSubmit = async () => {
      loading.value = true;
      try {
        if (isRegister.value) {
          if (form.password !== form.confirmPwd) throw new Error("两次密码不一致！");
          await AuthService.registerUser(form.username, form.password);
          message.value = "注册成功！请登录";
          msgType.value = "success";
          isRegister.value = false;
        } else {
          await AuthService.loginUser(form.username, form.password);
          emit('success');
        }
      } catch (err) {
        message.value = err.message;
        msgType.value = "error";
      } finally {
        loading.value = false;
      }
    };

    return { isRegister, form, loading, message, msgType, handleLoginSubmit };
  }
};