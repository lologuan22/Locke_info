package com.newblash.locke.service;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.mapper.PokemonMapper;

import jakarta.annotation.Resource;

import java.util.List;

@Service
public class PokemonService {

    @Resource
    private PokemonMapper pokemonMapper;

    // 1. 新增宠物
    public void addPokemon(Pokemon pokemon) {
        // 插入后，pokemon.getId() 会自动被 MP 回填赋值
        pokemonMapper.insert(pokemon);
    }

    // 2. 修改宠物（动态更新）
    public void updatePokemonStats(Pokemon pokemon) {
        // MP 的 updateById 会自动忽略实体类中为 null 的字段！
        // 比如你只想改 baseHp，只要把其他字段设为 null 调用此方法即可
        pokemonMapper.updateById(pokemon);
    }

    // 3. 根据 ID 查询
    public Pokemon getById(Integer id) {
        return pokemonMapper.selectById(id);
    }

    // 4. 查询所有传说宠物 (使用强大的 LambdaQueryWrapper，防字段写错)
    public List<Pokemon> getLegendaries() {
        return pokemonMapper.selectList(
                new LambdaQueryWrapper<Pokemon>()
                        .eq(Pokemon::getIsLegendary, true) // 自动映射为 is_legendary = true
                        .orderByAsc(Pokemon::getNumber) // 按编号升序
        );
    }

    // 5. 查询主属性为"草"，并且不是VIP的宠物
    public List<Pokemon> getGrassNonVip() {
        return pokemonMapper.selectList(
                new LambdaQueryWrapper<Pokemon>()
                        .eq(Pokemon::getType1, "草")
                        .ne(Pokemon::getIsVip, true));
    }

    // 6. 删除宠物
    public void deletePokemon(Integer id) {
        pokemonMapper.deleteById(id);
    }

    public List<Pokemon> getList(LambdaQueryWrapper<Pokemon> wrapper) {
        return pokemonMapper.selectList(wrapper);
    }
}
