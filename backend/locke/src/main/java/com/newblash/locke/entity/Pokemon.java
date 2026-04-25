package com.newblash.locke.entity;

import lombok.Data;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@TableName("pokemon")
@Schema(description = "宠物基础信息实体")
public class Pokemon {

    @TableId(type = IdType.AUTO)
    @Schema(description = "数据库主键ID", example = "1")
    private Integer id;

    @Schema(description = "宠物图鉴编号", example = "133")
    private Integer number;

    @Schema(description = "宠物名称", example = "迪莫")
    private String name;

    @Schema(description = "主系别/属性", example = "光系")
    private String type1;

    @Schema(description = "身高 (m)", example = "1.5")
    private Double height;

    @Schema(description = "体重 (kg)", example = "26.8")
    private Double weight;

    @Schema(description = "宠物背景描述")
    private String description;

    @Schema(description = "图片相对路径或URL", example = "/api/images/dimo.png")
    private String imageUrl;
}