# Locke_info 数据库文档

## 概述

Locke_info 项目是一个基于宝可梦主题的Web应用，后端使用Spring Boot框架，前端使用HTML/CSS/JavaScript。本数据库文档描述了项目的数据库结构和数据初始化脚本。

数据库名称：`pokedex_db`

## 数据库表结构

### 1. 用户表 (users)
存储用户信息，包括登录凭据、个人资料等。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码（加密存储） |
| email | VARCHAR(100) | 邮箱，唯一 |
| nickname | VARCHAR(50) | 昵称 |
| avatar_url | VARCHAR(255) | 头像URL |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |
| last_login | TIMESTAMP | 最后登录时间 |
| status | TINYINT | 状态（0-禁用，1-正常） |

### 2. 宝可梦基础信息表 (pokemon)
存储宝可梦的基本信息。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 主键，自增 |
| number | INT | 宝可梦编号，唯一 |
| name | VARCHAR(50) | 宝可梦名称 |
| type1 | VARCHAR(20) | 主属性/系别 |
| height | DECIMAL(5,2) | 身高(m) |
| weight | DECIMAL(5,2) | 体重(kg) |
| description | TEXT | 宝可梦简介 |
| image_url | VARCHAR(255) | 图片路径 |
| is_legendary | TINYINT(1) | 是否为神兽 |
| is_rare | TINYINT(1) | 是否稀有 |

### 3. 宝可梦种族值表 (pokemon_stats)
存储宝可梦的种族值，与pokemon表一对一关系。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| pokemon_id | INT | 外键，关联pokemon.id |
| hp | INT | 生命值 |
| atk | INT | 攻击 |
| def | INT | 防御 |
| sp_atk | INT | 特殊攻击 |
| sp_def | INT | 特殊防御 |
| speed | INT | 速度 |

### 4. 技能信息表 (skill)
存储宝可梦技能信息。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(50) | 技能名称 |
| type | VARCHAR(20) | 技能属性 |
| category | VARCHAR(20) | 类型（物理/变化/魔法） |
| power | INT | 威力 |
| pp | INT | PP值 |
| effect | VARCHAR(255) | 技能效果描述 |

### 5. 用户背包表 (user_pokemon)
存储用户拥有的宝可梦，多对多关系。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INT | 主键，自增 |
| user_id | INT | 外键，关联users.id |
| pokemon_id | INT | 外键，关联pokemon.id |
| caught_at | DATETIME | 获得时间 |

### 6. 宝可梦技能关联表 (pokemon_skill_relation)
存储宝可梦与技能的多对多关系。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| pokemon_id | INT | 外键，关联pokemon.id |
| skill_id | INT | 外键，关联skill.id |
| require_level | INT | 学习所需等级 |

## 数据初始化

### 步骤1：创建数据库和表
运行 `create_table.sql` 脚本，该脚本将：
- 创建 `pokedex_db` 数据库
- 创建所有表结构
- 设置外键约束和索引

### 步骤2：插入初始数据
运行 `data.sql` 脚本，该脚本将：
- 清空所有表数据
- 插入两个测试用户（admin 和 xiaoluoke）
- 插入67种宝可梦的基础信息和种族值
- 插入技能数据（如果有）

## 注意事项

1. **字符集**：数据库使用 `utf8mb4` 字符集，支持中文和特殊字符。
2. **外键约束**：表间存在外键关系，删除操作会级联。
3. **索引优化**：在常用查询字段上建立了索引。
4. **数据完整性**：使用 InnoDB 引擎确保事务安全。

## 相关文件

- `create_table.sql`：数据库表创建脚本
- `data.sql`：初始数据插入脚本

## 开发环境配置

在 `application.yml` 或 `application-local.yml` 中配置数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/pokedex_db
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```
