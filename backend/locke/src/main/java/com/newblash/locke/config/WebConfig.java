package com.newblash.locke.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.lang.NonNull;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Value("${file.upload-path}")
        private String uploadPath;

        @Value("${file.avatar-path}")
        private String avatarPath;

        /**
         * 1. 配置资源映射与强缓存 (Max-Age)
         * 浏览器在时间内不会再请求服务器
         */
        @Override
        public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
                // 图片映射：缓存 30 天
                registry.addResourceHandler("/api/images/**")
                                .addResourceLocations(ResourceUtils.FILE_URL_PREFIX + uploadPath)
                                .setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());

                // 头像映射：缓存 7 天
                registry.addResourceHandler("/api/avatars/**")
                                .addResourceLocations(ResourceUtils.FILE_URL_PREFIX + avatarPath)
                                .setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic());
        }

        /**
         * 2. 开启 ETag 协商缓存
         * 当强缓存过期或用户刷新时，服务器校验文件指纹，若无变化则返回 304，不传输文件体。
         */
        @Bean
        ShallowEtagHeaderFilter shallowEtagHeaderFilter() {
                return new ShallowEtagHeaderFilter();
        }
}