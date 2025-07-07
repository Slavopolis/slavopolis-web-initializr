import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Link,
  Modal,
} from '@arco-design/web-react';
import {
  IconUser,
  IconEmail,
  IconPhone,
  IconLock,
  IconSafe,
} from '@arco-design/web-react/icon';
import { RegisterFormData } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { useVerifyCode } from '@/hooks/useVerifyCode';
import { validationRules } from '@/utils/validation';
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import styles from '../style/index.module.less';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [form] = Form.useForm<RegisterFormData>();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const t = useLocale(locale);
  const { loading, error, register } = useAuth();
  const verifyCode = useVerifyCode();

  // 发送验证码
  const handleSendVerifyCode = async () => {
    try {
      const email = form.getFieldValue('email') as string;
      if (!email) {
        return;
      }

      await verifyCode.sendVerifyCode(email, 'register');
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  // 提交注册
  const handleSubmit = async () => {
    if (!agreeTerms) {
      return;
    }

    try {
      const values = await form.validate();

      const formData: RegisterFormData = {
        ...values,
        agreeTerms,
      };

      const success = await register(formData);
      if (success) {
        onSwitchToLogin();
      }
    } catch (err) {
      // 表单验证错误
    }
  };

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>
        {t['page.register.title']}
      </div>
      <div className={styles['login-form-subtitle']}>
        {t['page.register.subtitle']}
      </div>

      {/* 注册表单 */}
      <Form
        form={form}
        layout="vertical"
        onSubmit={handleSubmit}
        style={{ marginTop: '24px' }}
      >
        <Form.Item field="username" rules={validationRules.username}>
          <Input
            prefix={<IconUser />}
            placeholder={t['register.form.username.placeholder']}
            size="large"
          />
        </Form.Item>

        <Form.Item field="email" rules={validationRules.email}>
          <Input
            prefix={<IconEmail />}
            placeholder={t['register.form.email.placeholder']}
            size="large"
          />
        </Form.Item>

        <Form.Item field="phone" rules={validationRules.phone}>
          <Input
            prefix={<IconPhone />}
            placeholder={t['register.form.phone.placeholder']}
            size="large"
          />
        </Form.Item>

        <Form.Item field="password" rules={validationRules.password}>
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['register.form.password.placeholder']}
            size="large"
          />
        </Form.Item>

        <Form.Item
          field="confirmPassword"
          rules={validationRules.confirmPassword(
            form.getFieldValue('password') as string
          )}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['register.form.confirmPassword.placeholder']}
            size="large"
          />
        </Form.Item>

        <Form.Item field="verifyCode" rules={validationRules.verifyCode}>
          <Input
            prefix={<IconSafe />}
            placeholder={t['register.form.verifyCode.placeholder']}
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

        {/* 同意条款 */}
        <Form.Item style={{ marginBottom: '8px' }}>
          <Checkbox checked={agreeTerms} onChange={setAgreeTerms}>
            我同意
            <Link
              onClick={() => setShowTermsModal(true)}
              style={{ margin: '0 4px' }}
            >
              服务条款
            </Link>
            和
            <Link
              onClick={() => setShowPrivacyModal(true)}
              style={{ margin: '0 4px' }}
            >
              隐私政策
            </Link>
          </Checkbox>
        </Form.Item>

        {/* 错误信息 */}
        {error && <div className={styles['login-form-error']}>{error}</div>}

        {/* 注册按钮 */}
        <Button
          type="primary"
          size="large"
          long
          loading={loading}
          disabled={!agreeTerms}
          onClick={handleSubmit}
        >
          {t['register.form.submit']}
        </Button>

        {/* 登录链接 */}
        <div className={styles['login-form-register']}>
          <Typography.Text type="secondary">
            {t['login.form.haveAccount']}
          </Typography.Text>
          <Link onClick={onSwitchToLogin}>
            {t['register.form.backToLogin']}
          </Link>
        </div>
      </Form>

      {/* 服务条款弹窗 */}
      <Modal
        title="服务条款"
        visible={showTermsModal}
        onCancel={() => setShowTermsModal(false)}
        footer={null}
        style={{
          width: '750px',
        }}
        alignCenter={true}
        className="terms-modal"
      >
        <div
          className={styles['terms-content']}
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          <Typography.Title heading={6}>1. 服务介绍</Typography.Title>
          <Typography.Paragraph>
            JCodeNest（以下简称&ldquo;本平台&rdquo;）是一个专注于Java技术分享的知识平台，旨在为开发者提供高质量的技术内容、学习资源和交流环境。
          </Typography.Paragraph>

          <Typography.Title heading={6}>2. 用户责任</Typography.Title>
          <Typography.Paragraph>
            用户在使用本平台时，应当遵守以下规定：
          </Typography.Paragraph>
          <Typography.Paragraph>
            •
            不得发布违法、有害、威胁、滥用、骚扰、诽谤、粗俗、淫秽、诅咒、种族主义或其他令人反感的内容
            <br />
            • 不得侵犯他人知识产权、隐私权或其他合法权益
            <br />
            • 不得进行任何可能干扰、破坏或限制平台正常运行的行为
            <br />• 遵守相关法律法规，承担相应的法律责任
          </Typography.Paragraph>

          <Typography.Title heading={6}>3. 知识产权</Typography.Title>
          <Typography.Paragraph>
            本平台所有原创内容的知识产权归平台所有。用户发布的内容，用户保留其知识产权，但授权平台在平台范围内使用。
          </Typography.Paragraph>

          <Typography.Title heading={6}>4. 免责声明</Typography.Title>
          <Typography.Paragraph>
            平台提供的信息仅供参考，不构成投资建议或专业意见。用户应当独立判断并承担相应风险。
          </Typography.Paragraph>

          <Typography.Title heading={6}>5. 服务变更</Typography.Title>
          <Typography.Paragraph>
            我们保留随时修改、暂停或终止服务的权利，并会通过适当方式通知用户。
          </Typography.Paragraph>

          <Typography.Title heading={6}>6. 争议解决</Typography.Title>
          <Typography.Paragraph>
            本协议的解释和执行适用中华人民共和国法律。如发生争议，应友好协商解决。
          </Typography.Paragraph>
        </div>
      </Modal>

      {/* 隐私政策弹窗 */}
      <Modal
        title="隐私政策"
        visible={showPrivacyModal}
        onCancel={() => setShowPrivacyModal(false)}
        footer={null}
        style={{
          width: '750px',
        }}
        alignCenter={true}
        className="privacy-modal"
      >
        <div
          className={styles['privacy-content']}
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          <Typography.Title heading={6}>1. 信息收集</Typography.Title>
          <Typography.Paragraph>我们收集以下类型的信息：</Typography.Paragraph>
          <Typography.Paragraph>
            • 注册信息：用户名、邮箱、手机号等基本信息
            <br />
            • 使用信息：访问日志、操作记录、设备信息等
            <br />• 内容信息：用户发布的文章、评论、互动等内容
          </Typography.Paragraph>

          <Typography.Title heading={6}>2. 信息使用</Typography.Title>
          <Typography.Paragraph>我们使用收集的信息用于：</Typography.Paragraph>
          <Typography.Paragraph>
            • 提供和改进我们的服务
            <br />
            • 与用户进行沟通和客户服务
            <br />
            • 分析使用情况，优化用户体验
            <br />• 遵守法律法规要求
          </Typography.Paragraph>

          <Typography.Title heading={6}>3. 信息保护</Typography.Title>
          <Typography.Paragraph>
            我们采取合理的安全措施保护用户信息，包括技术措施和管理措施，防止信息丢失、泄露、损坏。
          </Typography.Paragraph>

          <Typography.Title heading={6}>4. 信息分享</Typography.Title>
          <Typography.Paragraph>
            我们不会向第三方出售、租赁或以其他方式转让用户个人信息，除非：
          </Typography.Paragraph>
          <Typography.Paragraph>
            • 获得用户明确同意
            <br />
            • 法律法规要求
            <br />• 保护我们的合法权益
          </Typography.Paragraph>

          <Typography.Title heading={6}>5. 内容版权声明</Typography.Title>
          <Typography.Paragraph>
            <strong>重要提醒：</strong>
          </Typography.Paragraph>
          <Typography.Paragraph>
            • 本站所有原创文章和内容均受版权保护
            <br />
            •
            如需转载或分享本站文章，请务必注明出处：&ldquo;来源：JCodeHub（沉默老李的Java
            Code Hub）&rdquo;
            <br />
            • 未经授权，禁止商业使用本站内容
            <br />• 违反版权规定的行为将承担法律责任
          </Typography.Paragraph>

          <Typography.Title heading={6}>6. 用户权利</Typography.Title>
          <Typography.Paragraph>用户有权：</Typography.Paragraph>
          <Typography.Paragraph>
            • 查询、更正、删除个人信息
            <br />
            • 选择是否接收推送消息
            <br />• 注销账户和删除个人数据
          </Typography.Paragraph>

          <Typography.Title heading={6}>7. 政策更新</Typography.Title>
          <Typography.Paragraph>
            我们保留随时更新本隐私政策的权利，重大变更将通过站内通知或邮件方式告知用户。
          </Typography.Paragraph>

          <Typography.Title heading={6}>8. 联系我们</Typography.Title>
          <Typography.Paragraph>
            如对本隐私政策有任何疑问，请通过以下方式联系我们：
            <br />
            邮箱：jcodenest@gmail.com
            <br />
            最后更新：2025年
          </Typography.Paragraph>
        </div>
      </Modal>
    </div>
  );
}
