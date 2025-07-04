<script setup lang="ts">
import type { ErrorAction } from '@/types/error'
import { Button } from 'ant-design-vue'
import { computed, ref } from 'vue'

interface Props {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  /** 按钮大小 */
  size?: 'large' | 'middle' | 'small'
  /** 按钮图标 */
  icon?: string
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否危险按钮 */
  danger?: boolean
  /** 是否为块级按钮 */
  block?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 错误操作配置 */
  action?: ErrorAction
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'large',
  loading: false,
  disabled: false,
  danger: false,
  block: false,
  className: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 按钮加载状态
const isLoading = ref(false)

// 计算按钮属性
const buttonProps = computed(() => ({
  type: props.action?.type || props.type,
  size: props.size,
  loading: isLoading.value || props.action?.loading || props.loading,
  disabled: props.action?.disabled || props.disabled,
  danger: props.danger,
  block: props.block,
}))

// 计算按钮文本
const buttonText = computed(() => {
  return props.action?.text || props.text
})

// 计算按钮图标
const buttonIcon = computed(() => {
  return props.action?.icon || props.icon
})

// 计算样式类名
const buttonClasses = computed(() => {
  const classes = ['action-button']

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})

// 处理点击事件
async function handleClick(event: MouseEvent) {
  try {
    isLoading.value = true

    // 执行自定义处理函数
    if (props.action?.handler) {
      await props.action.handler()
    }

    // 触发组件事件
    emit('click', event)
  } catch (error) {
    console.error('Action button handler error:', error)
  } finally {
    isLoading.value = false
  }
}

// 图标组件映射
const iconComponents = {
  home: 'HomeOutlined',
  back: 'ArrowLeftOutlined',
  refresh: 'ReloadOutlined',
  search: 'SearchOutlined',
  setting: 'SettingOutlined',
  help: 'QuestionCircleOutlined',
}

// 获取图标组件名
const getIconComponent = (iconName?: string) => {
  if (!iconName) return undefined
  return iconComponents[iconName as keyof typeof iconComponents] || iconName
}
</script>

<template>
  <Button v-bind="buttonProps" :class="buttonClasses" @click="handleClick">
    <!-- 图标 -->
    <template v-if="buttonIcon" #icon>
      <component :is="getIconComponent(buttonIcon)" v-if="getIconComponent(buttonIcon)" />
      <span v-else class="action-button__custom-icon">{{ buttonIcon }}</span>
    </template>

    <!-- 按钮文本 -->
    <span class="action-button__text">{{ buttonText }}</span>
  </Button>
</template>

<style scoped>
.action-button {
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 100px;
  height: 44px;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-button__text {
  font-size: 14px;
  line-height: 1.5;
}

.action-button__custom-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 按钮类型样式优化 */
.action-button:where(.ant-btn-primary) {
  background: linear-gradient(135deg, var(--ant-primary-color), var(--ant-primary-6));
  border: none;
  color: #ffffff;
}

.action-button:where(.ant-btn-primary):hover {
  background: linear-gradient(135deg, var(--ant-primary-5), var(--ant-primary-7));
}

.action-button:where(.ant-btn-default) {
  background: var(--ant-component-background);
  border: 1px solid var(--ant-border-color-base);
  color: var(--ant-text-color);
}

.action-button:where(.ant-btn-default):hover {
  border-color: var(--ant-primary-color);
  color: var(--ant-primary-color);
}

.action-button:where(.ant-btn-dashed) {
  background: transparent;
  border: 1px dashed var(--ant-border-color-base);
  color: var(--ant-text-color);
}

.action-button:where(.ant-btn-dashed):hover {
  border-color: var(--ant-primary-color);
  color: var(--ant-primary-color);
}

.action-button:where(.ant-btn-text) {
  background: transparent;
  border: none;
  color: var(--ant-text-color);
  box-shadow: none;
}

.action-button:where(.ant-btn-text):hover {
  background: var(--ant-background-color-light);
  color: var(--ant-primary-color);
}

.action-button:where(.ant-btn-link) {
  background: transparent;
  border: none;
  color: var(--ant-primary-color);
  box-shadow: none;
  text-decoration: none;
}

.action-button:where(.ant-btn-link):hover {
  color: var(--ant-primary-5);
  text-decoration: underline;
}

/* 加载状态 */
.action-button:where(.ant-btn-loading) {
  cursor: not-allowed;
  pointer-events: auto;
}

/* 禁用状态 */
.action-button:where(.ant-btn):disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 危险按钮 */
.action-button:where(.ant-btn-dangerous) {
  background: linear-gradient(135deg, var(--ant-error-color), var(--ant-error-6));
  border: none;
  color: #ffffff;
}

.action-button:where(.ant-btn-dangerous):hover {
  background: linear-gradient(135deg, var(--ant-error-5), var(--ant-error-7));
}

/* 块级按钮 */
.action-button:where(.ant-btn-block) {
  width: 100%;
  min-width: auto;
}

/* 按钮大小 */
.action-button:where(.ant-btn-lg) {
  height: 48px;
  font-size: 16px;
  padding: 0 24px;
  min-width: 120px;
}

.action-button:where(.ant-btn-sm) {
  height: 32px;
  font-size: 12px;
  padding: 0 12px;
  min-width: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-button {
    min-width: 80px;
    height: 40px;
    font-size: 13px;
  }

  .action-button:where(.ant-btn-lg) {
    height: 44px;
    font-size: 14px;
    min-width: 100px;
  }

  .action-button:where(.ant-btn-sm) {
    height: 28px;
    font-size: 11px;
    min-width: 60px;
  }
}

@media (max-width: 480px) {
  .action-button {
    min-width: 70px;
    height: 36px;
    font-size: 12px;
  }

  .action-button:where(.ant-btn-lg) {
    height: 40px;
    font-size: 13px;
    min-width: 90px;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .action-button:where(.ant-btn-default) {
    border-color: var(--ant-border-color-base);
  }

  .action-button:where(.ant-btn-text) {
    color: var(--ant-text-color);
  }

  .action-button:where(.ant-btn-text):hover {
    background: var(--ant-background-color-base);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .action-button {
    border-width: 2px;
    font-weight: 600;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .action-button {
    transition: none;
  }

  .action-button:hover,
  .action-button:active {
    transform: none;
  }
}

/* 焦点状态 */
.action-button:focus-visible {
  outline: 2px solid var(--ant-primary-color);
  outline-offset: 2px;
  z-index: 1;
}

/* 按钮组合样式 */
.action-button+.action-button {
  margin-left: 12px;
}

@media (max-width: 480px) {
  .action-button+.action-button {
    margin-left: 8px;
  }
}

/* 特殊用途按钮样式 */
.action-button--home {
  background: linear-gradient(135deg, var(--ant-success-color), var(--ant-success-6));
  border: none;
  color: #ffffff;
}

.action-button--home:hover {
  background: linear-gradient(135deg, var(--ant-success-5), var(--ant-success-7));
}

.action-button--back {
  background: var(--ant-component-background);
  border: 1px solid var(--ant-border-color-base);
  color: var(--ant-text-color-secondary);
}

.action-button--back:hover {
  border-color: var(--ant-primary-color);
  color: var(--ant-primary-color);
}

.action-button--retry {
  background: linear-gradient(135deg, var(--ant-warning-color), var(--ant-warning-6));
  border: none;
  color: #ffffff;
}

.action-button--retry:hover {
  background: linear-gradient(135deg, var(--ant-warning-5), var(--ant-warning-7));
}
</style>
