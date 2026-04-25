package com.newblash.locke.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.newblash.locke.common.Result;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.service.BackpackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户背包管理", description = "处理用户已拥有的宠物精灵数据，实现用户与全局宠物的关联过滤")
@RestController
@RequestMapping("/api/backpack")
@RequiredArgsConstructor
public class BackpackController {

    private final BackpackService backpackService;

    @Operation(summary = "获取用户背包列表", description = "分页返回当前登录用户拥有的宠物。系统会自动识别当前用户身份并从全局宠物表中过滤出属于该用户的数据。", responses = {
            @ApiResponse(responseCode = "200", description = "查询成功", content = @Content(schema = @Schema(implementation = PokemonPageResult.class)))
    })
    @GetMapping
    public Result<Page<Pokemon>> getUserBackpack(
            @Parameter(description = "页码 (从1开始)", example = "1") @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "每页数量", example = "10") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "属性类型过滤 (如：火系、光系)", example = "光系") @RequestParam(required = false) String type) {

        Page<Pokemon> result = backpackService.getUserPokemonPage(current, size, type);
        return Result.success(result);
    }

    @Operation(summary = "添加宠物到背包", description = "将指定的宠物 ID 绑定到当前登录用户名下。如果宠物已在背包中，将返回错误提示。")
    @PostMapping("/{pokemonId}")
    public Result<String> addToBackpack(
            @Parameter(description = "宠物在基础信息表中的唯一ID", example = "1") @PathVariable Integer pokemonId) {

        backpackService.addPokemonToUser(pokemonId);
        return Result.success("成功加入背包");
    }

    @Operation(summary = "从背包中移除宠物", description = "解除当前用户与该宠物的关联关系（物理删除关联表记录）。")
    @DeleteMapping("/{pokemonId}")
    public Result<String> removeFromBackpack(
            @Parameter(description = "宠物在基础信息表中的唯一ID", example = "1") @PathVariable Integer pokemonId) {

        backpackService.removePokemonFromUser(pokemonId);
        return Result.success("已从背包中移除");
    }

    @Operation(summary = "检查宠物是否已在背包中", description = "判断指定 ID 的宠物是否已经存在于当前用户的背包内。")
    @GetMapping("/check/{pokemonId}")
    public Result<Boolean> checkIfOwned(
            @Parameter(description = "宠物在基础信息表中的唯一ID", example = "1") @PathVariable Integer pokemonId) {

        boolean owned = backpackService.isPokemonOwned(pokemonId);
        return Result.success(owned);
    }

    /**
     * 辅助类：用于 Swagger 文档展示分页嵌套结构
     */
    private static class PokemonPageResult extends Result<Page<Pokemon>> {
    }
}