# Locke Backend

这是一个基于Spring Boot的后端项目，为Locke应用提供API服务。该项目集成了前端构建，支持完整的应用打包和部署。

## 技术栈

- **框架**: Spring Boot 3.5.14
- **Java版本**: Java 25
- **ORM**: MyBatis Plus 3.5.16
- **数据库**: H2 (推荐，轻量级，打包方便), MySQL 8.0+ (仍支持)
- **认证**: JWT (JSON Web Token)
- **API文档**: Swagger/OpenAPI 2.8.5
- **安全**: Spring Security
- **工具**: Lombok, Thumbnailator, WebP ImageIO
- **前端构建**: Vite (集成构建)

## 环境要求

- Java 25+
- Maven 3.6+
- Node.js 16+ (前端构建)
- npm 或 yarn (前端构建)
- MySQL 8.0+ (可选，如需切换为MySQL生产环境)

## 安装步骤

1. 克隆项目到本地：

   ```bash
   git clone https://github.com/lologuan22/Locke_info.git
   cd Locke_info/backend/locke
   ```

2. 安装后端依赖：

   ```bash
   mvn clean install
   ```

3. 配置数据库：
   - 默认使用H2数据库（内存模式），无需额外配置
   - 如需使用MySQL，编辑 `src/main/resources/application-local.yml`，修改数据源配置：
     ```yaml
     spring:
       datasource:
         url: jdbc:mysql://localhost:3306/pokedex_db?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8
         driver-class-name: com.mysql.cj.jdbc.Driver
         username: root
         password: your_password
       jpa:
         database-platform: org.hibernate.dialect.MySQL8Dialect
     ```
   - 然后创建对应的MySQL数据库：`pokedex_db`

4. 配置JWT密钥（可选）：
   - 在环境变量中设置 `JWT_SECRET`，或修改 `application.yml` 中的默认值

## 运行步骤

### 本地开发环境

1. 构建前端（可选，如果需要更新前端资源）：

   ```bash
   # 手动构建前端
   cd ../../frontend
   npm install
   npm run build
   cd ../backend/locke
   ```

   或在Maven构建时自动构建（generate-resources阶段）

2. 运行应用：

   ```bash
   mvn spring-boot:run
   ```

   或使用Maven Wrapper：

   ```bash
   ./mvnw spring-boot:run  # Linux/Mac
   mvnw.cmd spring-boot:run  # Windows
   ```

3. 应用将在 `http://localhost:8080` 启动

### API文档

启动应用后，可以通过以下方式访问API文档：

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 配置说明

### 数据库配置

默认使用H2数据库，配置在 `application.yml` 中：

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL
    driver-class-name: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true  # H2控制台: http://localhost:8080/h2-console
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
```

如需使用MySQL，参考上述"安装步骤"的数据库配置部分。

### 文件上传配置

文件上传路径通过 `application.yml` 和 `WebConfig.java` 配置管理：

- **头像文件**: `{项目根目录}/data/avatars/`
- **其他图片**: `{项目根目录}/data/images/`
- **访问路径**: 
  - 头像: `/api/avatars/**`
  - 图片: `/api/images/**`

路径配置由 `WebConfig` 类动态读取，支持相对路径自动适配不同系统环境。

### JWT配置

JWT相关配置在 `application.yml` 中：

- `jwt.expiration`: Token过期时间（毫秒），默认604800000（7天）

## 项目结构

```
src/main/java/com/newblash/locke/
├── LockeApplication.java          # 应用启动类
├── common/                        # 通用类
├── config/                        # 配置类
├── controller/                    # 控制器层
├── entity/                        # 实体类
├── exception/                     # 异常处理
├── handler/                       # 处理器
├── interceptor/                   # 拦截器
├── mapper/                        # MyBatis映射接口
├── service/                       # 服务层
├── utils/                         # 工具类
└── vo/                           # 视图对象

src/main/resources/
├── static/                        # 前端静态资源（由build-frontend.ps1生成）
├── templates/                     # 模板文件
├── application.yml                # 主配置文件
└── application-local.yml          # 本地环境配置

data/                              # 应用数据目录
build-frontend.ps1                 # 前端构建脚本
build-package.ps1                  # 应用打包脚本
Start-App.ps1                      # 启动脚本
双击运行我.bat                      # Windows启动批处理
```

## 主要功能

- 用户管理（注册、登录、认证）
- 宝可梦数据管理
- 技能管理
- 背包系统
- 文件上传处理
- 前端资源服务

## 测试

运行单元测试：

```bash
mvn test
```

## 构建生产版本

### 标准JAR构建

```bash
mvn clean package
```

生成的JAR文件位于 `target/` 目录下。

### 完整应用打包（包含自定义JRE）

项目支持一键打包为独立应用：

```bash
mvn clean package
```

打包过程将：
1. 自动构建前端资源
2. 生成自定义JRE运行时（使用jlink）
3. 创建独立应用包（使用jpackage）
4. 复制数据文件和启动脚本

打包输出位于 `target/installer/LockeApp/` 目录。

### 手动打包步骤

如果需要手动执行打包：

```powershell
# 1. 构建项目
mvn clean package

# 2. 运行打包脚本
.\build-package.ps1 target locke-0.0.1-SNAPSHOT
```

## 部署

### JAR部署

1. 构建JAR文件
2. 运行：
   ```bash
   java -jar target/locke-0.0.1-SNAPSHOT.jar
   ```

### 独立应用部署

1. 完成完整打包
2. 复制 `target/installer/LockeApp/` 目录到目标机器
3. 运行 `Start-App.ps1` 或 `双击运行我.bat`

## 注意事项

- 确保数据库连接信息正确
- 文件上传路径需要有写入权限
- JWT密钥在生产环境中应该使用强密钥
- 默认端口为8080，如需修改请编辑 `application.yml`
- 前端构建需要Node.js环境
- 打包需要Java 25的jlink和jpackage工具

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 许可证

[请添加许可证信息]
