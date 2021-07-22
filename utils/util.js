import api from './api'

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function loading () {
  wx.showLoading({
    title: '加载中..',
    mask: true
  })
}

function unloading () {
  wx.hideLoading()
}

/**
 * http操作
 */
function http (url, params, type, success, error, needLoading, headers) {
  if (typeof needLoading !== 'boolean' || needLoading) {
    loading()
  }
  if (!headers) {
    headers = {}
  }
  wx.request({
    url: url,
    data: params,
    method: type,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      ...headers
    },
    success: function (resp) {
      var data = resp.data
      if (data.code === 200) {
        typeof success == 'function' && success(data.data)
        setTimeout(function () { unloading() }, 300)
      } else {
        console.log(data.message)
        typeof error == 'function' && error(data.message)
        unloading()
      }
    },
    fail: function() {
      unloading()
      typeof error == 'function' && error('请求错误!')
    }
  })
}

/**
 * 获取某分类下的文章
 */
function getArticle(page, cate_id, keyword, success, error) {
  http(api.getArticle + page + '&cate_id=' + cate_id + '&search=' + keyword, {}, 'GET', success, error)
}

/**
 * 获取文章详情
 */
function getArticleInfo(gid, success, error) {
  http(api.getArticleInfo + gid, {}, 'GET', success, error)
}

/**
 * 获取某文章下的评论
 */
function getArticleComments(post_id, page, success, error) {
  http(api.getArticleComments, { post_id, page }, 'GET', success, error, false)
}
/**
 * 设置本地存储内容
 */
function setLS (key, value) {
  wx.setStorage({
    key: key,
    data: value
  })
}
/**
 * 获取本地存储内容
 */
function getLS (key) {
  return wx.getStorageSync(key)
}

/**
 * 获取博客设置信息
 */
function getSettings (success, error) {
  http(api.getSettings, {}, 'GET', success, error)
}

/**
 * 获取分类列表
 */
function getSorts (success, error) {
  http(api.getSorts, {}, 'GET', success, error)
}

/**
 * 添加评论
 */
function addComment (data, callback, error) {
  data.poster = data.poster || '小程序用户'
  http(api.addComment, data, 'POST', callback, error)
}

module.exports = {
  formatTime,
  getArticle,
  getArticleInfo,
  getSettings,
  getSorts,
  getArticleComments,
  addComment
}
