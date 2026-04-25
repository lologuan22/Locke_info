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
TRUNCATE TABLE `pokemon`; -- 清空旧数据
INSERT INTO `pokemon` (`id`, `number`, `name`, `type1`, `height`, `weight`, `description`, `image_url`) VALUES 
(1, 133, '迪莫', '光系', 1.50, 26.80, '关于梦想的故事，已经重复到不想再去回忆。', '/api/images/dimo.gif'),
(2, 1, '喵喵', '草系', 0.60, 12.00, '经常在宠物园出没，是新进小洛克们最喜欢的伙伴之一。', '/api/images/r_miaomiao.gif'),
(3, 4, '火花', '火系', 0.60, 8.50, '尾巴上的火焰在高兴时会摆动得非常厉害。', '/images/huohua.gif'),
(4, 7, '水蓝蓝', '水系', 0.50, 9.00, '非常害羞，经常躲在水草后面观察别人。', '/images/shuilanlan.gif');
-- ==========================================


-- ==========================================
-- 3. 插入洛克王国种族值
-- ==========================================
TRUNCATE TABLE `pokemon_stats`;
INSERT INTO `pokemon_stats` (`pokemon_id`, `hp`, `atk`, `def`, `sp_atk`, `sp_def`, `speed`) VALUES 
(1, 100, 80, 85, 110, 95, 120),  -- 迪莫 (高魔攻高速度)
(2, 45, 49, 49, 65, 65, 45),    -- 喵喵
(3, 39, 52, 43, 60, 50, 65),    -- 火花
(4, 44, 48, 65, 50, 64, 43);    -- 水蓝蓝

-- ==========================================
-- 4. 修正：插入洛克王国真实技能
-- ==========================================
TRUNCATE TABLE `skill`;
INSERT INTO `skill` (`id`, `name`, `type`, `category`, `power`, `pp`, `effect`) VALUES 
(1, '闪烈剑', '光系', '物理', 40, 30, '给对手造成一定伤害'),
(2, '光芒护盾', '光系', '变化', NULL, 15, '提升自身的魔抗等级'),
(3, '粒子打击', '光系', '物理', 55, 15, '额外增加暴击率'),
(4, '寄生种子', '草系', '变化', NULL, 10, '每回合吸取对方生命'),
(5, '火之刃', '火系', '物理', 65, 15, '一定几率让对手进入烧伤或恐惧状态'),
(6, '泡沫力量', '水系', '魔法', 65, 20, '一定几率降低对手速度');

-- ==========================================
-- 5. 关联宠物与技能
-- ==========================================
TRUNCATE TABLE `pokemon_skill_relation`;
-- 迪莫：闪烈剑、光芒护盾、粒子打击
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(1, 1, 1), (1, 2, 10), (1, 3, 15);

-- 喵喵：寄生种子
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(2, 4, 13);

-- 火花：火之刃
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(3, 5, 16);

-- 水蓝蓝：泡沫力量
INSERT INTO `pokemon_skill_relation` (`pokemon_id`, `skill_id`, `require_level`) VALUES 
(4, 6, 18);
-- ==========================================
-- 6. 插入用户背包数据 (user_pokemon)
-- ==========================================
INSERT INTO `user_pokemon` (`user_id`, `pokemon_id`, `caught_at`) VALUES 
(1, 1, NOW()), -- 用户1拥有迪莫
(1, 2, NOW()), -- 用户1拥有喵喵
(2, 2, NOW()), -- 用户2拥有喵喵
(3, 3, NOW()); -- 用户3拥有小火龙