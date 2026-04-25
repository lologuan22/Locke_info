package com.newblash.locke.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.newblash.locke.entity.Pokemon;

@Mapper
public interface PokemonMapper extends BaseMapper<Pokemon> {
}
