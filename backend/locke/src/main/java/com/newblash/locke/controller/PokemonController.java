package com.newblash.locke.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.newblash.locke.common.Result;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.service.PokemonService;
import com.newblash.locke.vo.PokemonDetailVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "宠物精灵管理", description = "提供宝可梦数据的查询与详情获取接口")
@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {

    @Resource
    private PokemonService pokemonService;

    @Operation(summary = "获取宠物列表", description = "支持根据类型过滤和名称模糊搜索，结果按编号升序排列")
    @GetMapping
    public Result<List<Pokemon>> getList(
            @Parameter(description = "属性类型 (如: Fire, Water)", example = "Fire") 
            @RequestParam(required = false) String type,
            
            @Parameter(description = "精灵名称 (模糊搜索)", example = "Pikachu") 
            @RequestParam(required = false) String name) {

        LambdaQueryWrapper<Pokemon> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(name != null, Pokemon::getName, name)
                .eq(type != null, Pokemon::getType1, type)
                .orderByAsc(Pokemon::getNumber);

        List<Pokemon> list = pokemonService.list(wrapper);
        return Result.success(list);
    }

    @Operation(summary = "获取宠物聚合详情", description = "根据数据库ID获取宝可梦的详细属性、技能及进化链信息")
    @GetMapping("/{id}")
    public Result<PokemonDetailVO> getDetail(
            @Parameter(description = "宠物ID (自增主键)", example = "1") 
            @PathVariable Integer id) {
        
        PokemonDetailVO detail = pokemonService.getPokemonDetail(id);

        if (detail == null) {
            return Result.error("未找到该宠物信息");
        }

        return Result.success(detail);
    }
}