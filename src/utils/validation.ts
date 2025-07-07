// 手机号验证正则
export const PHONE_REGEX = /^1[3-9]\d{9}$/;

// 邮箱验证正则
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 密码验证正则（至少8位，包含数字和字母）
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// 验证码验证正则（6位数字）
export const VERIFY_CODE_REGEX = /^\d{6}$/;

// 验证手机号
export const validatePhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

// 验证邮箱
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

// 验证密码
export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

// 验证验证码
export const validateVerifyCode = (code: string): boolean => {
  return VERIFY_CODE_REGEX.test(code);
};

// 检查是否为手机号
export const isPhoneNumber = (value: string): boolean => {
  return validatePhone(value);
};

// 检查是否为邮箱
export const isEmail = (value: string): boolean => {
  return validateEmail(value);
};

// 获取账号类型
export const getAccountType = (
  account: string
): 'phone' | 'email' | 'invalid' => {
  if (isPhoneNumber(account)) return 'phone';
  if (isEmail(account)) return 'email';
  return 'invalid';
};

// 表单验证规则
export const validationRules = {
  // 账号验证（手机号或邮箱）
  account: [
    { required: true, message: '请输入手机号或邮箱' },
    {
      validator: (value: string) => {
        const type = getAccountType(value);
        if (type === 'invalid') {
          return Promise.reject('请输入正确的手机号或邮箱格式');
        }
        return Promise.resolve();
      },
    },
  ],

  // 手机号验证
  phone: [
    { required: true, message: '请输入手机号' },
    {
      validator: (value: string) => {
        if (!validatePhone(value)) {
          return Promise.reject('请输入正确的手机号格式');
        }
        return Promise.resolve();
      },
    },
  ],

  // 邮箱验证
  email: [
    { required: true, message: '请输入邮箱' },
    {
      validator: (value: string) => {
        if (!validateEmail(value)) {
          return Promise.reject('请输入正确的邮箱格式');
        }
        return Promise.resolve();
      },
    },
  ],

  // 密码验证
  password: [
    { required: true, message: '请输入密码' },
    {
      validator: (value: string) => {
        if (!validatePassword(value)) {
          return Promise.reject('密码至少8位，包含数字和字母');
        }
        return Promise.resolve();
      },
    },
  ],

  // 确认密码验证
  confirmPassword: (password: string) => [
    { required: true, message: '请确认密码' },
    {
      validator: (value: string) => {
        if (value !== password) {
          return Promise.reject('两次输入的密码不一致');
        }
        return Promise.resolve();
      },
    },
  ],

  // 验证码验证
  verifyCode: [
    { required: true, message: '请输入验证码' },
    {
      validator: (value: string) => {
        if (!validateVerifyCode(value)) {
          return Promise.reject('请输入6位数字验证码');
        }
        return Promise.resolve();
      },
    },
  ],

  // 用户名验证
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 2, message: '用户名至少2个字符' },
    { maxLength: 20, message: '用户名最多20个字符' },
  ],
};
