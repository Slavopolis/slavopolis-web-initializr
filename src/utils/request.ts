/**
 * 生成唯一的请求ID
 * @returns 请求ID
 */
export function generateRequestId(): string {
  return `req_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
}

/**
 * URL 参数对象
 */
export type UrlParams = Record<string, string | number | boolean | undefined | null>

/**
 * 序列化URL参数
 * @param params 参数对象
 * @param options 序列化选项
 * @returns 序列化后的参数字符串
 */
export function serializeParams(
  params: UrlParams,
  options: {
    encode?: boolean
    arrayFormat?: 'brackets' | 'indices' | 'comma' | 'repeat'
    skipNull?: boolean
    skipUndefined?: boolean
  } = {},
): string {
  const { encode = true, arrayFormat = 'repeat', skipNull = true, skipUndefined = true } = options

  const pairs: string[] = []

  Object.entries(params).forEach(([key, value]) => {
    if (skipNull && value === null) return
    if (skipUndefined && value === undefined) return

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const serializedValue = encode ? encodeURIComponent(String(item)) : String(item)

        switch (arrayFormat) {
          case 'brackets':
            pairs.push(`${key}[]=${serializedValue}`)
            break
          case 'indices':
            pairs.push(`${key}[${index}]=${serializedValue}`)
            break
          case 'comma':
            if (index === 0) {
              const commaValue = value
                .map((v) => (encode ? encodeURIComponent(String(v)) : String(v)))
                .join(',')
              pairs.push(`${key}=${commaValue}`)
            }
            break
          case 'repeat':
          default:
            pairs.push(`${key}=${serializedValue}`)
            break
        }
      })
    } else {
      const serializedValue = encode ? encodeURIComponent(String(value)) : String(value)
      pairs.push(`${key}=${serializedValue}`)
    }
  })

  return pairs.join('&')
}

/**
 * 解析URL参数
 * @param search 查询字符串
 * @returns 参数对象
 */
export function parseParams(search: string): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {}

  // 移除开头的 ? 符号
  const queryString = search.startsWith('?') ? search.slice(1) : search

  if (!queryString) {
    return params
  }

  queryString.split('&').forEach((pair) => {
    const [key, value = ''] = pair.split('=')
    const decodedKey = decodeURIComponent(key)
    const decodedValue = decodeURIComponent(value)

    if (decodedKey in params) {
      // 已存在该key，转换为数组
      if (Array.isArray(params[decodedKey])) {
        ;(params[decodedKey] as string[]).push(decodedValue)
      } else {
        params[decodedKey] = [params[decodedKey] as string, decodedValue]
      }
    } else {
      params[decodedKey] = decodedValue
    }
  })

  return params
}

/**
 * 构建完整的URL
 * @param baseURL 基础URL
 * @param path 路径
 * @param params 查询参数
 * @returns 完整的URL
 */
export function buildUrl(baseURL: string, path: string = '', params?: UrlParams): string {
  let url = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

  if (path) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    url += cleanPath
  }

  if (params && Object.keys(params).length > 0) {
    const queryString = serializeParams(params)
    if (queryString) {
      url += `?${queryString}`
    }
  }

  return url
}

/**
 * 判断是否为绝对URL
 * @param url URL字符串
 * @returns 是否为绝对URL
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url)
}

/**
 * 获取URL的域名
 * @param url URL字符串
 * @returns 域名
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

/**
 * 获取URL的路径部分
 * @param url URL字符串
 * @returns 路径
 */
export function getPath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url.split('?')[0]
  }
}

/**
 * 合并URL路径
 * @param basePath 基础路径
 * @param relativePath 相对路径
 * @returns 合并后的路径
 */
export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/+$/, '')
      }
      return path.replace(/^\/+/, '').replace(/\/+$/, '')
    })
    .filter(Boolean)
    .join('/')
}

/**
 * 请求配置类型
 */
export interface RequestConfig {
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** 请求头 */
  headers?: Record<string, string>
  /** 查询参数 */
  params?: UrlParams
  /** 请求体 */
  data?: unknown
  /** 超时时间 */
  timeout?: number
  /** 是否携带凭证 */
  withCredentials?: boolean
}

/**
 * 格式化请求配置
 * @param config 原始配置
 * @returns 格式化后的配置
 */
export function formatRequestConfig(config: RequestConfig): RequestConfig {
  const formattedConfig = { ...config }

  // 默认方法
  if (!formattedConfig.method) {
    formattedConfig.method = 'GET'
  }

  // 默认headers
  if (!formattedConfig.headers) {
    formattedConfig.headers = {}
  }

  // 为POST/PUT/PATCH请求添加Content-Type
  if (['POST', 'PUT', 'PATCH'].includes(formattedConfig.method) && formattedConfig.data) {
    if (!formattedConfig.headers['Content-Type']) {
      if (formattedConfig.data instanceof FormData) {
        // FormData会自动设置Content-Type
      } else if (typeof formattedConfig.data === 'object') {
        formattedConfig.headers['Content-Type'] = 'application/json'
      } else {
        formattedConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
    }
  }

  return formattedConfig
}

/**
 * 深度克隆对象（简单实现）
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间
 * @returns 防抖后的函数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 间隔时间
 * @returns 节流后的函数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastExecTime = 0

  return (...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime >= delay) {
      func(...args)
      lastExecTime = currentTime
    }
  }
}

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟
 * @returns Promise
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

/**
 * 请求取消控制器管理
 */
export class RequestCancelManager {
  private controllers = new Map<string, AbortController>()

  createController(requestId: string): AbortController {
    const controller = new AbortController()
    this.controllers.set(requestId, controller)
    return controller
  }

  cancel(requestId: string): void {
    const controller = this.controllers.get(requestId)
    if (controller) {
      controller.abort()
      this.controllers.delete(requestId)
    }
  }

  cancelAll(): void {
    this.controllers.forEach((controller) => {
      controller.abort()
    })
    this.controllers.clear()
  }

  remove(requestId: string): void {
    this.controllers.delete(requestId)
  }

  getActiveCount(): number {
    return this.controllers.size
  }
}

export const requestCancelManager = new RequestCancelManager()

/**
 * 文件大小格式化
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 检查文件类型
 * @param file 文件对象
 * @param allowedTypes 允许的文件类型
 * @returns 是否为允许的类型
 */
export function isAllowedFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => {
    if (type.includes('*')) {
      // 处理通配符类型，如 image/*
      const baseType = type.split('/')[0]
      return file.type.startsWith(baseType + '/')
    }
    return file.type === type
  })
}
