package com.newblash.locke.service;

import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;
import com.newblash.locke.entity.User;

public interface UserService extends IService<User> {

    Map<String, Object> login(String username, String password);
}
