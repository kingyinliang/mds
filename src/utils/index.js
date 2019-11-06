function MdsPromise (callback) {
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
export default MdsPromise
