export const setInfo = info => (dispatch, getState) => {
  dispatch({
    type: 'setInfo',
    payload: info
  })
}