import { API_ENDPOINTS } from '@/constants/api'
import type { ApiResponse } from '@/types/api'
import type {
  CaptchaResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SocialLoginRequest,
  User,
} from '@/types/auth'
import { BaseApi } from '../base'

/**
 * 认证API类
 */
export class AuthApi extends BaseApi {
  /**
   * 用户登录
   * @param data 登录参数
   * @returns 登录响应
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
  }

  /**
   * 用户注册
   * @param data 注册参数
   * @returns 注册响应
   */
  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    return this.post<User>(API_ENDPOINTS.AUTH.REGISTER, data)
  }

  /**
   * 用户登出
   * @returns 登出响应
   */
  async logout(): Promise<ApiResponse<null>> {
    return this.post<null>(API_ENDPOINTS.AUTH.LOGOUT)
  }

  /**
   * 刷新令牌
   * @param refreshToken 刷新令牌
   * @returns 新的令牌信息
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> {
    return this.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    })
  }

  /**
   * 获取验证码
   * @returns 验证码信息
   */
  async getCaptcha(): Promise<ApiResponse<CaptchaResponse>> {
    return this.get<CaptchaResponse>('/auth/captcha')
  }

  /**
   * 验证邮箱
   * @param token 验证令牌
   * @returns 验证结果
   */
  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    return this.post<null>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  }

  /**
   * 发送重置密码邮件
   * @param email 邮箱地址
   * @returns 发送结果
   */
  async sendResetPasswordEmail(email: string): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/send-reset-password-email', { email })
  }

  /**
   * 重置密码
   * @param data 重置密码参数
   * @returns 重置结果
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    return this.post<null>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  }

  /**
   * 修改密码
   * @param data 修改密码参数
   * @returns 修改结果
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    return this.post<null>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
  }

  /**
   * 第三方登录
   * @param data 第三方登录参数
   * @returns 登录响应
   */
  async socialLogin(data: SocialLoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/auth/social-login', data)
  }

  /**
   * 绑定第三方账号
   * @param data 绑定参数
   * @returns 绑定结果
   */
  async bindSocialAccount(data: SocialLoginRequest): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/bind-social-account', data)
  }

  /**
   * 解绑第三方账号
   * @param provider 第三方平台
   * @returns 解绑结果
   */
  async unbindSocialAccount(provider: string): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/unbind-social-account', { provider })
  }

  /**
   * 获取第三方登录URL
   * @param provider 第三方平台
   * @param redirectUri 重定向URI
   * @returns 登录URL
   */
  async getSocialLoginUrl(
    provider: string,
    redirectUri?: string,
  ): Promise<ApiResponse<{ url: string }>> {
    return this.get<{ url: string }>('/auth/social-login-url', {
      params: { provider, redirectUri },
    })
  }

  /**
   * 检查用户名是否可用
   * @param username 用户名
   * @returns 检查结果
   */
  async checkUsername(username: string): Promise<ApiResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/auth/check-username', {
      params: { username },
    })
  }

  /**
   * 检查邮箱是否可用
   * @param email 邮箱
   * @returns 检查结果
   */
  async checkEmail(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return this.get<{ available: boolean }>('/auth/check-email', {
      params: { email },
    })
  }

  /**
   * 发送验证码
   * @param type 验证码类型
   * @param target 目标（邮箱或手机号）
   * @returns 发送结果
   */
  async sendVerificationCode(type: 'email' | 'sms', target: string): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/send-verification-code', { type, target })
  }

  /**
   * 验证验证码
   * @param type 验证码类型
   * @param target 目标（邮箱或手机号）
   * @param code 验证码
   * @returns 验证结果
   */
  async verifyCode(
    type: 'email' | 'sms',
    target: string,
    code: string,
  ): Promise<ApiResponse<{ valid: boolean }>> {
    return this.post<{ valid: boolean }>('/auth/verify-code', { type, target, code })
  }

  /**
   * 启用两步验证
   * @param method 验证方式
   * @returns 启用结果
   */
  async enableTwoFactorAuth(
    method: 'sms' | 'email' | 'app',
  ): Promise<ApiResponse<{ secret?: string; qrCode?: string }>> {
    return this.post<{ secret?: string; qrCode?: string }>('/auth/enable-2fa', { method })
  }

  /**
   * 禁用两步验证
   * @param code 验证码
   * @returns 禁用结果
   */
  async disableTwoFactorAuth(code: string): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/disable-2fa', { code })
  }

  /**
   * 验证两步验证码
   * @param code 验证码
   * @returns 验证结果
   */
  async verifyTwoFactorAuth(code: string): Promise<ApiResponse<{ valid: boolean }>> {
    return this.post<{ valid: boolean }>('/auth/verify-2fa', { code })
  }

  /**
   * 获取备用码
   * @returns 备用码列表
   */
  async getBackupCodes(): Promise<ApiResponse<{ codes: string[] }>> {
    return this.get<{ codes: string[] }>('/auth/backup-codes')
  }

  /**
   * 重新生成备用码
   * @returns 新的备用码列表
   */
  async regenerateBackupCodes(): Promise<ApiResponse<{ codes: string[] }>> {
    return this.post<{ codes: string[] }>('/auth/regenerate-backup-codes')
  }

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me')
  }

  /**
   * 检查令牌有效性
   * @returns 检查结果
   */
  async checkToken(): Promise<ApiResponse<{ valid: boolean; expiresIn: number }>> {
    return this.get<{ valid: boolean; expiresIn: number }>('/auth/check-token')
  }
}

/**
 * 认证API实例
 */
export const authApi = new AuthApi()
