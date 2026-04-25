-- ===========================================
-- 游戏精灵背包图鉴系统 - 属性计算存储过程
-- 文件: 001_update_pokemon_stats.sql
-- 功能: 创建更新宠物属性的存储过程
-- 执行顺序: 7
-- ===========================================

-- 确保使用正确的数据库
USE pokedex_db;

-- 删除已存在的存储过程
DROP PROCEDURE IF EXISTS update_user_pokemon_stats;
DROP PROCEDURE IF EXISTS calculate_pokemon_stats;
DROP PROCEDURE IF EXISTS get_training_suggestion;

-- 存储过程1: 更新单个用户宠物的当前数值
DELIMITER //

CREATE PROCEDURE update_user_pokemon_stats(IN p_backpack_id INT)
BEGIN
    DECLARE v_base_hp INT;
    DECLARE v_base_attack INT;
    DECLARE v_base_defense INT;
    DECLARE v_base_sp_attack INT;
    DECLARE v_base_sp_defense INT;
    DECLARE v_base_speed INT;
    DECLARE v_hp_progress INT;
    DECLARE v_attack_progress INT;
    DECLARE v_defense_progress INT;
    DECLARE v_sp_attack_progress INT;
    DECLARE v_sp_defense_progress INT;
    DECLARE v_speed_progress INT;
    DECLARE v_current_hp INT;
    DECLARE v_current_attack INT;
    DECLARE v_current_defense INT;
    DECLARE v_current_sp_attack INT;
    DECLARE v_current_sp_defense INT;
    DECLARE v_current_speed INT;
    
    -- 获取基础数值和培养进度
    SELECT 
        p.base_hp, p.base_attack, p.base_defense, p.base_sp_attack, p.base_sp_defense, p.base_speed,
        up.hp_progress, up.attack_progress, up.defense_progress, up.sp_attack_progress, up.sp_defense_progress, up.speed_progress
    INTO 
        v_base_hp, v_base_attack, v_base_defense, v_base_sp_attack, v_base_sp_defense, v_base_speed,
        v_hp_progress, v_attack_progress, v_defense_progress, v_sp_attack_progress, v_sp_defense_progress, v_speed_progress
    FROM user_pokemons up
    JOIN pokemons p ON up.pokemon_id = p.id
    WHERE up.id = p_backpack_id;
    
    -- 计算当前数值：基础值 + (基础值 * 1.5 * 进度/100)
    -- 最大培养值 = 基础值 * 2.5
    -- 当前值 = 基础值 + (基础值 * 1.5 * 进度/100)
    SET v_current_hp = v_base_hp + ROUND(v_base_hp * 1.5 * v_hp_progress / 100);
    SET v_current_attack = v_base_attack + ROUND(v_base_attack * 1.5 * v_attack_progress / 100);
    SET v_current_defense = v_base_defense + ROUND(v_base_defense * 1.5 * v_defense_progress / 100);
    SET v_current_sp_attack = v_base_sp_attack + ROUND(v_base_sp_attack * 1.5 * v_sp_attack_progress / 100);
    SET v_current_sp_defense = v_base_sp_defense + ROUND(v_base_sp_defense * 1.5 * v_sp_defense_progress / 100);
    SET v_current_speed = v_base_speed + ROUND(v_base_speed * 1.5 * v_speed_progress / 100);
    
    -- 更新用户宠物表
    UPDATE user_pokemons
    SET 
        current_hp = v_current_hp,
        current_attack = v_current_attack,
        current_defense = v_current_defense,
        current_sp_attack = v_current_sp_attack,
        current_sp_defense = v_current_sp_defense,
        current_speed = v_current_speed,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_backpack_id;
    
    -- 返回更新后的数值
    SELECT 
        p_backpack_id as backpack_id,
        v_current_hp as current_hp,
        v_current_attack as current_attack,
        v_current_defense as current_defense,
        v_current_sp_attack as current_sp_attack,
        v_current_sp_defense as current_sp_defense,
        v_current_speed as current_speed;
END //

DELIMITER ;

-- 存储过程2: 批量重新计算所有用户宠物的当前数值
DELIMITER //

CREATE PROCEDURE recalculate_all_pokemon_stats()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_backpack_id INT;
    DECLARE cur CURSOR FOR SELECT id FROM user_pokemons;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_backpack_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        CALL update_user_pokemon_stats(v_backpack_id);
    END LOOP;
    
    CLOSE cur;
    
    SELECT '所有宠物属性已重新计算完成!' as message;
END //

DELIMITER ;

-- 存储过程3: 获取宠物培养建议
DELIMITER //

CREATE PROCEDURE get_training_suggestion(IN p_backpack_id INT)
BEGIN
    DECLARE v_hp_progress INT;
    DECLARE v_attack_progress INT;
    DECLARE v_defense_progress INT;
    DECLARE v_sp_attack_progress INT;
    DECLARE v_sp_defense_progress INT;
    DECLARE v_speed_progress INT;
    DECLARE v_base_sp_attack INT;
    DECLARE v_base_attack INT;
    DECLARE v_base_speed INT;
    DECLARE v_type1 VARCHAR(20);
    DECLARE v_type2 VARCHAR(20);
    DECLARE v_suggestion TEXT;
    
    -- 获取宠物信息和培养进度
    SELECT 
        up.hp_progress, up.attack_progress, up.defense_progress, 
        up.sp_attack_progress, up.sp_defense_progress, up.speed_progress,
        p.base_sp_attack, p.base_attack, p.base_speed,
        p.type1, p.type2
    INTO 
        v_hp_progress, v_attack_progress, v_defense_progress,
        v_sp_attack_progress, v_sp_defense_progress, v_speed_progress,
        v_base_sp_attack, v_base_attack, v_base_speed,
        v_type1, v_type2
    FROM user_pokemons up
    JOIN pokemons p ON up.pokemon_id = p.id
    WHERE up.id = p_backpack_id;
    
    -- 初始化建议
    SET v_suggestion = CONCAT('宠物培养建议：\n\n');
    
    -- 分析各项进度
    IF v_hp_progress < 30 THEN
        SET v_suggestion = CONCAT(v_suggestion, '1. 精力培养进度较低(', v_hp_progress, '%)，建议优先提升生存能力\n');
    END IF;
    
    IF v_attack_progress < 30 AND v_base_attack > v_base_sp_attack THEN
        SET v_suggestion = CONCAT(v_suggestion, '2. 攻击培养进度较低(', v_attack_progress, '%)，作为物理输出型宠物需要加强攻击\n');
    END IF;
    
    IF v_sp_attack_progress < 30 AND v_base_sp_attack > v_base_attack THEN
        SET v_suggestion = CONCAT(v_suggestion, '3. 魔攻培养进度较低(', v_sp_attack_progress, '%)，作为魔法输出型宠物需要加强魔攻\n');
    END IF;
    
    IF v_defense_progress < 30 THEN
        SET v_suggestion = CONCAT(v_suggestion, '4. 防御培养进度较低(', v_defense_progress, '%)，建议提升物理防御能力\n');
    END IF;
    
    IF v_sp_defense_progress < 30 THEN
        SET v_suggestion = CONCAT(v_suggestion, '5. 魔抗培养进度较低(', v_sp_defense_progress, '%)，建议提升魔法防御能力\n');
    END IF;
    
    IF v_speed_progress < 30 AND v_base_speed > 80 THEN
        SET v_suggestion = CONCAT(v_suggestion, '6. 速度培养进度较低(', v_speed_progress, '%)，作为高速型宠物需要加强速度\n');
    END IF;
    
    -- 属性相关建议
    IF v_type1 IN ('fire', 'electric', 'light') OR v_type2 IN ('fire', 'electric', 'light') THEN
        SET v_suggestion = CONCAT(v_suggestion, '\n属性建议：', v_type1, IFNULL(CONCAT('/', v_type2), ''), '属性，建议优先培养速度和特攻\n');
    END IF;
    
    IF v_type1 IN ('rock', 'steel', 'ground') OR v_type2 IN ('rock', 'steel', 'ground') THEN
        SET v_suggestion = CONCAT(v_suggestion, '\n属性建议：', v_type1, IFNULL(CONCAT('/', v_type2), ''), '属性，建议优先培养防御和生命\n');
    END IF;
    
    IF v_type1 IN ('water', 'grass', 'ice') OR v_type2 IN ('water', 'grass', 'ice') THEN
        SET v_suggestion = CONCAT(v_suggestion, '\n属性建议：', v_type1, IFNULL(CONCAT('/', v_type2), ''), '属性，建议均衡培养各项属性\n');
    END IF;
    
    -- 总体建议
    SET v_suggestion = CONCAT(v_suggestion, '\n总体建议：');
    
    IF (v_hp_progress + v_attack_progress + v_defense_progress + v_sp_attack_progress + v_sp_defense_progress + v_speed_progress) / 6 < 50 THEN
        SET v_suggestion = CONCAT(v_suggestion, '宠物整体培养度较低，建议全面培养\n');
    ELSEIF (v_hp_progress + v_attack_progress + v_defense_progress + v_sp_attack_progress + v_sp_defense_progress + v_speed_progress) / 6 < 80 THEN
        SET v_suggestion = CONCAT(v_suggestion, '宠物培养度中等，建议针对弱点重点培养\n');
    ELSE
        SET v_suggestion = CONCAT(v_suggestion, '宠物培养度较高，继续保持均衡发展\n');
    END IF;
    
    -- 返回建议
    SELECT p_backpack_id as backpack_id, v_suggestion as training_suggestion;
END //

DELIMITER ;

-- 测试存储过程1
CALL update_user_pokemon_stats(1);

-- 测试存储过程3
CALL get_training_suggestion(1);

-- 显示存储过程创建信息
SELECT 
    '存储过程创建完成!' as message,
    '1. update_user_pokemon_stats - 更新单个宠物属性' as procedure_1,
    '2. recalculate_all_pokemon_stats - 批量重新计算所有宠物属性' as procedure_2,
    '3. get_training_suggestion - 获取宠物培养建议' as procedure_3;
