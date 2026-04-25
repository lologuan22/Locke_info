package com.newblash.locke.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@TableName("pokemon_stats")
@Schema(description = "宠物种族值（数值属性）实体，用于生成雷达图")
public class PokemonStats {

    @TableId
    @Schema(description = "关联的宠物ID", example = "1")
    private Integer pokemonId;

    @Schema(description = "精力/生命值 (HP)", example = "100")
    private Integer hp;

    @Schema(description = "物理攻击 (Attack)", example = "80")
    private Integer atk;

    @Schema(description = "物理防御 (Defense)", example = "85")
    private Integer def;

    @Schema(description = "魔法攻击 (Special Attack)", example = "110")
    private Integer spAtk;

    @Schema(description = "魔法防御 (Special Defense)", example = "95")
    private Integer spDef;

    @Schema(description = "速度 (Speed)", example = "120")
    private Integer speed;
}