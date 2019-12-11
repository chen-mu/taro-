import Taro from '@tarojs/taro'
import { clearUserStorage, getUserStorage } from '../action/counter'
import { LOCALE_ERROR } from '../constants/locale'
import regeneratorRuntime from '../utils/runtime'

/**
 * 响应状态码
 */
const CODE_SUCCESS = 200
const CODE_ERROR = 2003
const CODE_AUTH_EXPIRED = 911
const CODE_FAIL = 405
const CODE_NO_PERMISSION = 403


/**
 * 开发环境配置
 */
const DEV_REQUEST_DELAY = 2000
const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * 网络请求封装
 * @param {*} options
 */
export default async function fetch({
  url,
  payload,
  method = 'GET',
  showToast = true,
  autoLogin = true,
  mode = 'cors',
  showLoading = true,
  success = () => { },
  fail = () => { },
  complete = () => { },
}) {
  // 初始化头部数据
  const header = {}
  const { token } = getUserStorage()
  let data = {}
  if (token) {
    data = { ...payload, token }
  } else {
    data = { ...payload }
  }
  data = { ...payload, }

  /**
   * 修改请求头
   */

  // header['Content-Type'] = 'application/x-www-form-urlencoded'
  header['Accept'] = 'application/json'


  /**
   * 当网络请求成功
   * 开发环境增加模拟请求延迟
   * @param {*} response
   */
  async function handleSuccess(response) {
    success(response)
    handleComplete()
    return response
  }

  /**
    * 判断网络请求状态码
    * @param {*} response
    */
  async function handleStatus(response) {

    if (!response || !response.data) {
      throw new Error(LOCALE_ERROR);
    }

    switch (response.data.code) {


      case CODE_SUCCESS: return response;
      case CODE_ERROR: {
        const { code } = await Taro.login()
        Taro.setStorageSync('code', code)

        throw new Error(response.data.msg)
      }

      case CODE_NO_PERMISSION: {
        Taro.showToast({
          icon: 'none',
          title: response.data.msg,
          duration: 2000,
        })
        break
      }

      case CODE_AUTH_EXPIRED: {
        // clearUserStorage();
        Taro.setStorageSync('code', '')

        const cLength = Taro.getCurrentPages().length
        const currentPage = Taro.getCurrentPages()[cLength - 1]

      }
      default: throw new Error(LOCALE_ERROR)
    }
  }

  /**
   * 网络请求出错时
   * 进行提示 并 调用错误回调函数
   * @param {*} error
   */
  function handleError(error) {

    if (error.code === CODE_AUTH_EXPIRED && autoLogin) {

      if (error.message = error.message || LOCALE_ERROR) {
        let timer = setTimeout(() => {
          showToast && Taro.showToast({
            icon: 'none',
            title: { LOCALE_ERROR },
            duration: 2000
          }, () => clearTimeout(timer))
        }, 20)
      }
    }

    fail(error)
    handleComplete()
    return error
  }

  /**
   * 当数据请求完成时调用
   * 开发环境增加模拟请求延迟
   */
  function handleComplete() {
    showLoading && Taro.hideLoading()
    return setTimeout(() => {
      complete()
    }, IS_DEV ? DEV_REQUEST_DELAY : 0)
  }

  /**
   * 显示数据加载
   */
  showLoading && Taro.showLoading({
    title: '加载中',
    mask: true
  })

  return Taro.request({ url, data, header, method, mode })
    .then(handleStatus)
    .then(handleSuccess)
    .catch(handleError)
}
