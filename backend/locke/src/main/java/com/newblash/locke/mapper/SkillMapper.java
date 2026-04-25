package com.newblash.locke.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.newblash.locke.entity.Skill;
import com.newblash.locke.vo.SkillVO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface SkillMapper extends BaseMapper<Skill> {

    /**
     * 根据宠物ID查询其掌握的所有技能
     * 涉及 pokemon_skill_relation 中间表
     */
    List<SkillVO> getSkillsByPokemonId(@Param("pokemonId") Integer pokemonId);
}