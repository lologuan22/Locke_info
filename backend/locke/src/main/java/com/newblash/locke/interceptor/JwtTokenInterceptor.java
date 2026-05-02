package com.newblash.locke.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newblash.locke.common.Result;
import com.newblash.locke.utils.BaseContext;
import com.newblash.locke.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.IOException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class JwtTokenInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler)
            throws Exception {
        // 1. 排除跨域 OPTIONS 请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // 2. 获取 Header 中的 Token
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        } else {
            // 没有 Token
            return renderError(response, "未检测到登录凭证，请先登录");
        }

        try {
            Claims claims = jwtUtil.parseToken(token);
            // 解析成功，获取用户ID存入 ThreadLocal
            Integer userId = Integer.parseInt(claims.getSubject());
            BaseContext.setCurrentId(userId);
            return true;
        }
        catch (ExpiredJwtException _) {
            return renderError(response, "登录已过期，请重新登录");
        } catch (SignatureException _) {
            return renderError(response, "签名非法，凭证可能被篡改");
        } catch (MalformedJwtException _) {
            return renderError(response, "令牌格式错误");
        } catch (Exception _) {
            return renderError(response, "身份验证失败");
        }
    }

    /**
     * 手动渲染 JSON 结果给前端
     * @throws java.io.IOException 
     */
    
    
    private boolean renderError(HttpServletResponse response, String message) throws IOException, java.io.IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json;charset=UTF-8");

        Result<String> result = Result.error(message);

        // 将 Result 转为 JSON 字符串写入响应体
        String json = new ObjectMapper().writeValueAsString(result);
        response.getWriter().write(json);

        return false; // 拦截请求，不再往下走
    }

    @Override
    public void afterCompletion(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler,
            @Nullable Exception ex) {
        BaseContext.removeCurrentId(); 
    }
}