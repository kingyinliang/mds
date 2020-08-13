<template>
    <el-dialog title="订单拆分" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1200px" custom-class="dialog__class">
        <div style="text-align: right;">
            <el-button v-if="isAuth('steSplit')" type="primary" size="small" @click="addSplitTable">
                新增
            </el-button>
        </div>
        <el-table :data="splitTable" :row-class-name="rowDelFlag" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
            <el-table-column type="index" width="55" label="序号" fixed />
            <el-table-column label="生产订单" width="120" prop="orderNo" :show-overflow-tooltip="true" />
            <el-table-column min-width="180" label="生产物料" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                </template>
            </el-table-column>
            <el-table-column label="订单日期" width="100" prop="orderDate" :show-overflow-tooltip="true" />
            <el-table-column label="计划数量" width="100" prop="planOutput" />
            <el-table-column label="单位" width="70" prop="outputUnit" />
            <el-table-column label="生产日期" width="160" prop="productDate" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">* </span>生产日期
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.productDate" type="date" placeholder="选择日期" size="small" style="width: 140px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" />
                </template>
            </el-table-column>
            <el-table-column label="锅号" width="100" prop="potNo" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">* </span>锅号
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.potNo" size="small" placeholder="请选择" @change="potNoChange(scope.row)">
                        <el-option v-for="(subItem, subIndex) in holder" :key="subIndex" :label="subItem.holderName" :value="subItem.holderNo" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="锅数" width="100" prop="potCount" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">* </span>锅数
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.potCount" size="small" placeholder="请输入" />
                </template>
            </el-table-column>
            <el-table-column label="每锅数量" width="100" prop="potAmount" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">* </span>每锅数量
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.potAmount" size="small" placeholder="请输入" />
                </template>
            </el-table-column>
            <el-table-column label="备注" width="100" prop="remark">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" size="small" placeholder="请输入" />
                </template>
            </el-table-column>
            <el-table-column label="操作人" width="100" prop="changer" :show-overflow-tooltip="true" />
            <el-table-column label="操作时间" width="100" prop="changed" :show-overflow-tooltip="true" />
            <el-table-column label="操作" fixed="right" align="center" width="80">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('steSplit')" type="text" icon="el-icon-delete" @click="removeDataRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="SubmitForm()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import _ from 'lodash';

    @Component
    export default class OrderSplitDialog extends Vue {
        dialogFormVisible = false;
        holder: HolderObj[] = [];
        splitTable: SplitObj[] = [];
        orgSplitTable: SplitObj[] = [];
        orderObj: SplitObj = {};

        init(row) {
            STE_API.STE_SPLIT_LIST_API({
                current: 1,
                size: 9999,
                orderNo: row.orderNo
            }).then(({ data }) => {
                this.orderObj = row;
                this.dialogFormVisible = true;
                this.splitTable = JSON.parse(JSON.stringify(data.data.records))
                this.orgSplitTable = JSON.parse(JSON.stringify(data.data.records))
            })
            this.getHolder(row)
        }

        getHolder(params) {
            COMMON_API.HOLDER_QUERY_API({
                deptId: params.workShop,
                holderType: '014',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                this.holder = data.data.records
            })
        }

        potNoChange(row) {
            const holderObj: (any) = this.holder.filter(it => it.holderNo === row.potNo);// eslint-disable-line
            row.potCount = holderObj[0].holderBatch;
            row.potAmount = holderObj[0].holderVolume;
        }

        addSplitTable() {
            this.splitTable.push({
                id: '',
                delFlag: 0,
                potUnit: this.orderObj.countOutputUnit,
                workShop: this.orderObj.workShop,
                productLine: this.orderObj.productLine,
                orderId: this.orderObj.id,
                orderNo: this.orderObj.orderNo,
                orderDate: this.orderObj.productDate,
                materialCode: this.orderObj.materialCode,
                materialName: this.orderObj.materialName,
                planOutput: this.orderObj.planOutput,
                outputUnit: this.orderObj.outputUnit,
                productDate: this.orderObj.productDate,
                potNo: '',
                potCount: '',
                potAmount: '',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber()
            })
        }

        SubmitForm() {
            const dataArr = this.splitTable.filter(it => it.delFlag !== 1)
            // eslint-disable-next-line
            const productDateMap: any[] = [];
            for (let i = 0; i < dataArr.length; i++) {
                if (!dataArr[i].productDate || !dataArr[i].potNo || !dataArr[i].potCount || !dataArr[i].potAmount || dataArr[i].potAmount === '0') {
                    this.$warningToast('请填写必填项');
                    return false
                }
                // console.log(dataArr[i + 1].productDate)
                // if (dataArr[i].productDate !== dataArr[i + 1].productDate) {
                //     this.$warningToast('同一订单不允许跨天生产');
                //     return false
                // }
                if (dataArr[i].productDate) {
                    productDateMap.push(dataArr[i].productDate);
                }
            }
            if ([...new Set(productDateMap)].length !== 1) {
                this.$warningToast('同一订单不允许跨天生产');
                return false;
            }
            const submitObj: SubmitObj = {
                deletes: [],
                inserts: [],
                updates: []
            };
            this.splitTable.forEach((item, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        submitObj.deletes.push(item.id);
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.orgSplitTable[index], item)) {
                        submitObj.updates.push(item);
                    }
                } else {
                    submitObj.inserts.push(item);
                }
            })
            STE_API.STE_SPLIT_SAVE_API(submitObj).then(({ data }) => {
                this.$successToast(data.msg);
                this.dialogFormVisible = false;
                this.$emit('getList');
            })
        }

        // 删除行
        removeDataRow(row) {
            row.delFlag = 1;
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }
    }
    interface HolderObj {
        holderNo?: string;
    }
    interface SubmitObj {
        deletes: string[];
        inserts: SplitObj[];
        updates: SplitObj[];
    }
    interface SplitObj {
        id?: string;
        delFlag?: number;
        countOutputUnit?: string;
        potUnit?: string;
        workShop?: string;
        productLine?: string;
        orderId?: string;
        orderNo?: string;
        orderDate?: string;
        materialCode?: string;
        materialName?: string;
        planOutput?: string;
        outputUnit?: string;
        productDate?: string;
        potNo?: string;
        potCount?: string;
        potAmount?: string;
        remark?: string;
        changed?: string;
        changer?: string;
    }
</script>

<style scoped>

</style>
