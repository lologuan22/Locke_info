-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS pokedex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pokedex_db;

-- 2. 用户表 (Users)
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

-- 3. 宠物基础信息表 (Pokemon)
CREATE TABLE IF NOT EXISTS pokemon (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    number INT NOT NULL UNIQUE COMMENT '宠物编号',
    name VARCHAR(50) NOT NULL COMMENT '宠物名称',
    type1 VARCHAR(20) DEFAULT NULL COMMENT '主属性/系别',
    height DECIMAL(5,2) DEFAULT NULL COMMENT '身高(m)',
    weight DECIMAL(5,2) DEFAULT NULL COMMENT '体重(kg)',
    description TEXT COMMENT '宠物简介',
    image_url VARCHAR(255) DEFAULT NULL COMMENT '宠物立绘图片路径',
    is_legendary TINYINT(1) DEFAULT 0 COMMENT '是否为神兽',
    is_rare TINYINT(1) DEFAULT 0 COMMENT '是否稀有'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物基础信息表';

-- 4. 宠物种族值表 (Pokemon Stats) - 与 Pokemon 是一对一关系
CREATE TABLE IF NOT EXISTS pokemon_stats (
    pokemon_id INT PRIMARY KEY COMMENT '关联宠物ID',
    hp INT DEFAULT 0 COMMENT '精力/生命值',
    atk INT DEFAULT 0 COMMENT '攻击',
    def INT DEFAULT 0 COMMENT '防御',
    sp_atk INT DEFAULT 0 COMMENT '魔攻',
    sp_def INT DEFAULT 0 COMMENT '魔抗',
    speed INT DEFAULT 0 COMMENT '速度',
    -- 外键：当基础表删除时，对应的数值也一起删除
    CONSTRAINT fk_stats_pokemon FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物种族值/属性表';

-- 5. 技能信息表 (Skill)
CREATE TABLE IF NOT EXISTS skill (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '技能ID',
    name VARCHAR(50) NOT NULL COMMENT '技能名称',
    type VARCHAR(20) DEFAULT NULL COMMENT '技能属性',
    category VARCHAR(20) DEFAULT NULL COMMENT '类型(物理/变化/魔法)',
    power INT DEFAULT NULL COMMENT '威力',
    pp INT DEFAULT NULL COMMENT 'PP值',
    effect VARCHAR(255) DEFAULT NULL COMMENT '技能效果描述'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技能信息表';

-- 6. 用户背包表 (User Pokemon) - 用户与宠物的多对多关系
CREATE TABLE IF NOT EXISTS user_pokemon (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    user_id INT NOT NULL COMMENT '用户ID',
    pokemon_id INT NOT NULL COMMENT '宠物ID',
    caught_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
    -- 索引优化
    KEY idx_user_id (user_id),
    KEY idx_pokemon_id (pokemon_id),
    -- 外键约束
    CONSTRAINT fk_user_pk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_pk_pokemon FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户背包表';

-- 7. 宠物技能关联表 (Pokemon Skill Relation) - 宠物与技能的多对多关系
CREATE TABLE IF NOT EXISTS pokemon_skill_relation (
    pokemon_id INT NOT NULL COMMENT '宠物ID',
    skill_id INT NOT NULL COMMENT '技能ID',
    require_level INT DEFAULT 0 COMMENT '学习所需等级',
    PRIMARY KEY (pokemon_id, skill_id),
    -- 外键约束
    CONSTRAINT fk_rel_pokemon_base FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE,
    CONSTRAINT fk_rel_skill_base FOREIGN KEY (skill_id) REFERENCES skill (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物技能关联表';