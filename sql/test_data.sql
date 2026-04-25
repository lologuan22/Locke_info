-- ==========================================
-- 1. 插入用户数据 (users)
-- ==========================================
INSERT INTO `users` (`id`, `username`, `password`, `email`, `nickname`, `status`) VALUES 
(1, 'trainer_red', '123456', 'red@kanto.com', '小赤', 1),
(2, 'trainer_blue', '123456', 'blue@kanto.com', '小茂', 1),
(3, 'trainer_ash', '123456', 'ash@pallet.com', '小智', 1);

-- ==========================================
-- 2. 插入宠物基础数据 (pokemon)
-- ==========================================
INSERT INTO `pokemon` (`id`, `number`, `name`, `type1`, `height`, `weight`, `description`, `image_url`) VALUES 
(1, 133, '迪莫', '光系', 1.50, 26.80, '关于梦想的故事，已经重复到不想再去回忆。', '/api/images/dimo.gif'),
(2, 1, '喵喵', '草系', 0.60, 12.00, '可爱的小猫，头顶有一朵含苞待放的花骨朵。', '/images/miaomiao.png'),
(3, 4, '小火龙', '火系', 0.60, 8.50, '尾巴上的火焰代表着它的生命力，火焰熄灭时生命也会结束。', '/images/xiaohuolong.png');

-- ==========================================
-- 3. 插入宠物种族值数据 (pokemon_stats)
-- ==========================================
INSERT INTO `pokemon_stats` (`pokemon_id`, `hp`, `atk`, `def`, `sp_atk`, `sp_def`, `speed`) VALUES 
(1, 100, 80, 85, 110, 95, 120),  -- 迪莫
(2, 45, 49, 49, 65, 65, 45),    -- 喵喵
(3, 39, 52, 43, 60, 50, 65);    -- 小火龙

-- ==========================================
-- 4. 插入技能原型数据 (skill)
-- ==========================================
INSERT INTO `skill` (`id`, `name`, `type`, `category`, `power`, `pp`, `effect`) VALUES 
(1, '闪烈剑', '光系', '物理', 40, 30, '给对手造成一定伤害'),
(2, '光芒护盾', '光系', '变化', NULL, 15, '提升自身的魔抗等级'),
(3, '失明', '光系', '变化', NULL, 15, '降低对手命中等级'),
(4, '粒子打击', '光系', '物理', 55, 15, '给对手造成一定伤害'),
(5, '火花', '火系', '魔法', 40, 25, '用微弱的火焰攻击对手，有时使对手烧伤'),
(6, '藤鞭', '草系', '物理', 45, 25, '挥动藤蔓抽打对手进行攻击');

-- ==========================================
-- 5. 插入宠物与技能的关联 (pokemon_skill_relation)
-- ==========================================
-- 迪莫能学会的技能
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(1, 1, 0), (1, 2, 0), (1, 3, 0), (1, 4, 15);

-- 喵喵能学会的技能
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(2, 6, 0);

-- 小火龙能学会的技能
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(3, 5, 0);

-- ==========================================
-- 6. 插入用户背包数据 (user_pokemon)
-- ==========================================
INSERT INTO `user_pokemon` (`user_id`, `pokemon_id`, `caught_at`) VALUES 
(1, 1, NOW()), -- 用户1拥有迪莫
(1, 2, NOW()), -- 用户1拥有喵喵
(2, 2, NOW()), -- 用户2拥有喵喵
(3, 3, NOW()); -- 用户3拥有小火龙