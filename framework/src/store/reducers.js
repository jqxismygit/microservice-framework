/* eslint-disable */

import { combineReducers } from 'redux';

export default function(asyncReducers) {
  return combineReducers({
    ...asyncReducers
  });
}
