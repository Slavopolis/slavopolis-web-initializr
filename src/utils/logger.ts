/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

/**
 * 日志配置接口
 */
export interface LoggerConfig {
  /** 日志级别 */
  level: LogLevel
  /** 是否启用控制台输出 */
  enableConsole: boolean
  /** 是否启用远程日志 */
  enableRemote: boolean
  /** 远程日志端点 */
  remoteEndpoint?: string
  /** 日志前缀 */
  prefix: string
  /** 是否显示时间戳 */
  showTimestamp: boolean
  /** 是否显示调用栈 */
  showStack: boolean
}

/**
 * 日志条目接口
 */
export interface LogEntry {
  /** 日志级别 */
  level: LogLevel
  /** 日志消息 */
  message: string
  /** 额外数据 */
  data?: unknown
  /** 时间戳 */
  timestamp: number
  /** 来源 */
  source?: string
  /** 错误堆栈 */
  stack?: string
}

/**
 * 日志记录器类
 */
export class Logger {
  private config: LoggerConfig
  private logBuffer: LogEntry[] = []
  private maxBufferSize = 1000

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: false,
      prefix: '[SlavoPoliS]',
      showTimestamp: true,
      showStack: false,
      ...config,
    }
  }

  /**
   * 设置日志级别
   * @param level 日志级别
   */
  setLevel(level: LogLevel): void {
    this.config.level = level
  }

  /**
   * 记录调试日志
   * @param message 消息
   * @param data 额外数据
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  /**
   * 记录信息日志
   * @param message 消息
   * @param data 额外数据
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data)
  }

  /**
   * 记录警告日志
   * @param message 消息
   * @param data 额外数据
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data)
  }

  /**
   * 记录错误日志
   * @param message 消息
   * @param data 额外数据
   */
  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data)
  }

  /**
   * 记录日志
   * @param level 日志级别
   * @param message 消息
   * @param data 额外数据
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    // 检查日志级别
    if (level < this.config.level) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      source: this.getSource(),
    }

    // 添加错误堆栈
    if (this.config.showStack && level >= LogLevel.ERROR) {
      entry.stack = new Error().stack
    }

    // 添加到缓冲区
    this.addToBuffer(entry)

    // 控制台输出
    if (this.config.enableConsole) {
      this.outputToConsole(entry)
    }

    // 远程日志
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.sendToRemote(entry)
    }
  }

  /**
   * 获取调用源信息
   * @returns 源信息
   */
  private getSource(): string {
    const stack = new Error().stack
    if (!stack) return ''

    const lines = stack.split('\n')
    // 跳过Error构造函数和当前方法的调用栈
    const relevantLine = lines[4]
    if (!relevantLine) return ''

    // 提取文件名和行号
    const match =
      relevantLine.match(/at .* \((.+):(\d+):(\d+)\)/) || relevantLine.match(/at (.+):(\d+):(\d+)/)

    if (match) {
      const [, file, line] = match
      const filename = file.split('/').pop() || file
      return `${filename}:${line}`
    }

    return ''
  }

  /**
   * 添加到日志缓冲区
   * @param entry 日志条目
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry)

    // 限制缓冲区大小
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift()
    }
  }

  /**
   * 输出到控制台
   * @param entry 日志条目
   */
  private outputToConsole(entry: LogEntry): void {
    const timestamp = this.config.showTimestamp ? new Date(entry.timestamp).toISOString() : ''

    const prefix = this.config.prefix
    const source = entry.source ? ` [${entry.source}]` : ''
    const levelText = LogLevel[entry.level]

    const logMessage = `${timestamp} ${prefix}${source} [${levelText}] ${entry.message}`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.data)
        break
      case LogLevel.INFO:
        console.info(logMessage, entry.data)
        break
      case LogLevel.WARN:
        console.warn(logMessage, entry.data)
        break
      case LogLevel.ERROR:
        console.error(logMessage, entry.data)
        if (entry.stack) {
          console.error(entry.stack)
        }
        break
    }
  }

  /**
   * 发送到远程服务器
   * @param entry 日志条目
   */
  private async sendToRemote(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      // 远程日志发送失败，输出到控制台
      console.error('Failed to send log to remote:', error)
    }
  }

  /**
   * 获取日志缓冲区
   * @returns 日志条目数组
   */
  getBuffer(): LogEntry[] {
    return [...this.logBuffer]
  }

  /**
   * 清空日志缓冲区
   */
  clearBuffer(): void {
    this.logBuffer = []
  }

  /**
   * 导出日志
   * @param format 导出格式
   * @returns 导出的日志数据
   */
  exportLogs(format: 'json' | 'text' = 'json'): string {
    if (format === 'text') {
      return this.logBuffer
        .map((entry) => {
          const timestamp = new Date(entry.timestamp).toISOString()
          const level = LogLevel[entry.level]
          const source = entry.source ? ` [${entry.source}]` : ''
          const data = entry.data ? ` ${JSON.stringify(entry.data)}` : ''
          return `${timestamp}${source} [${level}] ${entry.message}${data}`
        })
        .join('\n')
    }

    return JSON.stringify(this.logBuffer, null, 2)
  }
}

/**
 * 默认日志配置
 */
const defaultConfig: Partial<LoggerConfig> = {
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableRemote: false,
  prefix: '[SlavoPoliS]',
  showTimestamp: true,
  showStack: import.meta.env.DEV,
}

/**
 * 全局日志记录器实例
 */
export const logger = new Logger(defaultConfig)

/**
 * 设置全局日志级别
 * @param level 日志级别
 */
export function setLogLevel(level: LogLevel): void {
  logger.setLevel(level)
}

/**
 * 启用远程日志
 * @param endpoint 远程端点
 */
export function enableRemoteLogging(endpoint: string): void {
  logger['config'].enableRemote = true
  logger['config'].remoteEndpoint = endpoint
}

/**
 * 禁用远程日志
 */
export function disableRemoteLogging(): void {
  logger['config'].enableRemote = false
}

/**
 * 创建专用日志记录器
 * @param name 日志记录器名称
 * @param config 配置
 * @returns 日志记录器实例
 */
export function createLogger(name: string, config: Partial<LoggerConfig> = {}): Logger {
  return new Logger({
    ...defaultConfig,
    prefix: `[${name}]`,
    ...config,
  })
}

/**
 * 性能计时器
 */
export class PerformanceTimer {
  private startTime = 0
  private endTime = 0
  private label: string

  constructor(label: string) {
    this.label = label
    this.start()
  }

  /**
   * 开始计时
   */
  start(): void {
    this.startTime = performance.now()
    logger.debug(`⏱️ Timer started: ${this.label}`)
  }

  /**
   * 结束计时
   * @returns 耗时（毫秒）
   */
  end(): number {
    this.endTime = performance.now()
    const duration = this.endTime - this.startTime
    logger.debug(`⏱️ Timer ended: ${this.label} - ${duration.toFixed(2)}ms`)
    return duration
  }

  /**
   * 获取当前耗时
   * @returns 耗时（毫秒）
   */
  elapsed(): number {
    return performance.now() - this.startTime
  }
}

/**
 * 创建性能计时器
 * @param label 标签
 * @returns 计时器实例
 */
export function createTimer(label: string): PerformanceTimer {
  return new PerformanceTimer(label)
}

/**
 * 统计函数执行时间
 * @param fn 要统计的函数
 * @param label 标签
 * @returns 包装后的函数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function timeFunction<T extends (...args: any[]) => any>(fn: T, label?: string): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((...args: any[]) => {
    const timer = createTimer(label || fn.name || 'anonymous')
    const result = fn(...args)

    if (result instanceof Promise) {
      return result.finally(() => timer.end())
    } else {
      timer.end()
      return result
    }
  }) as T
}
