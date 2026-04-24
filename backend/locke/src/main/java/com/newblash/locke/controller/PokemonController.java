package com.newblash.locke.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.newblash.locke.common.Result;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.service.PokemonService;
import com.newblash.locke.vo.PokemonDetailVO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@Tag(name = "宠物精灵管理", description = "提供宝可梦数据的查询与详情获取接口")
@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {

    @Resource
    private PokemonService pokemonService;

    @Operation(summary = "分页获取宠物列表", description = "支持按页码、名称和类型筛选，结果包含总记录数、当前页等分页信息")
    @GetMapping
    public Result<Page<Pokemon>> getListPage(
            @Parameter(description = "页码 (从1开始)", example = "1") @RequestParam(defaultValue = "1") Integer current,

            @Parameter(description = "每页数量", example = "10") @RequestParam(defaultValue = "10") Integer size,

            @Parameter(description = "属性类型", example = "Fire") @RequestParam(required = false) String type,

            @Parameter(description = "精灵名称", example = "皮卡丘") @RequestParam(required = false) String name) {

        // 1. 构造分页参数对象
        Page<Pokemon> pageParam = new Page<>(current, size);

        // 2. 构造查询条件
        LambdaQueryWrapper<Pokemon> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(name != null, Pokemon::getName, name) 
                .eq(type != null, Pokemon::getType1, type) 
                .orderByAsc(Pokemon::getNumber); 

        // 3. 执行分页查询
        Page<Pokemon> resultPage = pokemonService.page(pageParam, wrapper);

        return Result.success(resultPage);
    }

    @Operation(summary = "获取宠物聚合详情", description = "根据数据库ID获取宝可梦的详细属性、技能及进化链信息")
    @GetMapping("/{id}")
    public Result<PokemonDetailVO> getDetail(
            @Parameter(description = "宠物ID (自增主键)", example = "1") @PathVariable Integer id) {

        PokemonDetailVO detail = pokemonService.getPokemonDetail(id);

        if (detail == null) {
            return Result.error("未找到该宠物信息");
        }

        return Result.success(detail);
    }
}