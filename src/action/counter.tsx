import {
  ADD,
  MINUS,
  USER_LOGIN,
} from '../constants/counter'

import { createAction } from '../utils/redux'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}

// 异步的 action
export function asyncAdd() {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}


/**
 * 用户登录
 * @param {*} payload
 */
export const dispatchLogin = (payload, fetchOptions = {}) => createAction({
  payload,
  fetchOptions,
  method: 'POST',
  type: USER_LOGIN,
  url: API_USER_LOGIN,
  cb: ({ data: { data: { user, token } } })

})
