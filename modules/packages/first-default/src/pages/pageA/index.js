/* eslint-disable */
import React, { Component } from 'react';
import styles from './default.scss';

const PageA = (props) => {
  const { history } = props;
  return (
    <div className={styles.page}>
      这是first模块的A页面
        <div className={styles.btn} onClick={() => { history.push('/home/page2') }} >点击跳转到当前模块的B页面</div>
    </div>
  )
}

export default PageA;