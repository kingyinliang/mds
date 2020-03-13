import { BASICDATA_API } from '@/api/api';

// 获取工厂
/**
 * 获取工厂
 * @param {*} Vue = this
 */
export function Getdeptcode(Vue) {
    Vue.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
        if (data.code === 0) {
            Vue.factory = data.typeList;
            if (data.typeList.length > 0) {
                Vue.plantList.factory = data.typeList[0].deptId;
            }
        } else {
            Vue.prototype.$error_SHINHO(data.msg);
        }
    });
}
/**
 * 获取状态
 * @param {*} Vue = this, id = 工厂id, str = 筛选车间
 */
export function Getdeptbyid(Vue, id, str) {
    Vue.plantList.workShop = '';
    if (id) {
        Vue.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: str }, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                Vue.workshop = data.typeList;
                if (data.typeList.length > 0) {
                    Vue.plantList.workShop = data.typeList[0].deptId;
                }
            } else {
                Vue.prototype.$error_SHINHO(data.msg);
            }
        });
    }
}
// 深拷贝
export function deepCopy(obj) {
    const objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // 判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepCopy(obj[key]);
                } else {
                    // 如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
