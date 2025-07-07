import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Link,
} from '@arco-design/web-react';
import {
  IconLock,
  IconPhone,
  IconEmail,
  IconSafe,
} from '@arco-design/web-react/icon';
import { LoginType, LoginFormData } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { useVerifyCode } from '@/hooks/useVerifyCode';
import { validationRules, getAccountType } from '@/utils/validation';
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import styles from '../style/index.module.less';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

export default function LoginForm({
  onSwitchToRegister,
  onSwitchToForgot,
}: LoginFormProps) {
  const [form] = Form.useForm<LoginFormData>();
  const [loginType, setLoginType] = useState<LoginType>(
    LoginType.PHONE_PASSWORD
  );
  const [rememberMe, setRememberMe] = useState(false);

  const t = useLocale(locale);
  const { loading, error, login, getSavedLoginParams, setError } = useAuth();
  const verifyCode = useVerifyCode();

  // 获取保存的登录参数
  useEffect(() => {
    const savedParams = getSavedLoginParams();
    if (savedParams) {
      form.setFieldsValue(savedParams);
      setRememberMe(!!savedParams.rememberMe);
    }
  }, [form, getSavedLoginParams]);

  // 处理登录类型切换
  const handleLoginTypeChange = (type: LoginType) => {
    setLoginType(type);
    form.resetFields(['password', 'verifyCode']);
    setError('');
  };

  // 发送验证码
  const handleSendVerifyCode = async () => {
    try {
      const account = form.getFieldValue('account') as string;
      if (!account) {
        return;
      }

      await verifyCode.sendVerifyCode(account, 'login');
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  // 提交登录
  const handleSubmit = async () => {
    try {
      const values = await form.validate();

      const formData: LoginFormData = {
        account: values.account,
        password: values.password,
        verifyCode: values.verifyCode,
        rememberMe,
      };

      await login(formData);
    } catch (err) {
      // 表单验证错误
    }
  };

  // 登录方式选项
  const loginTypeOptions = [
    { key: LoginType.PHONE_PASSWORD, label: '手机号' },
    { key: LoginType.PHONE_CODE, label: '验证码' },
    { key: LoginType.EMAIL_PASSWORD, label: '邮箱' },
    { key: LoginType.EMAIL_CODE, label: '邮箱验证码' },
  ];

  // 获取当前登录方式的表单字段
  const renderLoginFields = () => {
    const account = (form.getFieldValue('account') || '') as string;
    const accountType = getAccountType(account);
    const isPasswordType = loginType.includes('password');
    const isEmailType = loginType.includes('email');

    return (
      <>
        <Form.Item field="account" rules={validationRules.account}>
          <Input
            prefix={isEmailType ? <IconEmail /> : <IconPhone />}
            placeholder={
              isEmailType
                ? t['login.form.email.placeholder']
                : t['login.form.phone.placeholder']
            }
            size="large"
          />
        </Form.Item>

        {isPasswordType ? (
          <Form.Item field="password" rules={validationRules.password}>
            <Input.Password
              prefix={<IconLock />}
              placeholder={t['login.form.password.placeholder']}
              size="large"
            />
          </Form.Item>
        ) : (
          <Form.Item field="verifyCode" rules={validationRules.verifyCode}>
            <Input
              prefix={<IconSafe />}
              placeholder={t['login.form.verifyCode.placeholder']}
              size="large"
              suffix={
                <Button
                  type="text"
                  size="small"
                  className={styles['verify-code-button']}
                  loading={verifyCode.loading}
                  disabled={verifyCode.countdown > 0}
                  onClick={handleSendVerifyCode}
                >
                  {verifyCode.countdown > 0
                    ? t['verifyCode.countdown'].replace(
                        '{count}',
                        verifyCode.countdown.toString()
                      )
                    : verifyCode.sent
                    ? t['verifyCode.resend']
                    : t['verifyCode.send']}
                </Button>
              }
            />
          </Form.Item>
        )}
      </>
    );
  };

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{t['page.login.title']}</div>
      <div className={styles['login-form-subtitle']}>
        {t['page.login.subtitle']}
      </div>

      {/* 登录方式切换 */}
      <div className={styles['login-type-switcher']}>
        {loginTypeOptions.map((option) => (
          <div
            key={option.key}
            className={`${styles['switch-item']} ${
              loginType === option.key ? styles.active : ''
            }`}
            onClick={() => handleLoginTypeChange(option.key)}
          >
            {option.label}
          </div>
        ))}
      </div>

      {/* 登录表单 */}
      <Form form={form} layout="vertical" onSubmit={handleSubmit}>
        {renderLoginFields()}

        {/* 记住密码和忘记密码 */}
        <div className={styles['login-form-actions']}>
          <Checkbox checked={rememberMe} onChange={setRememberMe}>
            {t['login.form.rememberPassword']}
          </Checkbox>
          <Link onClick={onSwitchToForgot}>
            {t['login.form.forgetPassword']}
          </Link>
        </div>

        {/* 错误信息 */}
        {error && <div className={styles['login-form-error']}>{error}</div>}

        {/* 登录按钮 */}
        <Button
          type="primary"
          size="large"
          long
          loading={loading}
          onClick={handleSubmit}
        >
          {t['login.form.login']}
        </Button>

        {/* 注册链接 */}
        <div className={styles['login-form-register']}>
          <Typography.Text type="secondary">
            {t['login.form.noAccount']}
          </Typography.Text>
          <Link onClick={onSwitchToRegister}>{t['login.form.register']}</Link>
        </div>
      </Form>
    </div>
  );
}
