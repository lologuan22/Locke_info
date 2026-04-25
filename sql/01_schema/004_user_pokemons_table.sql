USE pokedex_db;


-- 创建用户背包表
CREATE TABLE IF NOT EXISTS user_pokemons (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '背包ID',
    user_id INT NOT NULL COMMENT '用户ID',
    pokemon_id INT NOT NULL COMMENT '宠物ID',
    
    -- 自定义信息
    nickname VARCHAR(50) COMMENT '宠物昵称',
    level INT DEFAULT 1 COMMENT '等级（1-100）',
    exp INT DEFAULT 0 COMMENT '当前经验值',
    
    -- 培养进度（0-100%）
    hp_progress INT DEFAULT 0 COMMENT '精力培养进度',
    attack_progress INT DEFAULT 0 COMMENT '攻击培养进度',
    defense_progress INT DEFAULT 0 COMMENT '防御培养进度',
    sp_attack_progress INT DEFAULT 0 COMMENT '魔攻培养进度',
    sp_defense_progress INT DEFAULT 0 COMMENT '魔抗培养进度',
    speed_progress INT DEFAULT 0 COMMENT '速度培养进度',
    
    -- 当前数值（根据进度自动计算）
    current_hp INT DEFAULT 0 COMMENT '当前精力',
    current_attack INT DEFAULT 0 COMMENT '当前攻击',
    current_defense INT DEFAULT 0 COMMENT '当前防御',
    current_sp_attack INT DEFAULT 0 COMMENT '当前魔攻',
    current_sp_defense INT DEFAULT 0 COMMENT '当前魔抗',
    current_speed INT DEFAULT 0 COMMENT '当前速度',
    
    -- 状态标识
    is_favorite BOOLEAN DEFAULT FALSE COMMENT '是否收藏',
    is_shiny BOOLEAN DEFAULT FALSE COMMENT '是否闪光',
    
    -- 时间戳
    caught_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 外键约束
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE,
    
    -- 唯一约束：同一个用户不能有相同的宠物（除非是闪光）
    UNIQUE KEY uk_user_pokemon (user_id, pokemon_id, is_shiny),
    
    -- 索引
    INDEX idx_user_id (user_id),
    INDEX idx_pokemon_id (pokemon_id),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户背包表';

-- 显示表结构
DESC user_pokemons;

-- 显示创建信息
SELECT '用户背包表创建成功!' AS message;
