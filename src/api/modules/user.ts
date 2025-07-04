import { API_ENDPOINTS } from '@/constants/api'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/types/api'
import type {
  SecuritySettings,
  SocialAccount,
  UpdateProfileRequest,
  User,
  UserPreferences,
} from '@/types/auth'
import type {
  FriendRequest,
  LoginHistoryRecord,
  OperationLogRecord,
  UserActivity,
} from '@/types/user'
import { BaseApi } from '../base'

/**
 * 用户API类
 */
export class UserApi extends BaseApi {
  /**
   * 获取用户资料
   * @returns 用户资料
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return this.get<User>(API_ENDPOINTS.USER.PROFILE)
  }

  /**
   * 更新用户资料
   * @param data 更新参数
   * @returns 更新结果
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return this.put<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, data)
  }

  /**
   * 上传头像
   * @param file 头像文件
   * @returns 上传结果
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    return this.upload<{ avatar: string }>(API_ENDPOINTS.USER.AVATAR, file)
  }

  /**
   * 删除头像
   * @returns 删除结果
   */
  async deleteAvatar(): Promise<ApiResponse<null>> {
    return this.delete<null>(API_ENDPOINTS.USER.AVATAR)
  }

  /**
   * 获取用户偏好设置
   * @returns 偏好设置
   */
  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    return this.get<UserPreferences>(API_ENDPOINTS.USER.PREFERENCES)
  }

  /**
   * 更新用户偏好设置
   * @param data 偏好设置
   * @returns 更新结果
   */
  async updatePreferences(data: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    return this.put<UserPreferences>(API_ENDPOINTS.USER.PREFERENCES, data)
  }

  /**
   * 获取安全设置
   * @returns 安全设置
   */
  async getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {
    return this.get<SecuritySettings>(API_ENDPOINTS.USER.SECURITY)
  }

  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表
   */
  async getUsers(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.paginate<User>(API_ENDPOINTS.USER.LIST, params)
  }

  /**
   * 获取用户详情
   * @param id 用户ID
   * @returns 用户详情
   */
  async getUserById(id: string | number): Promise<ApiResponse<User>> {
    return this.get<User>(API_ENDPOINTS.USER.DETAIL(id))
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   */
  async deleteUser(id: string | number): Promise<ApiResponse<null>> {
    return this.delete<null>(API_ENDPOINTS.USER.DELETE(id))
  }

  /**
   * 批量删除用户
   * @param ids 用户ID列表
   * @returns 删除结果
   */
  async deleteUsers(ids: (string | number)[]): Promise<ApiResponse<null>> {
    return this.post<null>('/user/batch-delete', { ids })
  }

  /**
   * 启用/禁用用户
   * @param id 用户ID
   * @param enabled 是否启用
   * @returns 操作结果
   */
  async toggleUserStatus(id: string | number, enabled: boolean): Promise<ApiResponse<null>> {
    return this.put<null>(`/user/${id}/status`, { enabled })
  }

  /**
   * 重置用户密码
   * @param id 用户ID
   * @param newPassword 新密码
   * @returns 重置结果
   */
  async resetUserPassword(id: string | number, newPassword: string): Promise<ApiResponse<null>> {
    return this.put<null>(`/user/${id}/reset-password`, { newPassword })
  }

  /**
   * 获取用户登录历史
   * @param params 查询参数
   * @returns 登录历史
   */
  async getLoginHistory(params?: QueryParams): Promise<PaginatedResponse<LoginHistoryRecord>> {
    return this.paginate<LoginHistoryRecord>('/user/login-history', params)
  }

  /**
   * 获取用户操作日志
   * @param params 查询参数
   * @returns 操作日志
   */
  async getOperationLogs(params?: QueryParams): Promise<PaginatedResponse<OperationLogRecord>> {
    return this.paginate<OperationLogRecord>('/user/operation-logs', params)
  }

  /**
   * 获取绑定的第三方账号
   * @returns 第三方账号列表
   */
  async getSocialAccounts(): Promise<ApiResponse<SocialAccount[]>> {
    return this.get<SocialAccount[]>('/user/social-accounts')
  }

  /**
   * 解绑第三方账号
   * @param provider 第三方平台
   * @returns 解绑结果
   */
  async unbindSocialAccount(provider: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/user/social-accounts/${provider}`)
  }

  /**
   * 获取用户统计信息
   * @returns 统计信息
   */
  async getUserStats(): Promise<
    ApiResponse<{
      totalUsers: number
      activeUsers: number
      newUsers: number
      onlineUsers: number
    }>
  > {
    return this.get<{
      totalUsers: number
      activeUsers: number
      newUsers: number
      onlineUsers: number
    }>('/user/stats')
  }

  /**
   * 搜索用户
   * @param keyword 关键词
   * @param params 查询参数
   * @returns 搜索结果
   */
  async searchUsers(keyword: string, params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.paginate<User>('/user/search', { keyword, ...params })
  }

  /**
   * 获取推荐用户
   * @param limit 数量限制
   * @returns 推荐用户列表
   */
  async getRecommendedUsers(limit: number = 10): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/user/recommended', { params: { limit } })
  }

  /**
   * 关注用户
   * @param id 用户ID
   * @returns 关注结果
   */
  async followUser(id: string | number): Promise<ApiResponse<null>> {
    return this.post<null>(`/user/${id}/follow`)
  }

  /**
   * 取消关注用户
   * @param id 用户ID
   * @returns 取消关注结果
   */
  async unfollowUser(id: string | number): Promise<ApiResponse<null>> {
    return this.delete<null>(`/user/${id}/follow`)
  }

  /**
   * 获取关注列表
   * @param params 查询参数
   * @returns 关注列表
   */
  async getFollowing(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.paginate<User>('/user/following', params)
  }

  /**
   * 获取粉丝列表
   * @param params 查询参数
   * @returns 粉丝列表
   */
  async getFollowers(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.paginate<User>('/user/followers', params)
  }

  /**
   * 获取好友列表
   * @param params 查询参数
   * @returns 好友列表
   */
  async getFriends(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.paginate<User>('/user/friends', params)
  }

  /**
   * 发送好友申请
   * @param id 用户ID
   * @param message 申请消息
   * @returns 申请结果
   */
  async sendFriendRequest(id: string | number, message?: string): Promise<ApiResponse<null>> {
    return this.post<null>(`/user/${id}/friend-request`, { message })
  }

  /**
   * 处理好友申请
   * @param id 申请ID
   * @param action 操作类型
   * @returns 处理结果
   */
  async handleFriendRequest(
    id: string | number,
    action: 'accept' | 'reject',
  ): Promise<ApiResponse<null>> {
    return this.put<null>(`/user/friend-request/${id}`, { action })
  }

  /**
   * 获取好友申请列表
   * @param params 查询参数
   * @returns 好友申请列表
   */
  async getFriendRequests(params?: QueryParams): Promise<PaginatedResponse<FriendRequest>> {
    return this.paginate<FriendRequest>('/user/friend-requests', params)
  }

  /**
   * 删除好友
   * @param id 好友ID
   * @returns 删除结果
   */
  async deleteFriend(id: string | number): Promise<ApiResponse<null>> {
    return this.delete<null>(`/user/friends/${id}`)
  }

  /**
   * 拉黑用户
   * @param id 用户ID
   * @returns 拉黑结果
   */
  async blockUser(id: string | number): Promise<ApiResponse<null>> {
    return this.post<null>(`/user/${id}/block`)
  }

  /**
   * 取消拉黑用户
   * @param id 用户ID
   * @returns 取消拉黑结果
   */
  async unblockUser(id: string | number): Promise<ApiResponse<null>> {
    return this.delete<null>(`/user/${id}/block`)
  }

  /**
   * 获取黑名单
   * @param params 查询参数
   * @returns 黑名单列表
   */
  async getBlockedUsers(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return this.paginate<User>('/user/blocked', params)
  }

  /**
   * 举报用户
   * @param id 用户ID
   * @param reason 举报原因
   * @param description 举报描述
   * @returns 举报结果
   */
  async reportUser(
    id: string | number,
    reason: string,
    description?: string,
  ): Promise<ApiResponse<null>> {
    return this.post<null>(`/user/${id}/report`, { reason, description })
  }

  /**
   * 获取用户活动记录
   * @param id 用户ID
   * @param params 查询参数
   * @returns 活动记录
   */
  async getUserActivity(
    id: string | number,
    params?: QueryParams,
  ): Promise<PaginatedResponse<UserActivity>> {
    return this.paginate<UserActivity>(`/user/${id}/activity`, params)
  }

  /**
   * 导出用户数据
   * @param format 导出格式
   * @returns 导出结果
   */
  async exportUserData(format: 'json' | 'csv' | 'excel' = 'json'): Promise<Blob> {
    return this.download('/user/export', { params: { format } })
  }

  /**
   * 删除用户数据
   * @param password 用户密码
   * @returns 删除结果
   */
  async deleteUserData(password: string): Promise<ApiResponse<null>> {
    return this.post<null>('/user/delete-data', { password })
  }
}

/**
 * 用户API实例
 */
export const userApi = new UserApi()
