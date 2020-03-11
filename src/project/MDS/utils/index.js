export function MdsPromise(callback) {
    this.status = 'pending';
    this.resolveArray = [];
    this.rejectArray = [];
    const resolve = value => {
        this.status = 'resolved';
        this.doneValue = value;
        this.resolveArray.forEach(fn => (value = fn(value)));
        this.resolveArray = [];
    };
    const reject = value => {
        this.status = 'reject';
        this.doneValue = value;
        this.rejectArray.forEach(fn => (value = fn(value)));
        this.rejectArray = [];
    };
    try {
        callback(resolve, reject);
    } catch (e) {
        reject(e);
    }
}
MdsPromise.prototype.then = function(success, fail) {
    if (this.status === 'pending') {
        typeof success === 'function' && this.resolveArray.push(success);
        typeof fail === 'function' && this.rejectArray.push(fail);
    } else if (this.status === 'resolved') {
        typeof success === 'function' && success(this.doneValue);
    } else if (this.status === 'reject') {
        typeof fail === 'function' && fail(this.doneValue);
    }
    return this;
};
/**
 * 函数节流方法 只加定时器叫防抖
 * @param Function fn 延时调用函数
 * @param Number delay 延迟多长时间
 * @param Number atleast 至少多长时间触发一次
 * @return Function 延迟执行的方法
 */
export function throttle(fn, delay, atleast) {
    let timer = null;
    let previous = null;
    return function() {
        const now = Number(new Date());
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
            fn();
            previous = now;
            clearTimeout(timer);
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn();
                previous = null;
            }, delay);
        }
    };
}
/**
 * 简化Promise提交保存异步同步操作
 * @function AsyncHook 多参数同步Promise
 * @param 多个array，每一个参数是一个异步请求的数组，多个参数是同步的请求
 * @function setPromise 把请求数组处理成Promise.all
 * @return Function Promise.all的回调Promise
 */
export function AsyncHook() {
    if (arguments.length === 1) {
        return setPromise(arguments[0]);
    }
        return setPromise(arguments[0]).then(res => {
            const arr = Array.prototype.slice.call(arguments);
            arr.shift();
            const [...args] = arr;
            return AsyncHook(...args);
        });

}
function setPromise(fnArr) {
    const arr = [];
    fnArr.forEach(item => {
        arr.push(
            new Promise((resolve, reject) => {
                item[1].push(resolve);
                item[1].push(reject);
                const [...args] = item[1];
                item[0](...args);
            })
        );
    });
    return Promise.all(arr);
}
/**
 * 展开合并
 * @param $ this.$
 * @param 按钮class为showHiddenBtn name是展开div的class
 */
export function ShowHiddenNameBox($) {
    $('.showHiddenBtn')
        .unbind('click')
        .click(function() {
            const $shiftBox = $('.' + $(this).attr('name') + 'Box');
            if (
                $(this)
                    .find('i')
                    .hasClass('el-icon-caret-top')
            ) {
                $(this).html('展开<i class="el-icon-caret-bottom"></i>');
                $shiftBox.data('heightData', $shiftBox.height());
                $shiftBox.css('overflow', 'hidden');
                $shiftBox.animate({ height: 0 }, 300, function() {});
            } else {
                $shiftBox.css('overflow', 'inherit');
                $(this).html('收起<i class="el-icon-caret-top"></i>');
                $shiftBox.animate({ height: $shiftBox.data('heightData') }, 300, function() {
                    $shiftBox.css('height', 'auto');
                });
            }
        });
}
/**
 * 获取对象的路径 函数柯里化
 * @param path 传入路径返回获取这个路径的方法
 * @param obj 获取哪个对象的参数
 */
/* eslint-disable */
export function creatGetPath(path) {
    let paths = path.split('.');
    return function getPath(obj) {
        let res = obj;
        let prop;
        while ((prop = paths.shift())) {
            res = res[prop];
        }
        return res;
    };
}
/* eslint-enable */
