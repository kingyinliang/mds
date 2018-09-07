/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
// 人员管理数据处理
export function transfer (data) {
  var res = []
  var selcedid = []
  data.forEach((item, index) => {
    if (item.del_flag === '0') {
      selcedid.push(item.user_id)
    }
    res.push({
      label: item.name,
      key: item.user_id,
      screncon: item.name
    })
  })
  return {
    res: res,
    selcedid: selcedid
  }
}
export function setUserList (data) {
  var res = []
  data.forEach((item, index) => {
    res.push({
      label: item.realName + '（' + (item.workNum ? item.workNum : item.workNumTemp) + '）',
      key: item.realName + '（' + (item.workNum ? item.workNum : item.workNumTemp) + '）',
      screncon: item.realName + '（' + (item.workNum ? item.workNum : item.workNumTemp) + '）'
    })
  })
  return res
}
export function toDate (dateString) {
  var DATE_REGEXP = new RegExp('(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*')
  if (DATE_REGEXP.test(dateString)) {
    var timestamp = dateString.replace(DATE_REGEXP, function ($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
      var date = new Date($year, $month, $day, $hour || '00', $minute || '00', $second || '00', $milliscond || '00')
      return date.getTime()
    })
    var date = new Date()
    date.setTime(timestamp)
    return date
  }
  return null
}