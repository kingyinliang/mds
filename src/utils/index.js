
export function MdsPromise (callback) {
  this.status = 'pending'
  this.resolveArray = []
  this.rejectArray = []
  let resolve = (value) => {
    this.status = 'resolved'
    this.doneValue = value
    this.resolveArray.forEach(fn => (value = fn(value)))
    this.resolveArray = []
  }
  let reject = (value) => {
    this.status = 'reject'
    this.doneValue = value
    this.rejectArray.forEach(fn => (value = fn(value)))
    this.rejectArray = []
  }
  try {
    callback(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
MdsPromise.prototype.then = function (success, fail) {
  if (this.status === 'pending') {
    typeof success === 'function' && this.resolveArray.push(success)
    typeof fail === 'function' && this.rejectArray.push(fail)
  } else if (this.status === 'resolved') {
    typeof success === 'function' && success(this.doneValue)
  } else if (this.status === 'reject') {
    typeof fail === 'function' && fail(this.doneValue)
  }
  return this
}
/**
 * 函数节流方法 只加定时器叫防抖
 * @param Function fn 延时调用函数
 * @param Number delay 延迟多长时间
 * @param Number atleast 至少多长时间触发一次
 * @return Function 延迟执行的方法
 */
export function throttle (fn, delay, atleast) {
  var timer = null
  var previous = null
  return function () {
    var now = +new Date()
    if (!previous) previous = now
    if (atleast && now - previous > atleast) {
      fn()
      previous = now
      clearTimeout(timer)
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn()
        previous = null
      }, delay)
    }
  }
}
/**
 * 简化Promise
 * @param Array fnArr 第一次异步的函数数组
 * @param Array thenArr 第二次异步的函数数组
 * @return Function Promise.all的回调Promise
 */
export function AsyncHook (fnArr, thenArr) {
  let arr = []
  fnArr.forEach(item => {
    arr.push(new Promise((resolve, reject) => {
      item[1].push(resolve)
      item[1].push(reject)
      let [...args] = item[1]
      item[0](...args)
    }))
  })
  if (thenArr) {
    return Promise.all(arr).then(res => {
      let submitArr = []
      thenArr.forEach(item => {
        submitArr.push(new Promise((resolve, reject) => {
          item[1].push(resolve)
          item[1].push(reject)
          let [...args] = item[1]
          item[0](...args)
        }))
      })
      return Promise.all(submitArr)
    })
  } else {
    return Promise.all(arr)
  }
}
/**
 * 展开合并
 * @param $ this.$
 * @param 按钮class为showHiddenBtn name是展开div的class
 */
export function ShowHiddenNameBox ($) {
  $('.showHiddenBtn').unbind('click').click(function () {
    var $shiftBox = $('.' + $(this).attr('name') + 'Box')
    if ($(this).find('i').hasClass('el-icon-caret-top')) {
      $(this).html('展开<i class="el-icon-caret-bottom"></i>')
      $shiftBox.data('heightData', $shiftBox.height())
      $shiftBox.css('overflow', 'hidden')
      $shiftBox.animate({height: 0}, 300, function () {})
    } else {
      $shiftBox.css('overflow', 'inherit')
      $(this).html('收起<i class="el-icon-caret-top"></i>')
      $shiftBox.animate({height: $shiftBox.data('heightData')}, 300, function () {
        $shiftBox.css('height', 'auto')
      })
    }
  })
}
