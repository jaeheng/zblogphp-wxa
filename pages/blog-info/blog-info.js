// blog-info.js
import util from '../../utils/util.js'

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: 0,
    data: {},
    error: '',
    total: 0,
    page: 1,
    comments: [],
    isend: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      gid: options.gid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    this.getArticleInfo()
    this.getComments()
  },

  replyPost: function (e) {
    var gid = this.data.gid
    wx.navigateTo({
      url: '../add-comment/add-comment?gid=' + gid
    })
  },

  getArticleInfo: function () {
    var gid = this.data.gid
    var that = this
    util.getArticleInfo(gid, function (success) {
      const post = success.post
      post.PostTime = that.getDate(post.PostTime)
      post.Content = post.Content
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/<section/g, '<div')
        .replace(/\/section>/g, '\div>')
        .replace(/&nbsp;/g, ' ')
        .replace(/pre class="prism-highlight/g, 'pre style="white-space: pre-wrap!important;background-color: #eee;padding: 5px 10px;margin: 1em 0;" class="prism-highlight')
        .replace(/<img/gi, '<img class="rich-img" style="max-width:100%!important;display:block" ')
      that.setData({
        data: post
      })
    }, function (error) {
      that.setData({
        error: error
      })
    })
  },

  getComments: function () {
    let isEnd = this.data.isend
    if (isEnd) return false
    var gid = this.data.gid
    var page = this.data.page
    var that = this
    var oldData = this.data.comments

    util.getArticleComments(gid, page, function (resp) {
      const list = resp.list.map(item => {
        item.PostTime = that.getDate(item.PostTime)
        return item
      })
      const pagebar = resp.pagebar
      that.setData({
        page: page + 1,
        comments: oldData.concat(list),
        total: pagebar.AllCount,
        isend: pagebar.PageNow >= pagebar.PageAll
      })

      wx.stopPullDownRefresh()
    })
  },

  onPullDownRefresh: function () {
    this.getArticleInfo()
  },
  onReachBottom: function () {
    this.getComments()
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.data.title
    }
  },
  onShareTimeline: function (res) {
    return {
      title: this.data.data.title
    }
  },
  getDate: function (timestamp) {
    return util.formatTime(new Date(timestamp * 1e3))
  }
})