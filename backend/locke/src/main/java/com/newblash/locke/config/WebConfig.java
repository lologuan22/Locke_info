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

import com.newblash.locke.utils.PathUtils;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String baseDir = PathUtils.getProjectBaseDir();

        // 定义变量
        String imageLocation = "file:" + baseDir + File.separator + "data" + File.separator + "images"
                + File.separator;
        String avatarLocation = "file:" + baseDir + File.separator + "data" + File.separator + "avatars"
                + File.separator;

        // 图片映射
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations(imageLocation)
                .setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());

        // 头像映射
        registry.addResourceHandler("/api/avatars/**")
                .addResourceLocations(avatarLocation)
                .setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic());

        logger.info("静态资源加载路径: {}", imageLocation);

        // 允许访问 static 目录下的所有文件
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Bean
    ShallowEtagHeaderFilter shallowEtagHeaderFilter() {
        return new ShallowEtagHeaderFilter();
    }
}