import request from '@/utils/request';

/**
 * 【用户模块】
 */
// 登录
export const login = (data) => request.post('/api/user/login', data);
// 注册
export const register = (data) => request.post('/api/user/register', data);
// 退出登录
export const logout = () => request.post('/api/user/logout');
// 获取当前用户信息
export const getCurrentUserInfo = () => request.get('/api/user/info');

/**
 * 【宠物模块】
 */
// 分页获取宠物列表
export const getPokemonList = (params) => request.get('/api/pokemons', { params });
// 获取宠物聚合详情
export const getPokemonDetail = (id) => request.get(`/api/pokemons/${id}`);

/**
 * 【背包模块】
 */
// 获取用户背包列表
export const getUserBackpack = () => request.get('/api/backpack');
// 添加宠物到背包
export const addToBackpack = (pokemonId) => request.post(`/api/backpack/${pokemonId}`);
// 检查宠物是否已在背包中
export const checkIfOwned = (pokemonId) => request.get(`/api/backpack/check/${pokemonId}`);
// 从背包中移除宠物
export const removeFromBackpack = (pokemonId) => request.delete(`/api/backpack/${pokemonId}`);

/**
 * 【测试模块】
 */
export const sayHello = () => request.get('/hello');