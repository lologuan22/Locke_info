import request from "../utils/request.js";

/**
 * @typedef {Object} LoginResult
 * @property {number} [code] - 状态码 (200:成功, 其他:失败)
 * @property {string} [message] - 提示信息
 * @property {Object} [data] - 包含 token 和 userInfo 的键值对
 */

/**
 * @typedef {Object} Pokemon
 * @property {number} [id] - 数据库主键ID
 * @property {number} [number] - 宠物图鉴编号
 * @property {string} [name] - 宠物名称
 * @property {string} [type1] - 主系别/属性
 * @property {string} [imageUrl] - 图片相对路径或URL
 */

/**
 * @typedef {Object} PokemonDetailVO
 * @property {number} [id] - 宠物ID
 * @property {string} [name] - 名称
 * @property {Array<number>} [radarData] - 雷达图数值列表 [精力, 攻击, 防御, 魔攻, 魔抗, 速度]
 * @property {Array<Object>} [skills] - 宠物可学习的技能列表详情
 */

/**
 * 【用户模块】
 */

/**
 * 用户登录
 * @param {Object} loginDTO
 * @param {string} loginDTO.username - 用户名
 * @param {string} loginDTO.password - 密码
 * @returns {Promise<LoginResult>}
 */
export const login = (loginDTO) => request.post("/api/user/login", loginDTO);

/**
 * 用户注册
 * @param {Object} registerDTO
 * @param {string} [registerDTO.username]
 * @param {string} [registerDTO.password]
 * @param {string} [registerDTO.nickname]
 * @returns {Promise<Object>} 返回 ResultString
 */
export const register = (registerDTO) =>
  request.post("/api/user/register", registerDTO);

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 返回 ResultUser
 */
export const getCurrentUserInfo = () => request.get("/api/user/info");

/**
 * 更新用户个人资料
 * * @param {Object} userData - 用户资料数据对象
 * @param {string} [userData.nickname] - 用户昵称
 * @param {string} [userData.bio] - 个人简介
 * @param {number} [userData.gender] - 性别 (例如: 0-保密, 1-男, 2-女)
 * @returns {Promise<Object>} 返回服务器响应结果的 Promise 对象
 */
export const updateProfile = (userData) =>
  request.put("/api/user/profile", userData);

/**
 * 上传用户头像图片
 * * @param {File | Blob} file - 要上传的图片文件对象
 * @returns {Promise<Object>} 返回包含头像 URL 的服务器响应结果
 * @description 该方法会将文件封装在 FormData 中，并使用 multipart/form-data 格式发送
 */
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return request.post("/api/user/upload/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 退出登录
 * @returns {Promise<Object>}
 */
export const logout = () => request.post("/api/user/logout");

/**
 * 【宠物与背包模块】
 */

/**
 * 分页获取宠物列表
 * @param {Object} params
 * @param {number} [params.current=1] - 页码
 * @param {number} [params.size=10] - 每页数量
 * @param {string} [params.type] - 属性类型
 * @param {string} [params.name] - 精灵名称
 * @returns {Promise<Object>} 返回 ResultPagePokemon
 */
export const getPokemonList = (params) =>
  request.get("/api/pokemons", { params });

/**
 * 获取宠物聚合详情
 * @param {number} id - 宠物ID (自增主键)
 * @returns {Promise<PokemonDetailVO>}
 */
export const getPokemonDetail = (id) => request.get(`/api/pokemons/${id}`);

/**
 * 获取用户背包列表
 * @param {Object} params
 * @param {number} [params.current=1]
 * @param {number} [params.size=10]
 * @returns {Promise<Object>} 返回 PokemonPageResult
 */
export const getUserBackpack = (params) =>
  request.get("/api/backpack", { params });

/**
 * 添加宠物到背包
 * @param {number} pokemonId - 宠物唯一ID
 * @returns {Promise<Object>}
 */
export const addToBackpack = (pokemonId) =>
  request.post(`/api/backpack/${pokemonId}`);

/**
 * 检查宠物是否已在背包中
 * @param {number} pokemonId
 * @returns {Promise<boolean>} 返回 ResultBoolean
 */
export const checkIfOwned = (pokemonId) =>
  request.get(`/api/backpack/check/${pokemonId}`);

/**
 * 从背包中移除宠物
 * @param {number} pokemonId
 * @returns {Promise<Object>}
 */
export const removeFromBackpack = (pokemonId) =>
  request.delete(`/api/backpack/${pokemonId}`);

/**
 * 测试接口
 * @returns {Promise<string>}
 */
export const sayHello = () => request.get("/hello");
