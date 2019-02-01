import {asyncRequest} from '../../../api'
const regeneratorRuntime = require('../../../utils/runtime.js')

var app = getApp()
Page({
  data: {
    userInfo: null,
    isVisibleModal: false,
    productDetail: {},
    purchaseAmount: 1
  },
  // onShow:function(e){
  //   this.onLoad();
  // },
  onLoad: async function (options) {
    this.setData({userInfo: app.globalData.userInfo})
    const {data: {productDetail}} = await asyncRequest({
      url: `/product/${options.id}`,
    })
    this.setData({productDetail})
  },
  handleAddAmount: function () {
    const {purchaseAmount} = this.data
    this.setData({purchaseAmount: purchaseAmount + 1})
  },
  handleDeleteAmount: function () {
    const {purchaseAmount} = this.data
    this.setData({purchaseAmount: purchaseAmount === 1 ? 1 :purchaseAmount - 1})
  },
  handleAddToCart: async function () {
    const {purchaseAmount, productDetail} = this.data
    const productId = productDetail.id
    try {
      const {data: {cartCount}} = await asyncRequest({
        url: `/cart/${productId}/add`,
        data: {
          productId,
          amount: purchaseAmount
        },
        method: 'post'
      })
      productDetail.cartCount = cartCount
      this.setData({isVisibleModal: false, productDetail})
    } catch(err) {
      wx.showToast({
        title: '添加购物车失败',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
    
  },
  toggleModal: function () {
    const isVisibleModal = this.data.isVisibleModal
    this.setData({isVisibleModal: !isVisibleModal})
  }
})
