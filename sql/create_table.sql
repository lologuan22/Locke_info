-- 创建数据库
CREATE DATABASE IF NOT EXISTS pokedex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pokedex_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(255) DEFAULT '/images/avatars/default.png' COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';


CREATE TABLE `pokemon` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `number` int NOT NULL COMMENT '宠物编号',
  `name` varchar(50) NOT NULL COMMENT '宠物名称',
  `type1` varchar(20) DEFAULT NULL COMMENT '主属性/系别',
  `height` decimal(5,2) DEFAULT NULL COMMENT '身高(m)',
  `weight` decimal(5,2) DEFAULT NULL COMMENT '体重(kg)',
  `description` text COMMENT '宠物简介',
  `image_url` varchar(255) DEFAULT NULL COMMENT '宠物立绘图片路径',
  `is_legendary` tinyint(1) DEFAULT '0' COMMENT '是否为神兽',
  `is_rare` tinyint(1) DEFAULT '0' COMMENT '是否稀有',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_number` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物基础信息表';

CREATE TABLE `user_pokemon` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int NOT NULL COMMENT '用户ID，关联users表id',
  `pokemon_id` int NOT NULL COMMENT '宠物ID，关联pokemon表id',
  `caught_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
  PRIMARY KEY (`id`),
  -- 建立索引以优化查询性能
  KEY `idx_user_id` (`user_id`),
  KEY `idx_pokemon_id` (`pokemon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户背包表';


CREATE TABLE `pokemon_stats` (
  `pokemon_id` int NOT NULL COMMENT '关联宠物ID',
  `hp` int DEFAULT '0' COMMENT '精力/生命值',
  `atk` int DEFAULT '0' COMMENT '攻击',
  `def` int DEFAULT '0' COMMENT '防御',
  `sp_atk` int DEFAULT '0' COMMENT '魔攻',
  `sp_def` int DEFAULT '0' COMMENT '魔抗',
  `speed` int DEFAULT '0' COMMENT '速度',
  PRIMARY KEY (`pokemon_id`),
  CONSTRAINT `fk_stats_pokemon` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物种族值/属性表';


CREATE TABLE `skill` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '技能ID',
  `name` varchar(50) NOT NULL COMMENT '技能名称',
  `type` varchar(20) DEFAULT NULL COMMENT '技能属性(如光系)',
  `category` varchar(20) DEFAULT NULL COMMENT '类型(物理/变化/魔法)',
  `power` int DEFAULT NULL COMMENT '威力',
  `pp` int DEFAULT NULL COMMENT 'PP值',
  `effect` varchar(255) DEFAULT NULL COMMENT '技能效果描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技能信息表';


CREATE TABLE `pokemon_skill_relation` (
  `pokemon_id` int NOT NULL COMMENT '宠物ID',
  `skill_id` int NOT NULL COMMENT '技能ID',
  `require_level` int DEFAULT '0' COMMENT '学习所需等级',
  PRIMARY KEY (`pokemon_id`, `skill_id`),
  KEY `idx_skill` (`skill_id`),
  CONSTRAINT `fk_rel_pokemon` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rel_skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物技能关联表';
