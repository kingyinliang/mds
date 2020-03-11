<template>
    <div>
        <el-button type="primary" size="small" :disabled="!isRedact" style="float: right; margin-bottom: 5px;" @click="AddIn">
            新增
        </el-button>
        <el-table headerRowClassName="tableHead" :rowClassName="RowDelFlag" :data="InDataList" border tooltipEffect="dark">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column label="白/中/夜班" :showOverflowTooltip="true" prop="kjmWorkShopName">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.classes" style="width: 100%;" size="mini" placeholder="请选择" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @change="ChangeProductShift(scope.row)">
                        <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="生产批次" :showOverflowTooltip="true" prop="kjmWorkShopName" width="190">
                <template slot="header">
                    <i class="reqI">*</i><span>生产批次</span>
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.batch" placeholder="手工录入" size="mini" maxlength="10" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="本班生产 " :showOverflowTooltip="true" prop="production" width="190">
                <template slot="header">
                    <i class="reqI">*</i><span>本班生产</span>
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.production" type="number" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="单位" :showOverflowTooltip="true" prop="kjmWorkShopName" width="60">
                <template slot-scope="scope">
                    {{ (scope.row.unitName = '个') }}
                </template>
            </el-table-column>
            <el-table-column label="备注" :showOverflowTooltip="true" prop="kjmWorkShopName" width="190">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="操作" :showOverflowTooltip="true" prop="kjmWorkShopName" width="70" fixed="right">
                <template slot-scope="scope">
                    <el-button class="delBtn" type="text" icon="el-icon-delete" circle size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delIn(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <p style="font-size: 14px; line-height: 32px;">
            产量数合计：{{ sumNum }}个
        </p>
        <auditLog :tableData="InAudit" />
    </div>
</template>

<script>
import { BOTTLE_API } from '@/api/api';
import { GetStatus } from '@/net/validate';
export default {
    name: 'InStorage',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean,
            default() {
                return false;
            }
        },
        productShift: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            value2: '',
            InDataList: [],
            InAudit: [],
            num: ''
        };
    },
    computed: {
        sumNum: function() {
            let num = 0;
            this.InDataList.forEach(item => {
                if (item.delFlag !== '1') {
                    num += Number(item.production);
                }
            });
            return num;
        }
    },
    mounted() {},
    methods: {
        setNum(num) {
            const tmp = num;
            this.num = JSON.stringify(tmp);
        },
        setAmount(num) {
            this.InDataList.forEach(item => {
                if (!item.status) {
                    item.production = num;
                } else if (item.status === 'saved' || item.status === 'noPass') {
                    item.production = num;
                }
            });
        },
        // 获取生产入库
        getDataList() {
            let status = '';
            this.$http(`${BOTTLE_API.BOTTLE_PRO_IN_LIST}`, 'POST', {
                orderId: this.$store.state.common.bottle.ProOrderId
            })
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.InDataList = data.list;
                        this.InAudit = data.vrList;
                        status = GetStatus(this.InDataList);
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                })
                .finally(() => {
                    this.$emit('setInStorageState', status);
                });
        },
        // 生产班次下拉
        ChangeProductShift(row) {
            row.classesName = this.productShift.filter(item => item.code === row.classes)[0].value;
        },
        // 保存提交
        SaveOrSubmitData(str, resolve, reject) {
            this.InDataList.forEach(item => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
            });
            this.$http(`${str === 'saved' ? BOTTLE_API.BOTTLE_PRO_IN_SAVE : BOTTLE_API.BOTTLE_PRO_IN_SUBMIT}`, 'POST', this.InDataList).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('生产入库' + data.msg);
                    }
            });
        },
        // 校验
        dataRul() {
            let ty = true;
            this.InDataList.forEach(item => {
                if (item.delFlag !== '1') {
                    if (Number(item.production) < 0) {
                        ty = false;
                        this.$warning_SHINHO('生产入库本班生产必须为正整数');
                        return false;
                    }
                    if (!(item.production && item.batch)) {
                        ty = false;
                        this.$warning_SHINHO('生产入库必填项未填');
                        return false;
                    }
                    if (item.batch.length !== 10) {
                        ty = false;
                        this.$warning_SHINHO('生产入库批次十位');
                        return false;
                    }
                }
            });
            return ty;
        },
        AddIn() {
            let production = '';
            if (this.InDataList.filter(item => item.delFlag === '0').length) {
            } else {
                production = this.num;
            }
            this.InDataList.splice(0, 0, {
                id: '',
                orderId: this.$store.state.common.bottle.ProOrderId,
                serialNumber: '',
                status: '',
                classes: '',
                batch: '',
                production: production,
                unit: 'EA',
                remark: '',
                delFlag: '0',
                changed: '',
                changer: '',
                classesName: '',
                unitName: '个'
            });
        },
        delIn(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        //  RowDelFlag
        RowDelFlag({ row, rowIndex }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        ChangeNum() {
            this.$emit('SetMeaterielNum', this.sumNum);
        }
    }
};
</script>

<style scoped></style>
