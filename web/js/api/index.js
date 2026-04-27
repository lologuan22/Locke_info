import request from "../utils/request.js";

/**
 * 【用户核心模块】
 */

// 用户登录
export const login = (loginDTO) => request.post("/api/user/login", loginDTO);

// 用户注册
export const register = (registerDTO) => request.post("/api/user/register", registerDTO);

// 获取当前用户信息 (用于初始化界面)
export const getCurrentUserInfo = () => {
    const token = localStorage.getItem('token');
    return request.get("/api/user/info", {
        headers: { token }
    });
};

/**
 * 更新用户个人资料
 * @param {Object} userData - 包含 nickname, avatar, bio 等字段
 * @description 这个接口非常重要，上传完图片获取到 URL 后，必须调用此接口存入数据库
 */
export const updateProfile = (userData) => {
    const token = localStorage.getItem('token');
    return request.put("/api/user/profile", userData, {
        headers: { token }
    });
};

/**
 * 上传用户头像文件
 * @param {File} file - 原生文件对象
 * @returns {Promise} data 字段通常返回图片在服务器上的 URL 相对路径
 */
// 上传用户头像图片（携带token，后端识别用户）
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem('token');
  return request.post("/api/user/upload/avatar", formData, {
    headers: {
      token
    }
  });
};

// 退出登录
export const logout = () => {
    const token = localStorage.getItem('token');
    return request.post("/api/user/logout", {}, {
        headers: { token }
    });
};


/**
 * 【精灵图鉴模块】
 */

// 分页获取宠物列表 (支持名称和属性筛选)
export const getPokemonList = (params) => request.get("/api/pokemons", { params });

// 获取单个宠物详情
export const getPokemonDetail = (id) => request.get(`/api/pokemons/${id}`);


/**
 * 【背包/收藏模块】
 */

// 获取当前用户的背包列表
export const getUserBackpack = (params) => {
    const token = localStorage.getItem('token');
    return request.get("/api/backpack", {
        params,
        headers: { token }
    });
};

// 添加精灵到背包
export const addToBackpack = (pokemonId) => {
    const token = localStorage.getItem('token');
    return request.post(`/api/backpack/${pokemonId}`, {}, {
        headers: { token }
    });
};

// 从背包移除精灵
export const removeFromBackpack = (pokemonId) => {
    const token = localStorage.getItem('token');
    return request.delete(`/api/backpack/${pokemonId}`, {
        headers: { token }
    });
};

// 检查精灵是否已在背包
export const checkIfOwned = (pokemonId) => {
    const token = localStorage.getItem('token');
    return request.get(`/api/backpack/check/${pokemonId}`, {
        headers: { token }
    });
};

/**
 * 测试接口
 */
export const sayHello = () => request.get("/hello");