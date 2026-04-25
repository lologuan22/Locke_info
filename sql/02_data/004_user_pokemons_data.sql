-- ===========================================
-- 游戏精灵背包图鉴系统 - 用户宠物数据
-- 文件: 004_user_pokemons_data.sql
-- 功能: 插入用户宠物测试数据
-- 执行顺序: 6
-- ===========================================

-- 确保使用正确的数据库
USE pokedex_db;

-- 清空现有用户宠物数据（仅用于开发环境）
-- DELETE FROM user_pokemons;
-- ALTER TABLE user_pokemons AUTO_INCREMENT = 1;

-- 插入用户宠物测试数据
-- 用户1 (user1) 的宠物
INSERT INTO user_pokemons (user_id, pokemon_id, nickname, level, exp, hp_progress, attack_progress, defense_progress, sp_attack_progress, sp_defense_progress, speed_progress, current_hp, current_attack, current_defense, current_sp_attack, current_sp_defense, current_speed, is_favorite, is_shiny, caught_date) VALUES
(2, 1, '小火龙', 15, 450, 60, 75, 40, 80, 50, 70, 54, 85, 48, 92, 60, 78, TRUE, FALSE, '2026-01-15 10:30:00'),
(2, 2, '小蓝', 12, 280, 50, 60, 85, 55, 80, 45, 52, 60, 85, 60, 85, 50, FALSE, FALSE, '2026-01-20 14:15:00'),
(2, 3, '叶子喵', 10, 200, 40, 50, 50, 70, 70, 45, 47, 55, 55, 75, 75, 50, FALSE, FALSE, '2026-01-25 09:45:00'),
(2, 6, '闪凤凰', 25, 1200, 85, 90, 80, 95, 85, 90, 103, 113, 94, 135, 101, 108, TRUE, TRUE, '2026-02-10 16:20:00'),

-- 用户2 (user2) 的宠物
(3, 4, '龙王', 30, 2000, 90, 95, 90, 85, 90, 80, 114, 155, 114, 117, 117, 96, TRUE, FALSE, '2026-01-10 11:00:00'),
(3, 5, '雷狮', 28, 1800, 85, 90, 85, 100, 90, 95, 100, 110, 100, 135, 101, 120, FALSE, FALSE, '2026-01-18 15:30:00'),
(3, 7, '金龙', 22, 950, 75, 85, 70, 55, 85, 80, 98, 135, 90, 70, 112, 97, TRUE, FALSE, '2026-02-01 13:45:00'),
(3, 9, '圣骑士', 20, 800, 70, 65, 85, 90, 85, 95, 95, 85, 103, 135, 103, 125, FALSE, FALSE, '2026-02-05 10:15:00'),

-- 用户1 的更多宠物
(2, 8, '暗影龙', 18, 650, 65, 80, 75, 85, 70, 80, 115, 140, 103, 120, 94, 101, FALSE, FALSE, '2026-02-12 14:30:00'),
(2, 11, '灵狐', 16, 550, 60, 55, 50, 90, 80, 95, 61, 60, 52, 144, 107, 138, TRUE, FALSE, '2026-02-15 11:20:00'),

-- 用户2 的更多宠物
(3, 12, '钢铁兽', 24, 1100, 80, 90, 95, 55, 55, 45, 96, 138, 155, 70, 70, 57, FALSE, FALSE, '2026-02-08 09:10:00'),
(3, 15, '烈火狮', 14, 350, 55, 70, 55, 60, 55, 65, 67, 91, 64, 73, 64, 80, FALSE, FALSE, '2026-02-18 16:45:00');

-- 更新计算当前数值（基于进度）
-- 注意：这里手动计算了当前数值，实际应用中由触发器自动计算
UPDATE user_pokemons up
JOIN pokemons p ON up.pokemon_id = p.id
SET 
    up.current_hp = p.base_hp + ROUND(p.base_hp * 1.5 * up.hp_progress / 100),
    up.current_attack = p.base_attack + ROUND(p.base_attack * 1.5 * up.attack_progress / 100),
    up.current_defense = p.base_defense + ROUND(p.base_defense * 1.5 * up.defense_progress / 100),
    up.current_sp_attack = p.base_sp_attack + ROUND(p.base_sp_attack * 1.5 * up.sp_attack_progress / 100),
    up.current_sp_defense = p.base_sp_defense + ROUND(p.base_sp_defense * 1.5 * up.sp_defense_progress / 100),
    up.current_speed = p.base_speed + ROUND(p.base_speed * 1.5 * up.speed_progress / 100)
WHERE up.id IS NOT NULL;

-- 显示用户宠物数据
SELECT 
    up.id as '背包ID',
    u.username as '用户名',
    p.number as '宠物编号',
    p.chinese_name as '宠物名称',
    p.type1 as '主属性',
    p.type2 as '副属性',
    up.nickname as '昵称',
    up.level as '等级',
    up.hp_progress as '精力进度',
    up.attack_progress as '攻击进度',
    up.defense_progress as '防御进度',
    up.sp_attack_progress as '魔攻进度',
    up.sp_defense_progress as '魔抗进度',
    up.speed_progress as '速度进度',
    CASE WHEN up.is_favorite THEN '是' ELSE '否' END as '收藏',
    CASE WHEN up.is_shiny THEN '是' ELSE '否' END as '闪光',
    DATE_FORMAT(up.caught_date, '%Y-%m-%d') as '获得日期'
FROM user_pokemons up
JOIN users u ON up.user_id = u.id
JOIN pokemons p ON up.pokemon_id = p.id
ORDER BY u.username, up.level DESC;

-- 显示统计信息
SELECT 
    u.username as '用户名',
    COUNT(up.id) as '宠物数量',
    SUM(CASE WHEN up.is_favorite THEN 1 ELSE 0 END) as '收藏数量',
    SUM(CASE WHEN up.is_shiny THEN 1 ELSE 0 END) as '闪光数量',
    AVG(up.level) as '平均等级',
    MAX(up.level) as '最高等级'
FROM user_pokemons up
JOIN users u ON up.user_id = u.id
GROUP BY u.username
ORDER BY COUNT(up.id) DESC;
