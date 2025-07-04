<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div id="app">
    <header class="app-header">
      <nav class="app-nav">
        <RouterLink to="/" class="nav-link">首页</RouterLink>
        <RouterLink to="/about" class="nav-link">关于</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--ant-component-background);
  border-bottom: 1px solid var(--ant-border-color-split);
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.app-nav {
  display: flex;
  align-items: center;
  height: 64px;
  gap: 24px;
}

.nav-link {
  color: var(--ant-text-color);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  background: var(--ant-primary-1);
  color: var(--ant-primary-color);
}

.nav-link.router-link-active {
  background: var(--ant-primary-1);
  color: var(--ant-primary-color);
}

.app-main {
  flex: 1;
  background: var(--ant-body-background);
  padding: 24px;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
  }

  .app-nav {
    height: 56px;
    gap: 16px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 14px;
  }

  .app-main {
    padding: 16px;
  }
}
</style>
