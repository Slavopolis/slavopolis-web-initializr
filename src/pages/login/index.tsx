import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/store';
import Footer from '@/components/Footer';
import Logo from '@/assets/logo.svg';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotForm from './components/ForgotForm';
import LoginBanner from './banner';
import { PageType } from '@/types/auth';
import styles from './style/index.module.less';

function Login() {
  const [pageType, setPageType] = useState<PageType>(PageType.LOGIN);
  const settings = useSelector((state: GlobalState) => state.settings);

  useEffect(() => {
    document.body.setAttribute('arco-theme', 'light');
  }, []);

  // 切换到注册页面
  const handleSwitchToRegister = () => {
    setPageType(PageType.REGISTER);
  };

  // 切换到忘记密码页面
  const handleSwitchToForgot = () => {
    setPageType(PageType.FORGOT);
  };

  // 切换到登录页面
  const handleSwitchToLogin = () => {
    setPageType(PageType.LOGIN);
  };

  // 渲染当前页面的表单
  const renderCurrentForm = () => {
    switch (pageType) {
      case PageType.REGISTER:
        return <RegisterForm onSwitchToLogin={handleSwitchToLogin} />;
      case PageType.FORGOT:
        return <ForgotForm onSwitchToLogin={handleSwitchToLogin} />;
      case PageType.LOGIN:
      default:
        return (
          <LoginForm
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToForgot={handleSwitchToForgot}
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      {/* 系统Logo */}
      <div className={styles.logo}>
        <Logo />
        <div className={styles['logo-text']}>{settings.systemName}</div>
      </div>

      {/* 左侧Banner */}
      <div className={styles.left}>
        <LoginBanner />
      </div>

      {/* 右侧登录表单 */}
      <div className={styles.right}>
        <div className={styles.content}>
          <div className={styles['content-inner']}>{renderCurrentForm()}</div>
        </div>

        {/* 页脚 */}
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Login;
