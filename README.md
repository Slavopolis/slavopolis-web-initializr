# Slavopolis Web Initializr

<div align="center">
  <img src="./src/assets/logo.svg" alt="Slavopolis Logo" width="50" height="50">
  
  <h3>基于 Arco Design Pro + React 开发的前端模版项目</h3>
  
  <p>
    <a href="https://arco.design/" target="_blank">Arco Design Pro</a> 驱动的企业级前端开发框架
  </p>
  
  <p>
    <a href="https://github.com/Slavopolis/slavopolis-web-initializr/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/Slavopolis/slavopolis-web-initializr" alt="License">
    </a>
    <a href="https://github.com/Slavopolis/slavopolis-web-initializr/releases">
      <img src="https://img.shields.io/github/v/release/Slavopolis/slavopolis-web-initializr" alt="Release">
    </a>
    <a href="https://github.com/Slavopolis/slavopolis-web-initializr/issues">
      <img src="https://img.shields.io/github/issues/Slavopolis/slavopolis-web-initializr" alt="Issues">
    </a>
    <a href="https://github.com/Slavopolis/slavopolis-web-initializr/stargazers">
      <img src="https://img.shields.io/github/stars/Slavopolis/slavopolis-web-initializr" alt="Stars">
    </a>
  </p>
</div>

## 📖 项目简介

Slavopolis Web Initializr 是一个基于 [Arco Design Pro](https://arco.design/) + React 开发的企业级前端模版项目，专为 slavopolis-cloud-initializr 后端服务提供配套的前端解决方案。

该项目提供了完整的企业级前端开发框架，包含用户权限管理、数据可视化、表单处理、列表展示等常用功能模块，帮助开发者快速搭建现代化的 Web 应用。

## ✨ 特性

- 🚀 **现代化技术栈**：基于 React 17 + TypeScript + Arco Design Pro
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🎨 **丰富的组件**：提供大量开箱即用的业务组件
- 🔐 **权限管理**：内置完整的权限控制系统
- 📊 **数据可视化**：集成 BizCharts 图表组件
- 🌙 **主题切换**：支持明暗主题切换
- 🌐 **国际化**：内置多语言支持
- 📦 **状态管理**：集成 Redux 状态管理
- 🔧 **开发工具**：内置 ESLint、Prettier、Stylelint 等开发工具
- 🚢 **部署优化**：支持多环境部署配置

## 🛠️ 技术栈

- **前端框架**：React 17.0.2
- **UI 组件库**：Arco Design Pro
- **开发语言**：TypeScript
- **构建工具**：React App Rewired
- **状态管理**：Redux + React Redux
- **路由管理**：React Router
- **HTTP 客户端**：Axios
- **图表库**：BizCharts
- **样式处理**：Less
- **代码规范**：ESLint + Prettier + Stylelint

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- Yarn >= 1.22.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/Slavopolis/slavopolis-web-initializr.git

# 进入项目目录
cd slavopolis-web-initializr

# 安装依赖
yarn install
```

### 开发运行

```bash
# 启动开发服务器
yarn dev

# 或者使用 start 命令
yarn start
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 查看项目。

### 构建部署

```bash
# 构建生产版本
yarn build

# 构建文件将生成在 build 目录中
```

## 📁 项目结构

```
slavopolis-web-initializr/
├── README.md
├── config-overrides.js
├── package-lock.json
├── package.json
├── public
│   └── index.html                  # cra打包模版文件
├── react-app-env.d.ts
├── src
│   ├── assets                      # 静态资源
│   ├── components                  # 通用业务组件
│   ├── context.tsx                 # 全局配置
│   ├── declaration.d.ts
│   ├── index.tsx                   # 入口文件
│   ├── layout.tsx                  # 布局
│   ├── locale                      # 国际化语言包
│   ├── mock                        # 公共组件模拟数据
│   ├── pages                       # 页面模版
│   ├── react-app-env.d.ts
│   ├── routes.ts                   # 路由配置
│   ├── settings.json               # 配置文件
│   ├── store                       # redux状态管理
│   ├── style                       # 全局样式
│   └── utils                       # 工具库
├── tsconfig-base.json
├── tsconfig.json
└── yarn.lock
```

## 🔧 开发指南

### 代码规范

项目使用 ESLint、Prettier、Stylelint 进行代码规范检查：

```bash
# 运行 ESLint 检查
yarn eslint

# 运行 Stylelint 检查
yarn stylelint

# 运行所有检查（提交前检查）
yarn pre-commit
```

### 环境配置

在项目根目录创建 `.env.local` 文件进行本地环境配置：

```bash
# 复制环境配置模板
cp .env.local.example .env.local

# 编辑环境配置
vim .env.local
```

### 主题定制

项目支持主题定制，可以通过修改 `src/style/` 目录下的样式文件来自定义主题。

### 国际化

项目内置国际化支持，语言文件位于 `src/locale/` 目录。

## 🚢 部署

### 环境变量

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.local` - 本地环境配置（不会提交到版本控制）

### 部署到生产环境

```bash
# 构建生产版本
yarn build

# 部署到服务器
# 将 build 目录中的文件部署到 Web 服务器
```

## 🤝 贡献指南

我们欢迎任何形式的贡献！请遵循以下步骤：

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 开发规范

- 遵循项目的代码规范
- 编写清晰的提交信息
- 为新功能添加相应的测试
- 更新相关文档

## 📝 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新详情。

## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源。

## 🔗 相关链接

- [Arco Design Pro 官网](https://arco.design/)
- [Slavopolis Cloud Initializr](https://github.com/Slavopolis/slavopolis-cloud-initializr)
- [问题反馈](https://github.com/Slavopolis/slavopolis-web-initializr/issues)
- [功能请求](https://github.com/Slavopolis/slavopolis-web-initializr/issues/new)

## 📞 联系我们

如果您有任何问题或建议，请通过以下方式联系我们：

- 提交 [Issue](https://github.com/Slavopolis/slavopolis-web-initializr/issues)
- 发送邮件：[your-email@example.com](mailto:your-email@example.com)

---

<div align="center">
  <p>如果这个项目对您有帮助，请给我们一个 ⭐️ 支持！</p>
</div>
