<template>
    <el-dialog title="订单拆分" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1200px" custom-class="dialog__class">
        <div style="text-align: right;">
            <el-button type="primary" size="small" @click="addSplitTable">
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
            <el-table-column label="生产日期" width="140" prop="productDate" :show-overflow-tooltip="true">
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
                    <el-input v-model="scope.row.potNo" size="small" placeholder="请输入" />
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
                    <el-button type="text" icon="el-icon-delete" @click="removeDataRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="SubmitForm()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { STE_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import _ from 'lodash';

    @Component
    export default class OrderSplitDialog extends Vue {
        dialogFormVisible = false;
        splitTable: SplitObj[] = [];
        orgSplitTable: SplitObj[] = [];
        orderObj: SplitObj = {};

        init(row) {
            STE_API.STE_SPLIT_LIST_API({
                current: 1,
                size: 999,
                orderNo: row.orderNo
            }).then(({ data }) => {
                this.orderObj = row;
                this.dialogFormVisible = true;
                this.splitTable = JSON.parse(JSON.stringify(data.data.records))
                this.orgSplitTable = JSON.parse(JSON.stringify(data.data.records))
            })
        }

        addSplitTable() {
            this.splitTable.push({
                id: '',
                delFlag: 0,
                workShop: this.orderObj.workShop,
                productLine: this.orderObj.productLine,
                orderId: this.orderObj.orderId,
                orderNo: this.orderObj.orderNo,
                orderDate: this.orderObj.orderDate,
                materialCode: this.orderObj.materialCode,
                materialName: this.orderObj.materialName,
                planOutput: this.orderObj.planOutput,
                outputUnit: this.orderObj.outputUnit,
                productDate: '',
                potNo: '',
                potCount: '',
                potAmount: '',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber()
            })
        }

        SubmitForm() {
            for (const item of this.splitTable.filter(it => it.delFlag !== 1)) {
                if (!item.productDate || !item.potNo || !item.potCount) {
                    this.$warningToast('请填写必填项');
                    return false
                }
            }
            const submitObj: SubmitObj = {
                deletes: [],
                inserts: [],
                updates: []
            }
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
                console.log(data);
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
    interface SubmitObj {
        deletes: string[];
        inserts: SplitObj[];
        updates: SplitObj[];
    }
    interface SplitObj {
        id?: string;
        delFlag?: number;
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
