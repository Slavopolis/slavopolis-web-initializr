// 导出基础API类和实例
export { api, BaseApi } from './base'

// 导出请求相关
export {
  createAxiosInstance,
  createCustomRequest,
  createExternalRequest,
  createUploadRequest,
  request,
} from './request'

// 导出拦截器
export { setupInterceptors, setupRetryInterceptor } from './interceptors'

// 导出认证API
export { AuthApi, authApi } from './modules/auth'

// 导出用户API
export { UserApi, userApi } from './modules/user'

// 导出API类型
export type { ApiResponse, PaginatedResponse } from '../types/api'
export type { LoginRequest, RegisterRequest, User } from '../types/auth'
