-- 1. 插入宠物基础数据 (迪莫)
INSERT INTO `pokemon` (`id`, `number`, `name`, `type1`, `height`, `weight`, `description`, `image_url`) 
VALUES (1, 133, '迪莫', '光系', 1.50, 26.80, '关于梦想的故事，已经重复到不想再去回忆。这是关于梦想的故事，梦想简单却始终带着。这就是我，迪莫。', '/images/dimo.png');

-- 2. 插入迪莫的雷达图/属性数据 (假设满分是较大数据，这里填入种族值)
-- 顺序：精力, 攻击, 防御, 魔攻, 魔抗, 速度
INSERT INTO `pokemon_stats` (`pokemon_id`, `hp`, `atk`, `def`, `sp_atk`, `sp_def`, `speed`) 
VALUES (1, 100, 80, 85, 110, 95, 120);

-- 3. 插入技能原型数据
INSERT INTO `skill` (`id`, `name`, `type`, `category`, `power`, `pp`, `effect`) VALUES 
(1, '闪烈剑', '光系', '物理', 40, 30, '给对手造成一定伤害'),
(2, '光芒护盾', '光系', '变化', NULL, 15, '提升自身的魔抗等级'),
(3, '失明', '光系', '变化', NULL, 15, '降低对手命中等级'),
(4, '粒子打击', '光系', '物理', 55, 15, '给对手造成一定伤害');

-- 4. 建立宠物与技能的关联 (迪莫能学会以上四个技能)
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(1, 1, 0),  -- 初始技能
(1, 2, 0),  -- 初始技能
(1, 3, 0),  -- 初始技能
(1, 4, 15); -- 15级学会

-- 5. 插入第二个宠物（用于测试列表页查询）
INSERT INTO `pokemon` (`id`, `number`, `name`, `type1`, `height`, `weight`, `description`, `image_url`) 
VALUES (2, 1, '喵喵', '草系', 0.60, 12.00, '可爱的小猫，头顶有一朵含苞待放的花骨朵。', '/images/miaomiao.png');

INSERT INTO `pokemon_stats` (`pokemon_id`, `hp`, `atk`, `def`, `sp_atk`, `sp_def`, `speed`) 
VALUES (2, 45, 49, 49, 65, 65, 45);


UPDATE pokemon SET image_url = '/api/images/dimo.gif' WHERE id = 1;



-- 1. 为 ID 为 1 的用户添加迪莫 (Pokemon ID: 1)
INSERT INTO `user_pokemon` (`user_id`, `pokemon_id`, `caught_at`) 
VALUES (1, 1, NOW());

-- 2. 为 ID 为 1 的用户添加喵喵 (Pokemon ID: 2)
INSERT INTO `user_pokemon` (`user_id`, `pokemon_id`, `caught_at`) 
VALUES (1, 2, NOW());

-- 3. (可选) 为 ID 为 2 的用户只添加一只喵喵，用于测试权限隔离
INSERT INTO `user_pokemon` (`user_id`, `pokemon_id`, `caught_at`) VALUES (2, 2, NOW());