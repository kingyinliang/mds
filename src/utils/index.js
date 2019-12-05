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
