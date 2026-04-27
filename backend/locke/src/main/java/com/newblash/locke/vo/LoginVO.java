package com.newblash.locke.vo;

import com.newblash.locke.entity.User;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class LoginVO {
    @Schema(description = "访问令牌")
    private String token;
    @Schema(description = "用户信息")
    private User userInfo;
}