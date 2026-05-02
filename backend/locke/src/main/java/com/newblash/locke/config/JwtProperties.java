package com.newblash.locke.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * 用于签名和验证令牌的 JWT 密钥
     */
    private String secret;

    /**
     * 令牌过期时间，单位为秒
     */
    private long expiration;
}