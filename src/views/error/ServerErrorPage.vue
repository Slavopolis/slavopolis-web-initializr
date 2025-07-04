<script setup lang="ts">
import type { ErrorPageEvents, ErrorPageFullConfig } from '@/types/error'
import { ErrorType } from '@/types/error'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorPage from './ErrorPage.vue'

// 路由信息
const route = useRoute()

// 错误配置
const errorConfig: Partial<ErrorPageFullConfig> = {
  type: ErrorType.SERVER_ERROR,
  code: '500',
  title: '服务器错误',
  description: '服务器出现了一些问题，请稍后重试。如果问题持续存在，请联系技术支持。',
  icon: 'server-error',
  showBackButton: true,
  showHomeButton: true,
  showRetryButton: true,
  showDetails: true,
  customActions: [
    {
      text: '联系支持',
      type: 'dashed',
      icon: 'help',
      handler: () => {
        console.info('User contacted support')
        // 这里可以跳转到支持页面或打开支持对话框
        // window.open('mailto:support@example.com')
      },
    },
  ],
  layout: {
    layout: 'centered',
    maxWidth: '600px',
    padding: '60px 20px',
    showBackgroundPattern: true,
    backgroundPattern: 'waves',
  },
  animation: {
    enabled: true,
    enterAnimation: 'fade',
    duration: 600,
    delay: 0,
  },
  theme: {
    primaryColor: 'var(--ant-error-color)',
    backgroundColor: 'var(--ant-body-background)',
    textColor: 'var(--ant-text-color)',
    borderColor: 'var(--ant-border-color-base)',
    shadow: 'var(--ant-shadow-2)',
  },
}

// 事件处理
const events: ErrorPageEvents = {
  onMounted: () => {
    // 记录500错误
    console.error('500 Server Error:', {
      path: route.fullPath,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    })

    // 可以在这里上报服务器错误
    // errorLogger.logServerError({ path: route.fullPath, error: route.query.error })
  },
  onBack: () => {
    console.info('User clicked back button on 500 page')
  },
  onHome: () => {
    console.info('User clicked home button on 500 page')
  },
  onRetry: () => {
    console.info('User clicked retry button on 500 page')
  },
}

// 从路由参数获取自定义消息
const customDescription = ref<string>('')
const customDetails = ref<string>('')
const errorId = ref<string>('')
const errorTime = ref<string>('')

onMounted(() => {
  // 从查询参数获取自定义描述
  if (route.query.message) {
    customDescription.value = route.query.message as string
  }

  // 从查询参数获取错误详情
  if (route.query.details) {
    customDetails.value = route.query.details as string
  }

  // 从查询参数获取错误ID
  if (route.query.errorId) {
    errorId.value = route.query.errorId as string
  }

  // 从查询参数获取错误时间
  if (route.query.errorTime) {
    errorTime.value = route.query.errorTime as string
  }
})

// 动态描述
const dynamicDescription = computed(() => {
  if (customDescription.value) {
    return customDescription.value
  }

  return errorConfig.description || '服务器出现了一些问题，请稍后重试。'
})

// 动态详情
const dynamicDetails = computed(() => {
  if (customDetails.value) {
    return customDetails.value
  }

  let details = ''
  if (errorId.value) {
    details += `错误ID: ${errorId.value}\n`
  }
  if (errorTime.value) {
    details += `错误时间: ${errorTime.value}\n`
  }
  if (route.fullPath) {
    details += `请求路径: ${route.fullPath}\n`
  }
  details += `时间戳: ${new Date().toISOString()}`

  return details || undefined
})
</script>

<template>
  <ErrorPage :type="ErrorType.SERVER_ERROR" :code="errorConfig.code" :title="errorConfig.title"
    :description="dynamicDescription" :details="dynamicDetails" :config="errorConfig" :events="events" />
</template>

<style scoped>
/* 500页面特定样式 */
:deep(.error-page__code) {
  background: linear-gradient(135deg, var(--ant-error-color), var(--ant-error-6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.error-page__card) {
  background: var(--ant-component-background);
  border: 1px solid var(--ant-error-color-deprecated-border);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.1);
}

/* 500页面动画增强 */
:deep(.error-page__icon) {
  animation: serverErrorShake 3s ease-in-out infinite;
}

@keyframes serverErrorShake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

/* 重试按钮样式 */
:deep(.action-button--refresh) {
  background: linear-gradient(135deg, var(--ant-error-color), var(--ant-error-6));
  border: none;
  color: #ffffff;
}

:deep(.action-button--refresh:hover) {
  background: linear-gradient(135deg, var(--ant-error-5), var(--ant-error-7));
}

/* 联系支持按钮样式 */
:deep(.action-button--dashed) {
  border-color: var(--ant-error-color);
  color: var(--ant-error-color);
}

:deep(.action-button--dashed:hover) {
  border-color: var(--ant-error-5);
  color: var(--ant-error-5);
  background: var(--ant-error-1);
}

/* 错误详情样式 */
:deep(.error-page__details-content) {
  background: var(--ant-error-1);
  border: 1px solid var(--ant-error-3);
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

:deep(.error-page__details-content pre) {
  color: var(--ant-error-7);
  font-size: 11px;
  line-height: 1.4;
}

/* 响应式优化 */
@media (max-width: 768px) {
  :deep(.error-page__code) {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  :deep(.error-page__code) {
    font-size: 2.5rem;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  :deep(.error-page__code) {
    background: linear-gradient(135deg, var(--ant-error-4), var(--ant-error-6));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  :deep(.error-page__card) {
    border-color: var(--ant-error-color-deprecated-border);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.08);
  }

  :deep(.error-page__details-content) {
    background: var(--ant-error-1);
    border-color: var(--ant-error-3);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  :deep(.error-page__icon) {
    animation: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  :deep(.error-page__card) {
    border-width: 2px;
  }

  :deep(.error-page__details-content) {
    border-width: 2px;
  }
}
</style>
