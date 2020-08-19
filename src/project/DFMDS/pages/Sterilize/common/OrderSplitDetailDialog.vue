<template>
    <el-dialog title="拆分详情" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1200px" custom-class="dialog__class">
        <el-table :data="splitTable" :row-class-name="rowDelFlag" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
            <el-table-column type="index" width="55" label="序号" fixed />
            <el-table-column label="状态" width="100" prop="statusName" :show-overflow-tooltip="true" />
            <el-table-column label="锅单号" width="100" prop="potOrderNo" :show-overflow-tooltip="true" />
            <el-table-column label="生产锅序" width="100" prop="potOrder" :show-overflow-tooltip="true" />
            <el-table-column label="生产日期" width="100" prop="productDate" :show-overflow-tooltip="true" />
            <el-table-column label="锅号" width="100" prop="potNo" :show-overflow-tooltip="true" />
            <el-table-column min-width="180" label="生产物料" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.materialCode + ' ' + scope.row.materialName }}
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
            <el-table-column label="单位" width="70" prop="outputUnit" />
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
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="SubmitForm()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { STE_API } from 'common/api/api';
    import _ from 'lodash';

    @Component
    export default class OrderSplitDialog extends Vue {
        dialogFormVisible = false;
        splitTable: SplitObj[] = [];
        orgSplitTable: SplitObj[] = [];
        orderObj: SplitObj = {};

        init(row) {
            STE_API.STE_SPLIT_DETAIL_LIST_API({
                current: 1,
                size: 999,
                splitId: row.id
            }).then(({ data }) => {
                this.orderObj = row;
                this.dialogFormVisible = true;
                this.splitTable = JSON.parse(JSON.stringify(data.data.records))
                this.orgSplitTable = JSON.parse(JSON.stringify(data.data.records))
            })
        }

        SubmitForm() {
            for (const item of this.splitTable.filter(it => it.delFlag !== 1)) {
                if (!item.potAmount) {
                    this.$warningToast('请填写必填项');
                    return false
                }
            }
            const submitObj: SubmitObj = {
                deletes: [],
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
                }
            })
            STE_API.STE_SPLIT_DETAIL_SAVE_API(submitObj).then(({ data }) => {
                this.$successToast(data.msg);
                this.dialogFormVisible = false;
                this.$emit('getList')
            }).catch(() => {
                this.dialogFormVisible = false;
            })
        }

        // 删除行
        removeDataRow(row) {
            const list = this.splitTable.filter(it => it.delFlag !== 1)
            for (const i of list) {
                if (row.potOrder < Number(i.potOrder)) {
                    this.$warningToast('请先删除锅序最大的订单')
                    return false;
                }
            }
            this.$confirm('是否确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            })
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
        updates: SplitObj[];
    }
    interface SplitObj {
        id?: string;
        delFlag?: number;
        orderId?: string;
        orderNo?: string;
        materialCode?: string;
        materialName?: string;
        orderStartDate?: string;
        planOutput?: string;
        outputUnit?: string;
        productDate?: string;
        potNo?: string;
        potCount?: string;
        potAmount?: string;
        potOrder?: string;
        remark?: string;
        changed?: string;
        changer?: string;
    }
</script>

<style scoped>

</style>
