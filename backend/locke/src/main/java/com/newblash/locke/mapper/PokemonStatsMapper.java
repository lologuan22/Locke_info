package com.newblash.locke.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.newblash.locke.entity.PokemonStats;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PokemonStatsMapper extends BaseMapper<PokemonStats> {
}