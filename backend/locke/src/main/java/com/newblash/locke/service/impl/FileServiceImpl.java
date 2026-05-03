package com.newblash.locke.service.impl;

import com.newblash.locke.exception.BaseException;
import com.newblash.locke.service.FileService;
import com.newblash.locke.utils.PathUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import net.coobird.thumbnailator.Thumbnails;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadAvatar(MultipartFile file) {
        validateFile(file);

        // 1. 生成唯一 ID
        String uuid = UUID.randomUUID().toString();

        try {
            // 2. 获取动态存储路径
            String storagePath = PathUtils.getAvatarStoragePath();
            saveToDisk(file, uuid, storagePath);

            // 3. 返回前端访问的前缀（与 WebConfig 中的 addResourceHandler 对应）
            return "/api/avatars/" + uuid + ".webp";
        } catch (IOException e) {
            throw new BaseException("磁盘写入失败: " + e.getMessage());
        }
    }

    private void saveToDisk(MultipartFile file, String baseName, String storagePath) throws IOException {
        File destDir = new File(storagePath);
        if (!destDir.exists() && !destDir.mkdirs()) {
            throw new IOException("无法创建目录: " + storagePath);
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