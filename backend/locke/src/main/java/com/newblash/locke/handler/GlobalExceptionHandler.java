package com.newblash.locke.handler;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.newblash.locke.common.Result;
import com.newblash.locke.exception.BaseException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 捕获业务异常
     */
    @ExceptionHandler(BaseException.class)
    public Result<String> exceptionHandler(BaseException ex) {
        return Result.error(ex.getMessage()); 
    }

    /**
     * 捕获系统异常
     */
    @ExceptionHandler(Exception.class)
    public Result<String> handleRemainingException(Exception ex) {
        ex.printStackTrace(); 
        
        return Result.error("系统繁忙，请联系管理员");
    }
}