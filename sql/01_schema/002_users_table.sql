-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(255) DEFAULT '/images/avatars/default.png' COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';