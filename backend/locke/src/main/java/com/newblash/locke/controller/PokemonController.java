package com.newblash.locke.controller;

import org.springframework.web.bind.annotation.*;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.service.PokemonService;

import jakarta.annotation.Resource;

import java.util.List;

@RestController
@RequestMapping("/api/pokemons") // 统一路由前缀
public class PokemonController {

    @Resource   
    private PokemonService pokemonService;

    /**
     * 1. 获取宠物列表（支持条件过滤）
     * GET /api/pokemons?type1=草&isLegendary=true
     */
    @GetMapping
    public List<Pokemon> getList(
            @RequestParam(required = false) String type1,
            @RequestParam(required = false) Boolean isLegendary,
            @RequestParam(required = false) Boolean isRare) {

        // 使用 MP 的链式查询构造器
        LambdaQueryWrapper<Pokemon> wrapper = new LambdaQueryWrapper<>();
        
        // 如果前端传了 type1 参数，就加上条件；没传就不加（查全部）
        wrapper.eq(type1 != null && !type1.isEmpty(), Pokemon::getType1, type1)
               .eq(isLegendary != null, Pokemon::getIsLegendary, isLegendary)
               .eq(isRare != null, Pokemon::getIsRare, isRare)
               .orderByAsc(Pokemon::getNumber); // 默认按编号排序

        return pokemonService.getList(wrapper);
    }

    /**
     * 2. 根据 ID 获取单个宠物详情
     * GET /api/pokemons/1
     */
    @GetMapping("/{id}")
    public Pokemon getById(@PathVariable Integer id) {
        return pokemonService.getById(id);
    }

    /**
     * 3. 新增宠物
     * POST /api/pokemons
     * 使用 @RequestBody 接收前端传来的 JSON 数据
     */
    @PostMapping
    public String add(@RequestBody Pokemon pokemon) {
        pokemonService.addPokemon(pokemon);
        // 插入成功后，MP会自动将自增ID回填到 pokemon 对象中
        return "新增成功，宠物ID为: " + pokemon.getId(); 
    }

    /**
     * 4. 修改宠物信息（动态更新）
     * PUT /api/pokemons/1
     * 前端传什么字段，就只更新什么字段（MP自动忽略null）
     */
    @PutMapping("/{id}")
    public String update(@PathVariable Integer id, @RequestBody Pokemon pokemon) {
        // 防止前端恶意修改ID，强制设置路径上的ID
        pokemon.setId(id); 
        pokemonService.updatePokemonStats(pokemon);
        return "更新成功";
    }

    /**
     * 5. 删除宠物
     * DELETE /api/pokemons/1
     */
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        pokemonService.deletePokemon(id);
        return "删除成功";
    }
}
