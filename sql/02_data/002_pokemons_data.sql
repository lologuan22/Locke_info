-- ===========================================
-- 游戏精灵背包图鉴系统 - 洛克王国宠物数据
-- 文件: 002_pokemons_data.sql
-- 功能: 插入洛克王国风格宠物数据
-- 执行顺序: 4
-- ===========================================

-- 确保使用正确的数据库
USE pokedex_db;

-- 清空现有宠物数据（仅用于开发环境）
-- DELETE FROM pokemons;
-- ALTER TABLE pokemons AUTO_INCREMENT = 1;

-- 插入洛克王国经典宠物数据
INSERT INTO pokemons (number, name, chinese_name, type1, type2, is_rare, is_vip, is_legendary, is_awakening, is_multiple_evolution, is_kingdom_boss, base_hp, base_attack, base_defense, base_sp_attack, base_sp_defense, base_speed, image_url, description) VALUES
-- 初始三主宠
('001', 'Spark', '火花', 'fire', NULL, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, 45, 60, 40, 65, 50, 65, '/images/pokemon/001.png', '火系初始宠物，尾巴上有永不熄灭的火焰'),
('002', 'WaterBlue', '水蓝蓝', 'water', NULL, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, 44, 48, 65, 50, 64, 43, '/images/pokemon/002.png', '水系初始宠物，身体大部分由水构成'),
('003', 'MiaoMiao', '喵喵', 'grass', NULL, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, 45, 49, 49, 65, 65, 45, '/images/pokemon/003.png', '草系初始宠物，头上有片神奇的叶子'),

-- 稀有宠物
('004', 'DragonKing', '龙王', 'dragon', 'fire', TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, 91, 134, 95, 100, 100, 80, '/images/pokemon/004.png', '龙系传说宠物，拥有统治天空的力量'),
('005', 'ThunderBird', '雷霆狮王', 'electric', 'flying', TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, 78, 84, 78, 109, 85, 100, '/images/pokemon/005.png', '电飞双系天界觉醒宠物，掌控雷电'),
('006', 'IcePhoenix', '冰晶凤凰', 'ice', 'flying', TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, 90, 100, 90, 125, 85, 90, '/images/pokemon/006.png', '冰飞双系VIP宠物，优雅而强大'),

-- VIP宠物
('007', 'GoldenDragon', '黄金龙', 'dragon', 'steel', FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 95, 125, 79, 60, 100, 81, '/images/pokemon/007.png', '龙钢双系VIP宠物，全身覆盖金色鳞片'),
('008', 'ShadowWing', '暗影幽龙', 'dark', 'flying', FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, 105, 130, 90, 110, 80, 85, '/images/pokemon/008.png', '暗飞双系VIP宠物，擅长暗影攻击'),

-- 天界觉醒宠物
('009', 'HolyKnight', '圣光骑士', 'light', 'steel', FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, 91, 72, 90, 129, 90, 108, '/images/pokemon/009.png', '光钢双系天界觉醒宠物，正义的化身'),
('010', 'DemonKing', '魔王', 'dark', 'fire', FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, 105, 120, 105, 140, 105, 95, '/images/pokemon/010.png', '暗火双系天界觉醒BOSS，力量恐怖'),

-- 多元进化宠物
('011', 'EvolutionFox', '进化灵狐', 'normal', 'psychic', FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, 55, 50, 45, 135, 95, 120, '/images/pokemon/011.png', '普通超能双系多元进化宠物，聪明伶俐'),
('012', 'MetalBeast', '钢铁巨兽', 'steel', 'fighting', FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, 80, 120, 130, 60, 60, 50, '/images/pokemon/012.png', '钢斗双系多元进化宠物，防御力惊人'),

-- 王国BOSS
('013', 'VolcanoLord', '火山领主', 'fire', 'ground', TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, 105, 130, 120, 90, 100, 75, '/images/pokemon/013.png', '火地双系王国BOSS，掌控火山之力'),
('014', 'OceanEmperor', '海洋帝王', 'water', 'dragon', TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, 100, 100, 90, 150, 120, 90, '/images/pokemon/014.png', '水龙双系王国BOSS，海洋的统治者'),

-- 普通宠物
('015', 'FireLion', '烈火狮', 'fire', NULL, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 65, 80, 60, 65, 60, 70, '/images/pokemon/015.png', '火系普通宠物，鬃毛如火焰般燃烧'),
('016', 'WaterTurtle', '水晶龟', 'water', NULL, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 79, 83, 100, 85, 105, 78, '/images/pokemon/016.png', '水系普通宠物，背甲坚硬如水晶'),
('017', 'GrassDeer', '森之鹿', 'grass', NULL, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 80, 82, 83, 100, 100, 80, '/images/pokemon/017.png', '草系普通宠物，与森林共生'),
('018', 'ThunderWolf', '雷狼', 'electric', NULL, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 60, 90, 55, 90, 80, 110, '/images/pokemon/018.png', '电系普通宠物，速度如闪电'),
('019', 'IceFox', '雪狐', 'ice', NULL, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 65, 60, 60, 110, 95, 130, '/images/pokemon/019.png', '冰系普通宠物，毛皮如白雪'),
('020', 'RockGiant', '岩巨', 'rock', NULL, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 80, 120, 130, 50, 65, 45, '/images/pokemon/020.png', '岩系普通宠物，身体由岩石构成');

-- 显示插入结果
SELECT 
    id,
    number,
    name,
    chinese_name,
    type1,
    type2,
    CASE 
        WHEN is_legendary THEN '传说'
        WHEN is_vip THEN 'VIP'
        WHEN is_rare THEN '稀有'
        WHEN is_awakening THEN '天界觉醒'
        WHEN is_multiple_evolution THEN '多元进化'
        WHEN is_kingdom_boss THEN '王国BOSS'
        ELSE '普通'
    END as type_category,
    base_hp,
    base_attack,
    base_defense,
    base_sp_attack,
    base_sp_defense,
    base_speed
FROM pokemons
ORDER BY id;

-- 显示统计信息
SELECT 
    COUNT(*) as total_pokemons,
    SUM(CASE WHEN is_rare THEN 1 ELSE 0 END) as rare_count,
    SUM(CASE WHEN is_vip THEN 1 ELSE 0 END) as vip_count,
    SUM(CASE WHEN is_legendary THEN 1 ELSE 0 END) as legendary_count,
    SUM(CASE WHEN is_awakening THEN 1 ELSE 0 END) as awakening_count,
    SUM(CASE WHEN is_multiple_evolution THEN 1 ELSE 0 END) as evolution_count,
    SUM(CASE WHEN is_kingdom_boss THEN 1 ELSE 0 END) as boss_count
FROM pokemons;
