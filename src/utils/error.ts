import { BUSINESS_ERROR_CODE, ERROR_MESSAGE_MAP } from '@/constants/api'
import type { ErrorResponse } from '@/types/api'
import { message } from 'ant-design-vue'
import { AxiosError } from 'axios'
import { logger } from './logger'

/**
 * 自定义错误类型
 */
export class CustomError extends Error {
  code: string | number
  details?: string
  timestamp: number

  constructor(message: string, code: string | number = 'UNKNOWN_ERROR', details?: string) {
    super(message)
    this.name = 'CustomError'
    this.code = code
    this.details = details
    this.timestamp = Date.now()
  }
}

/**
 * 网络错误类型
 */
export class NetworkError extends CustomError {
  constructor(message: string = '网络连接失败', details?: string) {
    super(message, BUSINESS_ERROR_CODE.NETWORK_ERROR, details)
    this.name = 'NetworkError'
  }
}

/**
 * 业务错误类型
 */
export class BusinessError extends CustomError {
  constructor(message: string, code: string | number, details?: string) {
    super(message, code, details)
    this.name = 'BusinessError'
  }
}

/**
 * 验证错误类型
 */
export class ValidationError extends CustomError {
  fieldErrors?: Array<{ field: string; message: string }>

  constructor(
    message: string = '数据验证失败',
    fieldErrors?: Array<{ field: string; message: string }>,
  ) {
    super(message, BUSINESS_ERROR_CODE.VALIDATION_ERROR)
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

/**
 * 权限错误类型
 */
export class PermissionError extends CustomError {
  constructor(message: string = '权限不足') {
    super(message, BUSINESS_ERROR_CODE.PERMISSION_DENIED)
    this.name = 'PermissionError'
  }
}

/**
 * 错误处理器接口
 */
export interface ErrorHandler {
  (error: Error | AxiosError | CustomError): void
}

/**
 * 错误处理器映射
 */
const errorHandlers = new Map<string, ErrorHandler>()

/**
 * 注册错误处理器
 * @param errorType 错误类型
 * @param handler 处理器
 */
export function registerErrorHandler(errorType: string, handler: ErrorHandler): void {
  errorHandlers.set(errorType, handler)
}

/**
 * 移除错误处理器
 * @param errorType 错误类型
 */
export function removeErrorHandler(errorType: string): void {
  errorHandlers.delete(errorType)
}

/**
 * 处理错误
 * @param error 错误对象
 * @param showMessage 是否显示错误消息
 */
export function handleError(
  error: Error | AxiosError | CustomError,
  showMessage: boolean = true,
): void {
  logger.error('Error handled:', error)

  // 执行注册的错误处理器
  const handler = errorHandlers.get(error.name)
  if (handler) {
    handler(error)
    return
  }

  // 默认错误处理
  if (error instanceof AxiosError) {
    handleAxiosError(error, showMessage)
  } else if (error instanceof CustomError) {
    handleCustomError(error, showMessage)
  } else {
    handleGenericError(error, showMessage)
  }
}

/**
 * 处理Axios错误
 * @param error Axios错误对象
 * @param showMessage 是否显示错误消息
 */
function handleAxiosError(error: AxiosError, showMessage: boolean): void {
  const { response, code } = error

  if (response) {
    const { status, data } = response
    const errorResponse = data as ErrorResponse

    // 业务错误
    if (errorResponse && errorResponse.message) {
      if (showMessage) {
        message.error(errorResponse.message)
      }
      return
    }

    // HTTP状态码错误
    const statusMessage = getHttpStatusMessage(status)
    if (showMessage && statusMessage) {
      message.error(statusMessage)
    }
  } else {
    // 网络错误
    const networkMessage = getNetworkErrorMessage(code)
    if (showMessage && networkMessage) {
      message.error(networkMessage)
    }
  }
}

/**
 * 处理自定义错误
 * @param error 自定义错误
 * @param showMessage 是否显示错误消息
 */
function handleCustomError(error: CustomError, showMessage: boolean): void {
  if (showMessage) {
    const errorMessage =
      ERROR_MESSAGE_MAP[error.code as keyof typeof ERROR_MESSAGE_MAP] || error.message
    message.error(errorMessage)
  }

  // 特殊错误处理
  if (error instanceof ValidationError && error.fieldErrors) {
    // 可以在这里处理字段验证错误的特殊逻辑
    logger.warn('Field validation errors:', error.fieldErrors)
  }
}

/**
 * 处理通用错误
 * @param error 通用错误
 * @param showMessage 是否显示错误消息
 */
function handleGenericError(error: Error, showMessage: boolean): void {
  if (showMessage) {
    message.error(error.message || '未知错误')
  }
}

/**
 * 获取HTTP状态码对应的错误消息
 * @param status HTTP状态码
 * @returns 错误消息
 */
function getHttpStatusMessage(status: number): string {
  const statusMessages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '权限不足',
    404: '请求的资源不存在',
    405: '请求方法不被允许',
    408: '请求超时',
    409: '请求冲突',
    422: '请求数据格式错误',
    429: '请求频率过高',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时',
  }

  return statusMessages[status] || `请求失败 (${status})`
}

/**
 * 获取网络错误对应的错误消息
 * @param code 错误代码
 * @returns 错误消息
 */
function getNetworkErrorMessage(code?: string): string {
  const networkMessages: Record<string, string> = {
    ECONNABORTED: '请求超时',
    ERR_NETWORK: '网络连接失败',
    ERR_CANCELED: '请求已取消',
    ERR_TIMEOUT: '请求超时',
    ERR_INTERNET_DISCONNECTED: '网络连接已断开',
  }

  return networkMessages[code || ''] || '网络错误'
}

/**
 * 错误重试装饰器
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟
 * @returns 装饰器函数
 */
export function retryOnError(maxRetries: number = 3, delay: number = 1000) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]) {
      let lastError: Error

      for (let i = 0; i <= maxRetries; i++) {
        try {
          return await originalMethod.apply(this, args)
        } catch (error) {
          lastError = error as Error

          if (i < maxRetries && shouldRetry(error)) {
            logger.warn(`Retrying ${propertyKey} (${i + 1}/${maxRetries}):`, error)
            await new Promise((resolve) => setTimeout(resolve, delay))
          } else {
            break
          }
        }
      }

      throw lastError!
    }

    return descriptor
  }
}

/**
 * 判断是否应该重试
 * @param error 错误对象
 * @returns 是否应该重试
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shouldRetry(error: any): boolean {
  // 网络错误或5xx服务器错误可以重试
  if (error instanceof AxiosError) {
    const { code, response } = error

    // 网络错误
    if (code === 'ECONNABORTED' || code === 'ERR_NETWORK') {
      return true
    }

    // 5xx服务器错误
    if (response && response.status >= 500) {
      return true
    }
  }

  return false
}

/**
 * 创建错误报告
 * @param error 错误对象
 * @param context 上下文信息
 * @returns 错误报告
 */
export function createErrorReport(
  error: Error | AxiosError | CustomError,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>,
) {
  const report = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    timestamp: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    url: typeof window !== 'undefined' ? window.location.href : '',
    context: context || {},
  }

  // 添加错误特定信息
  if (error instanceof AxiosError) {
    Object.assign(report.error, {
      code: error.code,
      config: error.config,
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          }
        : null,
    })
  }

  if (error instanceof CustomError) {
    Object.assign(report.error, {
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
    })
  }

  return report
}

/**
 * 发送错误报告
 * @param error 错误对象
 * @param context 上下文信息
 */
export async function reportError(
  error: Error | AxiosError | CustomError,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>,
) {
  try {
    const report = createErrorReport(error, context)

    // 可以发送到错误监控服务
    // await errorReportingService.send(report)

    logger.error('Error report created:', report)
  } catch (reportError) {
    logger.error('Failed to report error:', reportError)
  }
}

/**
 * 安全执行函数，捕获并处理错误
 * @param fn 要执行的函数
 * @param errorHandler 错误处理器
 * @returns 执行结果
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: Error) => T | undefined,
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    handleError(error as Error)

    if (errorHandler) {
      const result = errorHandler(error as Error)
      return result
    }

    return undefined
  }
}

/**
 * 创建错误边界装饰器
 * @param errorHandler 错误处理器
 * @returns 装饰器函数
 */
export function errorBoundary(errorHandler?: ErrorHandler) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args)
      } catch (error) {
        if (errorHandler) {
          errorHandler(error as Error)
        } else {
          handleError(error as Error)
        }

        throw error
      }
    }

    return descriptor
  }
}
