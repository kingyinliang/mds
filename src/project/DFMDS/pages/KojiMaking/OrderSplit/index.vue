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
                                <el-table-column type="index" :index="index => getIndexMethod(index, splitTable)" label="序号" width="55" fixed />
                                <el-table-column label="订单状态" width="80" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <label :style="{ color: scope.row.orderStatusName === '不通过' ? 'red' : scope.row.orderStatusName === '通过' ? 'rgb(103, 194, 58)' : '',}">{{ scope.row.orderStatusName }}</label>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单日期" width="120" prop="orderStartDate" :show-overflow-tooltip="true" />
                                <el-table-column label="生产订单" width="120" prop="orderNo" :show-overflow-tooltip="true" />
                                <el-table-column min-width="220" label="生产物料" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="计划数量" width="100" prop="planOutput" />
                                <el-table-column label="单位" width="60" prop="outputUnit" />
                                <el-table-column label="操作" fixed="right" align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('steSplit')" class="iconfont factory-chaifen" type="text" :disabled="['C','P','X'].includes(scope.row.orderStatus)" @click="orderSplit(scope.row)">
                                            拆分
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
                            <el-table :data="splitTable" header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 61 - 62 - 47" border tooltip-effect="dark">
                                <el-table-column type="index" :index="index => getIndexMethod(index, splitTable)" label="序号" width="55" fixed />
                                <el-table-column label="曲房状态" width="100" prop="statusName" :show-overflow-tooltip="true" />
                                <el-table-column label="生产订单" min-width="120" prop="orderNo" :show-overflow-tooltip="true" />
                                <el-table-column label="曲房号" min-width="100" prop="kojiHouseName" :show-overflow-tooltip="true" />
                                <el-table-column label="发酵罐/池" min-width="100" prop="fermentPotName" :show-overflow-tooltip="true" />
                                <el-table-column label="入曲日期" width="140" prop="addKojiDate" :show-overflow-tooltip="true" />
                                <el-table-column label="出曲日期" width="140" prop="outKojiDate" :show-overflow-tooltip="true" />
                                <el-table-column label="操作人" width="160" prop="changer" :show-overflow-tooltip="true" />
                                <el-table-column label="操作时间" width="180" prop="changed" :show-overflow-tooltip="true" />
                                <el-table-column label="操作" fixed="right" align="center" width="140">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('steSplitDel')" type="text" icon="el-icon-delete" :disabled="['0'].includes(scope.row.canBeDeleted)" @click="delSplitRow(scope.row)">
                                            删除
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
        <order-split-dialog v-if="dialogFormVisible" ref="orderSplitDialog" @getList="getData" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';
    import OrderSplitDialog from '../common/OrderSplitDialog.vue'

    @Component({
        name: 'OrderSplit',
        components: {
            OrderSplitDialog
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
        dialogFormVisible = false;


        splitForm = {
            current: 1,
            size: 10,
            total: 0,
            orderNo: '',
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
        };

        orderSplitRow = {};
        // holder = [];
        queryResultList: OrderObj[] = []; // 订单查询结果
        splitTable: KojiObj[] = []; // 拆分
        rules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ];

        orderStatusMapping={}
        nowRow: KojiObj

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
                        deptName: '制曲'
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
                labelWidth: 90,
                prop: 'orderStartDate',
                valueFormat: 'yyyy-MM-dd',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd')
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
                prop: 'status',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.DICTQUERY_API({
                            dictType: 'COMMON_CHECK_STATUS'
                        }).then((res) => {
                            const temp = res.data.data.filter(item => item.dictValue !== '已提交') // DFMDS-2548
                            res.data.data = temp
                            resolve(res)
                        })
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

        mounted() {

            // 订单状态 mapping
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' }).then(({ data }) => {
                this.orderStatusMapping = {}
                data.data.forEach(item => {
                    this.orderStatusMapping[item.dictCode] = item.dictValue
                })
            });
        }

        // 查询请求
        listInterface(params) {
            if ((params.orderStartDate === '' || !params.orderStartDate) && params.orderNo === '') {
                this.$warningToast('日期或订单请选填一项');// eslint-disable-line
                return new Promise((resolve, reject) => {
                    reject('error') // eslint-disable-line
                });
            }

            params.current = this.currPage;
            params.size = this.pageSize;
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return KOJI_API.KOJI_ORDER_QUERY_API(params);
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

        // 查询回传 data
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


        // 表格双击
        showSplitTable(row) { // 已审核C、已过账P、已反审按钮不可操作X
            // if (!(row.orderStatus === 'D' || row.orderStatus === 'P' || row.orderStatus === 'X')) {
                this.splitForm.orderNo = row.orderNo
                this.nowRow = row
                this.getSplitTable()
            // }

        }

        // 获取拆分表格
        getSplitTable() {
            if (!this.splitForm.orderNo) {
                this.$warningToast('请双击订单后操作')
                return false
            }
            KOJI_API.ORDER_SPLITE_QUERY_BY_ID_API(this.splitForm).then(({ data }) => {
                if (!data.data.records.length) {
                    this.$infoToast('暂无任何拆分内容');
                }
                this.splitTable = data.data.records

                this.splitTable.forEach(item => {
                    item.statusName = this.orderStatusMapping[item.status]
                    item.orderStatus = this.nowRow.orderStatus
                })

                this.splitForm.current = data.data.current;
                this.splitForm.size = data.data.size;
                this.splitForm.total = data.data.total;
            })
        }

        // 拆分
        orderSplit(row) {
            // if (!(row.orderStatus === 'D' || row.orderStatus === 'P' || row.orderStatus === 'X')) {
                this.orderSplitRow = row;
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs.orderSplitDialog.init(row, this.orderStatusMapping);
                });
            // }
        }


        // 删除订单
        delSplitRow(row) {
            this.$confirm('删除后数据将丢失，是否删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                KOJI_API.ORDER_SPLITE_REMOVE_API({
                    deleteIds: [row.id],
                    orderId: row.orderId,
                    orderNo: row.orderNo,
                    orderStatus: this.nowRow.orderStatus
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

    interface OptionObj {
        optLabel?: string;
        optValue?: string;
        optId?: string;
    }
    interface OrderObj{
        changed?: Date;
        changer?: string;
        countMan?: number;
        countOutput?: number;
        countOutputUnit?: string;
        deviceTime?: number;
        dispatchMan?: string;
        exceptionDateCount?: number;
        factory?: string;
        factoryName?: string;
        germs?: number;
        id?: string;
        materialCode?: string;
        materialName?: string;
        operator?: string;
        operatorDate?: Date;
        orderEndDate?: Date;
        orderNo?: string;
        orderStartDate?: Date;
        orderStatus?: string;
        orderStatusName?: string;
        orderType?: string;
        outputUnit?: string;
        outputUnitName?: string;
        planOutput?: number;
        productDate?: Date;
        productLine?: string;
        productLineName?: string;
        readyTime?: number;
        realInAmount?: number;
        realOutput?: number;
        userTime?: number;
        workShop?: string;
        workShopName?: string;
    }

    interface KojiObj{
        orderStatus: string;
        statusName: string;
        orderStatu: string;
        addKojiDate: string;
        changed: string;
        changer: string;
        fermentPotId: string;
        fermentPotNo: string;
        id: string;
        kojiHouseId: string;
        kojiHouseNo: string;
        kojiOrderNo: string;
        materialCode: string;
        materialName: string;
        orderId: string;
        orderNo: string;
        orderType: string;
        outKojiDate: string;
        outputUnit: string;
        outputUnitName: string;
        planOutput: number;
        productDate: string;
        status: string;
        workShop: string;
        workShopName: string;
        canBeDeleted: string;
    }

    interface OptionObj {
        optLabel?: string;
        optValue?: string;
    }
</script>

<style lang="scss" scoped>

</style>
