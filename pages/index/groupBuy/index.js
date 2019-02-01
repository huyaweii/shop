import {asyncRequest} from '../../../api'
const regeneratorRuntime = require('../../../utils/runtime.js')
const app = getApp()

Page({
  data: {
    userInfo: null,
    isVisibleModal: false,
    list: [],
    idList: []
  },
  // onShow:function(e){
  //   this.onLoad();
  // },
  onLoad: async function (options) {
    this.setData({userInfo: app.globalData.userInfo})
    const {list} = await asyncRequest({
      url: '/cart/list',
      data: {
        idList: options.idList
      }
    })
    this.setData({list, idList: options.idList})
  },
  pay: async function () {
    const idList = [...this.data.idList]
    // wx.login({
    //   success: function(res) {
    //     if (res.code) {

    //     }
    //   }
    // })
    // console.log('hahaha')
    // wx.requestPayment({
    //   'timeStamp': 1547360662000,
    //   'nonceStr': 'klsdfklkasdlkkl',
    //   'package': '',
    //   'signType': 'MD5',
    //   'paySign': '',
    //   'success':function(res){},
    //   'fail':function(res){},
    //   'complete':function(res){
    //     console.log(res)
    //   }
    // })
    await asyncRequest({
      url: '/order/create', 
      data: {
        idList
      },
      method: 'post'
    })
  },
  toggleModal: function () {
    const isVisibleModal = this.data.isVisibleModal
    this.setData({isVisibleModal: !isVisibleModal})
  }
})
