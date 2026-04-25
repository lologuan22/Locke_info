package com.newblash.locke.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.vo.PokemonDetailVO;

public interface PokemonService extends IService<Pokemon> {
    
    /**
     * 获取宠物聚合详情（包含基础、种族值、技能）
     * @param id 宠物ID
     * @return 聚合后的视图对象
     */
    PokemonDetailVO getPokemonDetail(Integer id);
}