package com.newblash.locke.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

@Data
@TableName("users")
public class User {
    
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String nickname;
    private String avatarUrl;// 默认头像URL
    
    private LocalDateTime createdAt;// 创建时间
    private LocalDateTime updatedAt;// 更新时间
    private LocalDateTime lastLogin;// 最后登录时间
    
    private Integer status;// 用户状态: 0-禁用, 1-正常
    public static final int STATUS_DISABLED = 0;// 用户状态: 0-禁用
    public static final int STATUS_NORMAL = 1;//  用户状态: 1-正常
}