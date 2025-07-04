/**
 * 登录历史记录接口
 */
export interface LoginHistoryRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  userId: string | number
  /** 登录时间 */
  loginTime: string
  /** 登录IP */
  ip: string
  /** 地理位置 */
  location: string
  /** 设备信息 */
  device: string
  /** 浏览器信息 */
  browser?: string
  /** 操作系统 */
  os?: string
  /** 登录状态 */
  status: 'success' | 'failed'
  /** 失败原因 */
  reason?: string
  /** 会话ID */
  sessionId?: string
}

/**
 * 操作日志记录接口
 */
export interface OperationLogRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  userId: string | number
  /** 用户名 */
  username: string
  /** 操作模块 */
  module: string
  /** 操作类型 */
  action: string
  /** 操作描述 */
  description: string
  /** 操作时间 */
  operationTime: string
  /** IP地址 */
  ip: string
  /** 用户代理 */
  userAgent?: string
  /** 操作参数 */
  params?: Record<string, unknown>
  /** 操作结果 */
  result: 'success' | 'failed'
  /** 错误信息 */
  errorMessage?: string
}

/**
 * 好友申请接口
 */
export interface FriendRequest {
  /** 申请ID */
  id: string
  /** 申请者ID */
  fromUserId: string | number
  /** 申请者信息 */
  fromUser: {
    id: string | number
    username: string
    nickname: string
    avatar?: string
  }
  /** 被申请者ID */
  toUserId: string | number
  /** 申请消息 */
  message?: string
  /** 申请状态 */
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  /** 申请时间 */
  requestTime: string
  /** 处理时间 */
  responseTime?: string
  /** 处理者备注 */
  responseNote?: string
}

/**
 * 用户活动记录接口
 */
export interface UserActivity {
  /** 活动ID */
  id: string
  /** 用户ID */
  userId: string | number
  /** 活动类型 */
  type:
    | 'login'
    | 'logout'
    | 'profile_update'
    | 'password_change'
    | 'social_bind'
    | 'friend_request'
    | 'other'
  /** 活动标题 */
  title: string
  /** 活动描述 */
  description: string
  /** 活动时间 */
  activityTime: string
  /** IP地址 */
  ip?: string
  /** 设备信息 */
  device?: string
  /** 活动数据 */
  data?: Record<string, unknown>
  /** 活动状态 */
  status: 'success' | 'failed' | 'in_progress'
}

/**
 * 用户统计信息接口
 */
export interface UserStats {
  /** 总用户数 */
  totalUsers: number
  /** 活跃用户数 */
  activeUsers: number
  /** 新增用户数 */
  newUsers: number
  /** 在线用户数 */
  onlineUsers: number
  /** 本周新增 */
  weeklyNewUsers?: number
  /** 本月新增 */
  monthlyNewUsers?: number
  /** 用户增长率 */
  growthRate?: number
}

/**
 * 社交账号绑定信息接口
 */
export interface SocialAccountBinding {
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
  /** 最后使用时间 */
  lastUsedTime?: string
  /** 是否启用 */
  enabled: boolean
}

/**
 * 用户设备信息接口
 */
export interface UserDevice {
  /** 设备ID */
  deviceId: string
  /** 设备名称 */
  deviceName: string
  /** 设备类型 */
  deviceType: 'web' | 'mobile' | 'desktop' | 'tablet'
  /** 操作系统 */
  os: string
  /** 浏览器 */
  browser?: string
  /** 设备指纹 */
  fingerprint?: string
  /** 首次登录时间 */
  firstLogin: string
  /** 最后活跃时间 */
  lastActiveTime: string
  /** 是否当前设备 */
  isCurrent: boolean
  /** 是否信任设备 */
  isTrusted: boolean
  /** IP地址 */
  ip: string
  /** 地理位置 */
  location?: string
}
