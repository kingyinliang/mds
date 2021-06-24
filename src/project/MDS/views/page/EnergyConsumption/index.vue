<template>
    <div>
        <div class="header_main">
            <mds-card title="列表">
                <template slot="titleBtn">
                    <div style="float: right; margin-bottom: 5px;">
                        <el-date-picker v-model="plantList.statDate" size="small" style="margin-right: 10px;" type="month" value-format="yyyy-MM" placeholder="选择月" />
                        <el-button v-if="isAuth('sys:att:listAtt')" icon="el-icon-search" type="primary" size="small" @click="GetList(true)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('sys:att:listAtt')" icon="el-icon-document" type="primary" size="small" @click="setDate">
                            参考上期
                        </el-button>
                        <el-button v-if="isAuth('sys:att:listAtt')" icon="el-icon-tickets" type="primary" size="small" @click="saveDate">
                            全部保存
                        </el-button>
                        <el-button v-if="isAuth('sys:att:listAtt')" icon="el-icon-refresh" type="primary" size="small" @click="GetList(true)">
                            刷新
                        </el-button>
                    </div>
                </template>
                <el-row>
                    <el-table ref="table1" header-row-class-name="tableHead" :cell-style="{'text-align':'center'}" :data="datalist" class="newTable" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column label="行号" type="index" />
                        <el-table-column prop="dataCode" label="编码" :show-overflow-tooltip="true" />
                        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" />
                        <el-table-column prop="freezeState" label="冻结状态" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.freezeState === "1" ? '冻结':"未冻结" }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="uploadDate" label="时间" :show-overflow-tooltip="true" />
                        <!-- inputType	是	string	是	数据采集类型：1 管理信息系统；2 生产监控管理系统；3 分布式控制系统；4 现场仪表；5 手工填报 -->
                        <el-table-column prop="inputType" label="生产方式" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div>
                                    {{ scope.row.inputType | typeString }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="unit" :show-overflow-tooltip="true" />
                        <el-table-column prop="dataValue" label="数值" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div>
                                    <el-input v-model="scope.row.dataValue" type="text" :disabled="scope.row.freezeState !== '0'" @input="changeVal(scope.row)" />
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <div v-if="isAuth('sys:att:updateAtt') && scope.row.freezeState !=='1'">
                                    <el-button style="padding: 0;" type="text" @click="saveDateItem(scope.row,scope.$index)">
                                        保存
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </mds-card>
        </div>
    </div>
</template>

<script>
import { ECP_API } from '@/api/api';
// import { dateFormat } from '@/utils/date.js';
import { dateFormat } from 'utils/utils';
// import { setUserList, headanimation } from '@/net/validate';
export default {
    name: 'Index',
    components: {},
    filters: {
        typeString(type) {
            // <!-- inputType	是	string	是	数据采集类型：1 管理信息系统；2 生产监控管理系统；3 分布式控制系统；4 现场仪表；5 手工填报 -->
            switch (type) {
                case '1':
                    return '管理信息系统';
                case '2':
                    return '生产监控管理系统';
                case '3':
                    return '分布式控制系统';
                case '4':
                    return '现场仪表';
                case '5':
                    return '手工填报';
                default:
                    break;
            }
        }
    },
    data() {
        return {
            datalist: [
                {
                    rid: '048fc563-cb83-4142-9644-f69b6b2e3716',
                    enterpriseCode: '91370600780790663W',
                    dataCode: '00-00-0000-010104-10',
                    dataValue: '1140.1000',
                    inputType: '5',
                    statType: 2,
                    statDate: '2021-05-01',
                    uploadDate: '2021-05-01',
                    scope: '1',
                    valid: '1',
                    originalData: null,
                    timeOut: null,
                    dataState: '5',
                    freezeState: '0',
                    unit: '吨',
                    dataSource: '4',
                    createTime: null,
                    updateTime: null,
                    deleteFlag: null,
                    version: 2,
                    energyClassCode: '01',
                    energyTypeCode: '0104',
                    name: '全厂-一次能源-一般烟煤-购进',
                    energyTypeName: '一般烟煤',
                    epRid: '1325636639124402178'
                },
                {
                    rid: '048fc563-cb83-4142-9644-f69b6b2e3716',
                    enterpriseCode: '91370600780790663W',
                    dataCode: '00-00-0000-010104-10',
                    dataValue: '1140.1000',
                    inputType: '5',
                    statType: 2,
                    statDate: '2021-05-01',
                    uploadDate: '2021-05-01',
                    scope: '1',
                    valid: '1',
                    originalData: null,
                    timeOut: null,
                    dataState: '5',
                    freezeState: '0',
                    unit: '吨',
                    dataSource: '4',
                    createTime: null,
                    updateTime: null,
                    deleteFlag: null,
                    version: 2,
                    energyClassCode: '01',
                    energyTypeCode: '0104',
                    name: '全厂-一次能源-一般烟煤-购进',
                    energyTypeName: '一般烟煤',
                    epRid: '1325636639124402178'
                },
                {
                    rid: '048fc563-cb83-4142-9644-f69b6b2e3716',
                    enterpriseCode: '91370600780790663W',
                    dataCode: '00-00-0000-010104-10',
                    dataValue: '1140.1000',
                    inputType: '5',
                    statType: 2,
                    statDate: '2021-05-01',
                    uploadDate: '2021-05-01',
                    scope: '1',
                    valid: '1',
                    originalData: null,
                    timeOut: null,
                    dataState: '5',
                    freezeState: '1',
                    unit: '吨',
                    dataSource: '4',
                    createTime: null,
                    updateTime: null,
                    deleteFlag: null,
                    version: 2,
                    energyClassCode: '01',
                    energyTypeCode: '0104',
                    name: '全厂-一次能源-一般烟煤-购进',
                    energyTypeName: '一般烟煤',
                    epRid: '1325636639124402178'
                }
            ],
            plantList: {
                statDate: dateFormat(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM')
            },
            oldDatalist: [],
            saveList: []
        };
    },
    mounted() {
        this.GetList();
    },
    methods: {
        /**
         * 校验输入框中数值
         * 规则：只能是大于等于0的数字。可以为小数。填写几位小数，则显示几位小数，后面不要补0
         */
        changeVal(row) {
            row.dataValue = row.dataValue.match(/\d+(\.\d{0,2})?/) ? row.dataValue.match(/\d+(\.\d{0,2})?/)[0] : '';
        },
        //参考上期
        setDate() {
            // 给当前月份的日期减一月
            const sdtime = new Date(this.plantList.statDate).setMonth(new Date(this.plantList.statDate).getMonth() - 1); //一个月
            const time = dateFormat(new Date(sdtime), 'yyyy-MM');
            console.log(sdtime);
            console.log(time);
            this.GetBeforeList(time);
        },
        // 获取列表
        GetList() {
            this.$http(`${ECP_API.ENERGYCONSUMOPTION_LIST}`, 'GET', this.plantList).then(({ data }) => {
                if (data.code === 200) {
                    this.datalist = data.data;
                    this.oldDatalist = JSON.parse(JSON.stringify(this.datalist));
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        //参考上期中查询到上月数据之后 变更给选中日期中列表数值
        GetBeforeList(date) {
            const queryInfo = {
                statDate: date
            };
            this.$http(`${ECP_API.ENERGYCONSUMOPTION_BEFORE}`, 'GET', queryInfo).then(({ data }) => {
                if (data.code === 200) {
                    // 将查询到的数据赋值给datalist中的数值
                    for (let index = 0; index < this.datalist.length; index++) {
                        const nowEle = this.datalist[index];
                        const beforeEle = data.data[index];
                        if (nowEle.freezeState !== '1') {
                            nowEle.dataValue = beforeEle.dataValue;
                        }
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 判断数据是否有变动
        isChange() {
            console.log(this.oldDatalist);
            console.log(this.datalist);
            const indexArr = [];
            this.saveList = [];

            for (let index = 0; index < this.datalist.length; index++) {
                const newEle = this.datalist[index];
                const oldEle = this.oldDatalist[index];
                if (oldEle.dataValue !== newEle.dataValue && newEle.dataValue !== '') {
                    this.saveList.push(newEle);
                }
                if (newEle.dataValue === '' && newEle.freezeState !== '1') {
                    indexArr.push(index + 1);
                }
            }
            return indexArr;
        },
        /**
         * 数值保存 全部保存
         *  改了哪个列表的数值就更改哪一项，数值为空提示第几行为空
         */
        saveDate() {
            console.log(this.isChange());
            if (this.isChange().length !== 0) {
                this.$errorToast(`数值第${this.isChange()}行未填，请核实`);
                return;
            }
            if (this.saveList.length === 0) {
                this.$warningToast(`请至少修改一条数据的数值！`);
                return;
            }
            this.$confirm('确认保存数据？', '保存', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${ECP_API.ENERGYCONSUMOPTION_SAVE}`, 'POST', this.saveList).then(({ data }) => {
                        if (data.code === 200) {
                            this.GetList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                })
                .catch(() => {
                    // this.$infoToast('已取消删除');
                });
        },
        /**
         *
         *  单行保存，
         */
        saveDateItem(row, index) {
            console.log(row);
            console.log(index);
            if (row.dataValue === '') {
                this.$errorToast(`数值不能为空`);
                return;
            }
            if (row.dataValue === this.oldDatalist[index].dataValue) {
                this.$successToast(`保存成功`);
                return;
            }
            const arrInfo = [row];
            this.$confirm('确认保存数据？', '保存', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${ECP_API.ENERGYCONSUMOPTION_SAVE}`, 'POST', arrInfo).then(({ data }) => {
                        if (data.code === 200) {
                            this.datalist = data.page.list;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                })
                .catch(() => {
                    // this.$infoToast('已取消删除');
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.searchCard {
    margin-bottom: 0;
}
.searchCard,
.tableCard {
    position: relative;
    .toggleSearchTop {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .toggleSearchBottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .el-icon-caret-top::before,
    .el-icon-caret-bottom::before {
        color: #dcdfe6;
    }
}
</style>
