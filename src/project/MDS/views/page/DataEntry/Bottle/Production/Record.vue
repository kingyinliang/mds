<template>
    <div>
        <el-button type="primary" size="small" :disabled="!isRedact" style="float: right; margin-bottom: 5px;" @click="AddRecord">
            新增
        </el-button>
        <el-table headerRowClassName="tableHead" :rowClassName="RowDelFlag" :data="RecordList.filter(item => item.delFlag === '0').slice((currPage - 1) * pageSize, currPage * pageSize)" border tooltipEffect="dark">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column label="时间" prop="kjmWorkShopName">
                <template slot="header">
                    <i class="reqI">*</i><span>时间</span>
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.date" style="width: 100%;" size="mini" type="datetime" :disabled="!isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked'" valueFormat="yyyy-MM-dd  HH:mm:ss" format="yyyy-MM-dd  HH:mm" />
                </template>
            </el-table-column>
            <el-table-column label="瓶胚批号" :showOverflowTooltip="true" width="180">
                <template slot="header">
                    <i class="reqI">*</i><span>瓶胚批号</span>
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.embryoBatch" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="瓶胚数量 " :showOverflowTooltip="true" width="180">
                <template slot="header">
                    <i class="reqI">*</i><span>瓶胚数量</span>
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.embryoAmount" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="单位" :showOverflowTooltip="true" prop="kjmWorkShopName" width="60">
                <template slot-scope="scope">
                    {{ (scope.row.unit = '个') }}
                </template>
            </el-table-column>
            <el-table-column label="是否除尘" :showOverflowTooltip="true" prop="isDust" width="180">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.isDust" placeholder="请选择" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="供应商" :showOverflowTooltip="true" prop="kjmWorkShopName" width="180">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.supplier" placeholder="请选择" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')">
                        <el-option v-for="(iteam, index) in supplier" :key="index" :label="iteam.value" :value="iteam.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="备注" :showOverflowTooltip="true" prop="kjmWorkShopName" width="140">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="操作" :showOverflowTooltip="true" prop="kjmWorkShopName" width="70" fixed="right">
                <template slot-scope="scope">
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="delRecord(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :currentPage="currPage" :pageSizes="[10, 20, 50]" :pageSize="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        <p style="font-size: 14px; line-height: 32px;">
            合计数量：{{ sumNum }}个
        </p>
    </div>
</template>

<script>
import { BOTTLE_API } from '@/api/api';
export default {
    name: 'Record',
    components: {},
    props: {
        isRedact: {
            type: Boolean,
            default() {
                return false;
            }
        },
        supplier: {
            type: Array,
            default: () => {}
        }
    },
    data() {
        return {
            RecordList: [],
            currPage: 1,
            pageSize: 10,
            totalCount: 1
        };
    },
    computed: {
        sumNum: function() {
            let num = 0;
            this.RecordList.forEach(item => {
                if (item.delFlag !== '1') {
                    num += Number(item.embryoAmount);
                }
            });
            return num;
        }
    },
    mounted() {},
    methods: {
        // 获取投胚记录
        getDataList() {
            this.$http(`${BOTTLE_API.BOTTLE_PRO_RECORD_LIST}`, 'POST', {
                orderId: this.$store.state.common.bottle.ProOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.RecordList = data.embryoRecordList;
                    this.currPage = 1;
                    this.pageSize = 10;
                    this.totalCount = data.embryoRecordList.length;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 保存提交
        SaveData(str, resolve, reject) {
            this.RecordList.forEach(item => {
                item.sumEmbryoAmount = this.sumNum;
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
            this.$http(`${BOTTLE_API.BOTTLE_PRO_RECORD_SAVE}`, 'POST', this.RecordList).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('投胚记录' + data.msg);
                    }
            });
        },
        // 保存提交
        SubmitData(str, resolve, reject) {
            this.$http(`${BOTTLE_API.BOTTLE_PRO_RECORD_SUBMIT}`, 'POST', {
                orderId: this.$store.state.common.bottle.ProOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('投胚记录' + data.msg);
                    }
            });
        },
        // 校验
        dataRul() {
            let ty = true;
            this.RecordList.forEach(item => {
                if (item.delFlag !== '1') {
                    if (!(item.date && item.embryoBatch && item.embryoAmount)) {
                        ty = false;
                        this.$warning_SHINHO('投胚记录必填项未填');
                        return false;
                    }
                }
            });
            return ty;
        },
        // 新增
        AddRecord() {
            this.RecordList.splice(0, 0, {
                date: '',
                isDust: '1',
                delFlag: '0',
                embryoAmount: this.RecordList.length > 0 ? this.RecordList[this.RecordList.length - 1].embryoAmount : '',
                embryoBatch: '',
                id: '',
                orderId: this.$store.state.common.bottle.ProOrderId,
                remark: '',
                status: '',
                sumEmbryoAmount: '',
                supplier: this.RecordList.length > 0 ? this.RecordList[this.RecordList.length - 1].supplier : this.supplier.length > 0 ? this.supplier[0].code : '',
                unit: ''
            });
            this.currPage = 1;
            this.totalCount = this.RecordList.filter(item => item.delFlag === '0').length;
        },
        delRecord(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
                this.totalCount = this.RecordList.filter(item => item.delFlag === '0').length;
            });
        },
        //  RowDelFlag
        RowDelFlag({ row, rowIndex }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
        }
    }
};
</script>

<style scoped></style>
