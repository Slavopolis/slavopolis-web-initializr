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
  type: ErrorType.FORBIDDEN,
  code: '403',
  title: '权限不足',
  description: '抱歉，您没有权限访问此页面。请联系管理员获取相应权限。',
  icon: 'forbidden',
  showBackButton: true,
  showHomeButton: true,
  showRetryButton: false,
  showDetails: false,
  customActions: [
    {
      text: '申请权限',
      type: 'dashed',
      icon: 'help',
      handler: () => {
        console.info('User requested permission')
        // 这里可以跳转到权限申请页面或打开申请对话框
        // router.push('/permissions/request')
      },
    },
  ],
  layout: {
    layout: 'centered',
    maxWidth: '600px',
    padding: '60px 20px',
    showBackgroundPattern: true,
    backgroundPattern: 'grid',
  },
  animation: {
    enabled: true,
    enterAnimation: 'fade',
    duration: 600,
    delay: 0,
  },
  theme: {
    primaryColor: 'var(--ant-warning-color)',
    backgroundColor: 'var(--ant-body-background)',
    textColor: 'var(--ant-text-color)',
    borderColor: 'var(--ant-border-color-base)',
    shadow: 'var(--ant-shadow-2)',
  },
}

// 事件处理
const events: ErrorPageEvents = {
  onMounted: () => {
    // 记录403错误
    console.warn('403 Forbidden Access:', {
      path: route.fullPath,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    })

    // 可以在这里上报安全事件
    // securityLogger.logUnauthorizedAccess({ path: route.fullPath })
  },
  onBack: () => {
    console.info('User clicked back button on 403 page')
  },
  onHome: () => {
    console.info('User clicked home button on 403 page')
  },
}

// 从路由参数获取自定义消息
const customDescription = ref<string>('')
const customDetails = ref<string>('')
const requiredPermission = ref<string>('')

onMounted(() => {
  // 从查询参数获取自定义描述
  if (route.query.message) {
    customDescription.value = route.query.message as string
  }

  // 从查询参数获取错误详情
  if (route.query.details) {
    customDetails.value = route.query.details as string
  }

  // 从查询参数获取所需权限
  if (route.query.permission) {
    requiredPermission.value = route.query.permission as string
  }
})

// 动态描述
const dynamicDescription = computed(() => {
  if (customDescription.value) {
    return customDescription.value
  }

  if (requiredPermission.value) {
    return `访问此页面需要 "${requiredPermission.value}" 权限。请联系管理员获取相应权限。`
  }

  return errorConfig.description || '抱歉，您没有权限访问此页面。'
})
</script>

<template>
  <ErrorPage :type="ErrorType.FORBIDDEN" :code="errorConfig.code" :title="errorConfig.title"
    :description="dynamicDescription" :details="customDetails" :config="errorConfig" :events="events" />
</template>

<style scoped>
/* 403页面特定样式 */
:deep(.error-page__code) {
  background: linear-gradient(135deg, var(--ant-warning-color), var(--ant-warning-6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.error-page__card) {
  background: var(--ant-component-background);
  border: 1px solid var(--ant-warning-color-deprecated-border);
  box-shadow: 0 4px 12px rgba(250, 173, 20, 0.1);
}

/* 403页面动画增强 */
:deep(.error-page__icon) {
  animation: forbiddenPulse 2s ease-in-out infinite;
}

@keyframes forbiddenPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }

  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* 权限申请按钮样式 */
:deep(.action-button--dashed) {
  border-color: var(--ant-warning-color);
  color: var(--ant-warning-color);
}

:deep(.action-button--dashed:hover) {
  border-color: var(--ant-warning-5);
  color: var(--ant-warning-5);
  background: var(--ant-warning-1);
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
    background: linear-gradient(135deg, var(--ant-warning-4), var(--ant-warning-6));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  :deep(.error-page__card) {
    border-color: var(--ant-warning-color-deprecated-border);
    box-shadow: 0 4px 12px rgba(250, 173, 20, 0.08);
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
}
</style>
