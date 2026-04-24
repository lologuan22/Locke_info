package com.newblash.locke.controller;

import com.newblash.locke.common.Result;
import com.newblash.locke.entity.LoginDTO;
import com.newblash.locke.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "用户认证", description = "处理用户登录、注销及权限验证相关接口")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "用户登录", description = "根据用户名和密码获取 Token 及用户信息", responses = {
            @ApiResponse(responseCode = "200", description = "登录成功", content = @Content(schema = @Schema(implementation = LoginResult.class))),
            @ApiResponse(responseCode = "400", description = "用户名或密码错误", content = @Content)
    })
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        try {
            Map<String, Object> data = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
            return Result.success(data);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    // 辅助类：仅用于在 Swagger 文档中展示 Map 的结构
    // 如果你将来把 Map 改为具体的类（推荐），这个类就可以删掉
    private static class LoginResult extends Result<Map<String, Object>> {
        @Schema(description = "包含 token 和 userInfo 的键值对", example = "{ \"token\": \"ey...\", \"userInfo\": {...} }")
        private Map<String, Object> data;
    }
}