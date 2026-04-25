USE pokedex_db;


-- 创建属性相克表
CREATE TABLE IF NOT EXISTS type_effectiveness (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    attacking_type VARCHAR(20) NOT NULL COMMENT '攻击属性',
    defending_type VARCHAR(20) NOT NULL COMMENT '防御属性',
    multiplier DECIMAL(3,2) NOT NULL COMMENT '伤害倍数',
    
    -- 唯一约束
    UNIQUE KEY uk_attack_defend (attacking_type, defending_type),
    
    -- 索引
    INDEX idx_attacking_type (attacking_type),
    INDEX idx_defending_type (defending_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='属性相克表';

-- 显示表结构
DESC type_effectiveness;

-- 显示创建信息
SELECT '属性相克表创建成功!' AS message;
