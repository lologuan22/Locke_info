package com.newblash.locke.exception;

/**
 * 自定义业务异常
 */
public class BaseException extends RuntimeException {
    public BaseException(String message) {
        super(message);
    }
}