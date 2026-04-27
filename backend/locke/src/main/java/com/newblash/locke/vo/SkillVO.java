package com.newblash.locke.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "宠物详情页显示的技能信息视图对象")
public class SkillVO {

    @Schema(description = "技能唯一ID", example = "1")
    private Integer id;

    @Schema(description = "技能名称", example = "闪烈剑")
    private String name;

    @Schema(description = "技能属性（如：光系、草系、水系）", example = "光系")
    private String type;

    @Schema(description = "技能分类（物理/变化/魔法）", example = "物理")
    private String category;

    @Schema(description = "技能威力（变化类技能通常为null或0）", example = "40")
    private Integer power;

    @Schema(description = "技能使用次数（PP值）", example = "30")
    private Integer pp;

    @Schema(description = "技能效果详细描述", example = "给对手造成一定伤害")
    private String effect;

    @Schema(description = "在该宠物身上的学习等级", example = "15")
    private Integer requireLevel;
}