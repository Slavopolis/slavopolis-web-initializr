import { useState, useCallback } from 'react';
import { Message } from '@arco-design/web-react';
import {
  LoginFormData,
  RegisterFormData,
  ForgotFormData,
  AuthResponse,
} from '@/types/auth';
import { authService } from '@/services/authService';
import useStorage from '@/utils/useStorage';

// 认证hooks
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage('loginParams');

  // 登录成功后的处理
  const afterLoginSuccess = useCallback(
    (params: LoginFormData) => {
      // 记住密码
      if (params.rememberMe) {
        setLoginParams(JSON.stringify(params));
      } else {
        removeLoginParams();
      }
      // 记录登录状态
      localStorage.setItem('userStatus', 'login');
      // 跳转首页
      window.location.href = '/';
    },
    [setLoginParams, removeLoginParams]
  );

  // 登录
  const login = useCallback(
    async (formData: LoginFormData) => {
      setLoading(true);
      setError('');

      try {
        const response = await authService.login(formData);

        if (response.status === 'ok') {
          Message.success('登录成功');
          afterLoginSuccess(formData);
        } else {
          setError(response.msg || '登录失败，请重试');
        }
      } catch (err) {
        setError('登录失败，请检查网络连接');
      } finally {
        setLoading(false);
      }
    },
    [afterLoginSuccess]
  );

  // 注册
  const register = useCallback(async (formData: RegisterFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);

      if (response.status === 'ok') {
        Message.success('注册成功，请登录');
        return true;
      } else {
        setError(response.msg || '注册失败，请重试');
        return false;
      }
    } catch (err) {
      setError('注册失败，请检查网络连接');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 忘记密码
  const resetPassword = useCallback(async (formData: ForgotFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword(formData);

      if (response.status === 'ok') {
        Message.success('密码重置成功，请登录');
        return true;
      } else {
        setError(response.msg || '密码重置失败，请重试');
        return false;
      }
    } catch (err) {
      setError('密码重置失败，请检查网络连接');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取保存的登录参数
  const getSavedLoginParams = useCallback(() => {
    if (loginParams) {
      try {
        return JSON.parse(loginParams);
      } catch {
        return null;
      }
    }
    return null;
  }, [loginParams]);

  return {
    loading,
    error,
    login,
    register,
    resetPassword,
    getSavedLoginParams,
    setError,
  };
};
