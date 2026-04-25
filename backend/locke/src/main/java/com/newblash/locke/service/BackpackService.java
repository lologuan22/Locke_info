package com.newblash.locke.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.entity.UserPokemon; // 建议创建此关联实体

/**
 * 背包业务接口
 * 核心逻辑：基于当前登录用户 ID，对全局 Pokemon 数据进行过滤查询
 */
public interface BackpackService extends IService<UserPokemon> {

    /**
     * 分页查询当前用户的背包宠物
     * * @param current 当前页码
     * @param size    每页条数
     * @param type    宠物属性过滤（可选）
     * @return 包含宠物基础信息的分页结果
     */
    Page<Pokemon> getUserPokemonPage(Integer current, Integer size, String type);

    /**
     * 将宠物加入用户背包
     * * @param pokemonId 宠物ID
     */
    void addPokemonToUser(Integer pokemonId);

    /**
     * 将宠物从背包移除
     * * @param pokemonId 宠物ID
     */
    void removePokemonFromUser(Integer pokemonId);

    /**
     * 检查当前用户是否拥有该宠物
     * * @param pokemonId 宠物ID
     * @return 是否拥有
     */
    boolean isPokemonOwned(Integer pokemonId);
}