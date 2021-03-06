/*eslint no-invalid-this: "off"*/
import { BASICDATA_API, STERILIZED_API, SYSTEMSETUP_API } from '@/api/api';
// import Vue from "vue/types/index";
/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
    return /^1[0-9]{10}$/.test(s);
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
    return /^http[s]?:\/\/.*/.test(s);
}
/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
    return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false;
}
/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
    const res = [];
    const temp = {};
    for (let i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i];
    }
    for (let k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = [];
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1;
            }
            data[k]['_level'] = temp[data[k][pid]]['_level'] + 1;
            temp[data[k][pid]]['children'].push(data[k]);
        } else {
            res.push(data[k]);
        }
    }
    return res;
}
// 人员管理数据处理
export function transfer(data) {
    const res = [];
    const selcedid = [];
    data.forEach(item => {
        if (item.del_flag === '0') {
            selcedid.push(item.user_id);
        }
        res.push({
            label: item.name,
            key: item.user_id,
            screncon: item.name
        });
    });
    return {
        res: res,
        selcedid: selcedid
    };
}
export function setUserList(data) {
    const res = [];
    data.forEach(item => {
        res.push({
            label: item.realName + '（' + (item.workNum !== null && item.workNum !== '' ? item.workNum : item.workNumTemp) + '）',
            key: item.realName + '（' + (item.workNum !== null && item.workNum !== '' ? item.workNum : item.workNumTemp) + '）',
            screncon: item.realName + '（' + (item.workNum !== null && item.workNum !== '' ? item.workNum : item.workNumTemp) + '）'
        });
    });
    return res;
}
export function toDate(dateString) {
    const DATE_REGEXP = new RegExp('(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*');
    if (DATE_REGEXP.test(dateString)) {
        const timestamp = dateString.replace(DATE_REGEXP, function($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
            const date = new Date($year, Number($month) - 1, $day, $hour || '00', $minute || '00', $second || '00', $milliscond || '00');
            return date.getTime();
        });
        const date = new Date();
        date.setTime(timestamp);
        return date;
    }
    return null;
}
// dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// dateFormat(new Date(), "yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
export function dateFormat(date, fmt) {
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
    };
    let fmtTemp;
    if (/(y+)/.test(fmt)) fmtTemp = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmtTemp)) {
            fmtTemp = fmtTemp.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
        }
    }
    return fmtTemp;
}
/**
 * 导出
 * @param {*} ulr fileName vue
 */
// var fileDownload = require('js-file-download')
// export function exportFile (url, fileName, vue) {
//   vue.lodingS = true
//   vue.$http(url, 'POST', vue.plantList, false, true).then((res) => {
//     fileDownload(res.data, `${fileName}${getNewDate()}.xls`)
//     vue.lodingS = false
//   })
// }
// export function exportFileNoS3 (url, fileName, vue) {
//   vue.lodingS = true
//   vue.$http(url, 'POST', vue.plantList, false, true).then(({data}) => {
//     let blob = new Blob([data], {
//       type: 'application/ms-excel'
//     })
//     if (window.navigator.msSaveOrOpenBlob) {
//       navigator.msSaveBlob(blob)
//     } else {
//       let elink = document.createElement('a')
//       elink.download = `${fileName}${getNewDate()}.xlsx`
//       elink.style.display = 'none'
//       elink.href = URL.createObjectURL(blob)
//       document.body.appendChild(elink)
//       elink.click()
//       document.body.removeChild(elink)
//     }
//     vue.lodingS = false
//   })
// }

/**
 * 获取时间
 * @param {*} null
 */
export function getNewDate() {
    return new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate());
}

export function exportFile(url, fileName, vue) {
    vue.$http(url, 'POST', vue.plantList, false, false).then(({ data }) => {
        if (data.code === 0) {
            const elink = document.createElement('a');
            elink.download = `${fileName}${getNewDate()}.xls`;
            elink.style.display = 'none';
            elink.href = data.url;
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
        } else {
            vue.$notify.error({ title: '错误', message: data.msg });
        }
    });
}
export function exportFileForm(url, fileName, vue) {
    vue.$http(url, 'POST', vue.queryForm, false, false).then(({ data }) => {
        if (data.code === 0) {
            const elink = document.createElement('a');
            elink.download = `${fileName}${getNewDate()}.xls`;
            elink.style.display = 'none';
            elink.href = data.url;
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
        } else {
            vue.$notify.error({ title: '错误', message: data.msg });
        }
    });
}
/**
 * 动画
 * @param {*}
 */
export function headanimation($) {
    $('.toggleSearchBottom')
        .parents('.searchCard')
        .css('padding-bottom', '18px');
    // 搜索切换显隐
    $('.toggleSearchBottom').click(function() {
        $('.toggleSearchBottom')
            .parents('.searchCard')
            .css('padding-bottom', '0');
        $('.searchCard').animate({ height: 0 }, 300, function() {
            $('.searchCard')
                .parent('.main')
                .css('padding-bottom', 0);
        });
        $(this).hide();
        $('.toggleSearchTop').show();
    });
    $('.toggleSearchTop').click(function() {
        const hei = $('.el-card__body').height();
        $('.searchCard').animate({ height: `${hei + 40}px` }, 300, function() {
            $('.searchCard')
                .parent('.main')
                .css('padding-bottom', '15px');
        });
        $(this).hide();
        $('.toggleSearchBottom').show();
    });
}

/**
 * 获取状态
 * @param {*} null
 */
export function GetStatus(arr) {
    let sub = 0;
    let che = 0;
    let no = 0;
    let sav = 0;
    let status = '';
    arr.forEach(item => {
        if (item.status === 'noPass') {
            no = no + 1;
        } else if (item.status === 'submit') {
            sub = sub + 1;
        } else if (item.status === 'checked') {
            che = che + 1;
        } else if (item.status === 'saved') {
            sav = sav + 1;
        } else if (item.status === '') {
            sav = sav + 1;
        }
    });
    if (no > 0) {
        status = 'noPass';
    } else if (sav > 0) {
        status = 'saved';
    } else if (sub > 0) {
        status = 'submit';
    } else if (che > 0) {
        status = 'checked';
    }
    return status;
}
/**
 * 准备时间动画
 */

export function Readyanimation($) {
    $('.readyshiftBtn').click(function() {
        const $shiftBox = $('.' + $(this).attr('name') + 'Box');
        if (
            $(this)
                .find('i')
                .hasClass('el-icon-caret-top')
        ) {
            $(this).html('展开<em class="el-icon-caret-bottom"></em>');
            $shiftBox.data('heightData', $shiftBox.height());
            $shiftBox.css('overflow', 'hidden');
            $shiftBox.animate({ height: 0 }, 300, function() {
                //    empty
            });
        } else {
            $shiftBox.css('overflow', 'auto');
            $(this).html('收起<em class="el-icon-caret-top"></em>');
            $shiftBox.animate({ height: $shiftBox.data('heightData') }, 300, function() {
                $shiftBox.css('height', 'auto');
            });
        }
    });
}
export function ReadyanimationLook($) {
    $('#test1').click(function() {
        $('#test1Content').toggle();
    });
}
export function ReadyanimationLookNone($) {
    $('#test1Content').hide();
}
// 数据处理
export function orderList(data) {
    const result = [];
    let productDate = '';
    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            productDate = data[i].productDate;
        }
        const orderIdList = {};
        let orderNo = [data[i].orderNo];
        orderIdList[data[i].orderNo] = data[i].orderId;
        for (let j = i + 1; j < data.length; j++) {
            if (data[i].productLine === data[j].productLine) {
                j = ++i;
                orderNo.push(data[j].orderNo);
                orderIdList[data[j].orderNo] = data[j].orderId;
            }
        }
        let orderNos = '';
        if (orderNo.length === 1) {
            orderNos = orderNo[0];
            if (orderNo[0] === null) {
                orderNo = '';
            }
        } else {
            orderNos = '';
        }
        result.push({
            img: data[i].img,
            productLine: data[i].productLine,
            productLineName: data[i].productLineName,
            orderNo: orderNos,
            orderNo2: '',
            order_arr: orderNo, // eslint-disable-line
            realOutput: orderNo.length === 1 ? data[i].realOutput : '',
            materialCode: orderNo.length === 1 ? data[i].materialCode : '',
            materialName: orderNo.length === 1 ? data[i].materialName : '',
            orderStatus: orderNo.length === 1 ? data[i].orderStatus : '',
            planOutput: orderNo.length === 1 ? data[i].planOutput : '',
            outputUnit: orderNo.length === 1 ? data[i].outputUnit : '',
            properties: orderNo.length === 1 ? data[i].properties : '',
            orderIdList: orderIdList,
            productDate: productDate
        });
    }
    return result;
}
/**
 * 过滤车间 数据处理
 * @param {*} data
 */
export function orderListNew(data) {
    const orderArray = [];
    data.map(item => {
        const findRow = orderArray.findIndex(items => items.productLineName === item.productLineName);
        const orderListObj = {
            orderNo: item.orderNo,
            orderId: item.orderId,
            materialName: item.materialName,
            materialCode: item.materialCode,
            countOutput: item.countOutput,
            planOutput: item.planOutput,
            orderStatus: item.orderStatus,
            exportMaterial: item.exportMaterial
        };
        if (findRow === -1) {
            orderArray.push({
                img: item.img,
                productLine: item.productLine,
                productLineName: item.productLineName,
                orderNoList: [orderListObj],
                productDate: item.productDate,
                orderNo: '',
                materialCode: '',
                orderStatus: ''
            });
        } else {
            orderArray[findRow].orderNoList.push(orderListObj);
        }
    });
    orderArray.map(t => {
        if (t.orderNoList.length === 1) {
            t.materialCode = t.orderNoList[0].materialCode + ' ' + t.orderNoList[0].materialName;
            t.countOutput = t.orderNoList[0].countOutput;
            t.planOutput = t.orderNoList[0].planOutput;
            t.orderNo = t.orderNoList[0].orderNo;
            t.orderStatus = t.orderNoList[0].orderStatus;
        }
    });
    console.log(orderArray);
    return orderArray;
}
/**
 * 获取工厂
 */
export function getFactory(Vue) {
    Vue.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
        if (data.code === 0) {
            Vue.factory = data.typeList;
            Vue.formHeader.factory = data.typeList[0].deptId;
        } else {
            Vue.$notify.error({ title: '错误', message: data.msg });
        }
    });
}
/**
 * 获取车间
 */
export function getWorkshop(Vue, id, workshopName) {
    if (id) {
        Vue.$http(
            `${BASICDATA_API.FINDORGBYID_API}`,
            'POST',
            {
                deptId: id,
                deptName: workshopName
            },
            false,
            false,
            false
        ).then(({ data }) => {
            if (data.code === 0) {
                Vue.workshop = data.typeList;
                if (data.typeList.length) {
                    Vue.formHeader.workShop = data.typeList[0].deptId;
                }
            } else {
                Vue.$notify.error({ title: '错误', message: data.msg });
            }
        });
    }
}
/**
 * 获取产线
 */
export function getParentline(Vue, id) {
    if (id) {
        Vue.$http(
            `${BASICDATA_API.FINDORGBYPARENTID_API}`,
            'POST',
            {
                parentId: id
            },
            false,
            false,
            false
        ).then(({ data }) => {
            if (data.code === 0) {
                Vue.productline = data.childList;
                if (data.childList.length) {
                    Vue.formHeader.productline = data.childList[0].deptId;
                }
            } else {
                Vue.$notify.error({ title: '错误', message: data.msg });
            }
        });
    }
}
/**
 * 获取状态
 */
export function getStatus(Vue) {
    Vue.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'status_type' }, false, false, false).then(({ data }) => {
        if (data.code === 0) {
            Vue.Status = data.dicList;
        } else {
            Vue.$notify.error({ title: '错误', message: data.msg });
        }
    });
}
export class Stesave {
    constructor(formHeader) {
        this.formHeader = formHeader;
    }

    excUpdate(vue, str, resolve, reject) {
        return vue.$refs.excrecord.saveOrSubmitExc(
            {
                orderId: this.formHeader.orderId,
                sign: str
            },
            'ste',
            resolve,
            reject
        );
    }

    textUpdate(vue, str, resolve, reject) {
        return vue.$refs.textrecord.UpdateText(
            {
                orderId: this.formHeader.orderId,
                sign: str
            },
            'ste',
            resolve,
            reject
        );
    }

    orderUpdate(vue, status, str, resolve, reject) {
        this.formHeader[status] = str;
        vue.$http(`${STERILIZED_API.STE_ORDER_HEAD_UPDATE_API}`, 'POST', this.formHeader).then(({ data }) => {
            if (data.code === 0) {
                if (resolve) {
                    resolve('resolve');
                }
            } else if (reject) {
                reject('表头保存' + data.msg);
            }
        });
    }
}
// 浮点型加法函数
export function accAdd(arg1, arg2) {
    let r1, r2, argTemp1, argTemp2;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    const c = Math.abs(r1 - r2);
    const m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        const cm = Math.pow(10, c);
        if (r1 > r2) {
            argTemp1 = Number(arg1.toString().replace('.', ''));
            argTemp2 = Number(arg2.toString().replace('.', '')) * cm;
        } else {
            argTemp1 = Number(arg1.toString().replace('.', '')) * cm;
            argTemp2 = Number(arg2.toString().replace('.', ''));
        }
    } else {
        argTemp1 = Number(arg1.toString().replace('.', ''));
        argTemp2 = Number(arg2.toString().replace('.', ''));
    }
    return (argTemp1 + argTemp2) / m;
}
// 浮点型乘法
export function accMul(arg1, arg2) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
        m += s1.split('.')[1].length;
    } catch (e) {
        //
    }
    try {
        m += s2.split('.')[1].length;
    } catch (e) {
        //
    }
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}
// 浮点型减法
export function accSub(arg1, arg2) {
    let r1;
    let r2;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    const m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
    const n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
// 浮点型除法函数
export function accDiv(arg1, arg2) {
    let t1 = 0;
    let t2 = 0;
    try {
        t1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        //
    }
    try {
        t2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        //
    }
    const r1 = Number(arg1.toString().replace('.', ''));
    const r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
// 深克隆
export function deepClone(str) {
    return JSON.parse(JSON.stringify(str));
}
