package com.newblash.locke.config;

import java.io.File;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.ShallowEtagHeaderFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // 1. 获取运行目录
        org.springframework.boot.system.ApplicationHome home = new org.springframework.boot.system.ApplicationHome(
                getClass());
        File jarOrDir = home.getDir();
        String baseDir = jarOrDir.getAbsolutePath();

        // 2. 核心逻辑：如果是开发环境（target/classes），向上跳两级
        if (baseDir.endsWith("target" + File.separator + "classes") || baseDir.endsWith("target")) {
            baseDir = jarOrDir.getParentFile().getParentFile().getAbsolutePath();
        }

        // 3. 定义变量
        String imageLocation = "file:" + baseDir + File.separator + "data" + File.separator + "images" + File.separator;
        String avatarLocation = "file:" + baseDir + File.separator + "data" + File.separator + "avatars"
                + File.separator;

        // 1. 图片映射
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations(imageLocation)
                .setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());

        // 2. 头像映射
        registry.addResourceHandler("/api/avatars/**")
                .addResourceLocations(avatarLocation)
                .setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic());

        logger.info("静态资源加载路径: {}", imageLocation);
    }

    @Bean
    ShallowEtagHeaderFilter shallowEtagHeaderFilter() {
        return new ShallowEtagHeaderFilter();
    }
}