-- ===========================================
-- 游戏精灵背包图鉴系统 - 属性更新触发器
-- 文件: 001_user_pokemon_trigger.sql
-- 功能: 创建用户宠物属性自动更新触发器
-- 执行顺序: 8
-- ===========================================

-- 确保使用正确的数据库
USE pokedex_db;

-- 删除已存在的触发器
DROP TRIGGER IF EXISTS before_user_pokemon_insert;
DROP TRIGGER IF EXISTS after_user_pokemon_update;
DROP TRIGGER IF EXISTS update_pokemon_level;

-- 触发器1: 插入新宠物时自动计算初始属性
DELIMITER //

CREATE TRIGGER before_user_pokemon_insert
BEFORE INSERT ON user_pokemons
FOR EACH ROW
BEGIN
    DECLARE v_base_hp INT;
    DECLARE v_base_attack INT;
    DECLARE v_base_defense INT;
    DECLARE v_base_sp_attack INT;
    DECLARE v_base_sp_defense INT;
    DECLARE v_base_speed INT;
    
    -- 获取基础属性
    SELECT 
        base_hp, base_attack, base_defense, 
        base_sp_attack, base_sp_defense, base_speed
    INTO 
        v_base_hp, v_base_attack, v_base_defense,
        v_base_sp_attack, v_base_sp_defense, v_base_speed
    FROM pokemons
    WHERE id = NEW.pokemon_id;
    
    -- 计算初始当前数值
    SET NEW.current_hp = v_base_hp;
    SET NEW.current_attack = v_base_attack;
    SET NEW.current_defense = v_base_defense;
    SET NEW.current_sp_attack = v_base_sp_attack;
    SET NEW.current_sp_defense = v_base_sp_defense;
    SET NEW.current_speed = v_base_speed;
    
    -- 设置默认值
    IF NEW.level IS NULL THEN
        SET NEW.level = 1;
    END IF;
    
    IF NEW.exp IS NULL THEN
        SET NEW.exp = 0;
    END IF;
    
    IF NEW.caught_date IS NULL THEN
        SET NEW.caught_date = CURRENT_TIMESTAMP;
    END IF;
END //

DELIMITER ;

-- 触发器2: 更新培养进度时自动重新计算属性
DELIMITER //

CREATE TRIGGER after_user_pokemon_update
AFTER UPDATE ON user_pokemons
FOR EACH ROW
BEGIN
    -- 只有当培养进度发生变化时才重新计算
    IF OLD.hp_progress != NEW.hp_progress 
    OR OLD.attack_progress != NEW.attack_progress
    OR OLD.defense_progress != NEW.defense_progress
    OR OLD.sp_attack_progress != NEW.sp_attack_progress
    OR OLD.sp_defense_progress != NEW.sp_defense_progress
    OR OLD.speed_progress != NEW.speed_progress THEN
        
        -- 调用存储过程更新属性
        CALL update_user_pokemon_stats(NEW.id);
    END IF;
END //

DELIMITER ;

-- 触发器3: 等级变化时自动调整经验值范围
DELIMITER //

CREATE TRIGGER update_pokemon_level
BEFORE UPDATE ON user_pokemons
FOR EACH ROW
BEGIN
    DECLARE v_max_exp INT;
    DECLARE v_level_up_exp INT;
    
    -- 定义每个等级升级所需经验值（简单公式：等级 * 100）
    SET v_level_up_exp = NEW.level * 100;
    
    -- 如果经验值超过升级所需，自动升级
    IF NEW.exp >= v_level_up_exp AND NEW.level < 100 THEN
        SET NEW.level = NEW.level + 1;
        SET NEW.exp = NEW.exp - v_level_up_exp;
        
        -- 等级提升时，所有属性进度随机增加1-5点
        SET NEW.hp_progress = LEAST(100, NEW.hp_progress + FLOOR(1 + RAND() * 5));
        SET NEW.attack_progress = LEAST(100, NEW.attack_progress + FLOOR(1 + RAND() * 5));
        SET NEW.defense_progress = LEAST(100, NEW.defense_progress + FLOOR(1 + RAND() * 5));
        SET NEW.sp_attack_progress = LEAST(100, NEW.sp_attack_progress + FLOOR(1 + RAND() * 5));
        SET NEW.sp_defense_progress = LEAST(100, NEW.sp_defense_progress + FLOOR(1 + RAND() * 5));
        SET NEW.speed_progress = LEAST(100, NEW.speed_progress + FLOOR(1 + RAND() * 5));
    END IF;
    
    -- 确保等级在1-100之间
    IF NEW.level < 1 THEN
        SET NEW.level = 1;
    ELSEIF NEW.level > 100 THEN
        SET NEW.level = 100;
    END IF;
    
    -- 确保经验值非负
    IF NEW.exp < 0 THEN
        SET NEW.exp = 0;
    END IF;
    
    -- 确保培养进度在0-100之间
    IF NEW.hp_progress < 0 THEN SET NEW.hp_progress = 0;
    ELSEIF NEW.hp_progress > 100 THEN SET NEW.hp_progress = 100; END IF;
    
    IF NEW.attack_progress < 0 THEN SET NEW.attack_progress = 0;
    ELSEIF NEW.attack_progress > 100 THEN SET NEW.attack_progress = 100; END IF;
    
    IF NEW.defense_progress < 0 THEN SET NEW.defense_progress = 0;
    ELSEIF NEW.defense_progress > 100 THEN SET NEW.defense_progress = 100; END IF;
    
    IF NEW.sp_attack_progress < 0 THEN SET NEW.sp_attack_progress = 0;
    ELSEIF NEW.sp_attack_progress > 100 THEN SET NEW.sp_attack_progress = 100; END IF;
    
    IF NEW.sp_defense_progress < 0 THEN SET NEW.sp_defense_progress = 0;
    ELSEIF NEW.sp_defense_progress > 100 THEN SET NEW.sp_defense_progress = 100; END IF;
    
    IF NEW.speed_progress < 0 THEN SET NEW.speed_progress = 0;
    ELSEIF NEW.speed_progress > 100 THEN SET NEW.speed_progress = 100; END IF;
END //

DELIMITER ;

-- 测试触发器
-- 插入测试数据
INSERT INTO user_pokemons (user_id, pokemon_id, nickname, level, exp) 
VALUES (2, 18, '测试宠物', 5, 250);

-- 更新培养进度测试触发器
UPDATE user_pokemons 
SET hp_progress = 50, attack_progress = 60 
WHERE nickname = '测试宠物';

-- 显示触发器效果
SELECT 
    up.id,
    p.chinese_name,
    up.nickname,
    up.level,
    up.exp,
    up.hp_progress,
    up.attack_progress,
    up.current_hp,
    up.current_attack
FROM user_pokemons up
JOIN pokemons p ON up.pokemon_id = p.id
WHERE up.nickname = '测试宠物';

-- 删除测试数据
DELETE FROM user_pokemons WHERE nickname = '测试宠物';

-- 显示触发器创建信息
SELECT 
    '触发器创建完成!' as message,
    '1. before_user_pokemon_insert - 插入新宠物时自动计算初始属性' as trigger_1,
    '2. after_user_pokemon_update - 更新培养进度时自动重新计算属性' as trigger_2,
    '3. update_pokemon_level - 等级变化时自动调整经验值和进度' as trigger_3;
