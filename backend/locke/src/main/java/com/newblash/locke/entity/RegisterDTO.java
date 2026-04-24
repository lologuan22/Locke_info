package com.newblash.locke.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RegisterDTO {
    @Schema(description = "用户名", example = "zhangsan")
    private String username;

    @Schema(description = "密码", example = "123456")
    private String password;

    @Schema(description = "邮箱", example = "zhangsan@example.com")
    private String email;

    @Schema(description = "昵称", example = "小张")
    private String nickname;
}