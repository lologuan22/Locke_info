package com.newblash.locke.handler;

import com.newblash.locke.common.Result;
import com.newblash.locke.exception.BaseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 捕获 Spring Validation 校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<String> handleValidationException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        
        // 将所有不合规的提示信息拼接起来
        String msg = fieldErrors.stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("；"));
        
        logger.error("参数校验失败: {}", msg);
        
        return Result.error(msg); 
    }

    /**
     * 捕获业务异常 (如：用户名已存在)
     */
    @ExceptionHandler(BaseException.class)
    public Result<String> exceptionHandler(BaseException ex) {
        return Result.error(ex.getMessage()); 
    }

    /**
     * 兜底系统异常
     */
    @ExceptionHandler(Exception.class)
    public Result<String> handleRemainingException(Exception ex) {
        ex.printStackTrace(); 
        return Result.error("系统故障，请稍后再试");
    }
}