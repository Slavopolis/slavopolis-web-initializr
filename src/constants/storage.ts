/**
 * 本地存储键名常量
 */
export const STORAGE_KEYS = {
  // 认证相关
  ACCESS_TOKEN: 'slavopolis_access_token',
  REFRESH_TOKEN: 'slavopolis_refresh_token',
  TOKEN_EXPIRE: 'slavopolis_token_expire',

  // 用户信息
  USER_INFO: 'slavopolis_user_info',
  USER_PREFERENCES: 'slavopolis_user_preferences',
  USER_PERMISSIONS: 'slavopolis_user_permissions',

  // 应用设置
  APP_SETTINGS: 'slavopolis_app_settings',
  APP_THEME: 'slavopolis_app_theme',
  APP_LANGUAGE: 'slavopolis_app_language',
  APP_LAYOUT: 'slavopolis_app_layout',

  // 页面状态
  PAGE_STATE: 'slavopolis_page_state',
  ROUTE_CACHE: 'slavopolis_route_cache',
  FORM_CACHE: 'slavopolis_form_cache',

  // 业务数据
  PROJECT_CONFIG: 'slavopolis_project_config',
  LAST_PROJECT: 'slavopolis_last_project',
  RECENT_PROJECTS: 'slavopolis_recent_projects',

  // 缓存前缀
  CACHE_PREFIX: 'slavopolis_cache_',
  API_CACHE_PREFIX: 'slavopolis_api_cache_',

  // 临时数据
  TEMP_DATA: 'slavopolis_temp_data',
  DRAFT_DATA: 'slavopolis_draft_data',

  // 系统配置
  SYSTEM_CONFIG: 'slavopolis_system_config',
  DEBUG_MODE: 'slavopolis_debug_mode',

  // 性能监控
  PERFORMANCE_DATA: 'slavopolis_performance_data',
  ERROR_LOGS: 'slavopolis_error_logs',
} as const

/**
 * SessionStorage 键名常量
 */
export const SESSION_STORAGE_KEYS = {
  // 当前会话信息
  CURRENT_SESSION: 'slavopolis_current_session',
  SESSION_ID: 'slavopolis_session_id',

  // 临时状态
  TEMP_AUTH_STATE: 'slavopolis_temp_auth_state',
  TEMP_FORM_DATA: 'slavopolis_temp_form_data',

  // 页面状态
  PAGE_SCROLL_POSITION: 'slavopolis_page_scroll_position',
  TAB_STATE: 'slavopolis_tab_state',

  // 搜索历史
  SEARCH_HISTORY: 'slavopolis_search_history',
  FILTER_STATE: 'slavopolis_filter_state',

  // 工作流状态
  WORKFLOW_STATE: 'slavopolis_workflow_state',
  STEP_DATA: 'slavopolis_step_data',
} as const

/**
 * 缓存配置常量
 */
export const CACHE_CONFIG = {
  // 默认过期时间（毫秒）
  DEFAULT_EXPIRE: 30 * 60 * 1000, // 30分钟

  // 短期缓存（5分钟）
  SHORT_EXPIRE: 5 * 60 * 1000,

  // 中期缓存（1小时）
  MEDIUM_EXPIRE: 60 * 60 * 1000,

  // 长期缓存（24小时）
  LONG_EXPIRE: 24 * 60 * 60 * 1000,

  // 永久缓存（1年）
  PERMANENT_EXPIRE: 365 * 24 * 60 * 60 * 1000,

  // API 缓存过期时间
  API_CACHE_EXPIRE: 10 * 60 * 1000, // 10分钟

  // 用户数据缓存过期时间
  USER_CACHE_EXPIRE: 60 * 60 * 1000, // 1小时

  // 配置数据缓存过期时间
  CONFIG_CACHE_EXPIRE: 24 * 60 * 60 * 1000, // 24小时

  // 静态数据缓存过期时间
  STATIC_CACHE_EXPIRE: 7 * 24 * 60 * 60 * 1000, // 7天

  // 最大缓存条目数
  MAX_CACHE_ITEMS: 1000,

  // 最大缓存大小（字节）
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
} as const

/**
 * 存储配置常量
 */
export const STORAGE_CONFIG = {
  // 存储版本
  VERSION: '1.0.0',

  // 存储命名空间
  NAMESPACE: 'slavopolis',

  // 是否启用加密
  ENABLE_ENCRYPTION: false,

  // 是否启用压缩
  ENABLE_COMPRESSION: false,

  // 自动清理过期数据间隔（毫秒）
  AUTO_CLEANUP_INTERVAL: 60 * 60 * 1000, // 1小时

  // 存储容量警告阈值（字节）
  STORAGE_WARNING_THRESHOLD: 80 * 1024 * 1024, // 80MB

  // 存储容量限制（字节）
  STORAGE_LIMIT: 100 * 1024 * 1024, // 100MB
} as const

/**
 * 业务缓存键名模板
 */
export const CACHE_KEYS = {
  // 用户相关
  USER_PROFILE: (userId: string | number) => `user_profile_${userId}`,
  USER_PERMISSIONS: (userId: string | number) => `user_permissions_${userId}`,
  USER_SETTINGS: (userId: string | number) => `user_settings_${userId}`,

  // API 响应缓存
  API_RESPONSE: (endpoint: string, params?: string) =>
    `api_response_${endpoint}${params ? `_${params}` : ''}`,

  // 项目相关
  PROJECT_LIST: 'project_list',
  PROJECT_DETAIL: (projectId: string | number) => `project_detail_${projectId}`,
  PROJECT_CONFIG: (projectId: string | number) => `project_config_${projectId}`,

  // 系统配置
  SYSTEM_CONFIG: 'system_config',
  FEATURE_FLAGS: 'feature_flags',
  APP_VERSION: 'app_version',

  // 字典数据
  DICT_DATA: (dictType: string) => `dict_data_${dictType}`,
  ENUM_DATA: (enumType: string) => `enum_data_${enumType}`,

  // 地区数据
  REGION_DATA: 'region_data',
  CITY_LIST: (provinceId: string | number) => `city_list_${provinceId}`,

  // 文件相关
  FILE_LIST: (directory: string) => `file_list_${directory}`,
  FILE_PREVIEW: (fileId: string | number) => `file_preview_${fileId}`,

  // 搜索相关
  SEARCH_SUGGESTIONS: (keyword: string) => `search_suggestions_${keyword}`,
  SEARCH_RESULTS: (query: string) => `search_results_${query}`,

  // 统计数据
  DASHBOARD_DATA: 'dashboard_data',
  STATS_DATA: (dateRange: string) => `stats_data_${dateRange}`,

  // 通知相关
  NOTIFICATION_LIST: 'notification_list',
  UNREAD_COUNT: 'unread_count',
} as const

/**
 * 存储事件类型
 */
export const STORAGE_EVENTS = {
  // 数据变更事件
  DATA_CHANGED: 'storage:data:changed',
  DATA_EXPIRED: 'storage:data:expired',
  DATA_CLEARED: 'storage:data:cleared',

  // 认证事件
  TOKEN_UPDATED: 'storage:token:updated',
  TOKEN_EXPIRED: 'storage:token:expired',
  TOKEN_REMOVED: 'storage:token:removed',

  // 用户事件
  USER_LOGIN: 'storage:user:login',
  USER_LOGOUT: 'storage:user:logout',
  USER_INFO_UPDATED: 'storage:user:info:updated',

  // 设置事件
  SETTINGS_UPDATED: 'storage:settings:updated',
  THEME_CHANGED: 'storage:theme:changed',
  LANGUAGE_CHANGED: 'storage:language:changed',

  // 缓存事件
  CACHE_HIT: 'storage:cache:hit',
  CACHE_MISS: 'storage:cache:miss',
  CACHE_EXPIRED: 'storage:cache:expired',
  CACHE_CLEARED: 'storage:cache:cleared',

  // 错误事件
  STORAGE_ERROR: 'storage:error',
  QUOTA_EXCEEDED: 'storage:quota:exceeded',
} as const

/**
 * 存储策略配置
 */
export const STORAGE_STRATEGY = {
  // 认证信息策略
  AUTH: {
    type: 'localStorage' as const,
    encrypt: true,
    expire: 24 * 60 * 60 * 1000, // 24小时
  },

  // 用户信息策略
  USER: {
    type: 'localStorage' as const,
    encrypt: false,
    expire: 60 * 60 * 1000, // 1小时
  },

  // 应用设置策略
  SETTINGS: {
    type: 'localStorage' as const,
    encrypt: false,
    expire: undefined, // 永不过期
  },

  // 缓存数据策略
  CACHE: {
    type: 'localStorage' as const,
    encrypt: false,
    expire: 30 * 60 * 1000, // 30分钟
  },

  // 临时数据策略
  TEMP: {
    type: 'sessionStorage' as const,
    encrypt: false,
    expire: undefined, // 会话结束时清除
  },

  // 敏感数据策略
  SENSITIVE: {
    type: 'sessionStorage' as const,
    encrypt: true,
    expire: 15 * 60 * 1000, // 15分钟
  },
} as const
