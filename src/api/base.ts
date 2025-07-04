import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { request } from './request'

/**
 * 基础API类
 */
export class BaseApi {
  protected instance: AxiosInstance

  constructor(axiosInstance: AxiosInstance = request) {
    this.instance = axiosInstance
  }

  /**
   * GET 请求
   * @param url 请求URL
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  protected async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return response.data
  }

  /**
   * POST 请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  protected async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * PUT 请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  protected async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * DELETE 请求
   * @param url 请求URL
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  protected async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  /**
   * PATCH 请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  protected async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * 文件上传
   * @param url 上传URL
   * @param file 文件对象
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  protected async upload<T = unknown>(
    url: string,
    file: File,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })

    return response.data
  }

  /**
   * 多文件上传
   * @param url 上传URL
   * @param files 文件列表
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  protected async uploadMultiple<T = unknown>(
    url: string,
    files: File[],
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })

    return response.data
  }

  /**
   * 下载文件
   * @param url 下载URL
   * @param config 请求配置
   * @returns Promise<Blob>
   */
  protected async download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await this.instance.get(url, {
      responseType: 'blob',
      ...config,
    })

    return response.data
  }

  /**
   * 分页查询
   * @param url 请求URL
   * @param params 查询参数
   * @param config 请求配置
   * @returns Promise<PaginatedResponse<T>>
   */
  protected async paginate<T = unknown>(
    url: string,
    params?: {
      page?: number
      pageSize?: number
      [key: string]: unknown
    },
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResponse<T>> {
    const response = await this.instance.get<PaginatedResponse<T>>(url, {
      params,
      ...config,
    })

    return response.data
  }

  /**
   * 获取原始响应
   * @param url 请求URL
   * @param config 请求配置
   * @returns Promise<AxiosResponse<T>>
   */
  protected async getRaw<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config)
  }

  /**
   * 发送原始请求
   * @param config 请求配置
   * @returns Promise<AxiosResponse<T>>
   */
  protected async request<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config)
  }
}

/**
 * 创建API实例
 * @param axiosInstance Axios实例
 * @returns BaseApi实例
 */
export function createApi(axiosInstance?: AxiosInstance): BaseApi {
  return new BaseApi(axiosInstance)
}

/**
 * 默认API实例
 */
export const api = new BaseApi()
