package com.newblash.locke.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-path}")
    private String uploadPath;

    @Value("${file.avatar-path}")
    private String avatarPath;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // 1. 图片映射
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:" + uploadPath);

        // 2. 头像映射
        registry.addResourceHandler("/api/avatars/**")
                .addResourceLocations(
                        "file:" + (uploadPath.endsWith("/") ? uploadPath : uploadPath + "/") + "avatars/");
    }
}