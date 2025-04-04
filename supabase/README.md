# Supabase 预约系统配置指南

本文档提供了如何在 NasalCareAI 应用中设置和配置 Supabase 预约系统的详细说明。

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com/) 并登录您的账户
2. 点击 "New Project" 创建一个新项目
3. 填写项目详情并选择最近的区域
4. 设置数据库密码（请妥善保存）
5. 等待项目创建完成

## 步骤 2: 创建预约表

### 使用 Supabase 智能助手创建表

1. 在 Supabase 控制台中，点击右上角的 "智能助手" 图标
2. 将 `schema.sql` 文件中的 SQL 语句复制粘贴给智能助手
3. 点击 "Run" 执行 SQL 语句
4. 验证 `appointments` 表是否已成功创建

### 手动创建表

如果您更喜欢手动创建表：

1. 在 Supabase 控制台中，导航到 "Table Editor"
2. 点击 "New Table" 并填写表详情
3. 添加以下字段：
   - `id`: bigint (主键，自动递增)
   - `created_at`: timestamptz (默认值: now())
   - `name`: text (非空)
   - `phone`: text (非空)
   - `appointment_date`: date (非空)
   - `appointment_time`: text (非空)
   - `doctor`: text (非空)
   - `symptoms`: text
   - `status`: text (默认值: '待确认')

## 步骤 3: 配置 RLS (Row Level Security) 策略

为确保数据安全，同时允许适当的访问权限，需要设置以下 RLS 策略：

1. 在 Supabase 控制台中，导航到 "Authentication" > "Policies"
2. 为 `appointments` 表启用 RLS
3. 添加以下策略：
   - 允许匿名用户插入预约数据
   - 允许已认证用户查看所有预约数据
   - 允许已认证用户更新预约状态
   - 允许已认证用户删除预约

## 步骤 4: 获取 API 凭证

1. 在 Supabase 控制台中，导航到 "Settings" > "API"
2. 复制 "URL" 和 "anon public" 密钥
3. 将这些值更新到 `src/lib/supabase.ts` 文件中：

```typescript
const supabaseUrl = '您的_SUPABASE_URL';
const supabaseAnonKey = '您的_SUPABASE_ANON_KEY';
```

## 步骤 5: 创建管理员账户

1. 在 Supabase 控制台中，导航到 "Authentication" > "Users"
2. 点击 "Invite User" 并输入管理员邮箱
3. 设置临时密码
4. 管理员将收到邀请邮件，可以使用临时密码登录并重置密码

## 故障排除

### 管理员后台看不到预约信息

如果管理员登录后台但看不到预约数据，可能是 RLS 策略配置问题：

1. 确认 RLS 已正确启用
2. 验证 "允许已认证用户查看所有预约" 策略是否正确配置
3. 检查管理员是否已正确认证

### 预约时间无法选中

如果用户在预约页面选择时间时遇到问题：

1. 检查浏览器控制台是否有错误信息
2. 确认时间选择组件的状态管理是否正确
3. 验证日期格式是否符合要求

## 其他资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端文档](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)