import React from 'react';
import { Layout } from '@arco-design/web-react';
import { FooterProps } from '@arco-design/web-react/es/Layout/interface';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/store';
import cs from 'classnames';
import Logo from '@/assets/logo.svg';
import styles from './style/index.module.less';

function Footer(props: FooterProps = {}) {
  const { className, ...restProps } = props;
  const settings = useSelector((state: GlobalState) => state.settings);

  return (
    <Layout.Footer className={cs(styles.footer, className)} {...restProps}>
      <Logo className={cs(styles.logo)} />
      <span className={cs(styles.text)}>{settings.systemName}</span>
    </Layout.Footer>
  );
}

export default Footer;
