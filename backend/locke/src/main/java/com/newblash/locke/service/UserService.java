package com.newblash.locke.service;

import java.util.Map;
import com.newblash.locke.entity.User;
import com.newblash.locke.entity.RegisterDTO;

public interface UserService {

    /**
     * 用户登录
     * 
     * @return 包含 token 和 userInfo 的 Map
     */
    Map<String, Object> login(String username, String password);

    /**
     * 用户注册
     */
    void register(RegisterDTO registerDTO);

    /**
     * 获取当前登录用户信息
     */
    User getCurrentUser();
}