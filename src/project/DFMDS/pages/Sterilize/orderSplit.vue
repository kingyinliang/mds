<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steSplitQuery"
            :type="'home'"
            :rules="rules"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
            @created-end="createdEnd"
        >
            <template slot="home">
                <el-row class="home_card__main" :gutter="10">
                    <el-col :span="10">
                        <mds-card title="订单查询" name="ste" :pack-up="false" style="margin-bottom: 0; background: #fff;">
                            <el-table :data="queryResultList" header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 61 - 52 - 47" border tooltip-effect="dark" @row-dblclick="showSplitTable">
                                <el-table-column type="index" width="55" label="序号" fixed />
                                <el-table-column label="订单状态" width="80" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <label :style="{ color: scope.row.orderStatusName === '不通过' ? 'red' : scope.row.orderStatusName === '通过' ? 'rgb(103, 194, 58)' : '',}">{{ scope.row.orderStatusName }}</label>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单日期" width="100" prop="orderStartDate" :show-overflow-tooltip="true" />
                                <el-table-column label="生产订单" width="120" prop="orderNo" :show-overflow-tooltip="true" />
                                <el-table-column min-width="180" label="生产物料" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="计划数量" width="120" prop="planOutput" />
                                <el-table-column label="单位" width="70" prop="outputUnit" />
                                <el-table-column label="备注" width="70" prop="remark" />
                                <el-table-column label="操作" fixed="right" align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('steSplit')" type="text" @click="orderSplit(scope.row)">
                                            <em class="iconfont factory-chaifen" />拆分
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row style="overflow: hidden;">
                                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                            </el-row>
                        </mds-card>
                    </el-col>
                    <el-col :span="14">
                        <mds-card title="拆分管理" name="split" :pack-up="false" style="margin-bottom: 0; background: #fff;">
                            <template slot="titleBtn">
                                <el-form :inline="true" :model="splitForm" size="small" label-width="125px" style="float: right; height: 42px;">
                                    <el-form-item label="锅号：" style="margin-bottom: 10px;">
                                        <el-select v-model="splitForm.potNo" placeholder="请选择" clearable>
                                            <el-option label="请选择" value="" />
                                            <el-option v-for="(subItem, subIndex) in holder" :key="subIndex" :label="subItem.holderName" :value="subItem.holderNo" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="margin-bottom: 10px;">
                                        <el-button v-if="isAuth('steSplitQuery')" type="primary" size="small" @click="getSplitTable">
                                            查询
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </template>
                            <el-table :data="splitTable" header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 61 - 62 - 47" border tooltip-effect="dark">
                                <el-table-column type="index" width="55" label="序号" fixed />
                                <el-table-column label="生产订单" width="120" prop="orderNo" :show-overflow-tooltip="true" />
                                <el-table-column min-width="180" label="生产物料" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="计划数量" width="120" prop="planOutput" :show-overflow-tooltip="true" />
                                <el-table-column label="单位" width="70" prop="outputUnit" :show-overflow-tooltip="true" />
                                <el-table-column label="生产日期" width="100" prop="productDate" :show-overflow-tooltip="true" />
                                <el-table-column label="锅号" width="100" prop="potNo" :show-overflow-tooltip="true" />
                                <el-table-column label="锅数" width="100" prop="potCount" :show-overflow-tooltip="true" />
                                <el-table-column label="每锅数量" width="100" prop="potAmount" :show-overflow-tooltip="true" />
                                <el-table-column label="备注" width="100" prop="remark" />
                                <el-table-column label="操作人" width="100" prop="changer" :show-overflow-tooltip="true" />
                                <el-table-column label="操作时间" width="100" prop="changed" :show-overflow-tooltip="true" />
                                <el-table-column label="操作" fixed="right" align="center" width="140">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('steSplitDel')" type="text" icon="el-icon-delete" @click="delSplitRow(scope.row)">
                                            删除
                                        </el-button>
                                        <el-button v-if="isAuth('steSplitMx')" type="text" @click="orderSplitDetail(scope.row)">
                                            <em class="iconfont factory-liebiao" />
                                            <span style="margin-left: 5px;">详情</span>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row style="overflow: hidden;">
                                <el-pagination :current-page="splitForm.current" :page-sizes="[10, 20, 50]" :page-size="splitForm.size" layout="total, sizes, prev, pager, next, jumper" :total="splitForm.total" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" />
                            </el-row>
                        </mds-card>
                    </el-col>
                </el-row>
            </template>
        </query-table>
        <order-split-dialog v-if="dialogFormVisible1" ref="orderSplitDialog" @getList="getData" />
        <order-split-detail-dialog v-if="dialogFormVisible2" ref="orderSplitDetailDialog" @getList="getSplitTable" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';
    import OrderSplitDialog from './common/OrderSplitDialog.vue'
    import OrderSplitDetailDialog from './common/OrderSplitDetailDialog.vue'

    @Component({
        name: 'OrderSplit',
        components: {
            OrderSplitDialog,
            OrderSplitDetailDialog
        }
    })
    export default class OrderSplit extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        $refs: {
            queryTable: HTMLFormElement;
            orderSplitDialog: HTMLFormElement;
            orderSplitDetailDialog: HTMLFormElement;
        };

        currPage = 1;
        pageSize = 10;
        totalCount = 0;
        dialogFormVisible1 = false;
        dialogFormVisible2 = false;

        splitForm = {
            current: 1,
            size: 10,
            total: 0,
            orderNo: '',
            potNo: ''
        };

        orderSplitRow = {};
        holder = [];
        queryResultList: SteObj[] = [];
        splitTable: SteObj[] = [];
        rules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ];

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
                rule: [
                    { required: true, message: ' ', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '杀菌'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'date-picker',
                label: '订单日期',
                prop: 'orderStartDateBegin',
                labelWidth: 90,
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            },
            {
                type: 'input',
                label: '生产订单',
                labelWidth: 90,
                prop: 'orderNo'
            },
            {
                type: 'select',
                label: '状态',
                labelWidth: 60,
                prop: 'OrgOrderStatus',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            }
        ];

        // 查询请求
        listInterface(params) {
            params.OrgOrderStatus ? params.orderStatus = [params.OrgOrderStatus] : params.orderStatus = [];
            params.current = this.currPage; // eslint-disable-line
            params.size = this.pageSize; // eslint-disable-line
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return COMMON_API.ORDER_QUERY_API(params);
        }

        createdEnd() {
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '' && this.$refs.queryTable.queryForm.productDate !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        getData() {
            this.$refs.queryTable.getDataList();
            this.showSplitTable(this.orderSplitRow);
        }

        setData(data) {
            if (data.data.records.length) {
                this.queryResultList = data.data.records;
                this.currPage = data.data.current;
                this.pageSize = data.data.size;
                this.totalCount = data.data.total;
            } else {
                this.queryResultList = [];
                this.$infoToast('暂无任何内容');
            }
            this.splitTable = [];
        }

        getHolder(params) {
            COMMON_API.HOLDER_DROPDOWN_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: params.workShop,
                holderType: '014'
            }).then(({ data }) => {
                this.holder = data.data || [];
            })
        }

        // 表格双击
        showSplitTable(row) {
            this.splitForm.orderNo = row.orderNo;
            this.getHolder(row)
            this.getSplitTable()
        }

        // 获取拆分表格
        getSplitTable() {
            if (!this.splitForm.orderNo) {
                this.$warningToast('请双击订单后操作')
                return false
            }
            STE_API.STE_SPLIT_LIST_API(this.splitForm).then(({ data }) => {
                if (!data.data.records.length) {
                    this.$infoToast('暂无任何内容');
                }
                this.splitTable = data.data.records
                this.splitForm.current = data.data.current;
                this.splitForm.size = data.data.size;
                this.splitForm.total = data.data.total;
            })
        }

        // 拆分
        orderSplit(row) {
            this.orderSplitRow = row;
            this.dialogFormVisible1 = true;
            this.$nextTick(() => {
                this.$refs.orderSplitDialog.init(row);
            });
        }

        // 拆分详情
        orderSplitDetail(row) {
            this.dialogFormVisible2 = true;
            this.$nextTick(() => {
                this.$refs.orderSplitDetailDialog.init(row);
            });
        }

        // 删除订单
        delSplitRow(row) {
            this.$confirm('删除后数据将丢失，是否删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                STE_API.STE_SPLIT_SAVE_API({
                    deletes: [row.id]
                }).then(({ data }) => {
                    this.$successToast(data.msg);
                    this.getSplitTable();
                })
            });
        }

        // 改变每页条数
        handleSizeChange(val: number) {
            this.pageSize = val;
            this.$refs.queryTable.getDataList();
        }

        handleCurrentChange(val: number) {
            this.currPage = val;
            this.$refs.queryTable.getDataList();
        }

        // 改变每页条数
        handleSizeChange1(val: number) {
            this.splitForm.size = val;
            this.getSplitTable()
        }

        handleCurrentChange1(val: number) {
            this.splitForm.current = val;
            this.getSplitTable()
        }
    }
    interface SteObj{
        id?: string;
    }
</script>

<style lang="scss" scoped>

</style>
