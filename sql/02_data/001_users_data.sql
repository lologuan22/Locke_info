-- 插入测试用户
-- 密码都是: 123456 (使用BCrypt加密)
INSERT INTO users (username, password, email, nickname, status) VALUES
('admin', '$2a$10$X5h2m5J7pQ5t2V5v5X5h2e5X5h2m5J7pQ5t2V5v5X5h2e5X5h2m5J7pQ5t2V5v5X5h2e', 'admin@pokedex.com', '管理员', 1),
('user1', '$2a$10$X5h2m5J7pQ5t2V5v5X5h2e5X5h2m5J7pQ5t2V5v5X5h2e5X5h2m5J7pQ5t2V5v5X5h2e', 'user1@pokedex.com', '训练师小明', 1),
('user2', '$2a$10$X5h2m5J7pQ5t2V5v5X5h2e5X5h2m5J7pQ5t2V5v5X5h2e5X5h2m5J7pQ5t2V5v5X5h2e', 'user2@pokedex.com', '精灵大师', 1);