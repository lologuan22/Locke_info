package com.newblash.locke.entity;

import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@TableName("users")
@Schema(description = "用户信息实体")
public class User {

    @Schema(description = "用户ID", example = "1")
    private Integer id;

    @Schema(description = "用户名", example = "admin")
    private String username;

    @Schema(description = "密码 (加密存储)", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;

    @Schema(description = "电子邮箱", example = "example@domain.com")
    private String email;

    @Schema(description = "昵称", example = "洛克")
    private String nickname;

    @Schema(description = "头像URL", example = "/images/avatar/default.png")
    private String avatarUrl;

    @Schema(description = "账号创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "信息更新时间")
    private LocalDateTime updatedAt;

    @Schema(description = "最后登录时间")
    private LocalDateTime lastLogin;

    @Schema(description = "用户状态: 0-禁用, 1-正常", example = "1")
    private Integer status;

    @Schema(hidden = true)
    public static final int STATUS_DISABLED = 0;

    @Schema(hidden = true)
    public static final int STATUS_NORMAL = 1;
}