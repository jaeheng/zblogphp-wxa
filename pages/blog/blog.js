// blog.js
import util from '../../utils/util.js';
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    data: [],
    isend: false, // 是否最后一页
    imgUrl: '../../static/images/banner.jpg',
    keyword: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  showblogInfo: function (event) {
    var gid = event.currentTarget.dataset.gid
    wx.navigateTo({
      url: '../blog-info/blog-info?gid=' + gid
    })
  },

  getData: function (fromStart) {
    let isEnd = this.data.isend
    if (isEnd && !fromStart) return false
    var page = fromStart ? 1 : this.data.page + 1
    let that = this
    let oldData = this.data.data
    util.getArticle(page, 0, '', function (resp) {
      const data = resp.list.map(item => {
        item.PostTime = that.getDate(item.PostTime)
        return item
      })
      that.setData({
        page: page,
        data: fromStart ? data : oldData.concat(data),
        isend: resp.pagebar.PageNow >= resp.pagebar.PageAll
      })
      wx.stopPullDownRefresh()
    }, () => {
      that.setData({
        isend: true
      })
    });
  },
  onReachBottom: function () {
    this.getData();
  },

  onPullDownRefresh: function () {
    this.getData(1);
  },

  onShareAppMessage: function (res) {
    return {
    }
  },
  onShareTimeline: function (res) {
    return {}
  },
  getDate: function (timestamp) {
    return util.formatTime(new Date(timestamp * 1e3))
  }
})