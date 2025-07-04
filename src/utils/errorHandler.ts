import type { ErrorPageConfig, ErrorPageUtils, ErrorReportData, ErrorType } from '@/types/error'
import { ERROR_CONFIGS } from '@/types/error'
import { type Router } from 'vue-router'

/**
 * 错误页面工具类
 */
export class ErrorPageHandler {
  private router: Router

  constructor(router: Router) {
    this.router = router
  }

  /**
   * 跳转到404页面
   */
  show404(options?: { message?: string; details?: string; from?: string }) {
    this.router.push({
      name: 'error-404',
      query: {
        ...(options?.message && { message: options.message }),
        ...(options?.details && { details: options.details }),
        ...(options?.from && { from: options.from }),
        timestamp: Date.now().toString(),
      },
    })
  }

  /**
   * 跳转到403页面
   */
  show403(options?: {
    message?: string
    details?: string
    permission?: string
    resource?: string
  }) {
    this.router.push({
      name: 'error-403',
      query: {
        ...(options?.message && { message: options.message }),
        ...(options?.details && { details: options.details }),
        ...(options?.permission && { permission: options.permission }),
        ...(options?.resource && { resource: options.resource }),
        timestamp: Date.now().toString(),
      },
    })
  }

  /**
   * 跳转到500页面
   */
  show500(options?: { message?: string; details?: string; errorId?: string; errorTime?: string }) {
    this.router.push({
      name: 'error-500',
      query: {
        ...(options?.message && { message: options.message }),
        ...(options?.details && { details: options.details }),
        ...(options?.errorId && { errorId: options.errorId }),
        ...(options?.errorTime && { errorTime: options.errorTime }),
        timestamp: Date.now().toString(),
      },
    })
  }

  /**
   * 跳转到网络错误页面
   */
  showNetworkError(options?: {
    message?: string
    details?: string
    errorType?: 'timeout' | 'offline' | 'dns' | 'cors' | 'unknown'
    status?: string
  }) {
    this.router.push({
      name: 'error-network',
      query: {
        ...(options?.message && { message: options.message }),
        ...(options?.details && { details: options.details }),
        ...(options?.errorType && { errorType: options.errorType }),
        ...(options?.status && { status: options.status }),
        timestamp: Date.now().toString(),
      },
    })
  }

  /**
   * 跳转到通用错误页面
   */
  showGenericError(options?: {
    message?: string
    details?: string
    code?: string
    title?: string
  }) {
    this.router.push({
      name: 'error-general',
      query: {
        ...(options?.message && { message: options.message }),
        ...(options?.details && { details: options.details }),
        ...(options?.code && { code: options.code }),
        ...(options?.title && { title: options.title }),
        timestamp: Date.now().toString(),
      },
    })
  }

  /**
   * 处理API错误
   */
  handleApiError(error: unknown, context?: string) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (error as any).response

      switch (response?.status) {
        case 404:
          this.show404({
            message: '请求的资源不存在',
            details: `API: ${response.config?.url}\n状态码: ${response.status}`,
            from: context,
          })
          break
        case 403:
          this.show403({
            message: '没有权限访问此资源',
            details: `API: ${response.config?.url}\n状态码: ${response.status}`,
            resource: response.config?.url,
          })
          break
        case 500:
        case 502:
        case 503:
        case 504:
          this.show500({
            message: '服务器错误，请稍后重试',
            details: `API: ${response.config?.url}\n状态码: ${response.status}\n错误信息: ${response.data?.message || response.statusText}`,
            errorId: response.headers?.['x-request-id'] || 'unknown',
            errorTime: new Date().toISOString(),
          })
          break
        default:
          this.showGenericError({
            message: `请求失败 (${response.status})`,
            details: `API: ${response.config?.url}\n状态码: ${response.status}\n错误信息: ${response.data?.message || response.statusText}`,
            code: response.status.toString(),
            title: '请求错误',
          })
      }
    } else if (error instanceof Error) {
      // 网络错误
      if (error.name === 'NetworkError' || error.message.includes('Network')) {
        this.showNetworkError({
          message: '网络连接失败，请检查网络后重试',
          details: error.message,
          errorType: 'unknown',
        })
      } else {
        this.showGenericError({
          message: '发生了未知错误',
          details: error.message,
          title: '错误',
        })
      }
    } else {
      this.showGenericError({
        message: '发生了未知错误',
        details: String(error),
        title: '错误',
      })
    }
  }

  /**
   * 处理路由错误
   */
  handleRouteError(error: Error, to?: string) {
    if (error.name === 'NavigationDuplicated') {
      // 重复导航，忽略
      return
    }

    if (error.name === 'NavigationAborted') {
      // 导航被中止
      console.warn('Navigation aborted:', error.message)
      return
    }

    this.showGenericError({
      message: '页面导航失败',
      details: `错误: ${error.message}\n目标路由: ${to || 'unknown'}`,
      title: '导航错误',
    })
  }
}

/**
 * 错误页面工具函数
 */
export const createErrorPageUtils = (router: Router): ErrorPageUtils => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handler = new ErrorPageHandler(router)

  return {
    getErrorConfig: (type: ErrorType): ErrorPageConfig => {
      return ERROR_CONFIGS[type] || ERROR_CONFIGS.GENERIC
    },

    reportError: async (data: ErrorReportData): Promise<void> => {
      try {
        // 这里可以发送错误报告到服务器
        console.info('Error reported:', data)

        // 示例: 发送到错误监控服务
        // await fetch('/api/errors/report', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // })
      } catch (error) {
        console.error('Failed to report error:', error)
      }
    },

    formatError: (error: Error, type?: ErrorType): ErrorPageConfig => {
      const baseConfig = type ? ERROR_CONFIGS[type] : ERROR_CONFIGS.GENERIC

      return {
        ...baseConfig,
        title: error.name || baseConfig.title,
        description: error.message || baseConfig.description,
        details: error.stack || undefined,
      }
    },

    isErrorType: (value: string): value is ErrorType => {
      return Object.values(ERROR_CONFIGS).some((config) => config.type === value)
    },
  }
}

/**
 * 全局错误处理器
 */
export const setupGlobalErrorHandler = (router: Router) => {
  const handler = new ErrorPageHandler(router)

  // 处理未捕获的JavaScript错误
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)

    handler.showGenericError({
      message: '页面执行出错',
      details: `错误: ${event.error?.message || event.message}\n文件: ${event.filename}:${event.lineno}:${event.colno}`,
      title: 'JavaScript错误',
    })
  })

  // 处理未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)

    if (event.reason?.name === 'ChunkLoadError') {
      handler.showNetworkError({
        message: '页面资源加载失败',
        details: event.reason.message,
        errorType: 'unknown',
      })
    } else {
      handler.showGenericError({
        message: '异步操作失败',
        details: String(event.reason?.message || event.reason),
        title: 'Promise错误',
      })
    }

    // 阻止默认的控制台错误消息
    event.preventDefault()
  })

  return handler
}

/**
 * 导出默认的错误处理实例
 */
let globalErrorHandler: ErrorPageHandler | null = null

export const getErrorHandler = (): ErrorPageHandler | null => {
  return globalErrorHandler
}

export const setErrorHandler = (handler: ErrorPageHandler) => {
  globalErrorHandler = handler
}

/**
 * 便捷的错误处理函数
 */
export const handleError = {
  show404: (options?: Parameters<ErrorPageHandler['show404']>[0]) => {
    globalErrorHandler?.show404(options)
  },
  show403: (options?: Parameters<ErrorPageHandler['show403']>[0]) => {
    globalErrorHandler?.show403(options)
  },
  show500: (options?: Parameters<ErrorPageHandler['show500']>[0]) => {
    globalErrorHandler?.show500(options)
  },
  showNetworkError: (options?: Parameters<ErrorPageHandler['showNetworkError']>[0]) => {
    globalErrorHandler?.showNetworkError(options)
  },
  showGenericError: (options?: Parameters<ErrorPageHandler['showGenericError']>[0]) => {
    globalErrorHandler?.showGenericError(options)
  },
  handleApiError: (error: unknown, context?: string) => {
    globalErrorHandler?.handleApiError(error, context)
  },
  handleRouteError: (error: Error, to?: string) => {
    globalErrorHandler?.handleRouteError(error, to)
  },
}
