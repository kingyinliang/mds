<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :type="'home'"
            :rules="rules"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
        >
            <template slot="home">
                <el-row class="home_card__main" :gutter="10">
                    <el-col :span="10">
                        <mds-card title="订单查询" name="ste" :pack-up="false" style="margin-bottom: 0; background: #fff;">
                            <el-table :data="queryResultList" header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 61 - 52 - 47" border tooltip-effect="dark">
                                <el-table-column type="index" width="55" label="序号" fixed />
                                <el-table-column label="订单状态" width="80">
                                    <template slot-scope="scope">
                                        <label :style="{ color: scope.row.orderStatus === '不通过' ? 'red' : scope.row.orderStatus === '通过' ? 'rgb(103, 194, 58)' : '',}">{{ scope.row.orderStatus }}</label>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单日期" width="100" prop="orderDate" />
                                <el-table-column label="生产订单" width="120" prop="orderNo" />
                                <el-table-column min-width="180" label="生产物料">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="计划数量" width="120" prop="planOutput" />
                                <el-table-column label="单位" width="70" prop="planOutput" />
                                <el-table-column label="备注" width="70" prop="planOutput" />
                                <el-table-column label="操作" fixed="right" align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="orderSplit(scope.row)">
                                            <i class="iconfont factory-chaifen" />拆分
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                        </mds-card>
                    </el-col>
                    <el-col :span="14">
                        <mds-card title="拆分管理" name="split" :pack-up="false" style="margin-bottom: 0; background: #fff;">
                            <template slot="titleBtn">
                                <el-form :inline="true" :model="splitForm" size="small" label-width="125px" style="float: right; height: 42px;">
                                    <el-form-item label="锅号：" style="margin-bottom: 10px;">
                                        <el-select v-model="splitForm.potNo" placeholder="请选择">
                                            <el-option label="白班" value="白班" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="margin-bottom: 10px;">
                                        <el-button type="primary" size="small">
                                            查询
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </template>
                            <el-table :data="splitTable" header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 61 - 62 - 47" border tooltip-effect="dark">
                                <el-table-column type="index" width="55" label="序号" fixed />
                                <el-table-column label="生产订单" width="120" prop="orderNo" />
                                <el-table-column min-width="180" label="生产物料">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="计划数量" width="120" prop="planOutput" />
                                <el-table-column label="单位" width="70" prop="planOutput" />
                                <el-table-column label="生产日期" width="100" prop="orderDate" />
                                <el-table-column label="锅号" width="100" prop="orderDate" />
                                <el-table-column label="锅数" width="100" prop="orderDate" />
                                <el-table-column label="每锅数量" width="100" prop="orderDate" />
                                <el-table-column label="备注" width="100" prop="orderDate" />
                                <el-table-column label="操作人" width="100" prop="orderDate" />
                                <el-table-column label="操作时间" width="100" prop="orderDate" />
                                <el-table-column label="操作" fixed="right" align="center" width="140">
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-delete" @click="orderSplit(scope.row)">
                                            删除
                                        </el-button>
                                        <el-button type="text" @click="orderSplit(scope.row)">
                                            <i class="iconfont factory-liebiao" />
                                            <span style="margin-left: 5px;">详情</span>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination :current-page="currPage1" :page-sizes="[10, 20, 50]" :page-size="pageSize1" layout="total, sizes, prev, pager, next, jumper" :total="totalCount1" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                        </mds-card>
                    </el-col>
                </el-row>
            </template>
        </query-table>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible1" width="1200px" custom-class="dialog__class">
            <div>
                p
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible2" width="1200px" custom-class="dialog__class">
            <div>
                p
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component
    export default class OrderSplit extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        currPage = 1;
        pageSize = 10;
        totalCount = 0;
        currPage1 = 1;
        pageSize1 = 10;
        totalCount1 = 0;
        dialogFormVisible1 = false;
        dialogFormVisible2 = false;

        splitForm = {
            potNo: ''
        }

        queryResultList: SteObj[] = [{}];
        splitTable: SteObj[] = [{}];
        rules = [
            {
                prop: 'workshop',
                text: '请选择生产车间'
            }
        ];

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workshop',
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
                prop: 'productDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo'
            },
            {
                type: 'input',
                label: '状态',
                prop: 'status'
            }
        ];

        // 查询请求
        listInterface = params => {
            params.current = 1;
            params.size = 10;
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return STE_API.STE_HOME_LIST_API(params);
        };

        setData(data) {
            console.log(data);
        }

        orderSplit(row) {
            console.log(row);
        }
    }
    interface SteObj{
        id?: string;
    }
</script>

<style lang="scss" scoped>

</style>
