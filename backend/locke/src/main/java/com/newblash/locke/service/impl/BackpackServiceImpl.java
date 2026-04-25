package com.newblash.locke.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.entity.User;
import com.newblash.locke.entity.UserPokemon;
import com.newblash.locke.mapper.BackpackMapper; 
import com.newblash.locke.service.BackpackService;
import com.newblash.locke.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BackpackServiceImpl extends ServiceImpl<BackpackMapper, UserPokemon> implements BackpackService {

    private final UserService userService;

    public BackpackServiceImpl(BackpackMapper backpackMapper, UserService userService) {
        this.baseMapper = backpackMapper;
        this.userService = userService;
    }

@Override
public Page<Pokemon> getUserPokemonPage(Integer current, Integer size, String type) {
    User currentUser = userService.getCurrentUser();
    Integer userId = currentUser.getId();

    Page<Pokemon> page = new Page<>(current, size);
    String cleanType = org.springframework.util.StringUtils.hasText(type) ? type : null;

    return baseMapper.selectUserPokemonPage(page, userId, cleanType);
}

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addPokemonToUser(Integer pokemonId) {
        User currentUser = userService.getCurrentUser();

        // 检查是否已经拥有
        if (this.isPokemonOwned(pokemonId)) {
            throw new RuntimeException("该宠物已在背包中");
        }

        UserPokemon userPokemon = new UserPokemon();
        userPokemon.setUserId(currentUser.getId());
        userPokemon.setPokemonId(pokemonId);
        userPokemon.setCaughtAt(LocalDateTime.now());

        this.save(userPokemon);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removePokemonFromUser(Integer pokemonId) {
        User currentUser = userService.getCurrentUser();

        LambdaQueryWrapper<UserPokemon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPokemon::getUserId, currentUser.getId())
                .eq(UserPokemon::getPokemonId, pokemonId);

        this.remove(wrapper);
    }

    @Override
    public boolean isPokemonOwned(Integer pokemonId) {
        User currentUser = userService.getCurrentUser();

        LambdaQueryWrapper<UserPokemon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPokemon::getUserId, currentUser.getId())
                .eq(UserPokemon::getPokemonId, pokemonId);
        return this.count(wrapper) > 0;
    }
}