package com.newblash.locke.controller;

import com.newblash.locke.common.Result;
import com.newblash.locke.entity.LoginDTO;
import com.newblash.locke.entity.RegisterDTO;
import com.newblash.locke.entity.User;
import com.newblash.locke.service.FileService;
import com.newblash.locke.service.UserService;
import com.newblash.locke.vo.LoginVO;

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

@Tag(name = "用户认证", description = "处理用户登录、注销及权限验证相关接口")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileService fileService; // 注入接口

    @Operation(summary = "用户登录", responses = {
            @ApiResponse(responseCode = "200", description = "登录成功", content = @Content(schema = @Schema(implementation = LoginVO.class)))
    })
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody LoginDTO loginDTO) {
        try {
            LoginVO loginVO = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
            return Result.success(loginVO);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @Operation(summary = "用户注册", description = "创建新用户账号")
    @PostMapping("/register")
    public Result<String> register(@RequestBody RegisterDTO registerDTO) {

        userService.register(registerDTO);
        return Result.success("注册成功");
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

    @Operation(summary = "上传头像图片")
    @PostMapping("/upload/avatar")
    public Result<String> uploadAvatar(@RequestParam MultipartFile file) {
        String avatarUrl = fileService.uploadAvatar(file);
        return Result.success(avatarUrl);
    }
}
