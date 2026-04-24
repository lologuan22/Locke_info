package com.newblash.locke.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_pokemon")
@Schema(description = "用户背包关联实体", title = "用户宠物关联")
public class UserPokemon {
    
    @TableId(type = IdType.AUTO)
    @Schema(description = "关联表主键ID", example = "1")
    private Integer id;

    @Schema(description = "用户唯一标识ID", example = "1001")
    private Integer userId; 
    
    @Schema(description = "关联的宠物ID", example = "133")
    private Integer pokemonId;

    @Schema(description = "宠物获得/捕获时间", example = "2024-05-20 13:14:00")
    private LocalDateTime caughtAt;
}