import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 请求状态接口
 */
export interface RequestState {
  /** 请求ID */
  id: string
  /** 请求URL */
  url?: string
  /** 请求方法 */
  method?: string
  /** 开始时间 */
  startTime: number
  /** 状态 */
  status: 'pending' | 'completed' | 'failed'
}

/**
 * 请求统计信息
 */
export interface RequestStats {
  /** 总请求数 */
  totalRequests: number
  /** 成功请求数 */
  successRequests: number
  /** 失败请求数 */
  failedRequests: number
  /** 平均响应时间 */
  averageResponseTime: number
  /** 最大响应时间 */
  maxResponseTime: number
  /** 最小响应时间 */
  minResponseTime: number
}

/**
 * 请求Store
 */
export const useRequestStore = defineStore('request', () => {
  // 状态
  const activeRequests = ref<Map<string, RequestState>>(new Map())
  const completedRequests = ref<RequestState[]>([])
  const requestStats = ref<RequestStats>({
    totalRequests: 0,
    successRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: 0,
  })

  // 计算属性
  const activeRequestCount = computed(() => activeRequests.value.size)
  const isLoading = computed(() => activeRequestCount.value > 0)
  const activeRequestList = computed(() => Array.from(activeRequests.value.values()))

  /**
   * 添加请求
   * @param requestId 请求ID
   * @param url 请求URL
   * @param method 请求方法
   */
  function addRequest(requestId: string, url?: string, method?: string): void {
    const requestState: RequestState = {
      id: requestId,
      url,
      method,
      startTime: Date.now(),
      status: 'pending',
    }

    activeRequests.value.set(requestId, requestState)
    requestStats.value.totalRequests++
  }

  /**
   * 移除请求
   * @param requestId 请求ID
   * @param success 是否成功
   */
  function removeRequest(requestId: string, success: boolean = true): void {
    const request = activeRequests.value.get(requestId)
    if (!request) return

    // 计算响应时间
    const responseTime = Date.now() - request.startTime

    // 更新请求状态
    request.status = success ? 'completed' : 'failed'

    // 移除活跃请求
    activeRequests.value.delete(requestId)

    // 添加到完成列表
    completedRequests.value.push(request)

    // 限制完成列表大小
    if (completedRequests.value.length > 100) {
      completedRequests.value.shift()
    }

    // 更新统计信息
    updateStats(responseTime, success)
  }

  /**
   * 更新统计信息
   * @param responseTime 响应时间
   * @param success 是否成功
   */
  function updateStats(responseTime: number, success: boolean): void {
    const stats = requestStats.value

    // 更新成功/失败计数
    if (success) {
      stats.successRequests++
    } else {
      stats.failedRequests++
    }

    // 更新响应时间统计
    if (stats.maxResponseTime === 0) {
      stats.maxResponseTime = responseTime
      stats.minResponseTime = responseTime
      stats.averageResponseTime = responseTime
    } else {
      stats.maxResponseTime = Math.max(stats.maxResponseTime, responseTime)
      stats.minResponseTime = Math.min(stats.minResponseTime, responseTime)

      // 计算平均响应时间
      const completedCount = stats.successRequests + stats.failedRequests
      stats.averageResponseTime =
        (stats.averageResponseTime * (completedCount - 1) + responseTime) / completedCount
    }
  }

  /**
   * 清空所有请求
   */
  function clearRequests(): void {
    activeRequests.value.clear()
    completedRequests.value = []
  }

  /**
   * 清空统计信息
   */
  function clearStats(): void {
    requestStats.value = {
      totalRequests: 0,
      successRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: 0,
    }
  }

  /**
   * 获取请求详情
   * @param requestId 请求ID
   * @returns 请求状态
   */
  function getRequestById(requestId: string): RequestState | undefined {
    return activeRequests.value.get(requestId)
  }

  /**
   * 获取请求列表
   * @param status 状态过滤
   * @returns 请求列表
   */
  function getRequestsByStatus(status?: 'pending' | 'completed' | 'failed'): RequestState[] {
    if (!status) {
      return [...activeRequestList.value, ...completedRequests.value]
    }

    if (status === 'pending') {
      return activeRequestList.value
    }

    return completedRequests.value.filter((req) => req.status === status)
  }

  /**
   * 获取最近的请求
   * @param count 数量
   * @returns 最近的请求列表
   */
  function getRecentRequests(count: number = 10): RequestState[] {
    const allRequests = [...activeRequestList.value, ...completedRequests.value]
    return allRequests.sort((a, b) => b.startTime - a.startTime).slice(0, count)
  }

  /**
   * 检查是否有特定URL的请求
   * @param url URL
   * @returns 是否存在
   */
  function hasRequestForUrl(url: string): boolean {
    return activeRequestList.value.some((req) => req.url === url)
  }

  /**
   * 获取特定URL的请求数量
   * @param url URL
   * @returns 请求数量
   */
  function getRequestCountForUrl(url: string): number {
    return activeRequestList.value.filter((req) => req.url === url).length
  }

  /**
   * 获取性能报告
   * @returns 性能报告
   */
  function getPerformanceReport(): {
    stats: RequestStats
    slowestRequests: RequestState[]
    failedRequests: RequestState[]
    activeRequests: RequestState[]
  } {
    const slowestRequests = completedRequests.value
      .filter((req) => req.status === 'completed')
      .sort((a, b) => {
        const timeA = Date.now() - a.startTime
        const timeB = Date.now() - b.startTime
        return timeB - timeA
      })
      .slice(0, 5)

    const failedRequests = completedRequests.value
      .filter((req) => req.status === 'failed')
      .slice(-5)

    return {
      stats: requestStats.value,
      slowestRequests,
      failedRequests,
      activeRequests: activeRequestList.value,
    }
  }

  return {
    // 状态
    activeRequests,
    completedRequests,
    requestStats,

    // 计算属性
    activeRequestCount,
    isLoading,
    activeRequestList,

    // 方法
    addRequest,
    removeRequest,
    clearRequests,
    clearStats,
    getRequestById,
    getRequestsByStatus,
    getRecentRequests,
    hasRequestForUrl,
    getRequestCountForUrl,
    getPerformanceReport,
  }
})
