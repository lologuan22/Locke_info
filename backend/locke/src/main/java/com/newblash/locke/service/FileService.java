package com.newblash.locke.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    /**
     * 上传文件
     * 
     * @param file 文件对象
     * @return 返回可访问的 URL 路径
     */
    String uploadAvatar(MultipartFile file);
}