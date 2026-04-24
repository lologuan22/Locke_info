use pokedex_db;

CREATE TABLE `pokemon` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `number` int NOT NULL COMMENT '宠物编号',
  `name` varchar(50) NOT NULL COMMENT '宠物名称',
  `type1` varchar(20) DEFAULT NULL COMMENT '主属性/系别',
  `height` decimal(5,2) DEFAULT NULL COMMENT '身高(m)',
  `weight` decimal(5,2) DEFAULT NULL COMMENT '体重(kg)',
  `description` text COMMENT '宠物简介',
  `image_url` varchar(255) DEFAULT NULL COMMENT '宠物立绘图片路径',
  `is_legendary` tinyint(1) DEFAULT '0' COMMENT '是否为神兽',
  `is_rare` tinyint(1) DEFAULT '0' COMMENT '是否稀有',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_number` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物基础信息表';


CREATE TABLE `pokemon_stats` (
  `pokemon_id` int NOT NULL COMMENT '关联宠物ID',
  `hp` int DEFAULT '0' COMMENT '精力/生命值',
  `atk` int DEFAULT '0' COMMENT '攻击',
  `def` int DEFAULT '0' COMMENT '防御',
  `sp_atk` int DEFAULT '0' COMMENT '魔攻',
  `sp_def` int DEFAULT '0' COMMENT '魔抗',
  `speed` int DEFAULT '0' COMMENT '速度',
  PRIMARY KEY (`pokemon_id`),
  CONSTRAINT `fk_stats_pokemon` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物种族值/属性表';



CREATE TABLE `skill` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '技能ID',
  `name` varchar(50) NOT NULL COMMENT '技能名称',
  `type` varchar(20) DEFAULT NULL COMMENT '技能属性(如光系)',
  `category` varchar(20) DEFAULT NULL COMMENT '类型(物理/变化/魔法)',
  `power` int DEFAULT NULL COMMENT '威力',
  `pp` int DEFAULT NULL COMMENT 'PP值',
  `effect` varchar(255) DEFAULT NULL COMMENT '技能效果描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技能信息表';


CREATE TABLE `pokemon_skill_relation` (
  `pokemon_id` int NOT NULL COMMENT '宠物ID',
  `skill_id` int NOT NULL COMMENT '技能ID',
  `require_level` int DEFAULT '0' COMMENT '学习所需等级',
  PRIMARY KEY (`pokemon_id`, `skill_id`),
  KEY `idx_skill` (`skill_id`),
  CONSTRAINT `fk_rel_pokemon` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rel_skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物技能关联表';



DROP TABLE pokemons;CREATE TABLE `pokemon_skill_relation` (
  `pokemon_id` int NOT NULL COMMENT '宠物ID',
  `skill_id` int NOT NULL COMMENT '技能ID',
  `require_level` int DEFAULT '0' COMMENT '学习所需等级',
  PRIMARY KEY (`pokemon_id`, `skill_id`),
  KEY `idx_skill` (`skill_id`),
  CONSTRAINT `fk_rel_pokemon` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rel_skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物技能关联表';CREATE TABLE `pokemon` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `number` int NOT NULL COMMENT '宠物编号',
  `name` varchar(50) NOT NULL COMMENT '宠物名称',
  `type1` varchar(20) DEFAULT NULL COMMENT '主属性/系别',
  `height` decimal(5,2) DEFAULT NULL COMMENT '身高(m)',
  `weight` decimal(5,2) DEFAULT NULL COMMENT '体重(kg)',
  `description` text COMMENT '宠物简介',
  `image_url` varchar(255) DEFAULT NULL COMMENT '宠物立绘图片路径',
  `is_legendary` tinyint(1) DEFAULT '0' COMMENT '是否为神兽',
  `is_rare` tinyint(1) DEFAULT '0' COMMENT '是否稀有',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_number` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物基础信息表';


CREATE TABLE `pokemon_stats` (
  `pokemon_id` int NOT NULL COMMENT '关联宠物ID',
  `hp` int DEFAULT '0' COMMENT '精力/生命值',
  `atk` int DEFAULT '0' COMMENT '攻击',
  `def` int DEFAULT '0' COMMENT '防御',
  `sp_atk` int DEFAULT '0' COMMENT '魔攻',
  `sp_def` int DEFAULT '0' COMMENT '魔抗',
  `speed` int DEFAULT '0' COMMENT '速度',
  PRIMARY KEY (`pokemon_id`),
  CONSTRAINT `fk_stats_pokemon` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物种族值/属性表';



CREATE TABLE `skill` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '技能ID',
  `name` varchar(50) NOT NULL COMMENT '技能名称',
  `type` varchar(20) DEFAULT NULL COMMENT '技能属性(如光系)',
  `category` varchar(20) DEFAULT NULL COMMENT '类型(物理/变化/魔法)',
  `power` int DEFAULT NULL COMMENT '威力',
  `pp` int DEFAULT NULL COMMENT 'PP值',
  `effect` varchar(255) DEFAULT NULL COMMENT '技能效果描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技能信息表';


CREATE TABLE `pokemon_skill_relation` (
  `pokemon_id` int NOT NULL COMMENT '宠物ID',
  `skill_id` int NOT NULL COMMENT '技能ID',
  `require_level` int DEFAULT '0' COMMENT '学习所需等级',
  PRIMARY KEY (`pokemon_id`, `skill_id`),
  KEY `idx_skill` (`skill_id`),
  CONSTRAINT `fk_rel_pokemon` FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rel_skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物技能关联表';





-- DROP TABLE pokemons;

-- DROP TABLE user_pokemons;


SELECT * FROM `pokemon`;
SELECT * FROM `pokemon_stats`;
SELECT * FROM `skill`;
SELECT * FROM `pokemon_skill_relation`;
