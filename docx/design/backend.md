
### Locke_info 后端项目技术介绍

#### 项目概述
Locke_info 是一个基于Spring Boot的后端项目，旨在为宝可梦主题的应用提供RESTful API服务。该项目支持用户注册、登录、宝可梦管理和技能查询等功能，适用于前端展示和数据交互。项目采用微服务架构思想，模块化设计，便于扩展和维护。

#### 技术栈
- **编程语言**：Java 25
- **框架**：Spring Boot 3.5.14（核心框架，提供依赖注入、自动配置等）
- **ORM**：MyBatis Plus 3.5.16（简化数据库操作，支持CRUD、动态SQL）
- **安全认证**：JWT（JSON Web Token，用于用户身份验证和授权）
- **配置管理**：Spring Profiles（支持多环境配置，如本地和生产环境）
- **构建工具**：Maven（依赖管理和项目构建）
- **数据库**：H2（默认，轻量级，打包方便）、MySQL 8.0+（可选，支持生产环境）
- **API文档**：Swagger/OpenAPI 2.8.5（自动生成API文档，便于前端对接）
- **其他工具**：Lombok（简化Java代码）、Maven Wrapper（跨平台构建）

#### 系统架构
项目采用分层架构设计：
- **控制器层（Controller）**：处理HTTP请求，定义API端点（如UserController、PokemonController）。
- **服务层（Service）**：业务逻辑处理，封装数据操作和规则（如BackpackService）。
- **数据访问层（Mapper）**：使用MyBatis Plus与数据库交互，支持XML映射文件自定义SQL。
- **实体层（Entity）**：定义数据模型（如Pokemon、User实体）。
- **配置层（Config）**：包括CORS跨域、JWT属性、安全配置等。
- **异常处理**：全局异常处理器（GlobalExceptionHandler）和拦截器（JwtTokenInterceptor）确保系统稳定性。

#### 主要功能模块
1. **用户管理**：注册、登录、JWT令牌验证，支持用户数据CRUD。
2. **宝可梦管理**：查询宝可梦信息、统计数据和技能关联。
3. **背包系统**：管理用户物品，支持增删改查。
4. **技能查询**：提供技能详情和关联查询。
5. **通用功能**：结果封装（Result类）、工具类（Utils）和视图对象（VO）。

#### 数据库设计
- 默认使用H2数据库（内存或文件模式），支持切换到MySQL 8.0+进行生产部署。
- 包含表：user（用户）、pokemon（宝可梦）、skill（技能）、backpack（背包）、pokemon_stats（统计数据）等。
- 支持外键关联和索引优化。
- 初始化脚本：create_table.sql（建表）、data.sql（插入测试数据）。

#### 安全与配置
- **认证与授权**：JWT拦截器验证请求头中的Token，确保API安全。
- **跨域支持**：CORS配置允许前端跨域访问。
- **环境配置**：application.yml（生产环境）、application-local.yml（本地开发）。
- **异常处理**：统一捕获和返回错误信息，避免敏感数据泄露。

#### 部署与运行
- **本地运行**：使用Maven Wrapper（mvnw.cmd）编译和启动，端口默认8080。
- **数据库选择**：默认使用H2数据库（无需额外配置），也可在application-local.yml中配置MySQL。
- **打包**：mvn clean package 生成JAR文件，支持自定义JRE一键打包为独立应用。
- **测试**：JUnit单元测试，确保代码质量。

### 后端模块详细设计

#### 模块概述
后端采用模块化设计，按功能和职责划分包结构。每个模块职责明确，遵循单一职责原则，便于维护和扩展。以下是各模块的详细说明：

#### 1. 控制器层 (Controller)
**包路径**：`com.newblash.locke.controller`  
**职责**：处理HTTP请求，定义RESTful API端点，接收前端请求并返回响应。  
**主要类**：
- `UserController`：用户相关API，包括注册、登录、用户信息查询。
- `PokemonController`：宝可梦相关API，查询宝可梦列表、详情和统计。
- `BackpackController`：背包管理API，增删改查用户物品。
- `HelloController`：测试和欢迎接口。

**设计原则**：
- 使用`@RestController`注解，返回JSON格式数据。
- 统一使用`Result`类封装响应。
- 支持GET、POST、PUT、DELETE等HTTP方法。

#### 2. 服务层 (Service)
**包路径**：`com.newblash.locke.service`  
**职责**：实现业务逻辑，处理数据转换、验证和规则。  
**主要类**：
- `BackpackService`：背包业务逻辑。
- `PokemonService`：宝可梦业务逻辑。
- `UserService`：用户业务逻辑。
- `SkillService`：技能业务逻辑。

**设计原则**：
- 接口与实现分离（Service接口和ServiceImpl实现类）。
- 使用`@Service`注解注册为Spring Bean。
- 事务管理：使用`@Transactional`确保数据一致性。

#### 3. 数据访问层 (Mapper)
**包路径**：`com.newblash.locke.mapper`  
**职责**：与数据库交互，执行SQL查询和更新。  
**主要类**：
- `UserMapper`：用户数据访问。
- `PokemonMapper`：宝可梦数据访问。
- `SkillMapper`：技能数据访问。
- `BackpackMapper`：背包数据访问。
- `PokemonStatsMapper`：宝可梦统计数据访问。

**设计原则**：
- 继承`BaseMapper`接口，自动生成基础CRUD方法。
- 自定义SQL使用XML映射文件（如`BackpackMapper.xml`）。
- 支持分页查询和复杂关联查询。

#### 4. 实体层 (Entity)
**包路径**：`com.newblash.locke.entity`  
**职责**：定义数据模型，对应数据库表结构。  
**主要类**：
- `User`：用户实体。
- `Pokemon`：宝可梦实体。
- `Skill`：技能实体。
- `Backpack`：背包实体。
- `PokemonStats`：宝可梦统计实体。
- `LoginDTO`、`RegisterDTO`：数据传输对象，用于登录和注册。

**设计原则**：
- 使用Lombok注解（如`@Data`、`@Entity`）简化代码。
- 字段注解：`@TableName`指定表名，`@TableId`指定主键。
- 支持JPA和MyBatis Plus注解。

#### 5. 配置层 (Config)
**包路径**：`com.newblash.locke.config`  
**职责**：系统配置，包括安全、跨域、数据库等。  
**主要类**：
- `SecurityConfig`：Spring Security配置。
- `CorsConfig`：跨域资源共享配置。
- `JwtProperties`：JWT相关属性配置。
- `MybatisPlusConfig`：MyBatis Plus配置。
- `WebConfig`、`WebMvcConfig`：Web相关配置。
- `OpenApiConfig`：API文档配置。

**设计原则**：
- 使用`@Configuration`注解定义配置类。
- 条件配置：根据环境启用不同配置。

#### 6. 异常处理层 (Exception & Handler)
**包路径**：`com.newblash.locke.exception`、`com.newblash.locke.handler`  
**职责**：统一异常处理和拦截器。  
**主要类**：
- `BaseException`：自定义基础异常类。
- `GlobalExceptionHandler`：全局异常处理器，返回统一错误格式。
- `JwtTokenInterceptor`：JWT令牌拦截器，验证用户身份。

**设计原则**：
- 使用`@RestControllerAdvice`处理全局异常。
- 拦截器实现`HandlerInterceptor`接口。

#### 7. 工具层 (Utils)
**包路径**：`com.newblash.locke.utils`  
**职责**：提供通用工具方法。  
**主要类**：
- JWT工具类：生成和解析Token。
- 密码加密工具：BCrypt加密。
- 其他辅助工具。

**设计原则**：
- 静态方法为主，便于调用。
- 避免业务逻辑，专注工具功能。

#### 8. 视图对象层 (VO)
**包路径**：`com.newblash.locke.vo`  
**职责**：定义前端展示的数据结构。  
**主要类**：
- 各种VO类：封装返回给前端的数据。

**设计原则**：
- 与Entity分离，避免暴露内部数据结构。
- 使用DTO模式传输数据。

#### 9. 通用层 (Common)
**包路径**：`com.newblash.locke.common`  
**职责**：通用类和常量。  
**主要类**：
- `Result`：统一响应封装类。

**设计原则**：
- 定义常量和枚举。
- 提供通用方法。

#### API设计规范
- **RESTful风格**：使用HTTP方法表示操作，路径层次清晰。
- **版本控制**：API路径包含版本号，如`/api/v1/users`。
- **状态码**：200成功，400请求错误，401未授权，500服务器错误。
- **分页**：列表API支持`page`和`size`参数。
- **认证**：敏感API要求Authorization头携带JWT Token。

#### 数据流图
```
前端请求 -> 控制器 -> 服务 -> 映射器 -> 数据库
响应返回 <- 控制器 <- 服务 <- 映射器 <- 数据库
```

#### 依赖关系
- 控制器依赖服务。
- 服务依赖映射器和实体。
- 配置独立，提供全局支持。
- 异常处理器和拦截器横切关注点。

此设计确保了代码的可维护性、可扩展性和安全性。
