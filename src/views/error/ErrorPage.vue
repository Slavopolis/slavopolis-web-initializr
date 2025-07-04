<script setup lang="ts">
import ActionButton from '@/components/common/ActionButton.vue'
import ErrorIcon from '@/components/common/ErrorIcon.vue'
import ErrorLayout from '@/components/common/ErrorLayout.vue'
import type {
  ErrorAction,
  ErrorPageConfig,
  ErrorPageEvents,
  ErrorPageFullConfig,
  ErrorType
} from '@/types/error'
import { ERROR_CONFIGS } from '@/types/error'
import { Card, Collapse, CollapsePanel, Divider, Space } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  /** 错误类型 */
  type?: ErrorType
  /** 错误代码 */
  code?: string
  /** 错误标题 */
  title?: string
  /** 错误描述 */
  description?: string
  /** 错误详情 */
  details?: string
  /** 自定义配置 */
  config?: Partial<ErrorPageFullConfig>
  /** 事件处理器 */
  events?: ErrorPageEvents
}

const props = withDefaults(defineProps<Props>(), {
  type: 'GENERIC' as ErrorType,
  code: '',
  title: '',
  description: '',
  details: '',
})

const router = useRouter()
const route = useRoute()

// 组件状态
const showDetails = ref(false)
const isRetrying = ref(false)
const activeKeys = ref<string[]>([])

// 获取完整的错误配置
const errorConfig = computed((): ErrorPageConfig => {
  // 优先使用 props 中的值
  if (props.title || props.description) {
    return {
      type: props.type,
      code: props.code || props.type,
      title: props.title || '出现了错误',
      description: props.description || '抱歉，发生了未知错误。',
      icon: props.config?.icon,
      showBackButton: props.config?.showBackButton ?? true,
      showHomeButton: props.config?.showHomeButton ?? true,
      showRetryButton: props.config?.showRetryButton ?? false,
      customActions: props.config?.customActions,
      showDetails: props.config?.showDetails ?? !!props.details,
      details: props.details,
    }
  }

  // 从预定义配置中获取
  const baseConfig = ERROR_CONFIGS[props.type] || ERROR_CONFIGS.GENERIC

  // 合并自定义配置
  return {
    ...baseConfig,
    code: props.code || route.query.code as string || baseConfig.code,
    title: route.query.title as string || baseConfig.title,
    description: route.query.description as string || baseConfig.description,
    details: props.details || route.query.details as string,
    ...props.config,
  }
})

// 布局配置
const layoutConfig = computed(() => ({
  layout: 'centered' as const,
  maxWidth: '600px',
  padding: '40px 20px',
  showBackgroundPattern: true,
  backgroundPattern: 'dots' as const,
  ...props.config?.layout,
}))

// 动画配置
const animationConfig = computed(() => ({
  enabled: true,
  enterAnimation: 'fade' as const,
  duration: 600,
  delay: 100,
  ...props.config?.animation,
}))

// 操作按钮列表
const actionButtons = computed((): ErrorAction[] => {
  const buttons: ErrorAction[] = []

  // 返回按钮
  if (errorConfig.value.showBackButton) {
    buttons.push({
      text: '返回',
      type: 'default',
      icon: 'back',
      handler: handleBack,
    })
  }

  // 首页按钮
  if (errorConfig.value.showHomeButton) {
    buttons.push({
      text: '回到首页',
      type: 'primary',
      icon: 'home',
      handler: handleHome,
    })
  }

  // 重试按钮
  if (errorConfig.value.showRetryButton) {
    buttons.push({
      text: '重试',
      type: 'default',
      icon: 'refresh',
      handler: handleRetry,
      loading: isRetrying.value,
    })
  }

  // 自定义操作按钮
  if (errorConfig.value.customActions) {
    buttons.push(...errorConfig.value.customActions)
  }

  return buttons
})

// 处理返回操作
async function handleBack() {
  if (props.events?.onBack) {
    props.events.onBack()
    return
  }

  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// 处理回到首页
async function handleHome() {
  if (props.events?.onHome) {
    props.events.onHome()
    return
  }

  router.push('/')
}

// 处理重试操作
async function handleRetry() {
  if (props.events?.onRetry) {
    props.events.onRetry()
    return
  }

  isRetrying.value = true
  try {
    // 延迟一段时间模拟重试过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 重新加载当前页面
    window.location.reload()
  } finally {
    isRetrying.value = false
  }
}

// 切换详情显示
function toggleDetails() {
  showDetails.value = !showDetails.value
  activeKeys.value = showDetails.value ? ['details'] : []
  if (props.events?.onToggleDetails) {
    props.events.onToggleDetails(showDetails.value)
  }
}

// 组件挂载时的处理
onMounted(() => {
  if (props.events?.onMounted) {
    props.events.onMounted()
  }

  // 设置页面标题
  if (typeof document !== 'undefined') {
    document.title = `${errorConfig.value.title} - Slavopolis`
  }
})
</script>

<template>
  <ErrorLayout :config="layoutConfig" :show-pattern="layoutConfig.showBackgroundPattern"
    :pattern="layoutConfig.backgroundPattern" :max-width="layoutConfig.maxWidth" :padding="layoutConfig.padding">
    <div class="error-page">
      <!-- 错误卡片 -->
      <Card class="error-page__card" :bordered="false" :body-style="{ padding: '60px 40px' }">
        <!-- 错误图标 -->
        <div class="error-page__icon">
          <ErrorIcon :name="errorConfig.icon || 'generic-error'" :size="120" :animated="animationConfig.enabled" />
        </div>

        <!-- 错误代码 -->
        <div class="error-page__code">
          {{ errorConfig.code }}
        </div>

        <!-- 错误标题 -->
        <h1 class="error-page__title">
          {{ errorConfig.title }}
        </h1>

        <!-- 错误描述 -->
        <p class="error-page__description">
          {{ errorConfig.description }}
        </p>

        <!-- 操作按钮 -->
        <div class="error-page__actions">
          <Space :size="16" wrap>
            <ActionButton v-for="(action, index) in actionButtons" :key="index" :text="action.text" :type="action.type"
              :icon="action.icon" :loading="action.loading" :disabled="action.disabled" :action="action"
              class="error-page__action-button" />
          </Space>
        </div>

        <!-- 错误详情 -->
        <div v-if="errorConfig.showDetails && errorConfig.details" class="error-page__details">
          <Divider />

          <Collapse v-model:activeKey="activeKeys">
            <CollapsePanel key="details" header="错误详情" @click="toggleDetails">
              <div class="error-page__details-content">
                <pre>{{ errorConfig.details }}</pre>
              </div>
            </CollapsePanel>
          </Collapse>
        </div>
      </Card>

      <!-- 帮助信息 -->
      <div class="error-page__help">
        <p class="error-page__help-text">
          如果问题持续存在，请联系技术支持
        </p>
      </div>
    </div>
  </ErrorLayout>
</template>

<style scoped>
.error-page {
  max-width: 100%;
  width: 100%;
  animation: errorPageFadeIn 0.6s ease-out;
}

.error-page__card {
  background: var(--ant-component-background);
  border-radius: 16px;
  box-shadow: var(--ant-shadow-2);
  margin-bottom: 32px;
  border: 1px solid var(--ant-border-color-split);
}

.error-page__icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.error-page__code {
  text-align: center;
  font-size: 48px;
  font-weight: 700;
  color: var(--ant-text-color-tertiary);
  margin-bottom: 16px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.error-page__title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: var(--ant-text-color);
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.error-page__description {
  text-align: center;
  font-size: 1.1rem;
  color: var(--ant-text-color-secondary);
  margin: 0 0 32px 0;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.error-page__actions {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.error-page__action-button {
  min-width: 120px;
}

.error-page__details {
  margin-top: 24px;
}

.error-page__details-content {
  background: var(--ant-background-color-light);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--ant-border-color-split);
}

.error-page__details-content pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ant-text-color-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.error-page__help {
  text-align: center;
  opacity: 0.8;
}

.error-page__help-text {
  font-size: 14px;
  color: var(--ant-text-color-tertiary);
  margin: 0;
}

/* 入场动画 */
@keyframes errorPageFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-page__card :deep(.ant-card-body) {
    padding: 40px 24px;
  }

  .error-page__code {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .error-page__title {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  .error-page__description {
    font-size: 1rem;
    margin-bottom: 24px;
  }

  .error-page__action-button {
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .error-page__card :deep(.ant-card-body) {
    padding: 32px 20px;
  }

  .error-page__code {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .error-page__title {
    font-size: 1.25rem;
    margin-bottom: 8px;
  }

  .error-page__description {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  .error-page__actions :deep(.ant-space) {
    flex-direction: column;
    width: 100%;
  }

  .error-page__action-button {
    width: 100%;
    min-width: auto;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .error-page__card {
    background: var(--ant-component-background);
    border-color: var(--ant-border-color-split);
  }

  .error-page__details-content {
    background: var(--ant-background-color-base);
    border-color: var(--ant-border-color-split);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .error-page__card {
    border-width: 2px;
    border-color: var(--ant-border-color-base);
  }

  .error-page__code {
    font-weight: 800;
  }

  .error-page__title {
    font-weight: 700;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .error-page {
    animation: none;
  }
}

/* 打印样式 */
@media print {
  .error-page__actions {
    display: none;
  }

  .error-page__details {
    page-break-inside: avoid;
  }

  .error-page__card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>