package com.newblash.locke.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.util.ResourceUtils;
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
                // ResourceUtils.FILE_URL_PREFIX 就是 "file:"
                registry.addResourceHandler("/api/images/**")
                                .addResourceLocations(ResourceUtils.FILE_URL_PREFIX + uploadPath);

                // 2. 头像映射
                registry.addResourceHandler("/api/avatars/**")
                                .addResourceLocations(ResourceUtils.FILE_URL_PREFIX + avatarPath);
        }
}