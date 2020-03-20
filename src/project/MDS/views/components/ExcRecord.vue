<template>
    <mds-card :title="'录入数据单位：MIN'" :name="'exc'" :iconBg="'#f05c4a'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" :disabled="!isRedact" @click="AddExcDate(ExcDate)">
                    新增
                </el-button>
            </div>
        </template>
        <el-table headerRowClassName="tableHead" class="newTable" :data="ExcDate" :rowClassName="RowDelFlag" border tooltipEffect="dark">
            <el-table-column type="index" width="55" label="序号" />
            <el-table-column label="白/中/夜班" width="120">
                <template slot="header">
                    <i class="reqI">*</i>
                    <span>白/中/夜班</span>
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.classType" placeholder="请选择" :disabled="!isRedact" size="small">
                        <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="异常情况" width="150">
                <template slot="header">
                    <i class="reqI">*</i>
                    <span>异常情况</span>
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.expCode" placeholder="请选择" :disabled="!isRedact" size="small" @change="selectExpCode(scope.row)">
                        <el-option v-for="(item, index) in stoppageType" :key="index" :label="item.value" :value="item.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="异常描述" :showOverflowTooltip="true" width="220">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.expInfo" :disabled="!isRedact" size="small" placeholder="手工录入" />
                </template>
            </el-table-column>
            <el-table-column width="241" label="异常开始时间">
                <template slot="header">
                    <i class="reqI">*</i>
                    <span>异常开始时间</span>
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.expStartDate" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 195px;" />
                </template>
            </el-table-column>
            <el-table-column width="241" label="异常结束时间">
                <template slot="header">
                    <i class="reqI">*</i>
                    <span>异常结束时间</span>
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.expEndDate" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 195px;" />
                </template>
            </el-table-column>
            <el-table-column label="异常时间" width="80">
                <template slot-scope="scope">
                    <span>{{ (scope.row.expContinue = mistiming(scope.row.expEndDate, scope.row.expStartDate, scope.row)) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60">
                <template slot-scope="scope">
                    <span>{{ (scope.row.expContinueUnit = 'MIN') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备" width="120">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.deviceId" filterable placeholder="设备" size="small" :disabled="!(isRedact && (scope.row.expCode === '001' || scope.row.expCode === '002'))">
                        <el-option v-for="(item, index) in equipmentType" :key="index" :label="item.deviceName" :value="item.deviceNo" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="物料分类简称" width="120">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.materialShort" filterable placeholder="选择简称" :disabled="!(isRedact && (scope.row.expCode === '003' || scope.row.expCode === '004'))" size="small">
                        <el-option v-for="(item, index) in materialShort" :key="index" :label="item.value" :value="item.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="能源" width="120">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.energy" placeholder="选择能源" :disabled="!(isRedact && scope.row.expCode === '005')" size="small">
                        <el-option v-for="(item, index) in enery" :key="index" :label="item.value" :value="item.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="备注" width="120">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" :disabled="!isRedact" size="small" placeholder="手工录入" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="70">
                <template slot-scope="scope">
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact" @click="dellistbomS(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <p style="line-height: 32px; font-size: 12px;">
                总停线时间：{{ ExcNum }}
            </p>
        </div>
    </mds-card>
</template>

<script>
import { SYSTEMSETUP_API, PACKAGING_API, BASICDATA_API } from '@/api/api';
import { toDate } from '@/net/validate';
export default {
    name: 'ExcRecord',
    components: {},
    props: {
        isRedact: {
            type: Boolean
        },
        order: {
            type: Object,
            default: () => {
            //    Object
            }
        }
    },
    data() {
        return {
            stoppageType: [],
            equipmentType: [],
            materialShort: [],
            enery: [],
            ExcDate: [],
            productShift: []
        };
    },
    computed: {
        mistiming: function() {
            const that = this;// eslint-disable-line
            return function(end, start, row) {
                if (end && start && row.delFlag !== '1') {
                    if ((toDate(end) - toDate(start)) / 60000 < 0) {
                        that.$warningTost('异常结束时间早于异常开始时间，请重新录入');
                        return 'NaN';
                    }
                        return Number(((toDate(end) - toDate(start)) / 60000).toFixed(2));

                }
            };
        },
        ExcNum: function() {
            let num = 0;
            this.ExcDate.forEach(item => {
                num = num + (item.delFlag === '0' ? (item.expContinue ? Number(item.expContinue) : 0) : 0);
            });
            // return typeof(this.ExcDate[0].expEndDate)
            return num;
        }
    },
    watch: {
        'order.factory'(n) {
            this.GetstoppageType(n);
            this.GetmaterialShort(n);
            this.Getenery(n);
        }
    },
    mounted() {
        // this.GetstoppageType()
        // this.GetmaterialShort()
        // this.Getenery()
        this.GetProductShift();
    },
    methods: {
        // 获取生产班次
        GetProductShift() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'product_shift'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.productShift = data.dicList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        selectExpCode(row) {
            if (row.expCode === '001' || row.expCode === '002') {
                row.materialShort = '';
                row.energy = '';
            } else if (row.expCode === '003' || row.expCode === '004') {
                row.deviceId = '';
                row.energy = '';
            } else if (row.expCode === '005') {
                row.deviceId = '';
                row.materialShort = '';
            } else {
                row.deviceId = '';
                row.materialShort = '';
                row.energy = '';
            }
        },
        // 保存or提交
        saveOrSubmitExc(id, str, resolve, reject) {
            if (this.ExcDate.length > 0) {
                this.ExcDate.forEach(item => {
                    if (typeof id === 'string') {
                        item.orderId = id;
                    } else if (typeof id === 'object') {
                        if (str === 'Squeeze') {
                            item.factory = id.factory;
                            item.workShop = id.workShop;
                            item.productLine = id.productLine;
                            item.productDate = id.productDate;
                        } else if (str === 'ste') {
                            item.orderId = id.orderId;
                            item.sign = id.sign;
                        } else {
                            item.orderId = id.orderId;
                            item.orderHouseId = id.orderHouseId;
                            item.blongProc = id.blongProc;
                        }
                    }
                });
                this.$http(`${PACKAGING_API.PKGEXCUPDATE_API}`, 'POST', this.ExcDate).then(({ data }) => {
                    if (data.code === 0) {
                        if (resolve) {
                            resolve('resolve');
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '异常记录' + data.msg
                        });
                        if (reject) {
                            reject('异常记录' + data.msg);
                        }
                    }
                });
            } else if (resolve) {
                    resolve('resolve');
                }
        },
        // 获取异常数据
        GetExcDate(id) {
            let postdata;
            if (typeof id === 'string') {
                postdata = {
                    order_id: id// eslint-disable-line
                };
            } else if (typeof id === 'object') {
                postdata = id;
            }
            this.$http(`${PACKAGING_API.PKGEXCLIST_API}`, 'POST', postdata).then(({ data }) => {
                if (data.code === 0) {
                    this.ExcDate = data.listForm;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 异常记录校验
        excrul() {
            let ty = true;
            this.ExcDate.forEach(item => {
                if (item.delFlag !== '1') {
                    if (item.expCode && item.expStartDate && item.expEndDate) {
                        if (Number(item.expContinue) < 0) {
                            ty = false;
                            this.$warningTost('异常开始时间大于结束时间');
                            return false;
                        }
                        if (item.expCode === '001' || item.expCode === '002') {
                            if (!item.deviceId) {
                                ty = false;
                                this.$warningTost('异常记录设备必填');
                                return false;
                            }
                        } else if (item.expCode === '003' || item.expCode === '004') {
                            if (!item.materialShort) {
                                ty = false;
                                this.$warningTost('异常记录物料分类必填');
                                return false;
                            }
                        } else if (item.expCode === '005') {
                            if (!item.energy) {
                                ty = false;
                                this.$warningTost('异常记录能源必填');
                                return false;
                            }
                        }
                    } else {
                        ty = false;
                        this.$warningTost('异常记录必填项未填');
                        return false;
                    }
                }
            });
            return ty;
        },
        // getDataList(){}
        getDataList(n) {
            this.GetstoppageType(n);
            this.GetmaterialShort(n);
            this.Getenery(n);
        },
        // 获取异常情况
        GetstoppageType() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'stoppage_type'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.stoppageType = data.dicList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 获取设备类型
        GetequipmentType(productLine) {
            this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
                param: '',
                deptId: productLine,
                currPage: '1',
                pageSize: '50'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.equipmentType = data.list.list;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 获取物料分类简称
        GetmaterialShort() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'MATERIAL_SHORT'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.materialShort = data.dicList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 获取能源下拉
        Getenery() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'ENERGY'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.enery = data.dicList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 新增异常记录
        AddExcDate(form) {
            form.push({
                id: '',
                orderId: '',
                expCode: '',
                expInfo: '',
                expStartDate: null,
                expEndDate: null,
                expContinue: 0,
                expContinueUnit: '',
                deviceId: '',
                materialShort: '',
                energy: '',
                remark: '',
                delFlag: '0'
            });
        },
        // 删除
        dellistbomS(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        }
    }
};
</script>

<style>
.rowDel {
    display: none;
}
</style>
