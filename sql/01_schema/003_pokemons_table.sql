USE pokedex_db;


-- 创建宠物表（基于4399洛克王国属性）
CREATE TABLE IF NOT EXISTS pokemons (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '宠物ID，自增',
    number VARCHAR(20) NOT NULL COMMENT '宠物编号（如#001）',
    name VARCHAR(50) NOT NULL COMMENT '宠物名称',
    chinese_name VARCHAR(50) COMMENT '中文名',
    
    -- 洛克王国属性类型
    type1 VARCHAR(20) NOT NULL COMMENT '主属性',
    type2 VARCHAR(20) COMMENT '副属性',
    
    -- 宠物类型标识（参考洛克王国分类）
    is_rare BOOLEAN DEFAULT FALSE COMMENT '是否稀有宠物',
    is_vip BOOLEAN DEFAULT FALSE COMMENT '是否VIP宠物',
    is_legendary BOOLEAN DEFAULT FALSE COMMENT '是否传说宠物',
    is_awakening BOOLEAN DEFAULT FALSE COMMENT '是否天界觉醒宠物',
    is_multiple_evolution BOOLEAN DEFAULT FALSE COMMENT '是否多元进化宠物',
    is_kingdom_boss BOOLEAN DEFAULT FALSE COMMENT '是否王国BOSS',
    
    -- 基础属性（6项核心属性）
    base_hp INT DEFAULT 0 COMMENT '精力',
    base_attack INT DEFAULT 0 COMMENT '攻击',
    base_defense INT DEFAULT 0 COMMENT '防御',
    base_sp_attack INT DEFAULT 0 COMMENT '魔攻',
    base_sp_defense INT DEFAULT 0 COMMENT '魔抗',
    base_speed INT DEFAULT 0 COMMENT '速度',
    
    -- 图片和描述
    image_url VARCHAR(255) COMMENT '宠物图片URL',
    description TEXT COMMENT '宠物描述',
    
    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    -- 索引
    INDEX idx_number (number),
    INDEX idx_name (name),
    INDEX idx_type1 (type1),
    INDEX idx_type2 (type2),
    INDEX idx_rare (is_rare),
    INDEX idx_vip (is_vip),
    INDEX idx_legendary (is_legendary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物基础表（洛克王国风格）';

-- 显示表结构
DESC pokemons;

-- 显示创建信息
SELECT '宠物表创建成功!' AS message;
