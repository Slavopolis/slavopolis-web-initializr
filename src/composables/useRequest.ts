import { request } from '@/api/request'
import type { ApiResponse } from '@/types/api'
import { handleError } from '@/utils/error'
import { logger } from '@/utils/logger'
import type { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios'
import { computed, ref, unref, type Ref } from 'vue'

/**
 * 请求状态
 */
export interface UseRequestState<T> {
  /** 加载状态 */
  loading: Ref<boolean>
  /** 数据 */
  data: Ref<T | null>
  /** 错误 */
  error: Ref<Error | null>
  /** 是否已完成 */
  finished: Ref<boolean>
}

/**
 * 请求选项
 */
export interface UseRequestOptions<T> {
  /** 是否立即执行 */
  immediate?: boolean
  /** 初始数据 */
  initialData?: T
  /** 错误处理器 */
  onError?: (error: Error) => void
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 完成回调 */
  onFinally?: () => void
  /** 响应拦截器 */
  responseInterceptor?: (response: AxiosResponse) => T
  /** 是否显示错误消息 */
  showErrorMessage?: boolean
}

/**
 * 通用请求Hook
 * @param url 请求URL
 * @param config 请求配置
 * @param options 选项
 * @returns 请求状态和方法
 */
export function useRequest<T = unknown>(
  url: string | Ref<string>,
  config?: AxiosRequestConfig | Ref<AxiosRequestConfig>,
  options: UseRequestOptions<T> = {},
) {
  const {
    immediate = true,
    initialData = null,
    onError,
    onSuccess,
    onFinally,
    responseInterceptor,
    showErrorMessage = true,
  } = options

  // 状态
  const loading = ref(false)
  const data = ref<T | null>(initialData)
  const error = ref<Error | null>(null)
  const finished = ref(false)

  // 计算属性
  const isReady = computed(() => !loading.value && finished.value)
  const isSuccess = computed(() => isReady.value && !error.value)
  const isError = computed(() => isReady.value && !!error.value)

  /**
   * 执行请求
   * @param overrideConfig 覆盖配置
   * @returns Promise
   */
  async function execute(overrideConfig?: AxiosRequestConfig): Promise<T | null> {
    try {
      loading.value = true
      error.value = null
      finished.value = false

      const finalUrl = unref(url)
      const finalConfig = { ...unref(config), ...overrideConfig }

      logger.debug('Executing request:', { url: finalUrl, config: finalConfig })

      const response = await request({
        url: finalUrl,
        ...finalConfig,
      })

      // 处理响应数据
      let result: T
      if (responseInterceptor) {
        result = responseInterceptor(response)
      } else {
        // 假设返回的是ApiResponse格式
        const apiResponse = response.data as ApiResponse<T>
        result = apiResponse.data
      }

      data.value = result

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      const requestError = err as Error
      error.value = requestError

      if (showErrorMessage) {
        handleError(requestError)
      }

      if (onError) {
        onError(requestError)
      }

      return null
    } finally {
      loading.value = false
      finished.value = true

      if (onFinally) {
        onFinally()
      }
    }
  }

  /**
   * 重新执行请求
   */
  function refresh(): Promise<T | null> {
    return execute()
  }

  /**
   * 重置状态
   */
  function reset(): void {
    loading.value = false
    data.value = initialData
    error.value = null
    finished.value = false
  }

  /**
   * 取消请求
   */
  function cancel(): void {
    // 这里可以实现请求取消逻辑
    logger.debug('Request cancelled')
  }

  // 立即执行
  if (immediate) {
    execute()
  }

  return {
    // 状态
    loading,
    data,
    error,
    finished,

    // 计算属性
    isReady,
    isSuccess,
    isError,

    // 方法
    execute,
    refresh,
    reset,
    cancel,
  }
}

/**
 * GET请求Hook
 * @param url 请求URL
 * @param params 查询参数
 * @param options 选项
 * @returns 请求状态和方法
 */
export function useGet<T = unknown>(
  url: string | Ref<string>,
  params?: Record<string, unknown> | Ref<Record<string, unknown>>,
  options: UseRequestOptions<T> = {},
) {
  return useRequest<T>(
    url,
    computed(() => ({
      method: 'GET',
      params: unref(params),
    })),
    options,
  )
}

/**
 * POST请求Hook
 * @param url 请求URL
 * @param data 请求数据
 * @param options 选项
 * @returns 请求状态和方法
 */
export function usePost<T = unknown>(
  url: string | Ref<string>,
  data?: unknown | Ref<unknown>,
  options: UseRequestOptions<T> = {},
) {
  return useRequest<T>(
    url,
    computed(() => ({
      method: 'POST',
      data: unref(data),
    })),
    { immediate: false, ...options },
  )
}

/**
 * PUT请求Hook
 * @param url 请求URL
 * @param data 请求数据
 * @param options 选项
 * @returns 请求状态和方法
 */
export function usePut<T = unknown>(
  url: string | Ref<string>,
  data?: unknown | Ref<unknown>,
  options: UseRequestOptions<T> = {},
) {
  return useRequest<T>(
    url,
    computed(() => ({
      method: 'PUT',
      data: unref(data),
    })),
    { immediate: false, ...options },
  )
}

/**
 * DELETE请求Hook
 * @param url 请求URL
 * @param options 选项
 * @returns 请求状态和方法
 */
export function useDelete<T = unknown>(
  url: string | Ref<string>,
  options: UseRequestOptions<T> = {},
) {
  return useRequest<T>(url, { method: 'DELETE' }, { immediate: false, ...options })
}

/**
 * 分页请求Hook
 * @param url 请求URL
 * @param options 选项
 * @returns 分页状态和方法
 */
export function usePagination<T = unknown>(
  url: string | Ref<string>,
  options: UseRequestOptions<T> & {
    pageSize?: number
    defaultPage?: number
  } = {},
) {
  const { pageSize = 20, defaultPage = 1, ...requestOptions } = options

  const currentPage = ref(defaultPage)
  const currentPageSize = ref(pageSize)
  const total = ref(0)
  const totalPages = ref(0)

  const params = computed(() => ({
    page: currentPage.value,
    pageSize: currentPageSize.value,
  }))

  const result = useGet(url, params, {
    ...requestOptions,
    responseInterceptor: (response: AxiosResponse) => {
      const paginatedResponse = response.data
      total.value = paginatedResponse.data.total
      totalPages.value = paginatedResponse.data.totalPages
      return paginatedResponse.data.list
    },
  })

  /**
   * 跳转到指定页
   * @param page 页码
   */
  function goToPage(page: number): void {
    currentPage.value = page
    result.refresh()
  }

  /**
   * 下一页
   */
  function nextPage(): void {
    if (currentPage.value < totalPages.value) {
      goToPage(currentPage.value + 1)
    }
  }

  /**
   * 上一页
   */
  function prevPage(): void {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1)
    }
  }

  /**
   * 改变页大小
   * @param size 页大小
   */
  function changePageSize(size: number): void {
    currentPageSize.value = size
    currentPage.value = 1 // 重置到第一页
    result.refresh()
  }

  /**
   * 刷新当前页
   */
  function refreshPage(): void {
    result.refresh()
  }

  return {
    ...result,

    // 分页状态
    currentPage,
    currentPageSize,
    total,
    totalPages,

    // 分页方法
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    refreshPage,
  }
}

/**
 * 文件上传Hook
 * @param url 上传URL
 * @param options 选项
 * @returns 上传状态和方法
 */
export function useUpload<T = unknown>(
  url: string | Ref<string>,
  options: UseRequestOptions<T> & {
    onProgress?: (percentage: number) => void
  } = {},
) {
  const { onProgress, ...requestOptions } = options
  const progress = ref(0)

  const result = useRequest<T>(
    url,
    computed(() => ({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          progress.value = percentage

          if (onProgress) {
            onProgress(percentage)
          }
        }
      },
    })),
    { immediate: false, ...requestOptions },
  )

  /**
   * 上传文件
   * @param file 文件对象
   * @param extraData 额外数据
   * @returns Promise
   */
  async function upload(file: File, extraData?: Record<string, unknown>): Promise<T | null> {
    const formData = new FormData()
    formData.append('file', file)

    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return result.execute({ data: formData })
  }

  return {
    ...result,
    progress,
    upload,
  }
}
