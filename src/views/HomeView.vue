<script setup lang="ts">
// 主页组件
</script>

<template>
  <div class="home-view">
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎使用 Slavopolis Cloud Initializr</h1>
      <p class="welcome-description">
        一个现代化的云端项目初始化工具，帮助您快速搭建高质量的应用程序。
      </p>
    </div>

    <div class="features-section">
      <div class="feature-card">
        <h3>快速开始</h3>
        <p>几分钟内即可生成完整的项目结构</p>
      </div>
      <div class="feature-card">
        <h3>现代化技术栈</h3>
        <p>基于最新的前端技术构建</p>
      </div>
      <div class="feature-card">
        <h3>高度可定制</h3>
        <p>根据您的需求定制项目配置</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

.welcome-title {
  font-size: 2.5rem;
  color: var(--ant-text-color);
  margin-bottom: 20px;
  font-weight: 700;
}

.welcome-description {
  font-size: 1.2rem;
  color: var(--ant-text-color-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.feature-card {
  background: var(--ant-component-background);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--ant-border-color-split);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.feature-card h3 {
  color: var(--ant-text-color);
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-card p {
  color: var(--ant-text-color-secondary);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .home-view {
    padding: 20px 16px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-description {
    font-size: 1rem;
  }

  .features-section {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 40px;
  }

  .feature-card {
    padding: 20px;
  }
}
</style>
