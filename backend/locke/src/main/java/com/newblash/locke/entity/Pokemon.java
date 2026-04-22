package com.newblash.locke.entity;


import lombok.Data;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@Data
@TableName("pokemons")
public class Pokemon {
    
    /**
     * 宠物ID，自增
     */
    @TableId
    private Integer id;

    /**
     * 宠物编号（如#001）
     */
    private String number;

    /**
     * 宠物名称
     */
    private String name;

    /**
     * 中文名
     */
    private String chineseName;

    /**
     * 主属性
     */
    private String type1;

    /**
     * 副属性
     */
    private String type2;

    /**
     * 是否稀有宠物
     */
    private Boolean isRare;

    /**
     * 是否VIP宠物
     */
    private Boolean isVip;

    /**
     * 是否传说宠物
     */
    private Boolean isLegendary;

    /**
     * 是否天界觉醒宠物
     */
    private Boolean isAwakening;

    /**
     * 是否多元进化宠物
     */
    private Boolean isMultipleEvolution;

    /**
     * 是否王国BOSS
     */
    private Boolean isKingdomBoss;

    /**
     * 精力
     */
    private Integer baseHp;

    /**
     * 攻击
     */
    private Integer baseAttack;

    /**
     * 防御
     */
    private Integer baseDefense;

    /**
     * 魔攻
     */
    private Integer baseSpAttack;

    /**
     * 魔抗
     */
    private Integer baseSpDefense;

    /**
     * 速度
     */
    private Integer baseSpeed;

    /**
     * 宠物图片URL
     */
    private String imageUrl;

    /**
     * 宠物描述
     */
    private String description;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
