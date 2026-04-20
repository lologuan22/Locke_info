## 表结构说明
```sql/
├── 01_schema/              # 数据库结构文件
│   ├── 001_database_create.sql      # 创建数据库
│   ├── 002_users_table.sql          # 用户表
│   ├── 003_pokemons_table.sql       # 宠物基础表
│   ├── 004_user_pokemons_table.sql  # 用户背包表
│   └── 005_type_effectiveness.sql   # 属性相克表
│   
├── 02_data/                # 测试数据文件
│   ├── 001_users_data.sql           # 用户数据
│   ├── 002_pokemons_data.sql        # 宠物基础数据
│   ├── 003_type_effectiveness_data.sql  # 属性相克数据
│   └── 004_user_pokemons_data.sql   # 用户宠物数据
│   
├── 03_procedures/          # 存储过程和函数
│   └── 001_update_pokemon_stats.sql  # 更新宠物数值存储过程
│   
├── 04_triggers/            # 触发器
│   └── 001_user_pokemon_trigger.sql  # 宠物进度更新触发器
│   
├── 05_views/               # 视图
│   └── 001_user_pokemon_details.sql  # 用户宠物详情视图
│   
├── install.sh              # 一键安装脚本
└── README.md               # 数据库总体说明
```

### 1. users (用户表)
存储系统用户信息，包括登录凭证和个人信息。

### 2. pokemons (宠物基础表)
存储所有宠物的基础信息，包括属性、图片和基础数值。

### 3. user_pokemons (用户背包表)
存储用户拥有的宠物，包含培养进度和当前数值。

### 4. type_effectiveness (属性相克表)
存储属性相克关系，用于属性计算器功能。

## 测试数据

### 用户账户
- 用户名: admin, 密码: 123456 (管理员)
- 用户名: user1, 密码: 123456 (普通用户)
- 用户名: user2, 密码: 123456 (普通用户)

### 宠物数据
包含20个经典宠物，涵盖各种属性类型。

## 自动化功能

### 触发器
- `after_user_pokemon_update`: 当宠物培养进度更新时，自动重新计算当前数值

### 存储过程
- `update_user_pokemon_stats`: 更新指定宠物的当前数值

### 视图
- `user_pokemon_details`: 提供用户宠物的详细信息视图

## 维护说明

1. 定期备份数据库
2. 生产环境修改密码
3. 根据需要添加索引优化查询性能
