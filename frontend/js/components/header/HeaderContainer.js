import AuthModal from "./AuthModal.js";
import UserPanel from "./UserPanel.js";

const BASE_URL = "http://172.17.79.7:8080";

export default {
  components: { AuthModal, UserPanel },
  template: `
    <div class="hud">
        <AuthModal :show="showModal" @close="showModal = false" @success="handleAuthSuccess" />
        <div class="top">
            <div class="topp">
                <a href="./home.html"><img src="./img/imglogo.png" class="logo" width="60%"></a>
                
                <a v-if="!isLoggedIn" class="log" @click="showModal = true">登录/注册</a>
                <UserPanel v-else :userInfo="userInfo" :avatarUrl="userAvatarUrl" @update="onUserUpdate" />
            </div>
        </div>
    </div>`,
  setup() {
    const { ref, reactive, computed, onMounted } = Vue;
    const showModal = ref(false);
    const isLoggedIn = ref(false);
    const userInfo = ref({});

    const userAvatarUrl = computed(() => {
      const path = userInfo.value.avatarUrl;
      if (!path) console.warn("用户信息中缺少 avatarUrl 字段");
      return path.startsWith("http") ? path : `${BASE_URL}/${path.replace(/^\//, '')}`;
    });

    const initAuth = () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (user && localStorage.getItem("token")) {
        isLoggedIn.value = true;
        userInfo.value = user;
      }
    };

    const handleAuthSuccess = () => {
      initAuth();
      showModal.value = false;
    };

    const onUserUpdate = (newInfo) => {
      userInfo.value = newInfo;
      localStorage.setItem("userInfo", JSON.stringify(newInfo));
    };

    onMounted(initAuth);

    return { showModal, isLoggedIn, userInfo, userAvatarUrl, handleAuthSuccess, onUserUpdate };
  }
};