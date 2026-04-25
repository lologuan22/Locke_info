-- ===========================================
-- 游戏精灵背包图鉴系统 - 用户宠物详情视图
-- 文件: 001_user_pokemon_details.sql
-- 功能: 创建用户宠物详情视图
-- 执行顺序: 9
-- ===========================================

-- 确保使用正确的数据库
USE pokedex_db;

-- 删除已存在的视图
DROP VIEW IF EXISTS user_pokemon_details;
DROP VIEW IF EXISTS pokemon_type_effectiveness;
DROP VIEW IF EXISTS user_pokemon_training_summary;

-- 视图1: 用户宠物详细信息视图
CREATE VIEW user_pokemon_details AS
SELECT 
    up.id as backpack_id,
    u.id as user_id,
    u.username,
    u.nickname as user_nickname,
    p.id as pokemon_id,
    p.number,
    p.name as english_name,
    p.chinese_name,
    p.type1,
    p.type2,
    CASE 
        WHEN p.is_legendary THEN '传说'
        WHEN p.is_vip THEN 'VIP'
        WHEN p.is_rare THEN '稀有'
        WHEN p.is_awakening THEN '天界觉醒'
        WHEN p.is_multiple_evolution THEN '多元进化'
        WHEN p.is_kingdom_boss THEN '王国BOSS'
        ELSE '普通'
    END as rarity,
    p.image_url,
    p.description,
    
    -- 用户宠物信息
    up.nickname as pokemon_nickname,
    up.level,
    up.exp,
    
    -- 培养进度
    up.hp_progress,
    up.attack_progress,
    up.defense_progress,
    up.sp_attack_progress,
    up.sp_defense_progress,
    up.speed_progress,
    
    -- 基础数值
    p.base_hp,
    p.base_attack,
    p.base_defense,
    p.base_sp_attack,
    p.base_sp_defense,
    p.base_speed,
    
    -- 当前数值
    up.current_hp,
    up.current_attack,
    up.current_defense,
    up.current_sp_attack,
    up.current_sp_defense,
    up.current_speed,
    
    -- 最大培养数值（基础值 * 2.5）
    ROUND(p.base_hp * 2.5) as max_hp,
    ROUND(p.base_attack * 2.5) as max_attack,
    ROUND(p.base_defense * 2.5) as max_defense,
    ROUND(p.base_sp_attack * 2.5) as max_sp_attack,
    ROUND(p.base_sp_defense * 2.5) as max_sp_defense,
    ROUND(p.base_speed * 2.5) as max_speed,
    
    -- 状态标识
    CASE WHEN up.is_favorite THEN '是' ELSE '否' END as is_favorite,
    CASE WHEN up.is_shiny THEN '是' ELSE '否' END as is_shiny,
    
    -- 时间信息
    DATE_FORMAT(up.caught_date, '%Y-%m-%d %H:%i:%s') as caught_date,
    DATE_FORMAT(up.updated_at, '%Y-%m-%d %H:%i:%s') as last_updated,
    
    -- 计算属性
    ROUND((up.hp_progress + up.attack_progress + up.defense_progress + 
          up.sp_attack_progress + up.sp_defense_progress + up.speed_progress) / 6, 1) as avg_progress,
    
    -- 战力评分（简化公式）
    ROUND((up.current_hp + up.current_attack + up.current_defense + 
          up.current_sp_attack + up.current_sp_defense + up.current_speed) / 6) as combat_power
    
FROM user_pokemons up
JOIN users u ON up.user_id = u.id
JOIN pokemons p ON up.pokemon_id = p.id;

-- 视图2: 宠物属性相克信息视图
CREATE VIEW pokemon_type_effectiveness AS
SELECT 
    p.id as pokemon_id,
    p.chinese_name,
    p.type1,
    p.type2,
    
    -- 攻击优势
    (SELECT GROUP_CONCAT(CONCAT(defending_type, '(', multiplier, ')') ORDER BY multiplier DESC SEPARATOR ', ')
     FROM type_effectiveness te 
     WHERE te.attacking_type = p.type1 AND te.multiplier = 2.0) as type1_advantages,
    
    (SELECT GROUP_CONCAT(CONCAT(defending_type, '(', multiplier, ')') ORDER BY multiplier DESC SEPARATOR ', ')
     FROM type_effectiveness te 
     WHERE te.attacking_type = IFNULL(p.type2, p.type1) AND te.multiplier = 2.0) as type2_advantages,
    
    -- 防御弱点
    (SELECT GROUP_CONCAT(CONCAT(attacking_type, '(', multiplier, ')') ORDER BY multiplier DESC SEPARATOR ', ')
     FROM type_effectiveness te 
     WHERE te.defending_type = p.type1 AND te.multiplier = 2.0) as type1_weaknesses,
    
    (SELECT GROUP_CONCAT(CONCAT(attacking_type, '(', multiplier, ')') ORDER BY multiplier DESC SEPARATOR ', ')
     FROM type_effectiveness te 
     WHERE te.defending_type = IFNULL(p.type2, p.type1) AND te.multiplier = 2.0) as type2_weaknesses,
    
    -- 防御抵抗
    (SELECT GROUP_CONCAT(CONCAT(attacking_type, '(', multiplier, ')') ORDER BY multiplier ASC SEPARATOR ', ')
     FROM type_effectiveness te 
     WHERE te.defending_type = p.type1 AND te.multiplier = 0.5) as type1_resistances,
    
    (SELECT GROUP_CONCAT(CONCAT(attacking_type, '(', multiplier, ')') ORDER BY multiplier ASC SEPARATOR ', ')
     FROM type_effectiveness te 
     WHERE te.defending_type = IFNULL(p.type2, p.type1) AND te.multiplier = 0.5) as type2_resistances
    
FROM pokemons p
WHERE p.type1 IS NOT NULL;

-- 视图3: 用户宠物培养概况视图
CREATE VIEW user_pokemon_training_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.nickname as user_nickname,
    
    -- 宠物数量统计
    COUNT(up.id) as total_pokemons,
    SUM(CASE WHEN up.is_favorite THEN 1 ELSE 0 END) as favorite_count,
    SUM(CASE WHEN up.is_shiny THEN 1 ELSE 0 END) as shiny_count,
    
    -- 等级统计
    AVG(up.level) as avg_level,
    MAX(up.level) as max_level,
    MIN(up.level) as min_level,
    
    -- 培养进度统计
    AVG(up.hp_progress) as avg_hp_progress,
    AVG(up.attack_progress) as avg_attack_progress,
    AVG(up.defense_progress) as avg_defense_progress,
    AVG(up.sp_attack_progress) as avg_sp_attack_progress,
    AVG(up.sp_defense_progress) as avg_sp_defense_progress,
    AVG(up.speed_progress) as avg_speed_progress,
    
    -- 综合进度
    AVG((up.hp_progress + up.attack_progress + up.defense_progress + 
         up.sp_attack_progress + up.sp_defense_progress + up.speed_progress) / 6) as avg_overall_progress,
    
    -- 战力统计
    AVG(up.current_hp + up.current_attack + up.current_defense + 
        up.current_sp_attack + up.current_sp_defense + up.current_speed) as avg_combat_power,
    
    -- 稀有度统计
    SUM(CASE WHEN p.is_legendary THEN 1 ELSE 0 END) as legendary_count,
    SUM(CASE WHEN p.is_vip THEN 1 ELSE 0 END) as vip_count,
    SUM(CASE WHEN p.is_rare THEN 1 ELSE 0 END) as rare_count,
    SUM(CASE WHEN p.is_awakening THEN 1 ELSE 0 END) as awakening_count,
    SUM(CASE WHEN p.is_multiple_evolution THEN 1 ELSE 0 END) as evolution_count,
    SUM(CASE WHEN p.is_kingdom_boss THEN 1 ELSE 0 END) as boss_count,
    
    -- 属性类型统计
    COUNT(DISTINCT p.type1) as unique_type1_count,
    COUNT(DISTINCT p.type2) as unique_type2_count,
    
    -- 最新获得
    MAX(up.caught_date) as latest_catch
    
FROM users u
LEFT JOIN user_pokemons up ON u.id = up.user_id
LEFT JOIN pokemons p ON up.pokemon_id = p.id
GROUP BY u.id, u.username, u.nickname;

-- 测试视图1
SELECT 
    backpack_id,
    username,
    chinese_name,
    pokemon_nickname,
    level,
    hp_progress,
    attack_progress,
    current_hp,
    current_attack,
    combat_power
FROM user_pokemon_details
LIMIT 5;

-- 测试视图2
SELECT 
    pokemon_id,
    chinese_name,
    type1,
    type2,
    type1_advantages,
    type1_weaknesses
FROM pokemon_type_effectiveness
WHERE type1 IN ('fire', 'water', 'grass')
LIMIT 5;

-- 测试视图3
SELECT 
    username,
    total_pokemons,
    avg_level,
    avg_overall_progress,
    avg_combat_power
FROM user_pokemon_training_summary
WHERE total_pokemons > 0;

-- 显示视图创建信息
SELECT 
    '视图创建完成!' as message,
    '1. user_pokemon_details - 用户宠物详细信息视图' as view_1,
    '2. pokemon_type_effectiveness - 宠物属性相克信息视图' as view_2,
    '3. user_pokemon_training_summary - 用户宠物培养概况视图' as view_3;
