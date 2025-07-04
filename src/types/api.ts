/**
 * 通用API响应结构
 */
export interface ApiResponse<T = unknown> {
  /** 响应状态码 */
  code: number | string
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 是否成功 */
  success: boolean
  /** 时间戳 */
  timestamp?: number
  /** 请求ID */
  requestId?: string
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T = unknown> {
  /** 响应状态码 */
  code: number | string
  /** 响应消息 */
  message: string
  /** 是否成功 */
  success: boolean
  /** 分页数据 */
  data: {
    /** 数据列表 */
    list: T[]
    /** 当前页码 */
    page: number
    /** 每页数量 */
    pageSize: number
    /** 总数量 */
    total: number
    /** 总页数 */
    totalPages: number
    /** 是否有下一页 */
    hasNext: boolean
    /** 是否有上一页 */
    hasPrev: boolean
  }
  /** 时间戳 */
  timestamp?: number
  /** 请求ID */
  requestId?: string
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 通用查询参数
 */
export interface QueryParams extends PaginationParams {
  /** 关键字搜索 */
  keyword?: string
  /** 状态过滤 */
  status?: string | number
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 分类过滤 */
  category?: string
  /** 标签过滤 */
  tags?: string[]
  /** 索引签名，允许任意字符串键 */
  [key: string]: unknown
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  /** 文件ID */
  fileId: string
  /** 文件名 */
  fileName: string
  /** 文件大小 */
  fileSize: number
  /** 文件类型 */
  fileType: string
  /** 文件URL */
  fileUrl: string
  /** 缩略图URL */
  thumbnailUrl?: string
  /** 上传时间 */
  uploadTime: string
}

/**
 * 批量操作响应
 */
export interface BatchResponse {
  /** 成功数量 */
  successCount: number
  /** 失败数量 */
  failCount: number
  /** 总数量 */
  totalCount: number
  /** 成功的ID列表 */
  successIds: (string | number)[]
  /** 失败的ID列表 */
  failIds: (string | number)[]
  /** 错误详情 */
  errors?: {
    id: string | number
    error: string
  }[]
}

/**
 * 错误响应结构
 */
export interface ErrorResponse {
  /** 错误码 */
  code: string | number
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: string
  /** 字段错误 */
  fieldErrors?: {
    field: string
    message: string
  }[]
  /** 时间戳 */
  timestamp: number
  /** 请求路径 */
  path?: string
  /** 请求ID */
  requestId?: string
}

/**
 * 数据字典项
 */
export interface DictItem {
  /** 字典键 */
  key: string
  /** 字典值 */
  value: string
  /** 显示标签 */
  label: string
  /** 是否启用 */
  enabled: boolean
  /** 排序 */
  sort?: number
  /** 描述 */
  description?: string
  /** 扩展属性 */
  extra?: Record<string, unknown>
}

/**
 * 选项接口
 */
export interface Option {
  /** 选项值 */
  value: string | number
  /** 选项标签 */
  label: string
  /** 是否禁用 */
  disabled?: boolean
  /** 子选项 */
  children?: Option[]
}

/**
 * 树形节点接口
 */
export interface TreeNode {
  /** 节点ID */
  id: string | number
  /** 节点标签 */
  label: string
  /** 父节点ID */
  parentId?: string | number
  /** 子节点 */
  children?: TreeNode[]
  /** 是否展开 */
  expanded?: boolean
  /** 是否选中 */
  selected?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 扩展数据 */
  extra?: Record<string, unknown>
}

/**
 * 统计数据接口
 */
export interface StatsData {
  /** 总数 */
  total: number
  /** 增长数 */
  growth?: number
  /** 增长率 */
  growthRate?: number
  /** 时间段 */
  period?: string
  /** 单位 */
  unit?: string
}

/**
 * 图表数据接口
 */
export interface ChartData {
  /** 标签 */
  label: string
  /** 值 */
  value: number
  /** 颜色 */
  color?: string
  /** 额外数据 */
  extra?: Record<string, unknown>
}

/**
 * 地区数据接口
 */
export interface RegionData {
  /** 地区代码 */
  code: string
  /** 地区名称 */
  name: string
  /** 地区级别 */
  level: 'province' | 'city' | 'district'
  /** 父地区代码 */
  parentCode?: string
  /** 子地区 */
  children?: RegionData[]
}

/**
 * 通知数据接口
 */
export interface NotificationData {
  /** 通知ID */
  id: string
  /** 通知类型 */
  type: 'info' | 'success' | 'warning' | 'error'
  /** 通知标题 */
  title: string
  /** 通知内容 */
  content: string
  /** 是否已读 */
  read: boolean
  /** 创建时间 */
  createTime: string
  /** 过期时间 */
  expireTime?: string
  /** 操作按钮 */
  actions?: {
    label: string
    action: string
    type?: 'primary' | 'default' | 'danger'
  }[]
}

/**
 * 系统配置接口
 */
export interface SystemConfig {
  /** 配置键 */
  key: string
  /** 配置值 */
  value: unknown
  /** 配置类型 */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  /** 配置分组 */
  group?: string
  /** 配置描述 */
  description?: string
  /** 是否可编辑 */
  editable?: boolean
}

/**
 * 日志记录接口
 */
export interface LogRecord {
  /** 日志ID */
  id: string
  /** 日志级别 */
  level: 'debug' | 'info' | 'warn' | 'error'
  /** 日志消息 */
  message: string
  /** 日志时间 */
  timestamp: string
  /** 用户ID */
  userId?: string
  /** 操作模块 */
  module?: string
  /** 操作类型 */
  action?: string
  /** 请求IP */
  ip?: string
  /** 用户代理 */
  userAgent?: string
  /** 额外数据 */
  extra?: Record<string, unknown>
}

/**
 * 版本信息接口
 */
export interface VersionInfo {
  /** 版本号 */
  version: string
  /** 构建时间 */
  buildTime: string
  /** Git提交哈希 */
  gitHash?: string
  /** 环境信息 */
  environment: string
  /** 功能特性 */
  features?: string[]
  /** 依赖信息 */
  dependencies?: Record<string, string>
}
