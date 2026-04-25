package com.newblash.locke.service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    @Value("${file.upload-path}")

    private String uploadPath;

    public String uploadFile(MultipartFile file) {
        // 1. 生成唯一文件名 (UUID + 后缀)
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(uploadPath + fileName);

        // 2. 目录不存在则创建
        if (!dest.getParentFile().exists())
            dest.getParentFile().mkdirs();

        try {
            file.transferTo(dest);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        } 
        // 3. 返回给前端访问的相对路径
        return "/api/images/" + fileName;

    }
}