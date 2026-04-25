package com.newblash.locke.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.newblash.locke.entity.Pokemon;
import com.newblash.locke.entity.PokemonStats;
import com.newblash.locke.entity.Skill;
import com.newblash.locke.mapper.PokemonMapper;
import com.newblash.locke.mapper.PokemonStatsMapper;
import com.newblash.locke.mapper.SkillMapper;
import com.newblash.locke.service.PokemonService;
import com.newblash.locke.vo.PokemonDetailVO;
import com.newblash.locke.vo.SkillVO;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.Arrays;
import java.util.List;

@Service
public class PokemonServiceImpl extends ServiceImpl<PokemonMapper, Pokemon> implements PokemonService {

    // 注入其他表的 Mapper
    @Resource
    private PokemonStatsMapper statsMapper;

    @Resource
    private SkillMapper skillMapper;

    @Override
    public PokemonDetailVO getPokemonDetail(Integer id) {
        // 1. 获取基础信息 (从当前 Service 对应的 pokemon 表)
        Pokemon pokemon = this.getById(id);
        if (pokemon == null) {
            return null; // 或者抛出自定义异常
        }

        // 2. 获取种族值信息 (从 pokemon_stats 表)
        PokemonStats stats = statsMapper.selectById(id);

        // 3. 获取技能列表 (通过关联查询获取该宠物的技能)
        List<SkillVO> skills = skillMapper.getSkillsByPokemonId(id);

        // 4. 组装 VO (View Object)
        PokemonDetailVO vo = new PokemonDetailVO();
        
        // 复制相同名称的基础字段（id, name, type1, height, weight, description, imageUrl）
        BeanUtils.copyProperties(pokemon, vo);

        // 填充雷达图数组 (按原型图顺序：精力, 攻击, 防御, 魔攻, 魔抗, 速度)
        if (stats != null) {
            vo.setRadarData(Arrays.asList(
                stats.getHp(),
                stats.getAtk(),
                stats.getDef(),
                stats.getSpAtk(),
                stats.getSpDef(),
                stats.getSpeed()
            ));
        }

        // 填充技能列表
        vo.setSkills(skills);

        // 填充养成建议 (这部分可以根据宠物类型动态生成，或从数据库读取)
        vo.setSuggestion("建议性格：保守。建议学习光系爆发技能。");

        return vo;
    }
}