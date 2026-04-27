package com.newblash.locke.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.newblash.locke.entity.RegisterDTO;
import com.newblash.locke.entity.User;
import com.newblash.locke.exception.BaseException;
import com.newblash.locke.mapper.UserMapper;
import com.newblash.locke.service.UserService;
import com.newblash.locke.utils.BaseContext;
import com.newblash.locke.utils.JwtUtil;
import com.newblash.locke.vo.LoginVO;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final JwtUtil jwtUtil;

    @Override
    public LoginVO login(String username, String password) {
        // 1. 根据用户名查询
        User user = this.getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));

        // 2. 校验用户是否存在及状态
        if (user == null || user.getStatus() == User.STATUS_DISABLED) {
            throw new BaseException("用户不存在或已被禁用");
        }

        // 3. 校验密码 (注意：如果是生产环境，记得用 BCrypt 进行加密校验)
        if (!user.getPassword().equals(password)) {
            throw new BaseException("用户名或密码错误");
        }

        // 4. 生成真实的 Token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        // 5. 封装返回结果
        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);

        user.setPassword(null); // 返回给前端前脱敏
        loginVO.setUserInfo(user);

        // 6. 更新最后登录时间
        user.setLastLogin(LocalDateTime.now());
        this.updateById(user);

        return loginVO;
    }

    @Override
    @Transactional
    public void register(RegisterDTO registerDTO) {
        // 1. 检查用户名是否存在
        long count = this.count(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, registerDTO.getUsername()));
        if (count > 0) {
            throw new BaseException("用户名已存在");
        }

        // 2. 构造 User 实体
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setNickname(registerDTO.getNickname());
        user.setEmail(registerDTO.getEmail());

        // 3. 开发阶段：直接存入明文密码
        user.setPassword(registerDTO.getPassword());

        // 4. 设置默认值
        user.setStatus(User.STATUS_NORMAL);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // 5. 保存
        this.save(user);
    }

    @Override
    public User getCurrentUser() {
        // 从 ThreadLocal 中获取拦截器存入的用户 ID
        Integer userId = BaseContext.getCurrentId();

        if (userId == null) {
            return null;
        }

        User user = this.getById(userId);
        if (user != null) {
            user.setPassword(null); // 脱敏
        }
        return user;
    }

    @Value("${file.upload-path}")
    private String commonPath; // 用于通用图片

    @Value("${file.avatar-path}")
    private String avatarPath; // 用于头像图片

    @Override
    @Transactional
    public User updateUserProfile(User user) {
        User currentUser = this.getCurrentUser();
        if (currentUser == null)
            throw new BaseException("用户未登录");

        User updateEntity = new User();
        updateEntity.setId(currentUser.getId());
        updateEntity.setNickname(user.getNickname());
        updateEntity.setAvatarUrl(user.getAvatarUrl());
        updateEntity.setUpdatedAt(LocalDateTime.now());
        this.updateById(updateEntity);
        return this.getById(currentUser.getId());
    }

}