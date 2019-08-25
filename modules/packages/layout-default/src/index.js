/* eslint-disable */
import React, { Component } from 'react';
import styles from './default.scss';

const Layout = (props) => {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}></div>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
}

export default Layout;