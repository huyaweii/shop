import {asyncRequest} from '../../api'
const regeneratorRuntime = require('../../utils/runtime.js')

var app = getApp()
Page({
  data: {
    userInfo: null,
    productList: [],
    activeIndex: 0,
    tabs: [
      {
        id: 1,
        tabName: '水果'
      },
      {
        id: 2,
        tabName: '蔬菜'
      }, {
        id: 3,
        tabName: '坚果'
      }
    ]
  },
  onShow:function(e){
    this.onLoad();
  },
  onLoad: async function () {
    var vm = this;
    wx.getSystemInfo({
      success: (res) => {
        vm.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight
        });
      }
    })
    this.setData({userInfo: app.globalData.userInfo})
    this.getList(1)
  },
  getList: async function(category) {
    const {data: {list}} = await asyncRequest({
      url: '/product/list',
      data: {
        category
      }
    })
    this.setData({productList: list})
  },
  changeTab: function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      content: e.currentTarget.dataset.name
    })
    this.getList(e.currentTarget.dataset.index + 1)
  },
  getUserInfo: function (result) {
    const userInfo = result.detail.userInfo
    if (userInfo) {
      app.globalData.userInfo = userInfo
      this.setData({userInfo})
    }
  }
})
