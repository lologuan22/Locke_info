#!/bin/bash

# 游戏精灵背包图鉴系统 - 数据库一键安装脚本
# 使用说明: ./install.sh [数据库用户名] [数据库密码] [数据库主机] [数据库端口]

# 设置默认值
DB_USER=${1:-root}
DB_PASS=${2:-password}
DB_HOST=${3:-localhost}
DB_PORT=${4:-3306}
DB_NAME="pokedex_db"

echo "开始安装游戏精灵背包图鉴系统数据库..."
echo "数据库: $DB_NAME"
echo "主机: $DB_HOST:$DB_PORT"
echo "用户: $DB_USER"

# 检查mysql命令是否可用
if ! command -v mysql &> /dev/null; then
    echo "错误: mysql客户端未安装，请先安装MySQL客户端"
    exit 1
fi

# 执行顺序数组
SQL_FILES=(
    "01_schema/001_database_create.sql"
    "01_schema/002_users_table.sql"
    "01_schema/003_pokemons_table.sql"
    "01_schema/004_user_pokemons_table.sql"
    "01_schema/005_type_effectiveness.sql"
    "02_data/001_users_data.sql"
    "02_data/002_pokemons_data.sql"
    "02_data/003_type_effectiveness_data.sql"
    "02_data/004_user_pokemons_data.sql"
    "03_procedures/001_update_pokemon_stats.sql"
    "05_views/001_user_pokemon_details.sql"
    "04_triggers/001_user_pokemon_trigger.sql"
)

# 执行每个SQL文件
for sql_file in "${SQL_FILES[@]}"; do
    if [ -f "$sql_file" ]; then
        echo "正在执行: $sql_file"
        mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS < "$sql_file"
        
        if [ $? -ne 0 ]; then
            echo "错误: 执行 $sql_file 时发生错误"
            exit 1
        fi
    else
        echo "警告: 文件 $sql_file 不存在，跳过"
    fi
done

echo ""
echo "=========================================="
echo "数据库安装完成!"
echo "=========================================="
echo "数据库名称: $DB_NAME"
echo "测试用户:"
echo "  用户名: admin    密码: 123456"
echo "  用户名: user1    密码: 123456"
echo "  用户名: user2    密码: 123456"
echo ""
echo "可以使用以下命令连接数据库:"
echo "  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME"
echo "=========================================="