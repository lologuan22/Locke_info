package com.newblash.locke.utils;

import java.io.File;

public class PathUtils {
    private PathUtils() {}

    public static String getProjectBaseDir() {
        org.springframework.boot.system.ApplicationHome home = 
            new org.springframework.boot.system.ApplicationHome(PathUtils.class);
        File jarOrDir = home.getDir();
        String baseDir = jarOrDir.getAbsolutePath();

        if (baseDir.endsWith("target" + File.separator + "classes") || baseDir.endsWith("target")) {
            // 开发环境下，回到项目根目录
            baseDir = jarOrDir.getParentFile().getParentFile().getAbsolutePath();
        }
        return baseDir;
    }

    public static String getAvatarStoragePath() {
        return getProjectBaseDir() + File.separator + "data" + File.separator + "avatars" + File.separator;
    }
}