import axios from 'axios';
import {
  LoginFormData,
  RegisterFormData,
  ForgotFormData,
  AuthResponse,
} from '@/types/auth';

// 认证服务类
class AuthService {
  // 登录
  async login(formData: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/user/login', {
        account: formData.account,
        password: formData.password,
        verifyCode: formData.verifyCode,
        loginType: this.getLoginType(formData),
      });

      return response.data;
    } catch (error) {
      return {
        status: 'error',
        msg: '网络请求失败',
      };
    }
  }

  // 注册
  async register(formData: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/user/register', formData);
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        msg: '网络请求失败',
      };
    }
  }

  // 重置密码
  async resetPassword(formData: ForgotFormData): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/user/reset-password', formData);
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        msg: '网络请求失败',
      };
    }
  }

  // 发送验证码
  async sendVerifyCode(params: {
    account: string;
    accountType: 'phone' | 'email';
    type: 'login' | 'register' | 'reset';
  }): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/user/send-verify-code', params);
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        msg: '网络请求失败',
      };
    }
  }

  // 验证验证码
  async verifyCode(params: {
    account: string;
    accountType: 'phone' | 'email';
    code: string;
  }): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/user/verify-code', params);
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        msg: '网络请求失败',
      };
    }
  }

  // 获取登录类型
  private getLoginType(formData: LoginFormData): string {
    const isPhone = /^1[3-9]\d{9}$/.test(formData.account);
    const hasPassword = !!formData.password;

    if (isPhone) {
      return hasPassword ? 'phone_password' : 'phone_code';
    } else {
      return hasPassword ? 'email_password' : 'email_code';
    }
  }
}

// 导出单例实例
export const authService = new AuthService();
