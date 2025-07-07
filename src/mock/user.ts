import Mock from 'mockjs';
import { isSSR } from '@/utils/is';
import setupMock from '@/utils/setupMock';
import { generatePermission } from '@/routes';

if (!isSSR) {
  Mock.XHR.prototype.withCredentials = true;

  setupMock({
    setup: () => {
      // 预设的测试账户
      const testAccounts = [
        // 管理员账户
        {
          account: 'jcodenest@gmail.com',
          password: 'admin123',
          role: 'admin',
          name: '管理员',
        },
        {
          account: '18688888888',
          password: 'admin123',
          role: 'admin',
          name: '管理员',
        },

        // 普通用户账户
        {
          account: 'jcodenest@gmail.com',
          password: 'user123',
          role: 'user',
          name: '普通用户',
        },
        {
          account: '18688888888',
          password: 'user123',
          role: 'user',
          name: '普通用户',
        },

        // 测试账户
        {
          account: 'jcodenest@gmail.com',
          password: 'test123',
          role: 'user',
          name: '测试用户',
        },
        {
          account: '18688888888',
          password: 'test123',
          role: 'user',
          name: '测试用户',
        },
      ];

      // 注册用户数据存储
      const registeredUsers = new Map();

      // 验证码存储（实际项目中应该使用 Redis 等存储）
      const verifyCodes = new Map();

      // 工具函数：验证账号格式
      const getAccountType = (account: string) => {
        if (/^1[3-9]\d{9}$/.test(account)) return 'phone';
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)) return 'email';
        return 'invalid';
      };

      // 工具函数：查找账户
      const findAccount = (account: string) => {
        // 在测试账户中查找
        const testAccount = testAccounts.find((acc) => acc.account === account);
        if (testAccount) return testAccount;

        // 在注册用户中查找
        return registeredUsers.get(account);
      };

      // 用户信息
      const userRole = window.localStorage.getItem('userRole') || 'admin';
      Mock.mock(new RegExp('/api/user/userInfo'), () => {
        return Mock.mock({
          name: 'admin',
          avatar: '/avatar.png',
          email: 'jcodenest@gmail.com',
          job: 'backend',
          jobName: '后端开发工程师',
          organization: 'Backend',
          organizationName: '后端',
          location: 'shanghai',
          locationName: '上海',
          introduction: '沉默老李并非是一个真实存在的人。',
          personalWebsite: 'https://www.jcodenest.com',
          verified: true,
          phoneNumber: /177[*]{6}[0-9]{2}/,
          accountId: /[a-z]{4}[-][0-9]{8}/,
          registrationTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          permissions: generatePermission(userRole),
        });
      });

      // 登录接口
      Mock.mock(new RegExp('/api/user/login'), (params) => {
        const { account, password, verifyCode, loginType } = JSON.parse(
          params.body
        );

        if (!account) {
          return { status: 'error', msg: '账号不能为空' };
        }

        const accountType = getAccountType(account);
        if (accountType === 'invalid') {
          return { status: 'error', msg: '账号格式不正确' };
        }

        const userAccount = findAccount(account);

        // 密码登录方式
        if (loginType === 'phone_password' || loginType === 'email_password') {
          if (!password) {
            return { status: 'error', msg: '密码不能为空' };
          }

          if (!userAccount) {
            return { status: 'error', msg: '账号不存在' };
          }

          if (userAccount.password !== password) {
            return { status: 'error', msg: '密码错误' };
          }

          // 设置用户角色
          window.localStorage.setItem('userRole', userAccount.role);
          return {
            status: 'ok',
            data: { role: userAccount.role, name: userAccount.name },
          };
        }

        // 验证码登录方式
        if (loginType === 'phone_code' || loginType === 'email_code') {
          if (!verifyCode) {
            return { status: 'error', msg: '验证码不能为空' };
          }

          const storedCode = verifyCodes.get(account);
          if (!storedCode || storedCode.code !== verifyCode) {
            return { status: 'error', msg: '验证码错误或已过期' };
          }

          if (Date.now() > storedCode.expiry) {
            verifyCodes.delete(account);
            return { status: 'error', msg: '验证码已过期' };
          }

          // 验证码登录成功（不需要检查账户是否存在，可以自动注册）
          if (!userAccount) {
            // 自动创建账户
            const newUser = {
              account,
              password: 'auto_generated',
              role: 'user',
              name: accountType === 'phone' ? '手机用户' : '邮箱用户',
            };
            registeredUsers.set(account, newUser);
          }

          // 清除验证码
          verifyCodes.delete(account);

          const role = userAccount ? userAccount.role : 'user';
          const name = userAccount
            ? userAccount.name
            : accountType === 'phone'
            ? '手机用户'
            : '邮箱用户';

          window.localStorage.setItem('userRole', role);
          return { status: 'ok', data: { role, name } };
        }

        return { status: 'error', msg: '登录方式不支持' };
      });

      // 注册接口
      Mock.mock(new RegExp('/api/user/register'), (params) => {
        const {
          username,
          email,
          phone,
          password,
          confirmPassword,
          verifyCode,
          agreeTerms,
        } = JSON.parse(params.body);

        if (!username) return { status: 'error', msg: '用户名不能为空' };
        if (!email) return { status: 'error', msg: '邮箱不能为空' };
        if (!phone) return { status: 'error', msg: '手机号不能为空' };
        if (!password) return { status: 'error', msg: '密码不能为空' };
        if (!confirmPassword)
          return { status: 'error', msg: '确认密码不能为空' };
        if (!verifyCode) return { status: 'error', msg: '验证码不能为空' };
        if (!agreeTerms)
          return { status: 'error', msg: '请同意服务条款和隐私政策' };

        if (password !== confirmPassword) {
          return { status: 'error', msg: '两次输入的密码不一致' };
        }

        if (getAccountType(email) === 'invalid') {
          return { status: 'error', msg: '邮箱格式不正确' };
        }

        if (getAccountType(phone) === 'invalid') {
          return { status: 'error', msg: '手机号格式不正确' };
        }

        // 检查邮箱验证码
        const emailCode = verifyCodes.get(email);
        if (
          !emailCode ||
          emailCode.code !== verifyCode ||
          Date.now() > emailCode.expiry
        ) {
          return { status: 'error', msg: '邮箱验证码错误或已过期' };
        }

        // 检查账户是否已存在
        if (findAccount(email) || findAccount(phone)) {
          return { status: 'error', msg: '该邮箱或手机号已被注册' };
        }

        // 注册成功
        const newUser = {
          account: email,
          password,
          role: 'user',
          name: username,
        };
        registeredUsers.set(email, newUser);
        registeredUsers.set(phone, newUser); // 手机号也可以登录

        // 清除验证码
        verifyCodes.delete(email);

        return { status: 'ok', msg: '注册成功' };
      });

      // 重置密码接口
      Mock.mock(new RegExp('/api/user/reset-password'), (params) => {
        const { account, verifyCode, newPassword, confirmPassword } =
          JSON.parse(params.body);

        if (!account) return { status: 'error', msg: '账号不能为空' };
        if (!verifyCode) return { status: 'error', msg: '验证码不能为空' };
        if (!newPassword) return { status: 'error', msg: '新密码不能为空' };
        if (!confirmPassword)
          return { status: 'error', msg: '确认密码不能为空' };

        if (newPassword !== confirmPassword) {
          return { status: 'error', msg: '两次输入的密码不一致' };
        }

        const accountType = getAccountType(account);
        if (accountType === 'invalid') {
          return { status: 'error', msg: '账号格式不正确' };
        }

        // 检查验证码
        const storedCode = verifyCodes.get(account);
        if (
          !storedCode ||
          storedCode.code !== verifyCode ||
          Date.now() > storedCode.expiry
        ) {
          return { status: 'error', msg: '验证码错误或已过期' };
        }

        const userAccount = findAccount(account);
        if (!userAccount) {
          return { status: 'error', msg: '账号不存在' };
        }

        // 更新密码
        userAccount.password = newPassword;

        // 清除验证码
        verifyCodes.delete(account);

        return { status: 'ok', msg: '密码重置成功' };
      });

      // 发送验证码接口
      Mock.mock(new RegExp('/api/user/send-verify-code'), (params) => {
        const { account, accountType, type } = JSON.parse(params.body);

        if (!account) return { status: 'error', msg: '账号不能为空' };

        if (getAccountType(account) === 'invalid') {
          return { status: 'error', msg: '账号格式不正确' };
        }

        // 生成6位验证码
        const code = Math.random().toString().slice(-6);
        const expiry = Date.now() + 5 * 60 * 1000; // 5分钟过期

        // 存储验证码
        verifyCodes.set(account, { code, expiry, type });

        // 在控制台输出验证码（实际项目中会发送短信或邮件）
        console.log(`📱 验证码发送成功！
账号: ${account}
类型: ${accountType === 'phone' ? '手机短信' : '邮箱'}
用途: ${type === 'login' ? '登录' : type === 'register' ? '注册' : '重置密码'}
验证码: ${code}
有效期: 5分钟`);

        return {
          status: 'ok',
          msg: `验证码已发送至您的${accountType === 'phone' ? '手机' : '邮箱'}`,
          data: { code }, // 仅用于开发调试，生产环境不应返回
        };
      });

      // 验证验证码接口
      Mock.mock(new RegExp('/api/user/verify-code'), (params) => {
        const { account, accountType, code } = JSON.parse(params.body);

        if (!account || !code) {
          return { status: 'error', msg: '参数不完整' };
        }

        const storedCode = verifyCodes.get(account);
        if (!storedCode) {
          return { status: 'error', msg: '请先获取验证码' };
        }

        if (storedCode.code !== code) {
          return { status: 'error', msg: '验证码错误' };
        }

        if (Date.now() > storedCode.expiry) {
          verifyCodes.delete(account);
          return { status: 'error', msg: '验证码已过期' };
        }

        return { status: 'ok', msg: '验证成功' };
      });
    },
  });
}
