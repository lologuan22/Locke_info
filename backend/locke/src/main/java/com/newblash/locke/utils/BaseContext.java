package com.newblash.locke.utils;

/**
 * 持有当前登录用户 ID 的工具类
 */
public class BaseContext {
    private BaseContext() {}

    private static final ThreadLocal<Integer> threadLocal = new ThreadLocal<>();

    public static void setCurrentId(Integer id) {
        threadLocal.set(id);
    }

    public static Integer getCurrentId() {
        return threadLocal.get();
    }

    public static void removeCurrentId() {
        threadLocal.remove();
    }
}