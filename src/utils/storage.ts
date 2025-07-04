import { STORAGE_KEYS } from '../constants/storage'

/**
 * 本地存储类型
 */
export type StorageType = 'localStorage' | 'sessionStorage'

/**
 * 存储配置接口
 */
export interface StorageConfig {
  /** 存储类型 */
  type?: StorageType
  /** 过期时间（毫秒） */
  expire?: number
  /** 是否加密 */
  encrypt?: boolean
}

/**
 * 存储数据结构
 */
interface StorageData<T = unknown> {
  /** 实际数据 */
  value: T
  /** 过期时间戳 */
  expire?: number
  /** 创建时间戳 */
  createTime: number
}

/**
 * 获取存储对象
 * @param type 存储类型
 * @returns 存储对象
 */
function getStorageInstance(type: StorageType = 'localStorage'): Storage {
  return type === 'localStorage' ? localStorage : sessionStorage
}

/**
 * 检查是否支持存储
 * @param type 存储类型
 * @returns 是否支持
 */
function isStorageSupported(type: StorageType = 'localStorage'): boolean {
  try {
    const storage = getStorageInstance(type)
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * 设置存储数据
 * @param key 键名
 * @param value 值
 * @param config 配置
 */
export function setStorage<T>(key: string, value: T, config: StorageConfig = {}): void {
  const { type = 'localStorage', expire, encrypt = false } = config

  if (!isStorageSupported(type)) {
    console.warn(`${type} is not supported`)
    return
  }

  try {
    const storage = getStorageInstance(type)
    const actualValue = encrypt ? encryptData(value) : value
    const data: StorageData<T | string> = {
      value: actualValue,
      createTime: Date.now(),
      expire: expire ? Date.now() + expire : undefined,
    }

    storage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to set storage:', error)
  }
}

/**
 * 获取存储数据
 * @param key 键名
 * @param config 配置
 * @returns 存储的值
 */
export function getStorage<T>(key: string, config: StorageConfig = {}): T | null {
  const { type = 'localStorage', encrypt = false } = config

  if (!isStorageSupported(type)) {
    console.warn(`${type} is not supported`)
    return null
  }

  try {
    const storage = getStorageInstance(type)
    const item = storage.getItem(key)

    if (!item) {
      return null
    }

    const data: StorageData<T | string> = JSON.parse(item)

    // 检查是否过期
    if (data.expire && Date.now() > data.expire) {
      removeStorage(key, { type })
      return null
    }

    if (encrypt && typeof data.value === 'string') {
      return decryptData<T>(data.value)
    }

    return data.value as T
  } catch (error) {
    console.error('Failed to get storage:', error)
    return null
  }
}

/**
 * 移除存储数据
 * @param key 键名
 * @param config 配置
 */
export function removeStorage(key: string, config: StorageConfig = {}): void {
  const { type = 'localStorage' } = config

  if (!isStorageSupported(type)) {
    console.warn(`${type} is not supported`)
    return
  }

  try {
    const storage = getStorageInstance(type)
    storage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove storage:', error)
  }
}

/**
 * 清空存储
 * @param type 存储类型
 */
export function clearStorage(type: StorageType = 'localStorage'): void {
  if (!isStorageSupported(type)) {
    console.warn(`${type} is not supported`)
    return
  }

  try {
    const storage = getStorageInstance(type)
    storage.clear()
  } catch (error) {
    console.error('Failed to clear storage:', error)
  }
}

/**
 * 获取存储大小
 * @param type 存储类型
 * @returns 存储大小（字节）
 */
export function getStorageSize(type: StorageType = 'localStorage'): number {
  if (!isStorageSupported(type)) {
    return 0
  }

  try {
    const storage = getStorageInstance(type) as Storage & { [key: string]: string }
    let size = 0

    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        size += storage[key].length + key.length
      }
    }

    return size
  } catch (error) {
    console.error('Failed to get storage size:', error)
    return 0
  }
}

/**
 * 清理过期的存储数据
 * @param type 存储类型
 */
export function cleanExpiredStorage(type: StorageType = 'localStorage'): void {
  if (!isStorageSupported(type)) {
    return
  }

  try {
    const storage = getStorageInstance(type)
    const keys = Object.keys(storage)
    const currentTime = Date.now()

    keys.forEach((key) => {
      try {
        const item = storage.getItem(key)
        if (item) {
          const data: StorageData = JSON.parse(item)
          if (data.expire && currentTime > data.expire) {
            storage.removeItem(key)
          }
        }
      } catch {
        // 忽略解析错误，可能是其他格式的数据
      }
    })
  } catch (error) {
    console.error('Failed to clean expired storage:', error)
  }
}

// ========== Token 管理 ==========

/**
 * 设置访问令牌
 * @param token 令牌
 * @param expire 过期时间（毫秒）
 */
export function setToken(token: string, expire?: number): void {
  setStorage(STORAGE_KEYS.ACCESS_TOKEN, token, { expire })
}

/**
 * 获取访问令牌
 * @returns 令牌
 */
export function getToken(): string | null {
  return getStorage<string>(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * 移除访问令牌
 */
export function removeToken(): void {
  removeStorage(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * 设置刷新令牌
 * @param token 刷新令牌
 * @param expire 过期时间（毫秒）
 */
export function setRefreshToken(token: string, expire?: number): void {
  setStorage(STORAGE_KEYS.REFRESH_TOKEN, token, { expire })
}

/**
 * 获取刷新令牌
 * @returns 刷新令牌
 */
export function getRefreshToken(): string | null {
  return getStorage<string>(STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * 移除刷新令牌
 */
export function removeRefreshToken(): void {
  removeStorage(STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * 清除所有认证信息
 */
export function clearAuthStorage(): void {
  removeToken()
  removeRefreshToken()
  removeStorage(STORAGE_KEYS.USER_INFO)
}

// ========== 用户信息管理 ==========

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string | number
  username: string
  email?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: unknown
}

/**
 * 设置用户信息
 * @param userInfo 用户信息
 */
export function setUserInfo(userInfo: UserInfo): void {
  setStorage(STORAGE_KEYS.USER_INFO, userInfo)
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): UserInfo | null {
  return getStorage<UserInfo>(STORAGE_KEYS.USER_INFO)
}

/**
 * 移除用户信息
 */
export function removeUserInfo(): void {
  removeStorage(STORAGE_KEYS.USER_INFO)
}

// ========== 应用设置管理 ==========

/**
 * 应用设置接口
 */
export interface AppSettings {
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  [key: string]: unknown
}

/**
 * 设置应用设置
 * @param settings 应用设置
 */
export function setAppSettings(settings: AppSettings): void {
  const current = getAppSettings() || {}
  setStorage(STORAGE_KEYS.APP_SETTINGS, { ...current, ...settings })
}

/**
 * 获取应用设置
 * @returns 应用设置
 */
export function getAppSettings(): AppSettings | null {
  return getStorage<AppSettings>(STORAGE_KEYS.APP_SETTINGS)
}

/**
 * 移除应用设置
 */
export function removeAppSettings(): void {
  removeStorage(STORAGE_KEYS.APP_SETTINGS)
}

// ========== 缓存管理 ==========

/**
 * 设置缓存
 * @param key 缓存键
 * @param data 缓存数据
 * @param expire 过期时间（毫秒）
 */
export function setCache<T>(key: string, data: T, expire?: number): void {
  const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`
  setStorage(cacheKey, data, { expire })
}

/**
 * 获取缓存
 * @param key 缓存键
 * @returns 缓存数据
 */
export function getCache<T>(key: string): T | null {
  const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`
  return getStorage<T>(cacheKey)
}

/**
 * 移除缓存
 * @param key 缓存键
 */
export function removeCache(key: string): void {
  const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`
  removeStorage(cacheKey)
}

/**
 * 清空所有缓存
 */
export function clearCache(): void {
  if (!isStorageSupported()) {
    return
  }

  try {
    const storage = getStorageInstance()
    const keys = Object.keys(storage)

    keys.forEach((key) => {
      if (key.startsWith(STORAGE_KEYS.CACHE_PREFIX)) {
        storage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Failed to clear cache:', error)
  }
}

// ========== 加密/解密 ==========

/**
 * 简单的数据加密（实际项目中应使用更安全的加密算法）
 * @param data 要加密的数据
 * @returns 加密后的数据
 */
function encryptData<T>(data: T): string {
  try {
    return btoa(JSON.stringify(data))
  } catch {
    return JSON.stringify(data)
  }
}

/**
 * 简单的数据解密
 * @param encryptedData 加密的数据
 * @returns 解密后的数据
 */
function decryptData<T>(encryptedData: string): T {
  try {
    return JSON.parse(atob(encryptedData)) as T
  } catch {
    return JSON.parse(encryptedData) as T
  }
}
