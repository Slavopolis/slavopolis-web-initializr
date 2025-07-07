import React from 'react';
import { Form, Input, Button, Typography, Link } from '@arco-design/web-react';
import {
  IconLock,
  IconSafe,
  IconEmail,
  IconPhone,
} from '@arco-design/web-react/icon';
import { ForgotFormData } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { useVerifyCode } from '@/hooks/useVerifyCode';
import { validationRules, getAccountType } from '@/utils/validation';
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import styles from '../style/index.module.less';

interface ForgotFormProps {
  onSwitchToLogin: () => void;
}

export default function ForgotForm({ onSwitchToLogin }: ForgotFormProps) {
  const [form] = Form.useForm<ForgotFormData>();

  const t = useLocale(locale);
  const { loading, error, resetPassword } = useAuth();
  const verifyCode = useVerifyCode();

  // 发送验证码
  const handleSendVerifyCode = async () => {
    try {
      const account = form.getFieldValue('account') as string;
      if (!account) {
        return;
      }

      await verifyCode.sendVerifyCode(account, 'reset');
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  // 提交重置密码
  const handleSubmit = async () => {
    try {
      const values = await form.validate();

      const formData: ForgotFormData = {
        account: values.account,
        verifyCode: values.verifyCode,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      const success = await resetPassword(formData);
      if (success) {
        onSwitchToLogin();
      }
    } catch (err) {
      // 表单验证错误
    }
  };

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{t['page.forgot.title']}</div>
      <div className={styles['login-form-subtitle']}>
        {t['page.forgot.subtitle']}
      </div>

      {/* 重置密码表单 */}
      <Form
        form={form}
        layout="vertical"
        onSubmit={handleSubmit}
        style={{ marginTop: '32px' }}
      >
        <Form.Item field="account" rules={validationRules.account}>
          <Input
            prefix={
              getAccountType(
                (form.getFieldValue('account') as string) || ''
              ) === 'phone' ? (
                <IconPhone />
              ) : (
                <IconEmail />
              )
            }
            placeholder={t['forgot.form.account.placeholder']}
            size="large"
          />
        </Form.Item>

        <Form.Item field="verifyCode" rules={validationRules.verifyCode}>
          <Input
            prefix={<IconSafe />}
            placeholder={t['forgot.form.verifyCode.placeholder']}
            size="large"
            suffix={
              <Button
                type="text"
                size="small"
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

        <Form.Item field="newPassword" rules={validationRules.password}>
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['forgot.form.newPassword.placeholder']}
            size="large"
          />
        </Form.Item>

        <Form.Item
          field="confirmPassword"
          rules={validationRules.confirmPassword(
            form.getFieldValue('newPassword') as string
          )}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['forgot.form.confirmPassword.placeholder']}
            size="large"
          />
        </Form.Item>

        {/* 错误信息 */}
        {error && <div className={styles['login-form-error']}>{error}</div>}

        {/* 重置按钮 */}
        <Button
          type="primary"
          size="large"
          long
          loading={loading}
          onClick={handleSubmit}
          style={{ marginTop: '16px' }}
        >
          {t['forgot.form.submit']}
        </Button>

        {/* 返回登录链接 */}
        <div className={styles['login-form-register']}>
          <Link onClick={onSwitchToLogin}>{t['forgot.form.backToLogin']}</Link>
        </div>
      </Form>
    </div>
  );
}
