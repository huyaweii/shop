
import {asyncRequest} from '../../../api'
const regeneratorRuntime = require('../../../utils/runtime.js')
var app = getApp()
Page({
  data: {
    userInfo: null,
    isVisibleModal: false,
    list: [],
    selectedAll: false
  },
  // onShow:function(e){
  //   this.onLoad();
  // },
  onLoad: async function (options) {
    const {data: {list}} = await asyncRequest({url: `/cart/list`})
    this.setData({userInfo: app.globalData.userInfo, list})
  },
  handleAddProduct: async function (e) {
    const {id, amount} = e.currentTarget.dataset
    const {list} = this.data
    try {
      await asyncRequest({
        url: `/cart/${id}/add`,
        data: {
          productId: id,
          amount: 1
        },
        method: 'post'
      })
      const idx = list.findIndex(productInCart => productInCart.product_id === id)
      list[idx] = {
        ...list[idx], 
        product_amount: amount + 1
      }
      this.setData({list})
    } catch (err) {
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      })
      console.log(err)
    }
  },
  handleDeleteProduct: async function(e) {
    const {id, amount} = e.currentTarget.dataset
    const list = [...this.data.list]
    try {
      await asyncRequest({
        url: `/cart/${id}/delete`,
        data: {
          productId: id,
          amount: 1
        },
        method: 'post'
      })
      const idx = list.findIndex(productInCart => productInCart.product_id === id)
      if (amount > 1) {
        list[idx] = {
          ...list[idx], 
          product_amount: amount - 1
        }
      } else {
        list.splice(idx, 1)
      }
      this.setData({list})
    } catch (err) {
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
      console.log(err)
    }
    
  },
  toggleSelectedAll: async function(e) {
    let {selectedAll, list} = this.data
    list = [...list]
    if(selectedAll) {
      list = list.map(l => ({...l, selected: false}))
      this.setData({selectedAll: false, list})
    } else {
      list = list.map(l => ({...l, selected: true}))
      this.setData({selectedAll: true, list})
    }
  },
  toggleSecProd: async function(e) {
    const list = [...this.data.list]
    const {id} = e.currentTarget.dataset
    const idx = list.findIndex(product => product.product_id === id)
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        selected: !list[idx].selected
      }
    }
    this.setData({list, selectedAll: list.every(l => l.selected)})
  },
  settle: function () {
    const list = [...this.data.list]
    if (this.data.list.some(l => l.selected)) {
      const idList = list.filter(l => l.selected).map(l => l.product_id)
      wx.navigateTo({url: `/pages/index/payList/index?idList=${idList.join(',')}`})
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
    }
  }
})
