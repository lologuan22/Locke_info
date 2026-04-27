package com.newblash.locke.service.impl;

import com.newblash.locke.exception.BaseException;
import com.newblash.locke.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import net.coobird.thumbnailator.Thumbnails;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Value("${file.avatar-path}")
    private String avatarPath;

    @Override
    public String uploadAvatar(MultipartFile file) {
        validateFile(file);

        // 1. 生成唯一的 BaseName
        String uuid = UUID.randomUUID().toString();

        try {
            // 2. 将 uuid 传递给磁盘保存方法
            saveToDisk(file, uuid);

            // 3. 返回前端约定的路径
            return "/api/avatars/" + uuid + ".webp";
        } catch (IOException e) {
            throw new BaseException("磁盘写入失败: " + e.getMessage());
        }
    }

    private void saveToDisk(MultipartFile file, String baseName) throws IOException {
        File destDir = new File(avatarPath);
        if (!destDir.exists() && !destDir.mkdirs()) {
            throw new IOException("无法创建目录: " + avatarPath);
        }

        Thumbnails.of(file.getInputStream())
                .size(500, 500)
                .outputFormat("webp")
                .outputQuality(0.8f)
                .toFile(new File(destDir, baseName));
    }

    /**
     * 内部辅助：校验逻辑
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BaseException("上传文件不能为空");
        }
        String contentType = file.getContentType();
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new BaseException("图片大小不能超过 2MB");
        }

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BaseException("只能上传图片文件");
        }
    }
}