# 计算机学院课程项目计划书

**项目名称：** 游戏精灵背包图鉴系统  
**学院：** 计算机学院  
**小组序号：** 第22组  
**成员姓名：** lxg / xsh / lyf / fjz  
**指导老师：** 尹兆远  
**提交日期：** 2026年4月23日  

---

## 一、项目概述

### 1. 项目背景
本项目是基于宠物养成类游戏需求设计的全栈Web应用。随着宠物养成游戏的流行，玩家对宠物收集、培养、展示的需求日益增长。传统游戏内图鉴系统功能单一，缺乏个性化展示和深度培养建议。本系统旨在构建独立的宠物图鉴与背包管理平台，为玩家提供更丰富的宠物信息展示、个性化培养进度跟踪和智能培养建议功能。

### 2. 项目目标
- **功能目标**：实现宠物图鉴浏览、用户登录注册、宠物背包管理、培养进度跟踪、属性相克计算、数据可视化展示等核心功能
- **技术目标**：掌握Spring Boot + MySQL + HTML/CSS/JavaScript前后端分离开发模式
- **学习目标**：通过项目实践掌握团队协作、版本管理、文档编写等软件开发全流程

### 3. 开发环境与条件
- **操作系统**：Windows 10/11 或 macOS
- **开发工具**：VS Code、IntelliJ IDEA、MySQL Workbench、Postman
- **版本控制**：Git + GitHub/GitLab
- **运行时环境**：Java 11+、MySQL 8.0+、Node.js 14+（可选）

---

## 二、需求分析

### 1. 目标用户与使用场景
- **普通玩家**：查看宠物图鉴，了解宠物信息，使用属性计算器
- **注册用户**：拥有个人账户，可以收集宠物，管理背包，培养宠物
- **管理员**：管理系统数据，管理用户，查看系统运行状况

### 2. 核心功能清单
1. 用户注册、登录、退出
2. 宠物图鉴浏览（分页、搜索、筛选）
3. 宠物详情查看（基础信息、属性、图片）
4. 用户背包管理（宠物添加、查看、放生）
5. 宠物培养系统（升级、进度调整）
6. 数据可视化（雷达图、进度条）
7. 属性相克计算器
8. 智能培养建议生成

### 3. 非功能需求
- **性能要求**：页面加载<3秒，API响应<500ms，支持20+并发
- **安全要求**：密码加密存储，JWT认证，SQL注入防护
- **兼容性要求**：响应式设计，支持主流浏览器

---

## 三、技术路线

### 1. 总体架构
采用前后端分离架构：
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    前端      │    │    后端      │    │    数据库    │
│ HTML/CSS/JS  │◄──►│ Spring Boot  │◄──►│   MySQL    │
│  Chart.js    │    │  Spring      │    │             │
│  Fetch API   │    │  Security    │    └─────────────┘
└─────────────┘    └─────────────┘
```

### 2. 主要技术
- **前端**：HTML5、CSS3、JavaScript(ES6+)、Chart.js
- **后端**：Spring Boot 2.x、Spring Security、JWT、Spring Data JPA
- **数据库**：MySQL 8.0+，字符集utf8mb4
- **工具**：Git、Maven、Postman

### 3. 数据设计初步考虑
**核心实体：**
1. **用户(users)**：id, username, password, email, nickname, created_at
2. **宠物(pokemons)**：id, number, name, chinese_name, type1, type2, base_stats
3. **用户背包(user_pokemons)**：id, user_id, pokemon_id, nickname, level, progress, current_stats
4. **属性相克(type_effectiveness)**：attacking_type, defending_type, multiplier

**核心关系：**
- 用户 1:n 用户背包
- 用户背包 n:1 宠物
- 触发器自动更新当前数值

**核心SQL代码示例：**
```sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    nickname VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 宠物表
CREATE TABLE pokemons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    number VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    chinese_name VARCHAR(50),
    type1 VARCHAR(20) NOT NULL,
    type2 VARCHAR(20),
    base_hp INT DEFAULT 0,
    base_attack INT DEFAULT 0,
    base_defense INT DEFAULT 0,
    base_sp_attack INT DEFAULT 0,
    base_sp_defense INT DEFAULT 0,
    base_speed INT DEFAULT 0
);

-- 自动更新当前数值的存储过程
DELIMITER //
CREATE PROCEDURE update_user_pokemon_stats(IN p_backpack_id INT)
BEGIN
    -- 获取基础数值和进度，计算当前数值
    -- 当前值 = 基础值 + (基础值 * 1.5 * 进度/100)
    UPDATE user_pokemons up
    JOIN pokemons p ON up.pokemon_id = p.id
    SET 
        up.current_hp = p.base_hp + ROUND(p.base_hp * 1.5 * up.hp_progress / 100),
        -- ... 其他属性类似计算
    WHERE up.id = p_backpack_id;
END //
DELIMITER ;
```

**核心API设计：**
```java
// 用户认证接口
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // JWT认证逻辑
    }
}

// 宠物图鉴接口
@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {
    @GetMapping
    public Page<PokemonDTO> getPokemons(Pageable pageable) {
        // 分页查询宠物列表
    }
    
    @GetMapping("/{id}")
    public PokemonDetailDTO getPokemonDetail(@PathVariable Integer id) {
        // 获取宠物详情
    }
}

// 背包管理接口
@RestController
@RequestMapping("/api/backpack")
@PreAuthorize("isAuthenticated()")
public class BackpackController {
    @GetMapping
    public List<UserPokemonDTO> getUserPokemons(Principal principal) {
        // 获取用户背包
    }
    
    @PostMapping("/add/{pokemonId}")
    public ResponseEntity<?> addPokemon(@PathVariable Integer pokemonId) {
        // 添加宠物到背包
    }
}
```

**核心JavaScript代码：**
```javascript
// 雷达图组件
class PokemonRadarChart {
    drawRadarChart(baseStats, currentStats) {
        // 使用Chart.js绘制雷达图
        // 展示基础数值和当前数值对比
    }
}

// 进度条组件
class ProgressBars {
    createProgressBars(progress, currentStats, maxStats) {
        // 创建6个属性的进度条
        // 悬停显示详细数值
    }
}

// 属性计算器
class TypeCalculator {
    calculateEffectiveness(attacker, defender1, defender2) {
        // 计算属性相克倍数
        // 返回效果描述
    }
}
```

---

## 四、进度安排

### 1. 阶段划分
**总周期**：2周（10个工作日）

**第一阶段**：基础框架搭建（第1周）
- 项目初始化，数据库设计，用户模块
- 宠物图鉴模块
- 背包管理模块，核心功能联调

**第二阶段**：功能完善与优化（第2周）
- 数据可视化，智能建议算法
- 界面优化，测试，文档
- 演示准备，最终部署

### 2. 时间进度表
| 时间 | 主要任务 | 负责人 | 交付物 |
|------|----------|--------|--------|
| 第1周 | 项目初始化，数据库设计 | lxg, xsh | 数据库脚本，项目结构 |
| 第1周 | 宠物图鉴模块 | lyf, fjz | 宠物列表页，详情页 |
| 第1周 | 背包管理模块 | xsh, lyf | 背包功能，前后端联调 |
| 第2周 | 数据可视化 | lyf, fjz | 雷达图，进度条组件 |
| 第2周 | 测试优化 | 全体 | 优化后的系统 |
| 第2周 | 演示准备 | 全体 | 完整项目，演示材料 |

### 3. 风险与应对
- **技术风险**：前后端接口不一致 → 提前定义API文档
- **进度风险**：功能延期 → 每日站会，灵活调整任务
- **协作风险**：代码冲突 → 明确Git工作流，及时沟通
- **质量风险**：测试不足 → 编写测试用例，每日自测

---

## 五、成员分工

### 1. 成员信息
| 成员 | 学号 | 班级 | Git账号 | 主要任务 |
|------|------|------|---------|----------|
| lxg | [202405567219] | 计算机科学与技术 3| [lologuan22] | 数据库设计，项目统筹 |
| lyf | [202405567211] | 计算机科学与技术 3| [hougzs] | 前端核心开发，UI设计 |
| xsh | [202405567208] | 计算机科学与技术 3| [AshXiong] | 前端交互开发, 数据分析 |
| fjz | [202405567218] | 计算机科学与技术 3| [Merlinroden20102003HKG-A11y] | 后端架构开发，API设计 |

### 2. Git协作方式
- **仓库**：GitHub/GitLab公开仓库
- **分支策略**：
  - `main`：主分支，保护分支
  - `lxg` : 分支1 
  - `xsh` : 分支2 
  - `lyf` : 分支3 
  - `fzj` : 分支4   
- **提交规范**：feat/fix/docs/style/refactor/test/chore
- **工作流程**：功能分支开发 → Pull Request → 代码审查 → 合并到main

### 3. 阶段性成果计划
- **第1周末**：核心功能可用（用户登录，宠物图鉴，背包管理）
- **第2周中**：所有功能模块完成
- **第2周末**：完整项目交付，文档齐全，演示成功

---

## 附录
1. **远端Git仓库信息**：[https://github.com/lologuan22/Locke_info]
2. **其他说明**：
   - 测试账户：admin/123456, user1/123456, user2/123456
   - 部署环境：本地开发环境，支持Docker部署