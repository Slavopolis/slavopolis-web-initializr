import React from 'react';
import { Layout } from '@arco-design/web-react';
import { FooterProps } from '@arco-design/web-react/es/Layout/interface';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/store';
import cs from 'classnames';
import styles from './style/index.module.less';

function Footer(props: FooterProps = {}) {
  const { className, ...restProps } = props;
  const settings = useSelector((state: GlobalState) => state.settings);

  return (
    <Layout.Footer className={cs(styles.footer, className)} {...restProps}>
      {settings.systemName}
    </Layout.Footer>
  );
}

export default Footer;
