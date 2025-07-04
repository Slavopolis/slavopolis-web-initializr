import { authApi } from '@/api/modules/auth'
import { userApi } from '@/api/modules/user'
import type {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from '@/types/auth'
import { handleError } from '@/utils/error'
import { logger } from '@/utils/logger'
import { clearAuthStorage, getToken, setToken, setUserInfo, type UserInfo } from '@/utils/storage'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 认证状态
 */
export interface AuthState {
  /** 是否已登录 */
  isLoggedIn: boolean
  /** 当前用户 */
  currentUser: User | null
  /** 用户权限 */
  permissions: string[]
  /** 用户角色 */
  roles: string[]
  /** 是否正在加载 */
  loading: boolean
}

// 全局状态
const state = ref<AuthState>({
  isLoggedIn: false,
  currentUser: null,
  permissions: [],
  roles: [],
  loading: false,
})

/**
 * 认证组合函数
 */
export function useAuth() {
  const router = useRouter()

  // 计算属性
  const isLoggedIn = computed(() => state.value.isLoggedIn)
  const currentUser = computed(() => state.value.currentUser)
  const permissions = computed(() => state.value.permissions)
  const roles = computed(() => state.value.roles)
  const loading = computed(() => state.value.loading)

  /**
   * 初始化认证状态
   */
  async function initAuth(): Promise<void> {
    try {
      state.value.loading = true

      const token = getToken()
      if (!token) {
        logger.debug('No token found, user not logged in')
        return
      }

      // 检查token有效性
      const tokenCheck = await authApi.checkToken()
      if (!tokenCheck.data.valid) {
        logger.warn('Token is invalid, clearing auth data')
        await logout()
        return
      }

      // 获取用户信息
      const userResponse = await authApi.getCurrentUser()
      if (userResponse.success && userResponse.data) {
        await setAuthData(userResponse.data, token)
        logger.info('Auth initialized successfully')
      }
    } catch (error) {
      logger.error('Failed to initialize auth:', error)
      await logout()
    } finally {
      state.value.loading = false
    }
  }

  /**
   * 用户登录
   * @param credentials 登录凭证
   * @returns 是否成功
   */
  async function login(credentials: LoginRequest): Promise<boolean> {
    try {
      state.value.loading = true

      const response = await authApi.login(credentials)

      if (response.success && response.data) {
        const { user, accessToken } = response.data

        await setAuthData(user, accessToken)

        logger.info('User logged in successfully:', user.username)
        return true
      }

      return false
    } catch (error) {
      handleError(error as Error)
      return false
    } finally {
      state.value.loading = false
    }
  }

  /**
   * 用户注册
   * @param userData 注册数据
   * @returns 是否成功
   */
  async function register(userData: RegisterRequest): Promise<boolean> {
    try {
      state.value.loading = true

      const response = await authApi.register(userData)

      if (response.success) {
        logger.info('User registered successfully')
        return true
      }

      return false
    } catch (error) {
      handleError(error as Error)
      return false
    } finally {
      state.value.loading = false
    }
  }

  /**
   * 用户登出
   */
  async function logout(): Promise<void> {
    try {
      // 调用后端登出接口
      await authApi.logout()
    } catch (error) {
      logger.warn('Logout API call failed:', error)
    } finally {
      // 清除本地数据
      clearAuthData()

      // 重定向到登录页
      router.push('/login')

      logger.info('User logged out')
    }
  }

  /**
   * 修改密码
   * @param passwordData 密码数据
   * @returns 是否成功
   */
  async function changePassword(passwordData: ChangePasswordRequest): Promise<boolean> {
    try {
      state.value.loading = true

      const response = await authApi.changePassword(passwordData)

      if (response.success) {
        logger.info('Password changed successfully')
        return true
      }

      return false
    } catch (error) {
      handleError(error as Error)
      return false
    } finally {
      state.value.loading = false
    }
  }

  /**
   * 更新用户资料
   * @param profileData 资料数据
   * @returns 是否成功
   */
  async function updateProfile(profileData: UpdateProfileRequest): Promise<boolean> {
    try {
      state.value.loading = true

      const response = await userApi.updateProfile(profileData)

      if (response.success && response.data) {
        // 更新本地用户信息
        state.value.currentUser = response.data

        // 转换 User 类型到 UserInfo 类型
        const userInfo: UserInfo = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar,
          roles: response.data.roles?.map((role) => role.code) || [],
          permissions: response.data.permissions || [],
        }
        setUserInfo(userInfo)

        logger.info('Profile updated successfully')
        return true
      }

      return false
    } catch (error) {
      handleError(error as Error)
      return false
    } finally {
      state.value.loading = false
    }
  }

  /**
   * 刷新用户信息
   */
  async function refreshUserInfo(): Promise<void> {
    try {
      const response = await authApi.getCurrentUser()

      if (response.success && response.data) {
        state.value.currentUser = response.data

        // 转换 User 类型到 UserInfo 类型
        const userInfo: UserInfo = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar,
          roles: response.data.roles?.map((role) => role.code) || [],
          permissions: response.data.permissions || [],
        }
        setUserInfo(userInfo)

        updatePermissionsAndRoles(response.data)
      }
    } catch (error) {
      logger.error('Failed to refresh user info:', error)
    }
  }

  /**
   * 检查权限
   * @param permission 权限代码
   * @returns 是否有权限
   */
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission)
  }

  /**
   * 检查多个权限（AND）
   * @param permissionList 权限列表
   * @returns 是否有所有权限
   */
  function hasAllPermissions(permissionList: string[]): boolean {
    return permissionList.every((permission) => hasPermission(permission))
  }

  /**
   * 检查多个权限（OR）
   * @param permissionList 权限列表
   * @returns 是否有任一权限
   */
  function hasAnyPermission(permissionList: string[]): boolean {
    return permissionList.some((permission) => hasPermission(permission))
  }

  /**
   * 检查角色
   * @param role 角色代码
   * @returns 是否有角色
   */
  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  /**
   * 检查多个角色（AND）
   * @param roleList 角色列表
   * @returns 是否有所有角色
   */
  function hasAllRoles(roleList: string[]): boolean {
    return roleList.every((role) => hasRole(role))
  }

  /**
   * 检查多个角色（OR）
   * @param roleList 角色列表
   * @returns 是否有任一角色
   */
  function hasAnyRole(roleList: string[]): boolean {
    return roleList.some((role) => hasRole(role))
  }

  /**
   * 设置认证数据
   * @param user 用户信息
   * @param token 访问令牌
   */
  async function setAuthData(user: User, token: string): Promise<void> {
    // 保存到localStorage
    setToken(token)

    // 转换 User 类型到 UserInfo 类型
    const userInfo: UserInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      roles: user.roles?.map((role) => role.code) || [],
      permissions: user.permissions || [],
    }
    setUserInfo(userInfo)

    // 更新状态
    state.value.isLoggedIn = true
    state.value.currentUser = user
    updatePermissionsAndRoles(user)
  }

  /**
   * 清除认证数据
   */
  function clearAuthData(): void {
    // 清除localStorage
    clearAuthStorage()

    // 重置状态
    state.value.isLoggedIn = false
    state.value.currentUser = null
    state.value.permissions = []
    state.value.roles = []
  }

  /**
   * 更新权限和角色
   * @param user 用户信息
   */
  function updatePermissionsAndRoles(user: User): void {
    state.value.permissions = user.permissions || []
    state.value.roles = user.roles?.map((role) => role.code) || []
  }

  /**
   * 权限守卫装饰器
   * @param requiredPermissions 需要的权限
   * @param mode 检查模式：'all' | 'any'
   */
  function requirePermissions(requiredPermissions: string[], mode: 'all' | 'any' = 'all') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      descriptor.value = function (...args: any[]) {
        const hasRequiredPermissions =
          mode === 'all'
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions)

        if (!hasRequiredPermissions) {
          throw new Error(`缺少权限: ${requiredPermissions.join(', ')}`)
        }

        return originalMethod.apply(this, args)
      }

      return descriptor
    }
  }

  /**
   * 角色守卫装饰器
   * @param requiredRoles 需要的角色
   * @param mode 检查模式：'all' | 'any'
   */
  function requireRoles(requiredRoles: string[], mode: 'all' | 'any' = 'all') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      descriptor.value = function (...args: any[]) {
        const hasRequiredRoles =
          mode === 'all' ? hasAllRoles(requiredRoles) : hasAnyRole(requiredRoles)

        if (!hasRequiredRoles) {
          throw new Error(`缺少角色: ${requiredRoles.join(', ')}`)
        }

        return originalMethod.apply(this, args)
      }

      return descriptor
    }
  }

  // 监听路由变化，检查认证状态
  watch(
    () => router.currentRoute.value,
    (to) => {
      // 如果访问需要认证的路由但未登录，重定向到登录页
      if (to.meta?.requiresAuth && !isLoggedIn.value) {
        router.push('/login')
      }
    },
  )

  // 组件挂载时初始化认证状态
  onMounted(() => {
    initAuth()
  })

  return {
    // 状态
    isLoggedIn,
    currentUser,
    permissions,
    roles,
    loading,

    // 方法
    initAuth,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    refreshUserInfo,

    // 权限检查
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAllRoles,
    hasAnyRole,

    // 装饰器
    requirePermissions,
    requireRoles,
  }
}
