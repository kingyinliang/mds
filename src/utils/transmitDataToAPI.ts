import httpProxy from 'utils/net/httpProxy';
import axios from 'axios';

export default class TransmitDataToAPI {
    orgData: object[] = [];
    finalData: object[] = [];
    tableData: object[] = [];
    insertList: object[] = []; // 新增
    updateList: object[] = []; // 更新
    deleteList: object[] = []; // 删除
    tempForRow = {}; // 编辑时 row 缓存, 供比对用
    url = '';

    constructor(url) {
        // this.orgData = JSON.parse(JSON.stringify(data));
        // this.tableData = JSON.parse(JSON.stringify(data));
        this.url = url;
        if (new.target !== TransmitDataToAPI) {
            console.log('nono');
            return new TransmitDataToAPI(url);
        }

        // axios.post(this.url, {}).then(response => {
        //     this.orgData = JSON.parse(JSON.stringify(response.data.data));
        //     // if (this.orgData.length !== 0) {
        //     //     this.tableData = JSON.parse(JSON.stringify(this.orgData));
        //     //     this.tableData.forEach((item: TableData) => {
        //     //         item.changeMark = false; // 标示是否异动
        //     //         item.editabled = false; // 标示表格 row 可否编辑
        //     //     });
        //     // }
        //     // console.log('this.orgData');
        //     // console.log(this.orgData);
        //     // console.log('this.tableData');
        //     // console.log(this.tableData);
        //     return this;
        // });
    }

    async init() {
        // this.tableData = JSON.parse(JSON.stringify(response.data.data));
        // this.tableData = JSON.parse(JSON.stringify(this.orgData))
        await axios.post(this.url, {}).then(response => {
            this.orgData = JSON.parse(JSON.stringify(response.data.data));
            if (this.orgData.length !== 0) {
                this.tableData = JSON.parse(JSON.stringify(this.orgData));
                this.tableData.forEach((item: TableData) => {
                    item.changeMark = false; // 标示是否异动
                    item.editabled = false; // 标示表格 row 可否编辑
                });
            }
            // console.log('this.orgData');
            // console.log(this.orgData);
            // console.log('this.tableData');
            // console.log(this.tableData);
        });
        return this.tableData;
    }

    async sendData() {
        if (this.insertList.length === 0) {
            console.log('无新增数据');
        } else {
            this.insertList.forEach((item: TableData) => {
                delete item.editabled;
                delete item.id;
            });
        }

        this.updateList = this.findIt(this.tableData);
        if (this.updateList.length === 0) {
            console.log('修改数据无异动');
        } else {
            console.log('修改数据有异动');
            this.updateList.forEach((item: TableData) => {
                delete item.editabled;
                delete item.changeMark;
            });
        }
        if (this.deleteList.length === 0) {
            console.log('无删除数据');
        }
        console.log('this.insertList');
        console.log(this.insertList);
        console.log('this.updateList');
        console.log(this.updateList);
        console.log('this.deleteList');
        console.log(this.deleteList);

        if (this.insertList.length !== 0 || this.updateList.length !== 0 || this.deleteList.length !== 0) {
            await axios
                .post(this.url, {
                    insertList: this.insertList,
                    updateList: this.updateList,
                    deleteList: this.deleteList
                })
                .then(response => {
                    this.tableData = response.data.data;
                    console.log(this.tableData);
                });
        }
        return this.tableData;
    }

    removeItems(index, row) {
        // if (Object.prototype.hasOwnProperty.call(row, 'changeMark')) {
        if (row.id.substr(0, 4) !== 'temp') {
            console.log('删除已有的 data row');
            this.tableData.splice(index, 1);
            this.deleteList.push(row.id);
        } else if (this.insertList.length !== 0) {
            console.log('删除新增但未提交的 data row');
            this.tableData.splice(index, 1);
            this.insertList.forEach((item: TableData, subIndex) => {
                if (item.id === row.id) {
                    this.insertList.splice(subIndex, 1);
                }
            });
        }

        return this.tableData;
    }

    addItems() {
        const obj = JSON.parse(JSON.stringify(this.tableData[0]));
        Object.keys(obj).forEach(item => {
            if (typeof obj[item] === 'string') {
                console.log('我是字串');
                obj[item] = '';
            } else if (typeof obj[item] === 'number') {
                console.log('我是数字');
                obj[item] = 0;
            } else if (typeof obj[item] === 'boolean') {
                console.log('我是布林');
                obj[item] = false;
            } else {
                console.log('我是其馀');
                obj[item] = null;
            }
        });
        delete obj.changeMark;

        obj.id = 'temp' + new Date().getTime();
        this.tableData.unshift(obj);
        this.insertList.push(obj);
        (this.tableData[0] as TableData).editabled = true;
        return this.tableData;
    }

    updateItems(index, row) {
        if (row.id.substr(0, 4) !== 'temp') {
            // 非由新增产生的
            this.orgData.forEach((item: TableData, order) => {
                if (item.id === row.id) {
                    this.tempForRow = JSON.parse(JSON.stringify(this.orgData[order]));
                }
            });
        }
        (this.tableData[index] as TableData).editabled = true;
        return this.tableData;
    }

    checkItems(index, row) {
        (this.tableData[index] as TableData).editabled = false;
        if (row.id.substr(0, 4) !== 'temp') {
            // 非由新增产生的
            const tempRow = JSON.parse(JSON.stringify(row));
            delete tempRow.editabled;
            delete tempRow.changeMark;

            if (this.cmp(tempRow, this.tempForRow)) {
                console.log('无变更');
                (this.tableData[index] as TableData).changeMark = false;
            } else {
                console.log('有变更');
                (this.tableData[index] as TableData).changeMark = true;
            }
        }
        return this.tableData;
    }

    findIt(data: object[]) {
        const dataArrayIdList: object[] = [];
        data.forEach((item: TableData) => {
            if (!(item instanceof Object)) {
                console.log('data 找出非 object element');
                return false;
            }

            if (item.changeMark === true) {
                dataArrayIdList.push(item);
            }
        });

        return dataArrayIdList;
    }

    cmp(x, y) {
        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }
        // If both x and y are null or undefined and exactly the same
        if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
        }

        if (x === null || y === null) return x === y;

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions ㄋpassed across iframes
        if ((typeof x === 'function' && typeof y === 'function') || (x instanceof Date && y instanceof Date) || (x instanceof RegExp && y instanceof RegExp) || (x instanceof String && y instanceof String) || (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // If they are not strictly equal, they both need to be Objects
        if (!(x instanceof Object) || !(y instanceof Object)) {
            return false;
        }

        if (Object.prototype.isPrototypeOf.call(x, y) || Object.prototype.isPrototypeOf.call(y, x)) {
            return false;
        }

        //They must have the exact same prototype chain,the closest we can do is
        //test the constructor.
        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }
        for (const p in x) {
            //Inherited properties were tested using x.constructor === y.constructor
            if (Object.prototype.hasOwnProperty.call(x, p)) {
                // Allows comparing x[ p ] and y[ p ] when set to undefined
                if (!Object.prototype.hasOwnProperty.call(y, p)) {
                    return false;
                }
                // If they have the same strict value or identity then they are equal
                if (x[p] === y[p]) {
                    continue;
                }
                // Numbers, Strings, Functions, Booleans must be strictly equal
                if (typeof x[p] !== 'object') {
                    return false;
                }
                // Objects and Arrays must be tested recursively
                // if (!Object.is(x[ p ], y[ p ])) {
                //     return false;
                // }
            }
        }
        for (const q in y) {
            // allows x[ p ] to be set to undefined
            if (Object.prototype.hasOwnProperty.call(y, q) && !Object.prototype.hasOwnProperty.call(x, q)) {
                return false;
            }
        }
        return true;
    }
}
interface TableData {
    changed?: string;
    changer?: string;
    created?: string;
    creator?: string;
    delFlag?: string;
    id?: string;
    remark?: string;
    testCode?: string;
    testName?: string;
    version?: number;
    changeMark?: boolean;
    editabled?: boolean;
}
