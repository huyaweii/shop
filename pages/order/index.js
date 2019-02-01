import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')
var app = getApp()

Page({
  data: {
    userInfo: null,
    list: [],
    current: 0
  },
  onLoad: async function () {
    const {data: {orders}} = await asyncRequest({
      url: '/order/mine/list',
      data: {
        status: 0
      }
    })
    this.setData({list: orders})
  },
  handleChange: async function (e) {
    const {key} = e.detail
    this.setData({current: key})
    const {data: {orders}} = await asyncRequest({
      url: '/order/mine/list',
      data: {
        status: key
      }
    })
    this.setData({list: orders})
  }
})
