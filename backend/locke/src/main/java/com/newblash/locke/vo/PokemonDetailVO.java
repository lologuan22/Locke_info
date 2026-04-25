package com.newblash.locke.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "宠物详情视图对象（聚合基础信息、雷达图和技能）")
public class PokemonDetailVO {

    // --- 基础信息（来自 Pokemon 表） ---

    @Schema(description = "宠物ID", example = "1")
    private Integer id;

    @Schema(description = "图鉴编号", example = "133")
    private Integer number;

    @Schema(description = "名称", example = "迪莫")
    private String name;

    @Schema(description = "主系别", example = "光系")
    private String type1;

    @Schema(description = "身高 (m)", example = "1.5")
    private Double height;

    @Schema(description = "体重 (kg)", example = "26.8")
    private Double weight;

    @Schema(description = "简介描述")
    private String description;

    @Schema(description = "立绘图片路径", example = "/api/images/dimo.png")
    private String imageUrl;

    // --- 属性信息（来自 PokemonStats 表） ---

    @Schema(description = "雷达图数值列表。固定顺序：[精力, 攻击, 防御, 魔攻, 魔抗, 速度]", example = "[100, 80, 85, 110, 95, 120]")
    private List<Integer> radarData;

    // --- 技能列表（来自 Skill 表） ---

    @Schema(description = "宠物可学习的技能列表详情")
    private List<SkillVO> skills;
    // --- 其他显示逻辑 ---

    @Schema(description = "系统提供的养成/性格建议", example = "建议性格：保守。建议学习光系爆发技能。")
    private String suggestion;
}