package com.newblash.locke.controller;

import com.newblash.locke.common.Result;
import com.newblash.locke.entity.LoginDTO;
import com.newblash.locke.entity.RegisterDTO;
import com.newblash.locke.entity.User;
import com.newblash.locke.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

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

    @Operation(summary = "用户注册", description = "创建新用户账号")
    @PostMapping("/register")
    public Result<String> register(@RequestBody RegisterDTO registerDTO) {
        try {
            userService.register(registerDTO);
            return Result.success("注册成功");
        } catch (RuntimeException e) {
            // 例如：用户名已存在、密码强度不够等
            return Result.error(e.getMessage());
        }
    }

    @Operation(summary = "获取当前用户信息", description = "根据 Token 获取已登录用户的详细资料")
    @GetMapping("/info")
    public Result<User> getCurrentUserInfo() {
        // 逻辑：从 SecurityContext 或 Token 中提取用户 ID，再查数据库
        User user = userService.getCurrentUser();
        return Result.success(user);
    }

    @Operation(summary = "退出登录")
    @PostMapping("/logout")
    public Result<String> logout() {
        // 逻辑：使当前 Token 失效
        return Result.success("已成功退出");
    }

    @Operation(summary = "更新个人资料", description = "修改当前登录用户的昵称、头像等信息")
    @PutMapping("/profile")
    public Result<User> updateProfile(@RequestBody User user) {
        User updatedUser = userService.updateUserProfile(user);
        return Result.success(updatedUser);
    }

    @Operation(summary = "上传头像图片", description = "上传图片并返回可访问的 URL")
    @PostMapping("/upload/avatar")
    public Result<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            // 逻辑：1. 校验文件格式；2. 保存到本地或云端；3. 返回访问路径
            String avatarUrl = userService.uploadFile(file);
            return Result.success(avatarUrl);
        } catch (Exception e) {
            return Result.error("头像上传失败：" + e.getMessage());
        }
    }

    // 辅助类：仅用于在 Swagger 文档中展示 Map 的结构
    // 如果你将来把 Map 改为具体的类（推荐），这个类就可以删掉
    private static class LoginResult extends Result<Map<String, Object>> {
        @Schema(description = "包含 token 和 userInfo 的键值对", example = "{ \"token\": \"ey...\", \"userInfo\": {...} }")
        private Map<String, Object> data;
    }
}