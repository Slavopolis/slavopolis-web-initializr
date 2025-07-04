import { API_CONFIG } from '@/constants/api'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { setupInterceptors } from './interceptors'

/**
 * 创建 Axios 实例
 * @param config 可选的配置参数
 * @returns 配置好的 Axios 实例
 */
export function createAxiosInstance(config?: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || API_CONFIG.DEFAULT_BASE_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || API_CONFIG.DEFAULT_TIMEOUT,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...config?.headers,
    },
    ...config,
  })

  // 设置请求和响应拦截器
  setupInterceptors(instance)

  return instance
}

/**
 * 默认的 Axios 实例
 */
export const request = createAxiosInstance()

/**
 * 创建带有自定义配置的 Axios 实例
 * @param customConfig 自定义配置
 * @returns 配置好的 Axios 实例
 */
export function createCustomRequest(customConfig: AxiosRequestConfig): AxiosInstance {
  return createAxiosInstance(customConfig)
}

/**
 * 创建文件上传专用的 Axios 实例
 * @returns 配置好的文件上传 Axios 实例
 */
export function createUploadRequest(): AxiosInstance {
  return createAxiosInstance({
    timeout: 300000, // 5分钟超时
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 创建外部 API 请求实例
 * @param baseURL 外部 API 基础 URL
 * @returns 配置好的外部 API Axios 实例
 */
export function createExternalRequest(baseURL: string): AxiosInstance {
  return createAxiosInstance({
    baseURL,
    timeout: 30000, // 30秒超时
  })
}

export default request
