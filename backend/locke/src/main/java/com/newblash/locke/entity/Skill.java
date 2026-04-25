package com.newblash.locke.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@TableName("skill")
@Schema(description = "宠物技能信息实体")
public class Skill {

    @TableId(type = IdType.AUTO)
    @Schema(description = "技能唯一ID", example = "1")
    private Integer id;

    @Schema(description = "技能名称", example = "闪烈剑")
    private String name;

    @Schema(description = "技能属性（如：光系、草系、水系）", example = "光系")
    private String type;

    @Schema(description = "技能分类（物理/变化/魔法）", example = "物理")
    private String category;

    @Schema(description = "技能威力（变化类技能通常为null或0）", example = "40", nullable = true)
    private Integer power;

    @Schema(description = "技能使用次数（PP值）", example = "30")
    private Integer pp;

    @Schema(description = "技能效果详细描述", example = "给对手造成一定伤害")
    private String effect;
}