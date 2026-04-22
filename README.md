# Scaffold NestJS

基于 NestJS + Fastify 的企业级后端脚手架，面向 AI Agent 开发场景。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | NestJS 11 + Fastify |
| 语言 | TypeScript 5 |
| 数据库 | PostgreSQL + Drizzle ORM |
| 缓存 | Redis (ioredis) |
| 认证 | JWT + 全局 Guard |
| 校验 | Zod + nestjs-zod |
| 日志 | Pino + pino-pretty |
| 文档 | Swagger / OpenAPI |
| AI | OpenAI SDK (Chat Completion, Streaming, Embeddings) |
| 健康检查 | @nestjs/terminus |

## 项目结构

```
src/
├── main.ts                          # 应用入口
├── app.module.ts                    # 根模块
├── app.controller.ts                # 根路由（API 信息）
├── app.service.ts
│
├── config/                          # 配置管理
│   ├── config.module.ts             # 全局配置模块
│   ├── services/
│   │   └── app-config.service.ts    # 统一配置服务（Zod 校验）
│   ├── schemas/                     # Zod Schema 定义
│   │   ├── app.schema.ts
│   │   ├── database.schema.ts
│   │   ├── redis.schema.ts
│   │   ├── jwt.schema.ts
│   │   ├── security.schema.ts
│   │   ├── cors.schema.ts
│   │   ├── openai.schema.ts
│   │   └── swagger.schema.ts
│   ├── app.config.ts                # 配置工厂（registerAs）
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   ├── security.config.ts
│   ├── cors.config.ts
│   ├── openai.config.ts
│   ├── swagger.config.ts
│   └── logger.config.ts             # Pino 配置
│
├── common/                          # 公共组件
│   ├── decorators/
│   │   └── public.decorator.ts      # @Public() 跳过认证
│   ├── filters/
│   │   └── http-exception.filter.ts # 全局异常过滤器
│   ├── guards/
│   │   └── jwt-auth.guard.ts        # JWT 认证 Guard
│   ├── interceptors/
│   │   └── transform.interceptor.ts # 响应格式化
│   ├── events/                      # 事件处理器
│   ├── pipes/                       # 管道
│   ├── services/                    # 公共服务
│   └── utils/                       # 工具函数
│
└── modules/                         # 业务模块
    ├── database/                    # 数据库模块（Drizzle ORM）
    │   ├── database.service.ts
    │   └── schemas/
    │       └── users.schema.ts      # 用户表定义
    ├── redis/                       # Redis 模块（多客户端）
    │   └── redis.service.ts
    ├── openai/                      # OpenAI 模块
    │   ├── openai.service.ts        # Chat / Streaming / Embeddings
    │   ├── openai.exception.ts      # 自定义异常
    │   └── types.ts                 # 选项类型
    ├── health/                      # 健康检查模块
    │   ├── health.controller.ts
    │   └── indicators/              # 健康指示器
    │       ├── database.health.ts
    │       ├── redis.health.ts
    │       └── openai.health.ts
    └── jobs/                        # 定时任务模块
        ├── jobs.service.ts
        └── handlers/
            └── startup.handler.ts
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

复制环境变量文件并填写配置：

```bash
cp .env.example .env
```

关键字段说明见 `.env.example`。

### 启动

```bash
# 开发模式（热重载）
pnpm start:dev

# 生产模式
pnpm build && pnpm start:prod
```

启动后访问：

- API: `http://localhost:3300/api/v1`
- Swagger: `http://localhost:3300/api-docs`（需设置 `SWAGGER_ENABLED=true`）
- 健康检查: `http://localhost:3300/api/v1/health`

## 核心功能

### 配置管理

所有配置通过 `AppConfigService` 访问，具有完整的类型推导和 Zod 校验。配置流程：

```
.env → registerAs 工厂（Schema.parse） → ConfigService → AppConfigService（FullConfigSchema 校验）
```

在任何地方注入使用：

```ts
constructor(config: AppConfigService) {
  const port = config.app.port;
  const dbHost = config.database.host;
}
```

### OpenAI 模块

全局注入 `OpenAIService`，支持 Chat Completion、Streaming、Embeddings：

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

// 使用原始 SDK
const client = this.openai.getClient();
```

### 健康检查

基于 `@nestjs/terminus`，自动探测 Database、Redis、OpenAI 的连通状态：

```bash
curl http://localhost:3300/api/v1/health
```

返回 Terminus 标准格式，任一探测失败返回 HTTP 503。

### 认证

全局 JWT Guard，使用 `@Public()` 装饰器跳过认证：

```ts
@Get('public')
@Public()
publicEndpoint() {}

@Get('protected')
// 默认需要 JWT
protectedEndpoint() {}
```

### 数据库

Drizzle ORM，支持事务：

```ts
constructor(private readonly db: DatabaseService) {}

// 查询
const users = await this.db.query.users.findMany();

// 事务
await this.db.transaction(async (tx) => {
  await tx.insert(users).values({ email: 'a@b.com', ... });
});
```

## 脚本

```bash
pnpm build          # 编译
pnpm start:dev      # 开发模式
pnpm start:prod     # 生产模式
pnpm lint           # ESLint 检查
pnpm format         # Prettier 格式化
pnpm test           # 单元测试
pnpm test:e2e       # E2E 测试
pnpm test:cov       # 测试覆盖率
```

## License

UNLICENSED
