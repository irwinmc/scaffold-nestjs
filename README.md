# Scaffold NestJS

基于 NestJS + Fastify 的企业级后端脚手架，面向 AI Agent 开发场景，开箱即用。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | NestJS 11 + Fastify |
| 语言 | TypeScript 5 |
| 数据库 | PostgreSQL + Drizzle ORM |
| 缓存 | Redis (ioredis)，多客户端 |
| 任务队列 | BullMQ |
| 认证 | JWT + 全局 Guard |
| 权限 | 角色鉴权（RolesGuard） |
| 限流 | @nestjs/throttler |
| 校验 | Zod + nestjs-zod |
| 密码 | bcryptjs |
| 日志 | nestjs-pino（Pino） |
| 文档 | Swagger / OpenAPI |
| 安全 | Helmet + Compression |
| AI | OpenAI SDK（Chat Completion、Streaming、Embeddings） |
| 调度 | @nestjs/schedule |
| 健康检查 | @nestjs/terminus |

## 项目结构

```
src/
├── main.ts                               # 应用入口
├── app.module.ts                         # 根模块
├── app.controller.ts                     # 根路由
├── app.service.ts
│
├── config/                               # 配置管理
│   ├── index.ts                          # 统一导出
│   ├── config.module.ts                  # 全局配置模块
│   ├── services/
│   │   └── app-config.service.ts         # 统一配置服务（Zod 二次校验）
│   ├── schemas/                          # Zod Schema 定义
│   │   ├── index.ts                      # FullConfigSchema 聚合导出
│   │   ├── app.schema.ts
│   │   ├── database.schema.ts
│   │   ├── redis.schema.ts
│   │   ├── jwt.schema.ts
│   │   ├── security.schema.ts
│   │   ├── cors.schema.ts
│   │   ├── openai.schema.ts
│   │   └── swagger.schema.ts
│   ├── app.config.ts                     # registerAs 配置工厂
│   ├── security.config.ts
│   ├── jwt.config.ts
│   ├── redis.config.ts
│   ├── database.config.ts
│   ├── cors.config.ts
│   ├── openai.config.ts
│   ├── swagger.config.ts
│   └── logger.config.ts                  # Pino 多传输配置
│
├── common/                               # 公共组件
│   ├── decorators/
│   │   ├── index.ts
│   │   ├── public.decorator.ts           # @Public() 跳过认证
│   │   ├── current-user.decorator.ts     # @CurrentUser() 提取当前用户
│   │   └── roles.decorator.ts            # @Roles() 角色控制
│   ├── enums/                            # 枚举（预留）
│   ├── events/                           # 事件（预留）
│   ├── filters/
│   │   ├── index.ts
│   │   └── http-exception.filter.ts      # 全局异常过滤器（AllExceptionsFilter）
│   ├── guards/
│   │   ├── index.ts
│   │   ├── jwt-auth.guard.ts             # JWT 认证 Guard
│   │   └── roles.guard.ts                # 角色鉴权 Guard
│   ├── interceptors/
│   │   ├── index.ts
│   │   ├── transform.interceptor.ts      # 响应格式化为 { data, statusCode, message, timestamp }
│   │   └── timeout.interceptor.ts        # 请求超时控制
│   ├── pipes/
│   │   ├── index.ts
│   │   ├── trim.pipe.ts                  # 全局自动 trim 字符串入参
│   │   └── parse-int-id.pipe.ts          # 路径参数 :id 转 number
│   ├── services/                         # 公共服务（预留）
│   └── utils/                            # 工具函数（预留）
│
└── modules/                              # 业务模块
    ├── index.ts                          # 模块统一导出
    ├── database/                         # 数据库模块
    │   ├── index.ts
    │   ├── database.module.ts
    │   ├── database.service.ts           # Drizzle ORM + postgres.js
    │   └── schemas/
    │       ├── index.ts
    │       └── users.schema.ts           # 用户表定义
    ├── redis/                            # Redis 多客户端模块
    │   ├── index.ts
    │   ├── redis.module.ts
    │   └── redis.service.ts              # default / queue / pub 三客户端
    ├── openai/                           # OpenAI 模块
    │   ├── index.ts
    │   ├── openai.module.ts
    │   ├── openai.service.ts             # Chat / Streaming / Embeddings
    │   ├── openai.exception.ts           # 自定义异常处理
    │   └── types.ts                      # 选项类型
    ├── health/                           # 健康检查模块
    │   ├── index.ts
    │   ├── health.module.ts
    │   ├── health.controller.ts
    │   └── indicators/
    │       ├── index.ts
    │       ├── database.health.ts
    │       ├── redis.health.ts
    │       └── openai.health.ts
    ├── jobs/                             # 定时任务模块
    │   ├── index.ts
    │   ├── jobs.module.ts
    │   ├── jobs.service.ts
    │   └── handlers/
    │       ├── index.ts
    │       ├── startup.handler.ts
    │       └── task.handler.ts
    └── auth/                             # 认证模块
        ├── index.ts
        ├── auth.module.ts
        ├── auth.controller.ts            # POST /auth/register, /auth/login
        ├── auth.service.ts               # bcrypt 哈希 + JWT 签发
        └── dto/
            ├── index.ts
            ├── login.dto.ts
            └── register.dto.ts
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm
- PostgreSQL
- Redis

### 安装

```bash
pnpm install
```

### 配置

```bash
cp .env.example .env
```

按需编辑 `.env` 中的环境变量。`AppConfigService` 会在启动时统一校验所有配置项，校验失败时抛出明确错误。

### 启动

```bash
# 开发模式（热重载）
pnpm start:dev

# 调试模式
pnpm start:debug

# 生产模式
pnpm build && pnpm start:prod
```

启动后访问：

- API：`http://localhost:3300/api/v1`
- Swagger：`http://localhost:3300/api-docs`（需设置 `SWAGGER_ENABLED=true`）
- 健康检查：`http://localhost:3300/api/v1/health`

## 核心功能

### 配置管理

两层校验机制，确保配置正确：

```
.env → registerAs 工厂（Schema.parse） → ConfigService → AppConfigService（FullConfigSchema.parse 二次聚合校验）
```

在任何地方注入使用，完整的 TypeScript 类型推导：

```ts
constructor(config: AppConfigService) {
  const port = config.app.port;
  const dbHost = config.database.host;
}
```

### 安全防护

| 组件 | 作用 |
|------|------|
| `@fastify/helmet` | 设置安全 HTTP 头（CSP、X-Frame-Options 等） |
| `@fastify/compress` | 响应体 gzip 压缩 |
| `@nestjs/throttler` | 全局限流（通过 `RATE_LIMIT_TTL` / `RATE_LIMIT_MAX` 配置） |
| `AllExceptionsFilter` | 全局异常捕获，自动脱敏敏感信息，结构化 Pino 日志输出 |

异常过滤器在非生产环境返回 `stack`，生产环境仅返回基础错误信息。自动过滤 `authorization`、`cookie`、`x-api-key` 等敏感请求头。

### OpenAI 模块

全局模块，注入 `OpenAIService`，支持 Chat Completion、Streaming、Embeddings：

```ts
import { OpenAIService } from '@/modules/openai';

// Chat Completion
const response = await this.openai.chatCompletion([
  { role: 'user', content: 'Hello' },
]);

// Streaming
const stream = await this.openai.chatCompletionStream([
  { role: 'user', content: 'Hello' },
]);
for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content;
  if (delta) yield delta;
}

// Embeddings
const embedding = await this.openai.createEmbedding('text to embed', {
  dimensions: 512,
});

// 使用原始 SDK 客户端
const client = this.openai.getClient();
```

所有方法均有统一的错误处理（`handleOpenAIError`），自动将 OpenAI 错误码映射为 HTTP 异常。

### Redis 多客户端

`RedisService` 预置三种客户端，适配不同场景：

| 客户端 | 用途 |
|--------|------|
| `default` | 通用缓存 |
| `queue` | BullMQ 任务队列（自动关闭 `maxRetriesPerRequest`） |
| `pub` | Pub/Sub（关闭 `enableReadyCheck` 提升性能） |

```ts
// 使用指定客户端
const cache = this.redis.getClient('default');
const queue = this.redis.getClient('queue');
const pub = this.redis.getClient('pub');
```

所有客户端在模块销毁时自动 `quit()`。

### 数据库

基于 Drizzle ORM + postgres.js，支持事务：

```ts
constructor(private readonly db: DatabaseService) {}

// 查询
const users = await this.db.query.users.findMany();

// 事务
await this.db.transaction(async (tx) => {
  await tx.insert(users).values({ email: 'a@b.com', ... });
});
```

非生产环境自动开启 SQL 日志输出。

### 健康检查

基于 `@nestjs/terminus`，自动探测 Database、Redis、OpenAI 的连通状态：

```bash
curl http://localhost:3300/api/v1/health
```

返回 Terminus 标准格式，任一探测失败返回 HTTP 503。

### 认证与权限

全局 `JwtAuthGuard` + `RolesGuard`，请求处理链：

```
JwtAuthGuard（认证）→ RolesGuard（角色鉴权）
```

内置 Auth 模块，开箱即用：

```bash
# 注册
curl -X POST http://localhost:3300/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"alice","password":"123456"}'

# 登录
curl -X POST http://localhost:3300/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'

# 响应 { user: { id, email, username }, accessToken, expiresIn }
```

```ts
// 跳过认证
@Get('public')
@Public()
publicEndpoint() {}

// 角色控制
@Get('admin')
@Roles('admin')
adminOnly() {}

// 获取当前用户
@Get('profile')
getProfile(@CurrentUser() user: RequestUser) {
  return user;  // { userId, email, roles }
}

// 只取某个字段
@Get('me')
getMe(@CurrentUser('email') email: string) {
  return { email };
}
```

签发 token 时需包含 `roles`：

```ts
jwtService.sign({ sub: userId, email, roles: ['admin'] });
```

### 全局管道与拦截器

| 组件 | 作用 |
|------|------|
| `TrimPipe` | 全局，自动递归 trim 所有字符串入参 |
| `ZodValidationPipe` | 全局，Zod Schema 校验请求参数（nestjs-zod） |
| `ParseIntIdPipe` | 路由级，路径参数 `:id` 转 number，非法值返回 400 |
| `TransformInterceptor` | 全局，统一响应 `{ data, statusCode, message, timestamp }` |
| `TimeoutInterceptor` | 全局，请求超时控制（默认 30s），超时返回 408 |

管道执行顺序：`TrimPipe` → `ZodValidationPipe`（先 trim 再校验）。

### 响应格式

成功响应（`TransformInterceptor`）：

```json
{
  "data": { ... },
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

错误响应（`AllExceptionsFilter`）：

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/v1/xxx",
  "method": "POST"
}
```

## 脚本

```bash
pnpm build          # 编译
pnpm start:dev      # 开发模式（热重载）
pnpm start:debug    # 调试模式（断点调试）
pnpm start:prod     # 生产模式
pnpm lint           # ESLint 检查
pnpm format         # Prettier 格式化
pnpm test           # 单元测试
pnpm test:watch     # 测试监听模式
pnpm test:debug     # 调试单测
pnpm test:e2e       # E2E 测试
pnpm test:cov       # 测试覆盖率
```

## License

UNLICENSED
