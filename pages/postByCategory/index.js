//index.js
//获取应用实例
const app = getApp()
import {request} from '../../api'
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    postList: [],
    willReplyPostId: null,
    atUserId: null,
    pullUpLoading: false,
    postPage: 0,
    pageSize: 10,
    count: null,
    commentPlaceholder: '请输入评论内容',
    loading: true
  },
  onReachBottom: function () {
    const _this = this
    const {postPage, pageSize, postList, count, pullUpLoading} = this.data
    if (postList.length < count) {
      this.setData({pullUpLoading: true})
      const postId = postList[postList.length - 1].id
      request({
        url: '/post',
        data: {
          postPage,
          pageSize,
          postId,
          type: 'community'
        },
        success: function (res) {
          _this.setData({postList: [...postList, ...res.data.postList], pullUpLoading: false, postId, postPage})
        }
      })
    }
  },
  onLoad: function (options) {
    const _this = this
    const {postPage, pageSize} = this.data
    const {categoryId, categoryName} = options || {}
    request({
      url: `/post`,
      data: {
          postPage,
          pageSize,
          categoryId,
          type: 'community'
      },
      success: function (res) {
        const {postList, count} = res.data
        _this.setData({postList, count, loading: false, categoryId, categoryName})
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  test: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
        } else {
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })
        }
      }
    })
  },
  changePostId: function(e) {
    const {postId, atUserId, commentPlaceholder} = e.currentTarget.dataset
    this.setData({willReplyPostId: postId, atUserId, commentPlaceholder})
  },
  // changePostId: function(e) {
  //   this.setData({wid})
  // }
  submitComment: function(e) {
    const {willReplyPostId, atUserId} = this.data
    const content = e.detail.value
    if (!content) {
      return wx.showToast({title: '内容不能为空哦', icon: 'none'})
    }
    request({
      url: '/post/reply',
      data: {
        content: e.detail.value,
        post_id: willReplyPostId,
        at_user_id: atUserId
      },
      method: 'post',
      success: res => {
        const postList = [...this.data.postList]
        const idx = postList.findIndex(post => post.id === willReplyPostId)
        postList[idx] = {
          ...postList[idx],
          replys: [...postList[idx].replys, res.data.reply]
        }
        this.setData({willReplyPostId: null, postList})
      }
    })
  },
  closeMask: function() {
    this.setData({willReplyPostId: null})
  }
})
