// 登录方式枚举
export enum LoginType {
  PHONE_PASSWORD = 'phone_password',
  PHONE_CODE = 'phone_code',
  EMAIL_PASSWORD = 'email_password',
  EMAIL_CODE = 'email_code',
}

// 页面状态枚举
export enum PageType {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT = 'forgot',
}

// 登录表单数据接口
export interface LoginFormData {
  account: string; // 手机号或邮箱
  password?: string;
  verifyCode?: string;
  rememberMe?: boolean;
}

// 注册表单数据接口
export interface RegisterFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  verifyCode: string;
  agreeTerms: boolean;
}

// 忘记密码表单数据接口
export interface ForgotFormData {
  account: string; // 手机号或邮箱
  verifyCode: string;
  newPassword: string;
  confirmPassword: string;
}

// 验证码状态接口
export interface VerifyCodeState {
  loading: boolean;
  countdown: number;
  sent: boolean;
}

// API响应接口
export interface AuthResponse {
  status: 'ok' | 'error';
  msg?: string;
  data?: any;
}

// 用户信息接口
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
}
