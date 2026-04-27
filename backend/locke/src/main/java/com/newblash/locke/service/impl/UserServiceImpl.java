package com.newblash.locke.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.newblash.locke.entity.RegisterDTO;
import com.newblash.locke.entity.User;
import com.newblash.locke.mapper.UserMapper;
import com.newblash.locke.service.UserService;
import com.newblash.locke.utils.BaseContext;
import com.newblash.locke.utils.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final JwtUtil jwtUtil;

    @Override
    public Map<String, Object> login(String username, String password) {
        // 1. 根据用户名查询
        User user = this.getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));

        // 2. 校验用户是否存在及状态
        if (user == null || user.getStatus() == User.STATUS_DISABLED) {
            throw new RuntimeException("用户不存在或已被禁用");
        }

        // 3. 校验密码 (开发阶段：使用明文对比)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 4. 生成真实的 Token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        // 5. 封装返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);

        user.setPassword(null); // 返回给前端前脱敏
        result.put("userInfo", user);

        // 6. 更新最后登录时间
        user.setLastLogin(LocalDateTime.now());
        this.updateById(user);

        return result;
    }

    @Override
    @Transactional
    public void register(RegisterDTO registerDTO) {
        // 1. 检查用户名是否存在
        long count = this.count(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, registerDTO.getUsername()));
        if (count > 0) {
            throw new RuntimeException("用户名已存在");
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

    /**
     * 头像上传专用接口
     */
    @Override
    public String uploadFile(MultipartFile file) {
        // 调用通用保存逻辑，指定子目录为 "avatars"，访问前缀为 "/api/avatars/"
        return saveFile(file, "avatars", "/api/avatars/");
    }

    /**
     * 通用的私有文件保存逻辑
     * * @param file 文件流
     * 
     * @param physicalPath 物理存储的绝对路径 (直接由外部注入，如 avatarPath)
     * @param uriPrefix    数据库存储的访问前缀 (如 /api/avatars/)
     */
    private String saveFile(MultipartFile file, String physicalPath, String uriPrefix) {
        if (file.isEmpty()) {
            throw new RuntimeException("上传文件不能为空");
        }

        // 1. 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String suffix = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String newFileName = UUID.randomUUID().toString() + suffix;

        try {
            // 2. 确定物理存储全路径
            // 直接使用传入的物理路径，确保它和 WebConfig 里的配置是一致的
            File destDir = new File(physicalPath);
            if (!destDir.exists()) {
                destDir.mkdirs();
            }

            // 3. 物理保存 (使用 destDir 目录和文件名构建完整文件对象)
            file.transferTo(new File(destDir, newFileName));

            // 4. 返回前端访问路径：/api/avatars/xxxx.jpg
            return uriPrefix + newFileName;
        } catch (IOException e) {
            throw new RuntimeException("文件存储失败", e);
        }
    }

    @Override
    @Transactional
    public User updateUserProfile(User user) {
        User currentUser = this.getCurrentUser();
        if (currentUser == null)
            throw new RuntimeException("用户未登录");

        User updateEntity = new User();
        updateEntity.setId(currentUser.getId());
        updateEntity.setNickname(user.getNickname());
        updateEntity.setAvatarUrl(user.getAvatarUrl());
        updateEntity.setUpdatedAt(LocalDateTime.now());
        this.updateById(updateEntity);
        return this.getById(currentUser.getId());
    }

}