package com.newblash.locke.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.newblash.locke.entity.PokemonStats;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PokemonStatsMapper extends BaseMapper<PokemonStats> {
    // 这里的 ID 与 Pokemon 的 ID 是一一对应的，可以直接 selectById
}