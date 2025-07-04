/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 页面未找到 */
  NOT_FOUND = '404',
  /** 权限不足 */
  FORBIDDEN = '403',
  /** 服务器错误 */
  SERVER_ERROR = '500',
  /** 网络错误 */
  NETWORK_ERROR = 'NETWORK',
  /** 通用错误 */
  GENERIC = 'GENERIC',
}

/**
 * 错误页面配置接口
 */
export interface ErrorPageConfig {
  /** 错误类型 */
  type: ErrorType
  /** 错误代码 */
  code: string
  /** 错误标题 */
  title: string
  /** 错误描述 */
  description: string
  /** 自定义图标名称 */
  icon?: string
  /** 是否显示返回按钮 */
  showBackButton?: boolean
  /** 是否显示首页按钮 */
  showHomeButton?: boolean
  /** 是否显示重试按钮 */
  showRetryButton?: boolean
  /** 自定义操作按钮 */
  customActions?: ErrorAction[]
  /** 是否显示详细错误信息 */
  showDetails?: boolean
  /** 详细错误信息 */
  details?: string
}

/**
 * 错误操作按钮接口
 */
export interface ErrorAction {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  /** 按钮图标 */
  icon?: string
  /** 点击处理函数 */
  handler: () => void | Promise<void>
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 错误图标配置接口
 */
export interface ErrorIconConfig {
  /** 图标名称 */
  name: string
  /** 图标大小 */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 是否显示动画 */
  animated?: boolean
  /** 自定义样式类名 */
  className?: string
}

/**
 * 错误页面主题配置
 */
export interface ErrorThemeConfig {
  /** 主色调 */
  primaryColor?: string
  /** 背景色 */
  backgroundColor?: string
  /** 文本色 */
  textColor?: string
  /** 边框色 */
  borderColor?: string
  /** 阴影配置 */
  shadow?: string
}

/**
 * 错误页面布局配置
 */
export interface ErrorLayoutConfig {
  /** 布局类型 */
  layout?: 'centered' | 'top' | 'bottom'
  /** 最大宽度 */
  maxWidth?: number | string
  /** 内边距 */
  padding?: number | string
  /** 是否显示背景图案 */
  showBackgroundPattern?: boolean
  /** 背景图案类型 */
  backgroundPattern?: 'dots' | 'grid' | 'waves' | 'none'
}

/**
 * 错误页面动画配置
 */
export interface ErrorAnimationConfig {
  /** 是否启用动画 */
  enabled?: boolean
  /** 入场动画类型 */
  enterAnimation?: 'fade' | 'slide' | 'bounce' | 'zoom'
  /** 动画持续时间 */
  duration?: number
  /** 动画延迟 */
  delay?: number
  /** 动画缓动函数 */
  easing?: string
}

/**
 * 错误页面完整配置
 */
export interface ErrorPageFullConfig extends ErrorPageConfig {
  /** 主题配置 */
  theme?: ErrorThemeConfig
  /** 布局配置 */
  layout?: ErrorLayoutConfig
  /** 动画配置 */
  animation?: ErrorAnimationConfig
}

/**
 * 预定义错误配置
 */
export const ERROR_CONFIGS: Record<ErrorType, ErrorPageConfig> = {
  [ErrorType.NOT_FOUND]: {
    type: ErrorType.NOT_FOUND,
    code: '404',
    title: '页面未找到',
    description: '抱歉，您访问的页面不存在或已被删除。',
    icon: 'not-found',
    showBackButton: true,
    showHomeButton: true,
    showRetryButton: false,
  },
  [ErrorType.FORBIDDEN]: {
    type: ErrorType.FORBIDDEN,
    code: '403',
    title: '权限不足',
    description: '抱歉，您没有权限访问此页面。',
    icon: 'forbidden',
    showBackButton: true,
    showHomeButton: true,
    showRetryButton: false,
  },
  [ErrorType.SERVER_ERROR]: {
    type: ErrorType.SERVER_ERROR,
    code: '500',
    title: '服务器错误',
    description: '服务器出现了一些问题，请稍后重试。',
    icon: 'server-error',
    showBackButton: true,
    showHomeButton: true,
    showRetryButton: true,
  },
  [ErrorType.NETWORK_ERROR]: {
    type: ErrorType.NETWORK_ERROR,
    code: 'NETWORK',
    title: '网络连接失败',
    description: '无法连接到服务器，请检查您的网络连接。',
    icon: 'network-error',
    showBackButton: true,
    showHomeButton: true,
    showRetryButton: true,
  },
  [ErrorType.GENERIC]: {
    type: ErrorType.GENERIC,
    code: 'ERROR',
    title: '出现了错误',
    description: '抱歉，发生了未知错误。',
    icon: 'generic-error',
    showBackButton: true,
    showHomeButton: true,
    showRetryButton: true,
  },
}

/**
 * 错误页面事件类型
 */
export interface ErrorPageEvents {
  /** 返回按钮点击事件 */
  onBack?: () => void
  /** 首页按钮点击事件 */
  onHome?: () => void
  /** 重试按钮点击事件 */
  onRetry?: () => void
  /** 错误详情切换事件 */
  onToggleDetails?: (show: boolean) => void
  /** 页面挂载事件 */
  onMounted?: () => void
}

/**
 * 错误上报数据接口
 */
export interface ErrorReportData {
  /** 错误类型 */
  type: ErrorType
  /** 错误代码 */
  code: string
  /** 错误消息 */
  message: string
  /** 错误堆栈 */
  stack?: string
  /** 当前路径 */
  path: string
  /** 用户代理 */
  userAgent: string
  /** 时间戳 */
  timestamp: number
  /** 用户ID */
  userId?: string
  /** 会话ID */
  sessionId?: string
  /** 额外数据 */
  extra?: Record<string, unknown>
}

/**
 * 错误页面工具函数类型
 */
export type ErrorPageUtils = {
  /** 获取错误配置 */
  getErrorConfig: (type: ErrorType) => ErrorPageConfig
  /** 上报错误 */
  reportError: (data: ErrorReportData) => Promise<void>
  /** 格式化错误信息 */
  formatError: (error: Error, type?: ErrorType) => ErrorPageConfig
  /** 检查错误类型 */
  isErrorType: (value: string) => value is ErrorType
}
