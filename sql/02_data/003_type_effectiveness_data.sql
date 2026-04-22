-- ===========================================
-- 游戏精灵背包图鉴系统 - 属性相克数据
-- 文件: 003_type_effectiveness_data.sql
-- 功能: 插入洛克王国属性相克数据
-- 执行顺序: 5
-- ===========================================

-- 确保使用正确的数据库
USE pokedex_db;

-- 清空现有属性相克数据（仅用于开发环境）
-- DELETE FROM type_effectiveness;
-- ALTER TABLE type_effectiveness AUTO_INCREMENT = 1;

-- 插入洛克王国属性相克数据
-- 攻击属性 vs 防御属性 -> 伤害倍数
-- 2.0 = 效果超群, 1.0 = 一般, 0.5 = 效果不好, 0 = 无效
INSERT INTO type_effectiveness (attacking_type, defending_type, multiplier) VALUES
-- 火系攻击
('fire', 'grass', 2.0),     -- 火克草
('fire', 'ice', 2.0),       -- 火克冰
('fire', 'steel', 2.0),     -- 火克钢
('fire', 'bug', 2.0),       -- 火克虫
('fire', 'fire', 0.5),      -- 火抗火
('fire', 'water', 0.5),     -- 水克火
('fire', 'rock', 0.5),      -- 岩克火
('fire', 'dragon', 0.5),    -- 龙抗火

-- 水系攻击
('water', 'fire', 2.0),     -- 水克火
('water', 'rock', 2.0),     -- 水克岩
('water', 'ground', 2.0),   -- 水克地
('water', 'water', 0.5),    -- 水抗水
('water', 'grass', 0.5),    -- 草克水
('water', 'dragon', 0.5),   -- 龙抗水

-- 草系攻击
('grass', 'water', 2.0),    -- 草克水
('grass', 'rock', 2.0),     -- 草克岩
('grass', 'ground', 2.0),   -- 草克地
('grass', 'grass', 0.5),    -- 草抗草
('grass', 'fire', 0.5),     -- 火克草
('grass', 'poison', 0.5),   -- 毒克草
('grass', 'flying', 0.5),   -- 飞克草
('grass', 'bug', 0.5),      -- 虫克草
('grass', 'dragon', 0.5),   -- 龙抗草
('grass', 'steel', 0.5),    -- 钢抗草

-- 电系攻击
('electric', 'water', 2.0), -- 电克水
('electric', 'flying', 2.0),-- 电克飞
('electric', 'electric', 0.5), -- 电抗电
('electric', 'grass', 0.5), -- 草抗电
('electric', 'dragon', 0.5),-- 龙抗电
('electric', 'ground', 0),  -- 地免疫电

-- 冰系攻击
('ice', 'grass', 2.0),      -- 冰克草
('ice', 'ground', 2.0),     -- 冰克地
('ice', 'flying', 2.0),     -- 冰克飞
('ice', 'dragon', 2.0),     -- 冰克龙
('ice', 'ice', 0.5),        -- 冰抗冰
('ice', 'water', 0.5),      -- 水抗冰
('ice', 'fire', 0.5),       -- 火克冰
('ice', 'steel', 0.5),      -- 钢抗冰

-- 格斗系攻击
('fighting', 'normal', 2.0),-- 斗克普
('fighting', 'ice', 2.0),   -- 斗克冰
('fighting', 'rock', 2.0),  -- 斗克岩
('fighting', 'dark', 2.0),  -- 斗克暗
('fighting', 'steel', 2.0), -- 斗克钢
('fighting', 'poison', 0.5),-- 毒抗斗
('fighting', 'flying', 0.5),-- 飞克斗
('fighting', 'psychic', 0.5),-- 超能克斗
('fighting', 'bug', 0.5),   -- 虫抗斗
('fighting', 'ghost', 0),   -- 鬼免疫斗

-- 毒系攻击
('poison', 'grass', 2.0),   -- 毒克草
('poison', 'fairy', 2.0),   -- 毒克妖
('poison', 'poison', 0.5),  -- 毒抗毒
('poison', 'ground', 0.5),  -- 地克毒
('poison', 'rock', 0.5),    -- 岩抗毒
('poison', 'ghost', 0.5),   -- 鬼抗毒
('poison', 'steel', 0),     -- 钢免疫毒

-- 地面系攻击
('ground', 'fire', 2.0),    -- 地克火
('ground', 'electric', 2.0),-- 地克电
('ground', 'poison', 2.0),  -- 地克毒
('ground', 'rock', 2.0),    -- 地克岩
('ground', 'steel', 2.0),   -- 地克钢
('ground', 'grass', 0.5),   -- 草抗地
('ground', 'bug', 0.5),     -- 虫抗地
('ground', 'flying', 0),    -- 飞免疫地

-- 飞行系攻击
('flying', 'grass', 2.0),   -- 飞克草
('flying', 'fighting', 2.0),-- 飞克斗
('flying', 'bug', 2.0),     -- 飞克虫
('flying', 'electric', 0.5),-- 电克飞
('flying', 'rock', 0.5),    -- 岩克飞
('flying', 'steel', 0.5),   -- 钢抗飞

-- 超能力系攻击
('psychic', 'fighting', 2.0),-- 超能克斗
('psychic', 'poison', 2.0), -- 超能克毒
('psychic', 'psychic', 0.5),-- 超能抗超能
('psychic', 'steel', 0.5),  -- 钢抗超能
('psychic', 'dark', 0),     -- 暗免疫超能

-- 虫系攻击
('bug', 'grass', 2.0),      -- 虫克草
('bug', 'psychic', 2.0),    -- 虫克超能
('bug', 'dark', 2.0),       -- 虫克暗
('bug', 'fire', 0.5),       -- 火克虫
('bug', 'fighting', 0.5),   -- 斗克虫
('bug', 'poison', 0.5),     -- 毒克虫
('bug', 'flying', 0.5),     -- 飞克虫
('bug', 'ghost', 0.5),      -- 鬼抗虫
('bug', 'steel', 0.5),      -- 钢抗虫
('bug', 'fairy', 0.5),      -- 妖抗虫

-- 岩石系攻击
('rock', 'fire', 2.0),      -- 岩克火
('rock', 'ice', 2.0),       -- 岩克冰
('rock', 'flying', 2.0),    -- 岩克飞
('rock', 'bug', 2.0),       -- 岩克虫
('rock', 'fighting', 0.5),  -- 斗克岩
('rock', 'ground', 0.5),    -- 地克岩
('rock', 'steel', 0.5),     -- 钢抗岩

-- 幽灵系攻击
('ghost', 'psychic', 2.0),  -- 鬼克超能
('ghost', 'ghost', 2.0),    -- 鬼克鬼
('ghost', 'dark', 0.5),     -- 暗抗鬼
('ghost', 'normal', 0),     -- 普免疫鬼

-- 龙系攻击
('dragon', 'dragon', 2.0),  -- 龙克龙
('dragon', 'steel', 0.5),   -- 钢抗龙
('dragon', 'fairy', 0),     -- 妖免疫龙

-- 恶系攻击
('dark', 'psychic', 2.0),   -- 暗克超能
('dark', 'ghost', 2.0),     -- 暗克鬼
('dark', 'fighting', 0.5),  -- 斗克暗
('dark', 'dark', 0.5),      -- 暗抗暗
('dark', 'fairy', 0.5),     -- 妖抗暗

-- 钢系攻击
('steel', 'ice', 2.0),      -- 钢克冰
('steel', 'rock', 2.0),     -- 钢克岩
('steel', 'fairy', 2.0),    -- 钢克妖
('steel', 'fire', 0.5),     -- 火克钢
('steel', 'water', 0.5),    -- 水抗钢
('steel', 'electric', 0.5), -- 电抗钢
('steel', 'steel', 0.5),    -- 钢抗钢

-- 妖精系攻击
('fairy', 'fighting', 2.0), -- 妖克斗
('fairy', 'dragon', 2.0),   -- 妖克龙
('fairy', 'dark', 2.0),     -- 妖克暗
('fairy', 'fire', 0.5),     -- 火克妖
('fairy', 'poison', 0.5),   -- 毒克妖
('fairy', 'steel', 0.5),    -- 钢抗妖

-- 光系攻击（洛克王国特有）
('light', 'dark', 2.0),     -- 光克暗
('light', 'ghost', 2.0),    -- 光克鬼
('light', 'light', 0.5),    -- 光抗光
('light', 'dragon', 0.5);   -- 龙抗光

-- 显示属性相克数据
SELECT 
    attacking_type as '攻击属性',
    defending_type as '防御属性',
    multiplier as '伤害倍数',
    CASE 
        WHEN multiplier = 2.0 THEN '效果超群'
        WHEN multiplier = 1.0 THEN '一般'
        WHEN multiplier = 0.5 THEN '效果不好'
        WHEN multiplier = 0 THEN '无效'
        ELSE '特殊'
    END as '效果描述'
FROM type_effectiveness
ORDER BY attacking_type, defending_type;

-- 显示属性数量统计
SELECT 
    COUNT(*) as total_effectiveness_rules,
    COUNT(DISTINCT attacking_type) as unique_attacking_types,
    COUNT(DISTINCT defending_type) as unique_defending_types
FROM type_effectiveness;
