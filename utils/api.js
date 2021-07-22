import config from '../config.js'
let api = config.domain + '/zb_system/api.php'

module.exports = {
  getArticle: api + '?mod=post&act=list&sortby=ID&order=desc&page=',
  getArticleInfo: api + '?mod=post&id=',
  getSettings: api + '?mod=system&act=basic_info',
  getSorts: api + '?mod=category&act=list&sortby=Order',
  getArticleComments: api + '?mod=comment&act=list&sortby=ID&order=desc&post_id='
}