import { useState, useCallback, useEffect } from 'react';
import { Message } from '@arco-design/web-react';
import { VerifyCodeState } from '@/types/auth';
import { authService } from '@/services/authService';
import { getAccountType } from '@/utils/validation';

// 验证码hooks
export const useVerifyCode = () => {
  const [state, setState] = useState<VerifyCodeState>({
    loading: false,
    countdown: 0,
    sent: false,
  });

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.countdown > 0) {
      timer = setTimeout(() => {
        setState((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [state.countdown]);

  // 发送验证码
  const sendVerifyCode = useCallback(
    async (account: string, type: 'login' | 'register' | 'reset') => {
      // 验证账号格式
      const accountType = getAccountType(account);
      if (accountType === 'invalid') {
        Message.error('请输入正确的手机号或邮箱');
        return false;
      }

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await authService.sendVerifyCode({
          account,
          accountType,
          type,
        });

        if (response.status === 'ok') {
          Message.success('验证码发送成功');
          setState((prev) => ({
            ...prev,
            loading: false,
            countdown: 60,
            sent: true,
          }));
          return true;
        } else {
          Message.error(response.msg || '验证码发送失败');
          setState((prev) => ({ ...prev, loading: false }));
          return false;
        }
      } catch (err) {
        Message.error('验证码发送失败，请检查网络连接');
        setState((prev) => ({ ...prev, loading: false }));
        return false;
      }
    },
    []
  );

  // 重置状态
  const resetState = useCallback(() => {
    setState({
      loading: false,
      countdown: 0,
      sent: false,
    });
  }, []);

  // 验证验证码
  const verifyCode = useCallback(async (account: string, code: string) => {
    const accountType = getAccountType(account);
    if (accountType === 'invalid') {
      return false;
    }

    try {
      const response = await authService.verifyCode({
        account,
        accountType,
        code,
      });

      return response.status === 'ok';
    } catch (err) {
      return false;
    }
  }, []);

  return {
    ...state,
    sendVerifyCode,
    resetState,
    verifyCode,
  };
};
