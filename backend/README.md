# Locke Backend

这是一个基于Spring Boot的后端项目，为Locke应用提供API服务。

## 技术栈

- **框架**: Spring Boot 3.5.14
- **Java版本**: Java 25
- **ORM**: MyBatis Plus 3.5.16
- **数据库**: MySQL
- **认证**: JWT (JSON Web Token)
- **API文档**: Swagger/OpenAPI
- **安全**: Spring Security
- **工具**: Lombok, Thumbnailator, WebP ImageIO

## 环境要求

- Java 25+
- Maven 3.6+
- MySQL 8.0+

## 安装步骤

1. 克隆项目到本地：
   ```bash
   git clone https://github.com/lologuan22/Locke_info.git
   cd Locke_info/backend/locke
   ```

2. 安装依赖：
   ```bash
   mvn clean install
   ```

3. 配置数据库：
   - 创建MySQL数据库：`pokedex_db`
   - 更新 `src/main/resources/application-local.yml` 中的数据库连接信息

4. 配置JWT密钥（可选）：
   - 在环境变量中设置 `JWT_SECRET`，或修改 `application.yml` 中的默认值

## 运行步骤

### 本地开发环境

1. 确保MySQL服务正在运行
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

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 配置说明

### 数据库配置

在 `application-local.yml` 中配置数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/pokedex_db?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: your_password
```

### 文件上传配置

默认文件上传路径：
- 通用文件: `D:/locke-uploads/common/`
- 头像文件: `D:/locke-uploads/avatars/`
- 访问路径: `/api/images/**`

### JWT配置

JWT相关配置在 `application.yml` 中：
- `jwt.secret`: JWT签名密钥
- `jwt.expiration`: Token过期时间（毫秒）

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
```

## 主要功能

- 用户管理（注册、登录、认证）
- 宝可梦数据管理
- 技能管理
- 背包系统
- 文件上传处理

## 测试

运行单元测试：
```bash
mvn test
```

## 构建生产版本

```bash
mvn clean package
```

生成的JAR文件位于 `target/` 目录下。

## 部署

1. 构建JAR文件
2. 运行：
   ```bash
   java -jar target/locke-0.0.1-SNAPSHOT.jar
   ```

## 注意事项

- 确保数据库连接信息正确
- 文件上传路径需要有写入权限
- JWT密钥在生产环境中应该使用强密钥
- 默认端口为8080，如需修改请编辑 `application.yml`

