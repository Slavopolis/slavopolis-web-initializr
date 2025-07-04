import { BUSINESS_ERROR_CODE, ERROR_MESSAGE_MAP, HTTP_STATUS } from '@/constants/api'
import { useRequestStore } from '@/stores/request'
import { logger } from '@/utils/logger'
import { generateRequestId } from '@/utils/request'
import { getToken, removeToken } from '@/utils/storage'
import { message } from 'ant-design-vue'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * 设置请求和响应拦截器
 * @param instance Axios 实例
 */
export function setupInterceptors(instance: AxiosInstance): void {
  // 设置请求拦截器
  setupRequestInterceptor(instance)

  // 设置响应拦截器
  setupResponseInterceptor(instance)
}

/**
 * 设置请求拦截器
 * @param instance Axios 实例
 */
function setupRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const requestStore = useRequestStore()

      // 生成请求ID
      const requestId = generateRequestId()
      config.headers['X-Request-ID'] = requestId

      // 添加时间戳
      config.headers['X-Timestamp'] = Date.now().toString()

      // 添加认证token
      const token = getToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }

      // 记录请求开始
      requestStore.addRequest(requestId)

      // 请求日志
      logger.info('Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data,
        params: config.params,
        requestId,
      })

      return config
    },
    (error: AxiosError) => {
      logger.error('Request Error:', error)
      return Promise.reject(error)
    },
  )
}

/**
 * 设置响应拦截器
 * @param instance Axios 实例
 */
function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const requestStore = useRequestStore()
      const requestId = response.config.headers['X-Request-ID'] as string

      // 记录请求完成
      if (requestId) {
        requestStore.removeRequest(requestId)
      }

      // 响应日志
      logger.info('Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        config: {
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          baseURL: response.config.baseURL,
        },
        requestId,
      })

      // 处理业务逻辑
      return handleBusinessLogic(response)
    },
    (error: AxiosError) => {
      const requestStore = useRequestStore()
      const requestId = error.config?.headers?.['X-Request-ID'] as string

      // 记录请求完成
      if (requestId) {
        requestStore.removeRequest(requestId)
      }

      // 错误日志
      logger.error('Response Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
        requestId,
      })

      // 处理错误响应
      return handleErrorResponse(error)
    },
  )
}

/**
 * 处理业务逻辑
 * @param response 响应对象
 * @returns 处理后的响应
 */
function handleBusinessLogic(response: AxiosResponse): AxiosResponse | Promise<never> {
  const { status, data } = response

  // HTTP 状态码检查
  if (status >= HTTP_STATUS.OK && status < 300) {
    // 检查业务状态码
    if (data && typeof data === 'object' && 'code' in data) {
      const { code, message: msg } = data

      // 业务成功
      if (code === 0 || code === '0' || code === 'success') {
        return response
      }

      // 业务失败
      const errorMessage =
        msg || ERROR_MESSAGE_MAP[code as keyof typeof ERROR_MESSAGE_MAP] || '操作失败'

      // 特殊错误处理
      if (
        code === BUSINESS_ERROR_CODE.TOKEN_EXPIRED ||
        code === BUSINESS_ERROR_CODE.TOKEN_INVALID
      ) {
        handleAuthError()
        return Promise.reject(new Error(errorMessage))
      }

      // 显示错误消息
      message.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }

    return response
  }

  return response
}

/**
 * 处理错误响应
 * @param error 错误对象
 * @returns 处理后的错误
 */
function handleErrorResponse(error: AxiosError): Promise<never> {
  const { response, code, message: errorMessage } = error

  if (response) {
    const { status, data } = response

    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        handleAuthError()
        message.error('登录已过期，请重新登录')
        break

      case HTTP_STATUS.FORBIDDEN:
        message.error('权限不足')
        break

      case HTTP_STATUS.NOT_FOUND:
        message.error('请求的资源不存在')
        break

      case HTTP_STATUS.METHOD_NOT_ALLOWED:
        message.error('请求方法不被允许')
        break

      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        if (data && typeof data === 'object' && 'message' in data) {
          message.error(data.message as string)
        } else {
          message.error('请求数据格式错误')
        }
        break

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        message.error('服务器内部错误')
        break

      case HTTP_STATUS.BAD_GATEWAY:
        message.error('网关错误')
        break

      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        message.error('服务暂时不可用')
        break

      case HTTP_STATUS.GATEWAY_TIMEOUT:
        message.error('网关超时')
        break

      default:
        message.error(`请求失败: ${status}`)
    }
  } else {
    // 网络错误或其他错误
    switch (code) {
      case 'ECONNABORTED':
        message.error('请求超时')
        break

      case 'ERR_NETWORK':
        message.error('网络连接失败')
        break

      case 'ERR_CANCELED':
        // 请求被取消，不显示错误消息
        break

      default:
        message.error(errorMessage || '网络错误')
    }
  }

  return Promise.reject(error)
}

/**
 * 处理认证错误
 */
function handleAuthError(): void {
  // 清除本地存储的认证信息
  removeToken()

  // 重定向到登录页
  const router = useRouter()
  router.push('/login')
}

/**
 * 请求重试拦截器
 * @param instance Axios 实例
 * @param retryCount 重试次数
 * @param retryDelay 重试延迟
 */
export function setupRetryInterceptor(
  instance: AxiosInstance,
  retryCount: number = 3,
  retryDelay: number = 1000,
): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number }

      // 如果没有配置或者已经重试过了，直接返回错误
      if (!config || config._retryCount === undefined) {
        config._retryCount = 0
      }

      // 如果重试次数已达上限，返回错误
      if (config._retryCount >= retryCount) {
        return Promise.reject(error)
      }

      // 只对网络错误和5xx错误进行重试
      const shouldRetry =
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        (error.response?.status && error.response.status >= 500)

      if (!shouldRetry) {
        return Promise.reject(error)
      }

      // 增加重试次数
      config._retryCount++

      // 延迟重试
      await new Promise((resolve) => setTimeout(resolve, retryDelay))

      logger.warn(`Request retry ${config._retryCount}/${retryCount}:`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        error: error.message,
      })

      // 重新发起请求
      return instance(config)
    },
  )
}

// 导入 router，用于认证失败时的重定向
function useRouter() {
  // 这里需要在实际使用时导入 vue-router
  // 暂时返回一个 mock 对象
  return {
    push: (path: string) => {
      console.log('Redirecting to:', path)
      // 在实际项目中，这里应该使用 Vue Router
      if (typeof window !== 'undefined') {
        window.location.href = path
      }
    },
  }
}
