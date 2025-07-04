/**
 * 用户登录请求参数
 */
export interface LoginRequest {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  captcha?: string
  /** 验证码键 */
  captchaKey?: string
  /** 记住密码 */
  remember?: boolean
}

/**
 * 用户注册请求参数
 */
export interface RegisterRequest {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 确认密码 */
  confirmPassword: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone?: string
  /** 验证码 */
  captcha?: string
  /** 验证码键 */
  captchaKey?: string
  /** 邀请码 */
  inviteCode?: string
}

/**
 * 用户信息接口
 */
export interface User {
  /** 用户ID */
  id: string | number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone?: string
  /** 头像 */
  avatar?: string
  /** 性别 */
  gender?: 'male' | 'female' | 'other'
  /** 生日 */
  birthday?: string
  /** 个人简介 */
  bio?: string
  /** 用户状态 */
  status: 'active' | 'inactive' | 'banned'
  /** 角色列表 */
  roles: Role[]
  /** 权限列表 */
  permissions: string[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 最后登录时间 */
  lastLoginTime?: string
  /** 最后登录IP */
  lastLoginIp?: string
}

/**
 * 角色接口
 */
export interface Role {
  /** 角色ID */
  id: string | number
  /** 角色名称 */
  name: string
  /** 角色编码 */
  code: string
  /** 角色描述 */
  description?: string
  /** 角色类型 */
  type: 'system' | 'custom'
  /** 角色状态 */
  status: 'active' | 'inactive'
  /** 权限列表 */
  permissions: Permission[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/**
 * 权限接口
 */
export interface Permission {
  /** 权限ID */
  id: string | number
  /** 权限名称 */
  name: string
  /** 权限编码 */
  code: string
  /** 权限类型 */
  type: 'menu' | 'button' | 'api' | 'data'
  /** 权限描述 */
  description?: string
  /** 父权限ID */
  parentId?: string | number
  /** 权限路径 */
  path?: string
  /** 权限方法 */
  method?: string
  /** 权限状态 */
  status: 'active' | 'inactive'
  /** 排序 */
  sort?: number
  /** 子权限 */
  children?: Permission[]
}

/**
 * 登录响应
 */
export interface LoginResponse {
  /** 用户信息 */
  user: User
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken: string
  /** 令牌类型 */
  tokenType: string
  /** 过期时间（秒） */
  expiresIn: number
  /** 权限列表 */
  permissions: string[]
  /** 角色列表 */
  roles: string[]
}

/**
 * 令牌刷新响应
 */
export interface RefreshTokenResponse {
  /** 新的访问令牌 */
  accessToken: string
  /** 新的刷新令牌 */
  refreshToken: string
  /** 令牌类型 */
  tokenType: string
  /** 过期时间（秒） */
  expiresIn: number
}

/**
 * 密码重置请求
 */
export interface ResetPasswordRequest {
  /** 邮箱或手机号 */
  identifier: string
  /** 验证码 */
  captcha: string
  /** 新密码 */
  newPassword: string
  /** 确认密码 */
  confirmPassword: string
}

/**
 * 密码修改请求
 */
export interface ChangePasswordRequest {
  /** 旧密码 */
  oldPassword: string
  /** 新密码 */
  newPassword: string
  /** 确认密码 */
  confirmPassword: string
}

/**
 * 用户资料更新请求
 */
export interface UpdateProfileRequest {
  /** 昵称 */
  nickname?: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 头像 */
  avatar?: string
  /** 性别 */
  gender?: 'male' | 'female' | 'other'
  /** 生日 */
  birthday?: string
  /** 个人简介 */
  bio?: string
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  /** 语言设置 */
  language: string
  /** 主题设置 */
  theme: 'light' | 'dark' | 'auto'
  /** 时区设置 */
  timezone: string
  /** 通知设置 */
  notifications: {
    /** 邮件通知 */
    email: boolean
    /** 短信通知 */
    sms: boolean
    /** 站内通知 */
    inApp: boolean
    /** 推送通知 */
    push: boolean
  }
  /** 隐私设置 */
  privacy: {
    /** 显示邮箱 */
    showEmail: boolean
    /** 显示手机号 */
    showPhone: boolean
    /** 显示生日 */
    showBirthday: boolean
    /** 允许搜索 */
    allowSearch: boolean
  }
  /** 界面设置 */
  ui: {
    /** 侧边栏折叠 */
    sidebarCollapsed: boolean
    /** 固定头部 */
    fixedHeader: boolean
    /** 显示标签页 */
    showTabs: boolean
    /** 显示面包屑 */
    showBreadcrumb: boolean
  }
}

/**
 * 安全设置
 */
export interface SecuritySettings {
  /** 两步验证 */
  twoFactorAuth: {
    /** 是否启用 */
    enabled: boolean
    /** 验证方式 */
    method: 'sms' | 'email' | 'app'
    /** 备用码 */
    backupCodes?: string[]
  }
  /** 登录设备 */
  loginDevices: {
    /** 设备ID */
    deviceId: string
    /** 设备名称 */
    deviceName: string
    /** 设备类型 */
    deviceType: 'web' | 'mobile' | 'desktop'
    /** 操作系统 */
    os: string
    /** 浏览器 */
    browser?: string
    /** IP地址 */
    ip: string
    /** 地理位置 */
    location: string
    /** 最后活跃时间 */
    lastActiveTime: string
    /** 是否当前设备 */
    current: boolean
  }[]
  /** 登录历史 */
  loginHistory: {
    /** 登录时间 */
    loginTime: string
    /** IP地址 */
    ip: string
    /** 地理位置 */
    location: string
    /** 设备信息 */
    device: string
    /** 登录状态 */
    status: 'success' | 'failed'
    /** 失败原因 */
    reason?: string
  }[]
}

/**
 * 验证码响应
 */
export interface CaptchaResponse {
  /** 验证码键 */
  captchaKey: string
  /** 验证码图片（Base64） */
  captchaImage: string
  /** 过期时间 */
  expireTime: number
}

/**
 * 权限检查结果
 */
export interface PermissionCheckResult {
  /** 是否有权限 */
  hasPermission: boolean
  /** 缺少的权限 */
  missingPermissions?: string[]
  /** 权限详情 */
  permissionDetails?: {
    /** 权限代码 */
    code: string
    /** 权限名称 */
    name: string
    /** 权限类型 */
    type: string
  }[]
}

/**
 * 用户状态
 */
export interface UserStatus {
  /** 是否在线 */
  online: boolean
  /** 最后活跃时间 */
  lastActiveTime: string
  /** 当前状态 */
  status: 'active' | 'away' | 'busy' | 'offline'
  /** 状态消息 */
  statusMessage?: string
}

/**
 * 第三方登录请求
 */
export interface SocialLoginRequest {
  /** 第三方平台 */
  provider: 'github' | 'google' | 'wechat' | 'qq' | 'weibo'
  /** 授权码 */
  code: string
  /** 状态参数 */
  state?: string
  /** 重定向URI */
  redirectUri?: string
}

/**
 * 第三方账号绑定信息
 */
export interface SocialAccount {
  /** 绑定ID */
  id: string
  /** 第三方平台 */
  provider: 'github' | 'google' | 'wechat' | 'qq' | 'weibo'
  /** 第三方用户ID */
  socialId: string
  /** 第三方用户名 */
  socialUsername: string
  /** 第三方头像 */
  socialAvatar?: string
  /** 绑定时间 */
  bindTime: string
  /** 是否已绑定 */
  bound: boolean
}
