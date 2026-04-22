package com.newblash.locke.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.newblash.locke.entity.User;
import com.newblash.locke.mapper.UserMapper;
import com.newblash.locke.service.UserService;
import com.newblash.locke.utils.JwtUtil;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    public Map<String, Object> login(String username, String password) {
        // 1. 查数据库
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, username));

        // 2. 校验
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("密码错误");
        }
        if (user.getStatus() == User.STATUS_DISABLED) {
            throw new RuntimeException("账号已被禁用");
        }

        // 3. 更新最后登录时间
        user.setLastLogin(LocalDateTime.now());
        userMapper.updateById(user);

        // 4. 生成Token并返回
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", user);

        return data;
    }
}
