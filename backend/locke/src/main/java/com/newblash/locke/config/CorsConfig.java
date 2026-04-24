package com.newblash.locke.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings( @NonNull CorsRegistry registry) {
        registry.addMapping("/**") // 拦截所有请求
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的请求方法
                .allowedHeaders("*") // 允许的所有请求头
                .allowCredentials(true) // 是否允许携带 Cookie 等凭证信息
                .maxAge(3600); // 预检请求的缓存时间（秒）
    }
}
