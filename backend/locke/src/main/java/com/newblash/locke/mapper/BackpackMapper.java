package com.newblash.locke.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.entity.UserPokemon;
import org.apache.ibatis.annotations.Param;

/**
 * 背包数据访问层
 */
public interface BackpackMapper extends BaseMapper<UserPokemon> {

    /**
     * 分页查询用户背包中的宠物详细信息
     * 逻辑：通过 user_pokemon 关联全局 pokemon 表
     */
    Page<Pokemon> selectUserPokemonPage(
            Page<Pokemon> page,
            @Param("userId") Integer userId,
            @Param("type") String type);
}