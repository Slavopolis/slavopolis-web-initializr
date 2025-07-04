/**
 * API 配置常量
 */
export const API_CONFIG = {
  // 默认配置
  DEFAULT_BASE_URL: 'http://localhost:8080/api',
  DEFAULT_TIMEOUT: 30000,

  // 重试配置
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,

  // 分页配置
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // 文件上传配置
  UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  UPLOAD_TIMEOUT: 300000, // 5分钟

  // 缓存配置
  CACHE_DURATION: 5 * 60 * 1000, // 5分钟
} as const

/**
 * HTTP 状态码常量
 */
export const HTTP_STATUS = {
  // 成功状态码
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 客户端错误状态码
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  // 服务器错误状态码
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

/**
 * API 端点常量
 */
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // 用户相关
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    AVATAR: '/user/avatar',
    PREFERENCES: '/user/preferences',
    SECURITY: '/user/security',
    LIST: '/user/list',
    DETAIL: (id: string | number) => `/user/${id}`,
    DELETE: (id: string | number) => `/user/${id}`,
  },

  // 文件相关
  FILE: {
    UPLOAD: '/file/upload',
    DOWNLOAD: (id: string | number) => `/file/download/${id}`,
    DELETE: (id: string | number) => `/file/delete/${id}`,
    LIST: '/file/list',
  },

  // 系统相关
  SYSTEM: {
    CONFIG: '/system/config',
    HEALTH: '/system/health',
    VERSION: '/system/version',
    LOGS: '/system/logs',
  },
} as const

/**
 * 业务错误码常量
 */
export const BUSINESS_ERROR_CODE = {
  // 通用错误
  UNKNOWN_ERROR: 'E000001',
  SYSTEM_ERROR: 'E000002',
  PARAMETER_ERROR: 'E000003',
  VALIDATION_ERROR: 'E000004',

  // 认证错误
  AUTH_FAILED: 'E001001',
  TOKEN_EXPIRED: 'E001002',
  TOKEN_INVALID: 'E001003',
  PERMISSION_DENIED: 'E001004',
  ACCOUNT_LOCKED: 'E001005',
  PASSWORD_INCORRECT: 'E001006',

  // 用户错误
  USER_NOT_FOUND: 'E002001',
  USER_ALREADY_EXISTS: 'E002002',
  EMAIL_ALREADY_EXISTS: 'E002003',
  PHONE_ALREADY_EXISTS: 'E002004',

  // 文件错误
  FILE_NOT_FOUND: 'E003001',
  FILE_TOO_LARGE: 'E003002',
  FILE_TYPE_NOT_SUPPORTED: 'E003003',
  UPLOAD_FAILED: 'E003004',

  // 网络错误
  NETWORK_ERROR: 'E004001',
  REQUEST_TIMEOUT: 'E004002',
  SERVER_ERROR: 'E004003',
  SERVICE_UNAVAILABLE: 'E004004',
} as const

/**
 * 错误消息映射
 */
export const ERROR_MESSAGE_MAP = {
  [BUSINESS_ERROR_CODE.UNKNOWN_ERROR]: '未知错误',
  [BUSINESS_ERROR_CODE.SYSTEM_ERROR]: '系统错误',
  [BUSINESS_ERROR_CODE.PARAMETER_ERROR]: '参数错误',
  [BUSINESS_ERROR_CODE.VALIDATION_ERROR]: '数据验证失败',

  [BUSINESS_ERROR_CODE.AUTH_FAILED]: '认证失败',
  [BUSINESS_ERROR_CODE.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [BUSINESS_ERROR_CODE.TOKEN_INVALID]: '登录状态无效，请重新登录',
  [BUSINESS_ERROR_CODE.PERMISSION_DENIED]: '权限不足',
  [BUSINESS_ERROR_CODE.ACCOUNT_LOCKED]: '账户已被锁定',
  [BUSINESS_ERROR_CODE.PASSWORD_INCORRECT]: '密码错误',

  [BUSINESS_ERROR_CODE.USER_NOT_FOUND]: '用户不存在',
  [BUSINESS_ERROR_CODE.USER_ALREADY_EXISTS]: '用户已存在',
  [BUSINESS_ERROR_CODE.EMAIL_ALREADY_EXISTS]: '邮箱已被注册',
  [BUSINESS_ERROR_CODE.PHONE_ALREADY_EXISTS]: '手机号已被注册',

  [BUSINESS_ERROR_CODE.FILE_NOT_FOUND]: '文件不存在',
  [BUSINESS_ERROR_CODE.FILE_TOO_LARGE]: '文件过大',
  [BUSINESS_ERROR_CODE.FILE_TYPE_NOT_SUPPORTED]: '文件类型不支持',
  [BUSINESS_ERROR_CODE.UPLOAD_FAILED]: '文件上传失败',

  [BUSINESS_ERROR_CODE.NETWORK_ERROR]: '网络连接失败',
  [BUSINESS_ERROR_CODE.REQUEST_TIMEOUT]: '请求超时',
  [BUSINESS_ERROR_CODE.SERVER_ERROR]: '服务器错误',
  [BUSINESS_ERROR_CODE.SERVICE_UNAVAILABLE]: '服务暂时不可用',
} as const

/**
 * 请求头常量
 */
export const REQUEST_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_REQUEST_ID: 'X-Request-ID',
  X_TIMESTAMP: 'X-Timestamp',
  X_SIGNATURE: 'X-Signature',
} as const

/**
 * Content-Type 常量
 */
export const CONTENT_TYPE = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
} as const
