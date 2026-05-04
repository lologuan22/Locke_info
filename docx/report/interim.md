# 游戏精灵背包图鉴系统 - 软件说明书（中期版）

游戏精灵背包图鉴系统 - 软件说明书（中期版）

# 基本信息

# 一、项目概述

## 1. 项目背景

随着宠物养成类游戏的流行，玩家对宠物收集、培养、展示的需求日益增长。传统游戏内图鉴系统功能单一，缺乏个性化展示和深度培养建议。本系统旨在构建一个独立的宠物图鉴与背包管理平台，为玩家提供更丰富的宠物信息展示、个性化培养进度跟踪和智能培养建议功能，弥补传统游戏内系统的不足，同时作为计算机学院课程综合实践项目，帮助团队掌握全栈开发技能。

## 2. 系统目标

1. 功能目标：实现宠物图鉴浏览、用户登录注册、宠物收藏管理、培养进度跟踪、属性相克计算、数据可视化展示等核心功能

2. 技术目标：掌握Spring Boot + MySQL + HTML/CSS/JavaScript前后端分离开发模式

3. 质量目标：确保系统稳定可靠，界面友好美观，提供良好的用户体验

4. 学习目标：通过项目实践掌握团队协作、版本管理、文档编写等软件开发全流程

## 3. 开发环境

前端开发环境：

- - 操作系统：Windows 10/11 或 macOS
- - 开发工具：VS Code
- - 技术栈：HTML5、CSS3、JavaScript(ES6+)、Chart.js
- - 浏览器：Chrome/Firefox/Edge
后端开发环境：

- - 开发工具：IntelliJ IDEA
- - 技术栈：Spring Boot 3.x、Spring Security、JWT、MyBatis Plus
- - Java版本：JDK 17+
- - 构建工具：Maven
数据库环境：

- - MySQL 8.0+
- - 管理工具：MySQL Workbench
- - 字符集：utf8mb4
版本控制：

- - Git + GitHub/GitLab
- - 分支策略：Git Flow
API测试：

- - Postman
# 二、需求分析

## 1. 功能需求

### 1.1 用户管理模块

- 用户注册、登录、退出功能

- 用户信息修改与维护（包括头像设置）

- 权限管理（普通用户、管理员）

- 密码使用BCrypt加密存储，确保安全性

### 1.2 宠物图鉴模块

- 宠物列表浏览（分页、搜索、筛选）

- 宠物详情查看（基础信息、属性、图片）

- 属性相克关系查询与计算

- 头像资源公开访问，无需JWT认证

### 1.3 收藏管理模块（原背包模块）

- 用户可将感兴趣的宠物/技能加入收藏

- 收藏列表查看与管理

- 收藏宠物详情查看

- 收藏标记与分类

### 1.4 数据可视化模块

- 宠物能力值雷达图展示

- 培养进度条可视化

- 属性相克计算器

### 1.5 智能建议模块

- 基于培养进度的个性化建议

- 属性成长策略推荐

- 战力评估与提升指导

## 2. 非功能需求

性能要求：

- - 页面加载时间 < 3秒
- - API响应时间 < 500ms
- - 雷达图渲染时间 < 1秒
- - 支持20+用户并发访问
安全要求：

- - 用户密码使用BCrypt加密存储
- - 敏感接口需要JWT认证
- - 头像等静态资源公开访问，无需认证
- - SQL注入防护
- - XSS攻击防护
兼容性要求：

- - 支持主流浏览器（Chrome、Firefox、Edge）
- - 响应式设计，适配PC端和移动端
- - 支持屏幕分辨率自适应
可用性要求：

- - 界面简洁直观，操作流程明确
- - 提供清晰的错误提示和加载状态
- - 关键操作有确认提示
可靠性要求：

- - 数据库定期备份机制
- - 异常情况的优雅处理
- - 关键数据的事务保护
# 三、系统设计

## 1. 系统架构

本系统采用前后端分离架构设计，基于Spring Boot 3.x和MyBatis Plus技术栈：

┌──────────────┐             ┌──────────────────┐           ┌─────────────┐

│    前端      │             │       后端       │            │    数据库   │

│ HTML/CSS/JS  │    ◄──►     │   Spring Boot    │   ◄──►    │    MySQL    │

│  Chart.js    │             │   MyBatis Plus   │           │             │

│  Fetch API   │             │ Spring Security  │           └─────────────┘

└──────────────┘             └──────────────────┘

        ▲

        |

┌──────────────┐

│    用户      │

│   浏览器     │

└──────────────┘

架构层次说明：

1. 表现层：基于HTML/CSS/JavaScript构建的用户界面，使用Chart.js进行数据可视化

2. 业务逻辑层：Spring Boot 3.x提供的RESTful API服务，处理核心业务逻辑

3. 数据访问层：MyBatis Plus操作MySQL数据库，支持动态SQL和XML映射

4. 数据存储层：MySQL关系型数据库存储所有业务数据

## 2. 模块设计

### 2.1 用户管理模块

- UserController：处理用户注册、登录、Token刷新

- UserService：管理用户信息、修改资料、密码加密

- JwtTokenInterceptor：验证JWT Token，控制接口访问权限

- 头像资源公开访问，无需认证

### 2.2 宠物图鉴模块

- PokemonController：提供宠物列表、详情、搜索接口

- PokemonService：计算属性相克关系，处理宠物数据业务逻辑

- PokemonMapper：使用MyBatis Plus进行数据库操作

### 2.3 收藏管理模块（原背包模块）

- BackpackController：管理用户收藏列表

- BackpackService：处理收藏添加、删除、查询逻辑

- BackpackMapper：收藏数据访问，支持复杂查询

### 2.4 数据可视化模块

- 图表组件：雷达图、进度条可视化

- 计算器组件：属性相克交互计算

- 数据适配器：将后端数据转换为前端图表格式

### 2.5 智能建议模块

- 建议生成器：基于培养进度生成个性化建议

- 战力评估：计算宠物综合战力

- 策略推荐：推荐培养策略和属性搭配

## 3. 数据库设计

### 3.1 核心表结构设计

#### 1. users（用户表）

CREATE TABLE users (

- id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
- username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
- password VARCHAR(255) NOT NULL COMMENT 'BCrypt加密密码',
- email VARCHAR(100) UNIQUE COMMENT '邮箱',
- nickname VARCHAR(50) COMMENT '昵称',
- avatar_url VARCHAR(255) COMMENT '头像URL（公开访问）',
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
- status TINYINT DEFAULT 1 COMMENT '状态'
);

#### 2. pokemons（宠物基础表）

CREATE TABLE pokemons (

- id INT PRIMARY KEY AUTO_INCREMENT COMMENT '宠物ID',
- number VARCHAR(20) NOT NULL COMMENT '宠物编号',
- name VARCHAR(50) NOT NULL COMMENT '英文名',
- chinese_name VARCHAR(50) COMMENT '中文名',
- type1 VARCHAR(20) NOT NULL COMMENT '主属性',
- type2 VARCHAR(20) COMMENT '副属性',
- base_hp INT DEFAULT 0 COMMENT '精力',
- base_attack INT DEFAULT 0 COMMENT '攻击',
- base_defense INT DEFAULT 0 COMMENT '防御',
- base_sp_attack INT DEFAULT 0 COMMENT '魔攻',
- base_sp_defense INT DEFAULT 0 COMMENT '魔抗',
- base_speed INT DEFAULT 0 COMMENT '速度',
- image_url VARCHAR(255) COMMENT '图片URL（公开访问）'
);

#### 3. backpack（收藏表）

CREATE TABLE backpack (

- id INT PRIMARY KEY AUTO_INCREMENT COMMENT '收藏ID',
- user_id INT NOT NULL COMMENT '用户ID',
- pokemon_id INT NOT NULL COMMENT '宠物ID',
- skill_id INT COMMENT '技能ID',
- is_favorite BOOLEAN DEFAULT TRUE COMMENT '是否收藏',
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
- FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE
);

#### 4. type_effectiveness（属性相克表）

CREATE TABLE type_effectiveness (

- attacking_type VARCHAR(20) NOT NULL COMMENT '攻击属性',
- defending_type VARCHAR(20) NOT NULL COMMENT '防御属性',
- multiplier DECIMAL(3,2) NOT NULL COMMENT '伤害倍数'
);

#### 5. skills（技能表）

CREATE TABLE skills (

- id INT PRIMARY KEY AUTO_INCREMENT COMMENT '技能ID',
- name VARCHAR(100) NOT NULL COMMENT '技能名称',
- description TEXT COMMENT '技能描述',
- power INT COMMENT '技能威力',
- type VARCHAR(20) COMMENT '技能属性',
- category VARCHAR(20) COMMENT '技能类别'
);

### 3.2 安全设计原则

1. 密码安全：使用BCrypt算法加密存储用户密码，即使数据库泄露也无法还原明文密码

2. 认证分离：头像、图片等静态资源公开访问，无需JWT认证，避免浏览器无法正常加载

3. 接口保护：业务逻辑接口使用JWT Token认证，保护用户数据安全

4. 权限控制：不同用户角色访问不同资源，防止越权操作

### 3.3 功能定位调整

根据项目会议讨论结果，对部分功能进行重新定位：

1. 背包功能重新定位为"收藏"功能：用户可将感兴趣的精灵/技能加入收藏列表

2. 头像访问优化：头像资源支持公开访问，不依赖JWT认证，确保浏览器正常显示

3. 密码存储强化：采用BCrypt加密存储，确保即使数据库泄露也不会泄露用户密码

# 四、系统实现

## 1. 关键技术

### 1.1 Spring Boot 3.x + MyBatis Plus架构

- 使用Spring Boot 3.x作为核心框架，提供依赖注入、自动配置

- 集成MyBatis Plus作为ORM框架，简化数据库操作，支持动态SQL

- 采用分层架构：Controller、Service、Mapper、Entity，职责清晰

- 使用Lombok简化Java代码，减少样板代码

### 1.2 用户认证与安全

- 使用Spring Security + JWT实现无状态认证

- 密码使用BCryptPasswordEncoder加密存储，确保安全性

- 敏感接口需要Bearer Token验证，通过JwtTokenInterceptor拦截

- 头像等静态资源公开访问，配置CorsConfig支持跨域

- 统一的异常处理GlobalExceptionHandler，返回标准错误格式

### 1.3 数据可视化

- 使用Chart.js库实现雷达图组件，展示宠物六维属性

- 自定义CSS进度条组件，支持悬停提示和动画效果

- 响应式设计，使用Flexbox/Grid布局适配不同屏幕尺寸

- 数据缓存机制，提高图表渲染性能

### 1.4 API设计规范

- RESTful风格API设计，使用HTTP方法表示操作

- 统一响应格式Result类，包含code、message、data、timestamp

- OpenAPI/Swagger自动生成API文档，便于前端对接

- 分页查询支持，使用MyBatis Plus分页插件

## 2. 界面展示（中期进展）

### 2.1 已完成界面

1. 登录注册页面

- 完成表单设计和客户端验证

- 实现记住密码功能

- 错误提示和加载状态

- 密码强度验证和加密传输

2. 主页布局

- 响应式导航栏设计

- 统一页面框架结构

- 主题配色方案确定

- 用户头像显示（公开资源访问）

3. 宠物列表页

- 卡片式布局设计，展示宠物基础信息

- 分页控件实现，支持多种分页方式

- 搜索筛选功能框架，可按属性、名称搜索

- 收藏按钮，支持添加/取消收藏

4. 详情页框架

- 基础布局完成，分为左右两栏

- 左侧展示宠物详细信息

- 右侧预留数据可视化区域

- 收藏状态显示和操作

### 2.2 界面设计特点

- 卡片式设计：信息层次清晰，视觉重点突出

- 统一配色：主色调#3498db，辅色调#2ecc71，视觉风格一致

- 响应式布局：使用Flexbox/Grid实现，完美适配多种设备

- 交互动效：平滑过渡效果，友好的操作反馈

- 加载状态：数据加载时的占位符和动画提示

## 3. 核心代码片段

### 3.1 Spring Boot配置文件

# application.yml

spring:

datasource:

url: jdbc:mysql://localhost:3306/pokedex_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=UTC

username: root

password: your_password

driver-class-name: com.mysql.cj.jdbc.Driver

servlet:

multipart:

max-file-size: 10MB

max-request-size: 10MB

mybatis-plus:

configuration:

log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

global-config:

db-config:

logic-delete-field: deleted

logic-delete-value: 1

logic-not-delete-value: 0

### 3.2 用户实体类（使用Lombok）

@Data

@TableName("users")

public class User {

@TableId(type = IdType.AUTO)

private Integer id;

@TableField("username")

private String username;

@TableField("password")

private String password;

@TableField("email")

private String email;

@TableField("nickname")

private String nickname;

@TableField("avatar_url")

private String avatarUrl;

@TableField("created_at")

private LocalDateTime createdAt;

@TableField("status")

private Integer status;

}

### 3.3 密码加密存储（BCrypt）

@Service

public class UserServiceImpl implements UserService {

@Autowired

private UserMapper userMapper;

@Autowired

private PasswordEncoder passwordEncoder;

@Override

public Result register(User user) {

// 检查用户名是否已存在

if (userMapper.selectCount(new QueryWrapper<User>().eq("username", user.getUsername())) > 0) {

return Result.error("用户名已存在");

}

// 使用BCrypt加密密码

String encodedPassword = passwordEncoder.encode(user.getPassword());

user.setPassword(encodedPassword);

// 设置默认头像（公开可访问的URL）

user.setAvatarUrl("/images/avatars/default.png");

// 保存用户

user.setCreatedAt(LocalDateTime.now());

userMapper.insert(user);

return Result.success("注册成功");

}

}

### 3.4 收藏功能实现

@RestController

@RequestMapping("/api/backpack")

public class BackpackController {

@Autowired

private BackpackService backpackService;

@PostMapping("/add")

public Result addToBackpack(@RequestBody Backpack backpack,

HttpServletRequest request) {

// 从JWT Token中获取用户ID

Integer userId = JwtUtils.getUserIdFromToken(request);

backpack.setUserId(userId);

// 检查是否已收藏

Backpack existing = backpackService.getByUserAndPokemon(

userId, backpack.getPokemonId());

if (existing != null) {

return Result.error("已收藏该宠物");

}

// 添加收藏

backpack.setIsFavorite(true);

backpack.setCreatedAt(LocalDateTime.now());

backpackService.save(backpack);

return Result.success("收藏成功");

}

@GetMapping("/list")

public Result getBackpackList(HttpServletRequest request) {

Integer userId = JwtUtils.getUserIdFromToken(request);

List<BackpackVO> list = backpackService.getUserBackpack(userId);

return Result.success(list);

}

}

### 3.5 公开资源访问配置

@Configuration

public class WebConfig implements WebMvcConfigurer {

@Override

public void addResourceHandlers(ResourceHandlerRegistry registry) {

// 配置静态资源映射，头像等资源公开访问

registry.addResourceHandler("/images/**")

.addResourceLocations("classpath:/static/images/")

.setCachePeriod(3600);

registry.addResourceHandler("/avatars/**")

.addResourceLocations("classpath:/static/avatars/")

.setCachePeriod(3600);

}

@Override

public void addInterceptors(InterceptorRegistry registry) {

// JWT拦截器排除公开资源路径

registry.addInterceptor(new JwtTokenInterceptor())

.addPathPatterns("/api/**")

.excludePathPatterns("/images/**", "/avatars/**");

}

}

# 五、系统测试

## 1. 测试方案

### 1.1 测试范围

- 功能测试：用户管理、宠物图鉴、收藏管理等核心功能

- 接口测试：RESTful API的正确性、健壮性和安全性

- 数据库测试：数据完整性、事务一致性、性能测试

- 兼容性测试：主流浏览器兼容性测试

- 性能测试：关键接口响应时间和并发处理能力测试

- 安全测试：认证授权、SQL注入、XSS攻击防护测试

### 1.2 测试方法

- 单元测试：使用JUnit对Service层进行测试

- 集成测试：测试前后端接口集成和数据流

- 系统测试：完整业务流程端到端测试

- 手动测试：界面交互和用户体验测试

- 自动化测试：关键接口自动化测试脚本

### 1.3 测试工具

- Postman：API接口测试和自动化测试

- JUnit 5：Java单元测试框架

- Chrome DevTools：前端调试和性能分析

- MySQL Workbench：数据库测试和性能分析

- JMeter：性能压测和并发测试

## 2. 测试用例（计划）

### 2.1 用户注册测试用例

1. 正常注册流程

- 输入合法的用户名、密码、邮箱

- 预期结果：注册成功，返回用户信息

2. 重复用户名注册

- 输入已存在的用户名

- 预期结果：注册失败，提示"用户名已存在"

3. 无效邮箱格式

- 输入格式错误的邮箱

- 预期结果：注册失败，提示"邮箱格式错误"

4. 密码强度不足

- 输入简单密码

- 预期结果：注册失败，提示"密码强度不足"

### 2.2 用户登录测试用例

1. 正确用户名密码登录

- 输入正确的用户名和密码

- 预期结果：登录成功，返回Token

2. 错误密码登录

- 输入正确的用户名，错误的密码

- 预期结果：登录失败，提示"用户名或密码错误"

3. 不存在的用户登录

- 输入不存在的用户名

- 预期结果：登录失败，提示"用户不存在"

4. Token过期验证

- 使用过期的Token访问受保护接口

- 预期结果：访问被拒绝，返回401状态码

### 2.3 宠物图鉴测试用例

1. 宠物列表分页加载

- 请求不同页码的宠物列表

- 预期结果：正确返回对应页码的数据

2. 搜索功能测试

- 输入关键词搜索宠物

- 预期结果：返回包含关键词的宠物列表

3. 属性筛选测试

- 选择特定属性筛选宠物

- 预期结果：返回符合属性条件的宠物

4. 详情页面数据展示

- 查看宠物详情页面

- 预期结果：正确显示宠物所有信息

## 3. 问题与改进

1. 用户名合法测试发现emoji表情符号可以作为用户名注册成功

- 加强注册用户名合法性力度

2.展示图鉴时发现重复数据

- 去重逻辑优化

# 六、用户手册

*注：中期阶段系统尚未完全开发完成，用户手册将在结项阶段补全。*

# 七、项目总结

## 1. 成果总结

### 1.1 项目规划与设计阶段完成工作

✓ 完成详细的需求分析和技术选型

✓ 完成系统架构设计和模块划分

✓ 完成数据库设计和ER图绘制

✓ 制定详细的开发计划和时间表

✓ 明确团队成员分工和协作规范

### 1.2 开发实施阶段当前进展

✓ 完成前后端项目框架搭建

✓ 完成数据库建表和测试数据准备

✓ 完成用户管理模块核心功能

✓ 完成宠物图鉴模块基础功能

✓ 开始收藏管理模块开发

✓ 完成基础界面布局和样式设计

### 1.3 文档与协作工作

✓ 建立Git仓库并制定协作规范

✓ 编写API接口文档

✓ 编写数据库设计文档

✓ 编写项目计划书

✓ 编写本软件说明书（中期版）

✓ 定期进行代码审查和进度同步

## 2. 不足与改进方向

### 2.1 当前存在的问题

1. 进度方面：部分前端界面尚未完成，数据可视化组件需要进一步开发

2. 技术方面：雷达图组件的性能需要优化，智能建议算法需要完善

3. 协作方面：需要加强前后端接口的同步沟通，避免接口不一致

4. 测试方面：测试工作尚未系统展开，需要制定详细的测试计划

### 2.2 下一步改进计划

1. 加快开发进度：按照时间表，确保按时完成核心功能开发

2. 加强测试工作：提前开展测试，及早发现和修复问题

3. 优化代码质量：进行代码重构，提高系统性能和可维护性

4. 完善文档：持续更新技术文档，为结项做好准备

5. 性能优化：对关键接口和组件进行性能调优

## 3. 成员分工表

### Git任务对应情况：

- 熊松鹤：主要负责backend/目录下的Java代码和配置，后端架构和API

- 刘逸枫：主要负责frontend/目录下的HTML/CSS文件，页面布局和样式

- 范嘉壮：主要负责HTML/CSS辅助开发和sql数据维护

- 刘小刚：主要负责sql/目录下的SQL脚本和文档，数据库设计

## 4. Git 提交记录

1. 初始提交：项目框架搭建，基础目录结构创建

数据库设计提交：完成所有数据库表的创建脚本和测试数据

用户模块提交：实现用户注册、登录、JWT认证功能

宠物图鉴提交：实现宠物列表和详情页面基础功能

5. 前端框架提交：完成响应式布局和基础组件开发

6. API文档提交：编写完整的API接口文档

7. 数据库优化提交：添加索引、视图、存储过程优化

# 附录

## 参考资料

1. Spring Boot官方文档

2. MySQL 8.0参考手册

3. Chart.js官方文档

4. RESTful API设计指南

5. 前后端分离架构最佳实践

## 源代码仓库

- 项目Git仓库：[“https://github.com/lologuan22/Locke_info”]

- 文档仓库：与代码仓库同一项目下docs/目录

## 其他补充材料

1. API接口文档：独立文档，包含所有接口详细说明

2. 数据库设计文档：独立文档，包含表结构、关系、SQL脚本

3. 项目计划书：独立文档，包含详细的时间计划和分工

4. 部署指南：独立文档，包含系统部署和配置说明

# 项目状态说明

当前版本：中期版

完成进度：约60%

核心功能完成情况：基础框架和核心模块已完成，详细功能开发中

下一步重点：完成数据可视化组件、智能建议算法、系统测试

预计完成时间：按计划在2周内完成全部开发工作

*注：本中期报告基于当前开发进度编写，结项阶段将在此基础上更新完善，形成最终版本。*


| 项目名称 | 游戏精灵背包图鉴系统 |
| 学院 | 计算机学院 |
| 小组序号 | 第22组 |
| 成员姓名 | 刘小刚 / 熊松鹤 / 刘逸枫 / 范嘉壮 |
| 指导老师 | 尹兆远 |
| 当前版本 | 中期版 |
| 更新日期 | 2026年5月1日 |


| 姓名 | 班级 | 学号 | Git账号 | 承担的主要任务 |
| 刘小刚 | 计算机科学与技术3班 | 202405567219 | lologuan22 | 文档、测试、数据库设计 |
| 熊松鹤 | 计算机科学与技术3班 | 202405567208 | AshXiong | 后端 |
| 刘逸枫 | 计算机科学与技术3班 | 202405567211 | hougzs | 前端，UI |
| 范嘉壮 | 计算机科学与技术3班 | 202405567218 | Merlinroden20102003HKG-A11y | 数据库数据维护，测试 |

