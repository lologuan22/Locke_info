# 🎮 洛克王国图鉴与背包系统

一个基于Spring Boot + Vue 3 + MySQL/H2的精灵图鉴与背包管理系统，支持用户登录、精灵收集、培养进度跟踪和数据可视化展示。

## 📋 目录
- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [API文档](#api文档)
- [部署说明](#部署说明)

## 📖 项目简介
本项目是一个完整的洛克王国游戏精灵图鉴与背包管理系统，实现了以下核心功能：
- 用户注册登录与权限管理（JWT认证）
- 宠物图鉴大全浏览与搜索（分页、筛选）
- 个人精灵背包管理（添加、查看、放生）
- 精灵培养进度跟踪与编辑
- 属性雷达图与进度条可视化（ECharts）
- 智能培养建议生成
- 精灵对比分析
- 全球地图视图展示

## ✨ 功能特性
### 核心功能
- ✅ 用户注册、登录、退出（JWT令牌认证）
- ✅ 宠物图鉴浏览（分页、搜索、属性筛选）
- ✅ 精灵背包管理（添加、查看、删除、清空）
- ✅ 统一详情页（动态适配图鉴/背包模式）
- ✅ 属性雷达图可视化（基础/养成数值切换）
- ✅ 培养进度条展示与编辑（悬停提示）
- ✅ 智能培养建议生成（基于进度）
- ✅ 精灵对比功能（多属性分析）

### 亮点功能
- 🎯 统一详情页设计，支持动态数据加载
- 📊 交互式ECharts雷达图，支持数值切换
- 📈 进度条悬停提示，显示详细数值信息
- 💡 基于进度的智能培养建议算法
- 📱 响应式设计，适配移动端与桌面端
- 🌍 地图化展示，支持组织筛选
- 🔍 高级搜索与筛选功能

## 🛠️ 技术栈
### 前端技术
- **Vue.js 3.x** (CDN引入) - 前端框架，组件化开发
- **Vite 8.0.10+** - 构建工具，开发服务器与打包
- **Axios 1.15.2** - HTTP客户端，API请求
- **ECharts 5.4.3** - 数据可视化，雷达图绘制
- **JavaScript (ES6+)** - 核心编程语言
- **HTML5 + CSS3** - 页面结构与响应式样式

### 后端技术
- **Spring Boot 3.5.14** - 核心框架，自动配置
- **Java 25** - 编程语言
- **MyBatis Plus 3.5.16** - ORM框架，简化数据库操作
- **JWT (JSON Web Token)** - 用户认证与授权
- **Spring Security** - 安全框架
- **H2 Database** (默认) - 轻量级数据库，打包方便
- **MySQL 8.0+** (可选) - 生产环境数据库
- **Swagger/OpenAPI 2.8.5** - API文档自动生成

### 开发工具
- **Git + GitHub** - 版本控制
- **Maven 3.6+** - 后端依赖管理
- **Node.js 16+ + npm** - 前端依赖管理
- **MySQL Workbench** - 数据库管理
- **Maven Wrapper** - 跨平台构建

## 📁 项目结构
```
Locke_info/
├── backend/                    # 后端项目
│   └── locke/                  # Spring Boot应用
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/newblash/locke/
│       │   │   │   ├── controller/    # 控制器层
│       │   │   │   ├── service/       # 服务层
│       │   │   │   ├── mapper/        # 数据访问层
│       │   │   │   ├── entity/        # 实体层
│       │   │   │   ├── config/        # 配置类
│       │   │   │   └── utils/         # 工具类
│       │   │   └── resources/
│       │   │       ├── application.yml       # 生产配置
│       │   │       ├── application-local.yml # 本地配置
│       │   │       └── mapper/        # MyBatis XML映射
│       │   └── test/                 # 测试代码
│       ├── pom.xml                   # Maven配置
│       ├── mvnw & mvnw.cmd          # Maven Wrapper
│       └── target/                   # 构建输出
│
├── frontend/                   # 前端项目(vue版)
│   ├── index.html              # 主页（精灵图鉴）
│   ├── compare.html            # 精灵对比页面
│   ├── details.html            # 宠物详情页
│   ├── my-collection.html      # 我的冒险手册
│   ├── world-map.html          # 全球图鉴地图
│   ├── package.json            # 前端依赖配置
│   ├── vite.config.js          # Vite构建配置
│   ├── js/                     # JavaScript源码
│   │   ├── config.js           # 全局配置
│   │   ├── api/index.js        # API接口
│   │   ├── components/         # Vue组件
│   │   ├── hooks/              # 自定义Hooks
│   │   └── utils/              # 工具函数
│   ├── css/                    # 样式文件
│   └── public/                 # 静态资源
│
├── sql/                        # 数据库脚本
│   ├── create_table.sql        # 建表脚本
│   ├── data.sql                # 测试数据
│   └── README.md               # 数据库说明
│
├── docx/                       # 项目文档
│   ├── design/
│   │   ├── backend.md          # 后端设计文档
│   │   └── FRONTEND_DOCUMENTATION.md # 前端文档
│   ├── meeting/                # 会议记录
│   ├── plan/                   # 计划文档
│   ├── report/                 # 报告文档
│   └── test/                   # 测试文档
│
├── another_version/web         # 纯js前端版本
├── ui/                         # UI设计稿
└── README.md                   # 项目说明
```

## 🚀 快速开始

### 环境要求
- Java 25+
- Maven 3.6+
- Node.js 16+ & npm
- MySQL 8.0+ (可选，默认使用H2)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/lologuan22/Locke_info.git
   cd Locke_info
   ```

2. **后端配置**
   ```bash
   cd backend/locke
   # 安装依赖
   mvn clean install
   ```

3. **数据库配置**
   - 默认使用H2数据库，无需额外配置
   - 如需使用MySQL，编辑 `src/main/resources/application-local.yml`：
     ```yaml
     spring:
       datasource:
         url: jdbc:mysql://localhost:3306/locke_db?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8
         username: root
         password: your_password
     ```

4. **前端配置**
   ```bash
   cd ../../frontend
   npm install
   ```

### 运行项目

1. **启动后端**
   ```bash
   cd backend/locke
   mvn spring-boot:run
   # 或使用Wrapper
   ./mvnw spring-boot:run  # Linux/Mac
   mvnw.cmd spring-boot:run  # Windows
   ```
   后端将在 `http://localhost:8080` 启动

2. **启动前端**
   ```bash
   cd frontend
   npm run dev
   ```
   前端将在 `http://localhost:5173` 启动

## 📚 API文档

启动后端后，可通过以下方式访问API文档：
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

## 📦 部署说明

### 开发环境
- 后端：使用 `application-local.yml` 配置
- 前端：运行 `npm run dev` 启动开发服务器

### 生产环境
1. **构建前端**
   ```bash
   cd frontend
   npm run build
   ```

2. **打包后端**
   ```bash
   cd backend/locke
   mvn clean package
   ```

3. **运行JAR包**
   ```bash
   java -jar target/locke-0.0.1-SNAPSHOT.jar
   ```

### Docker部署 (可选)
项目支持Docker容器化部署，详情请参考部署文档。

---

*本项目基于洛克王国游戏主题开发，仅供学习和娱乐使用。*