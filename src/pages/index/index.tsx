import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BaseComponent from '../../components/base';
import { add, minus, asyncAdd } from '../../action/counter'


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))


export default class Index extends BaseComponent {

  config = {
    navigationBarTitleText: '首页'
  }

  async componentWillMount() {
    await console.log(111)
  }


  render() {
    console.log(this.props)
    const { add, dec, asyncAdd, counter } = this.props
    return (
      <View >
        <View className='demo'> Hello world!</View>
        <View > Hello world!</View>
        <Button className='add_btn' onClick={add}>+</Button>
        <Button className='dec_btn' onClick={dec}>-</Button>
        <Button className='dec_btn' onClick={asyncAdd}>async</Button>

        <View>{counter.num}</View>
      </View>
    )
  }
}
