/* eslint-disable */
import React, { Component } from 'react';
import styles from './default.scss';
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
const PageA = (props) => {
  const { info, setInfo } = props;
  return (
    <div className={styles.page}>
      这是second模块的A页面
        <div>{info}</div>
      <button onClick={() => setInfo('信息被更新')}>更新信息</button>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    info: ownProps.getState(state).info,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setInfo: info => {
      return dispatch(actions.setInfo(info))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageA)
