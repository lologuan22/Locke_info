package com.newblash.locke.config;

import com.newblash.locke.interceptor.JwtTokenInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final JwtTokenInterceptor jwtTokenInterceptor;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        if (jwtTokenInterceptor != null) {
            registry.addInterceptor(jwtTokenInterceptor)
                    .addPathPatterns("/api/**")
                    .excludePathPatterns(
                            "/api/user/login",
                            "/api/user/register",
                            "/api/images/**",
                            "/api/pokemons",
                            "/api/pokemons/**",
                            "/swagger-ui/**",
                            "/v3/api-docs/**",
                            "/swagger-resources/**",
                            "/webjars/**"
                    );
        }
    }
}