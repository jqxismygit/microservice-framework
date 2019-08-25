const info = (state = '111', action) => {
  switch (action.type) {
    case 'setInfo':
      return action.payload
    default:
      return state
  }
}

export default info