import request from '@/utils/request';

/**
 * @typedef {Object} SkillVO - 宠物技能详情
 * @property {number} [id]
 * @property {string} [name] - 技能名称
 * @property {string} [type] - 技能属性/系别
 * @property {number} [power] - 威力
 * @property {string} [effect] - 技能效果描述
 * @property {number} [requireLevel] - 在该宠物身上的学习等级
 */

/**
 * @typedef {Object} PokemonDetailVO - 宠物聚合详情
 * @property {number} [id] - 宠物ID
 * @property {number} [number] - 图鉴编号
 * @property {string} [name] - 名称
 * @property {string} [type1] - 主系别
 * @property {number} [height] - 身高 (m)
 * @property {number} [weight] - 体重 (kg)
 * @property {string} [description] - 简介描述
 * @property {string} [imageUrl] - 立绘图片路径
 * @property {Array<number>} [radarData] - 雷达图数值列表 [精力, 攻击, 防御, 魔攻, 魔抗, 速度]
 * @property {Array<SkillVO>} [skills] - 宠物可学习的技能列表详情
 * @property {string} [suggestion] - 系统提供的养成/性格建议
 */

/**
 * @typedef {Object} User - 用户基础信息
 * @property {number} [id]
 * @property {string} [username]
 */

/**
 * @typedef {Object} LoginResult - 登录结果
 * @property {number} [code] - 状态码 (200:成功, 其他:失败)
 * @property {string} [message] - 提示信息
 * @property {Object} [data] - 包含 token 和 userInfo 的键值对
 */

/** * ==========================================
 * 用户管理接口
 * ==========================================
 */

/**
 * 用户登录
 * @param {Object} loginDTO
 * @param {string} loginDTO.username - 用户名
 * @param {string} loginDTO.password - 密码
 * @returns {Promise<LoginResult>}
 */
export const login = (loginDTO) => request.post('/api/user/login', loginDTO);

/**
 * 用户注册
 * @param {Object} registerDTO
 * @param {string} [registerDTO.username] - 用户名
 * @param {string} [registerDTO.password] - 密码
 * @param {string} [registerDTO.email] - 邮箱
 * @param {string} [registerDTO.nickname] - 昵称
 * @returns {Promise<Object>} 返回 ResultString
 */
export const register = (registerDTO) => request.post('/api/user/register', registerDTO);

/**
 * 获取当前用户信息
 * @returns {Promise<{code: number, message: string, data: User}>} 返回 ResultUser
 */
export const getCurrentUserInfo = () => request.get('/api/user/info');

/**
 * 退出登录
 * @returns {Promise<Object>}
 */
export const logout = () => request.post('/api/user/logout');

/** * ==========================================
 * 宠物与背包接口
 * ==========================================
 */

/**
 * 分页获取宠物列表
 * @param {Object} params
 * @param {number} [params.current=1] - 页码 (从1开始)
 * @param {number} [params.size=10] - 每页数量
 * @param {string} [params.type] - 属性类型过滤
 * @param {string} [params.name] - 精灵名称搜索
 * @returns {Promise<Object>} 返回 ResultPagePokemon
 */
export const getPokemonList = (params) => request.get('/api/pokemons', { params });

/**
 * 获取宠物聚合详情 (含技能和进化链)
 * @param {number} id - 宠物ID (自增主键)
 * @returns {Promise<PokemonDetailVO>}
 */
export const getPokemonDetail = (id) => request.get(`/api/pokemons/${id}`);

/**
 * 获取当前用户背包列表
 * @param {Object} [params]
 * @param {number} [params.current=1]
 * @param {number} [params.size=10]
 * @param {string} [params.type] - 属性类型过滤
 * @returns {Promise<Object>} 返回 PokemonPageResult
 */
export const getUserBackpack = (params) => request.get('/api/backpack', { params });

/**
 * 添加宠物到背包
 * @param {number} pokemonId - 宠物唯一ID
 */
export const addToBackpack = (pokemonId) => request.post(`/api/backpack/${pokemonId}`);

/**
 * 检查宠物是否已在背包中
 * @param {number} pokemonId
 * @returns {Promise<{code: number, data: boolean}>} 返回 ResultBoolean
 */
export const checkIfOwned = (pokemonId) => request.get(`/api/backpack/check/${pokemonId}`);

/**
 * 从背包中移除宠物
 * @param {number} pokemonId
 */
export const removeFromBackpack = (pokemonId) => request.delete(`/api/backpack/${pokemonId}`);

/**
 * 测试接口
 * @returns {Promise<string>}
 */
export const sayHello = () => request.get('/hello');