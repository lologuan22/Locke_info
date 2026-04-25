package com.newblash.locke.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "宠物详情页显示的技能信息")
public class SkillVO {
    private Integer id;
    private String name;
    private String type;
    private Integer power;
    private String effect;

    @Schema(description = "在该宠物身上的学习等级")
    private Integer requireLevel;
}