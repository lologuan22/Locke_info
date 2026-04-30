/**
 * Locke 项目 API 接口模块
 * 基于 Springdoc 和 Knife4j 的后端接口定义
 * @module api/index
 */

import request from '../utils/request.js';

// ==========================================
// 实体类定义 (Entity Definitions)
// ==========================================

/**
 * 通用响应结果实体
 * @template T
 * @typedef {Object} Result
 * @property {number} code - 状态码 (200:成功, 其他:失败)
 * @property {string} message - 提示信息
 * @property {T} data - 响应数据主体
 */

/**
 * 分页数据容器实体
 * @template T
 * @typedef {Object} PageData
 * @property {T[]} records - 记录列表
 * @property {number} total - 总记录数
 * @property {number} size - 每页数量
 * @property {number} current - 当前页码
 */

/**
 * 用户基础信息实体
 * @typedef {Object} User
 * @property {number} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} email - 电子邮箱
 * @property {string} nickname - 昵称
 * @property {string} avatarUrl - 头像URL
 * @property {string} createdAt - 账号创建时间 (ISO Date)
 * @property {number} status - 用户状态: 0-禁用, 1-正常
 */

/**
 * 宠物基础信息实体
 * @typedef {Object} Pokemon
 * @property {number} id - 数据库主键ID
 * @property {number} number - 宠物图鉴编号
 * @property {string} name - 宠物名称
 * @property {string} type1 - 主系别/属性
 * @property {number} height - 身高 (m)
 * @property {number} weight - 体重 (kg)
 * @property {string} description - 宠物背景描述
 * @property {string} imageUrl - 图片相对路径或URL
 */

/**
 * 宠物技能视图实体
 * @typedef {Object} SkillVO
 * @property {number} id - 技能唯一ID
 * @property {string} name - 技能名称
 * @property {string} type - 技能属性 (如: 光系)
 * @property {string} category - 技能分类 (物理/变化/魔法)
 * @property {number} power - 技能威力
 * @property {number} pp - 技能使用次数 (PP值)
 * @property {string} effect - 技能效果描述
 * @property {number} requireLevel - 学习等级
 */

/**
 * 宠物详情视图实体 (聚合信息)
 * @typedef {Object} PokemonDetailVO
 * @property {number} id - 宠物ID
 * @property {number} number - 图鉴编号
 * @property {string} name - 名称
 * @property {string} type1 - 主系别
 * @property {number[]} radarData - 雷达图数值 [精力, 攻击, 防御, 魔攻, 魔抗, 速度]
 * @property {SkillVO[]} skills - 宠物可学习的技能列表
 * @property {string} suggestion - 系统提供的养成/性格建议
 * @property {string} imageUrl - 立绘图片路径
 */

// ==========================================
// 1. 用户认证 (User Authentication)
// ==========================================

/**
 * 用户登录
 * @param {Object} data
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise<Result<{token: string, userInfo: User}>>}
 */
export const login = (data) => {
  return request({ url: '/api/user/login', method: 'post', data });
};

/**
 * 用户注册
 * @param {Object} data
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} [data.email] - 邮箱
 * @param {string} [data.nickname] - 昵称
 * @returns {Promise<Result<string>>}
 */
export const register = (data) => {
  return request({ url: '/api/user/register', method: 'post', data });
};

/**
 * 获取当前用户信息
 * @returns {Promise<Result<User>>}
 */
export const getCurrentUserInfo = () => {
  return request({ url: '/api/user/info', method: 'get' });
};

/**
 * 更新个人资料
 * @param {Partial<User>} data 用户修改的信息
 * @returns {Promise<Result<User>>}
 */
export const updateProfile = (data) => {
  return request({ url: '/api/user/profile', method: 'put', data });
};

/**
 * 上传头像图片
 * @param {FormData} formData 
 * @returns {Promise<Result<string>>} 返回头像URL
 */
export const uploadAvatar = (formData) => {
  return request({
    url: '/api/user/upload/avatar',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// ==========================================
// 2. 宠物精灵管理 (Pokemon Management)
// ==========================================

/**
 * 分页获取宠物列表
 * @param {Object} params
 * @param {number} [params.current] - 页码
 * @param {number} [params.size] - 每页数量
 * @param {string} [params.type] - 属性类型
 * @param {string} [params.name] - 精灵名称
 * @returns {Promise<Result<PageData<Pokemon>>>}
 */
export const getPokemonList = (params) => {
  return request({ url: '/api/pokemons', method: 'get', params });
};

/**
 * 获取宠物聚合详情
 * @param {number} id - 宠物ID
 * @returns {Promise<Result<PokemonDetailVO>>}
 */
export const getPokemonDetail = (id) => {
  return request({ url: `/api/pokemons/${id}`, method: 'get' });
};

// ==========================================
// 3. 用户背包管理 (Backpack Management)
// ==========================================

/**
 * 获取用户背包列表
 * @param {Object} params
 * @param {number} [params.current]
 * @param {number} [params.size]
 * @param {string} [params.type]
 * @returns {Promise<Result<PageData<Pokemon>>>}
 */
export const getUserBackpack = (params) => {
  return request({ url: '/api/backpack', method: 'get', params });
};

/**
 * 添加宠物到背包
 * @param {number} pokemonId 
 * @returns {Promise<Result<string>>}
 */
export const addToBackpack = (pokemonId) => {
  return request({ url: `/api/backpack/${pokemonId}`, method: 'post' });
};

/**
 * 从背包中移除宠物
 * @param {number} pokemonId 
 * @returns {Promise<Result<string>>}
 */
export const removeFromBackpack = (pokemonId) => {
  return request({ url: `/api/backpack/${pokemonId}`, method: 'delete' });
};

/**
 * 检查宠物是否已在背包中
 * @param {number} pokemonId 
 * @returns {Promise<Result<boolean>>}
 */
export const checkIfOwned = (pokemonId) => {
  return request({ url: `/api/backpack/check/${pokemonId}`, method: 'get' });
};

/**
 * 退出登录
 * @returns {Promise<Result<string>>}
 */
export const logout = () => {
  return request({ 
    url: '/api/user/logout', 
    method: 'post' 
  });
};