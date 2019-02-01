const regeneratorRuntime = require('../../utils/runtime.js')
var app = getApp()
import {request} from '../../api'
import {asyncRequest} from '../../api'

Page({
  data: {
    userInfo: null,
    url: ''
  },
  onLoad: function (options) {
    const {url} = options
    this.setData({userInfo: app.globalData.userInfo, url})
  },
  getUserInfo: async function (result) {
    const _this = this
    const userInfo = result.detail.userInfo
    if (userInfo) {
      app.globalData.userInfo = userInfo
      const {avatarUrl, nickName, gender} = userInfo
      const {url} = _this.data
      wx.navigateTo({
        url: decodeURIComponent(url)
      })
    }
  }
})
