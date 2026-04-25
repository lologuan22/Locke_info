package com.newblash.locke.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI lockeOpenAPI() {
        return new OpenAPI()
                // 1. 文档基本信息配置
                .info(new Info()
                        .title("Locke 项目 API 接口文档")
                        .description("基于 Springdoc 和 Knife4j 的后端接口定义")
                        .version("v1.0.0")
                        .contact(new Contact().name("NewBlash").email("lologuan22@gmail.com")))

                // 2. 安全配置
                .components(new Components()
                        .addSecuritySchemes("BearerToken", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("请输入 JWT Token (无需加 Bearer 前缀)")))

                // 3. 全局应用安全校验
                .addSecurityItem(new SecurityRequirement().addList("BearerToken"));
    }
}