/* eslint-disable */
import React, { Component } from 'react';
import styles from './default.scss';

const Home = (props) => {
  const { history } = props;
  return (
    <div className={styles.page}>
      这是主页面，主页面模块暂时只允许配置一个路由哦，如有其它变动，请自行修改代码哦
        <div className={styles.btn} onClick={() => { history.push('/first/page') }} >点击跳转到模块A的页面</div>
        <div className={styles.btn} onClick={() => { history.push('/second/page') }} >点击跳转到模块B的页面</div>
    </div>
  )
}
export default Home;