<!-- 入库管理 -->
<template>
    <div class="header_main CategoryDetermination">
        <query-table
            ref="queryTable"
            type="home"
            query-auth="steCkQuery"
            :factory-type="1"
            :query-form-data="queryTableFormData"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            :operation-column-width="90"
            @get-data-success="returnDataFromQueryTableForm"
        >
            <template slot="home">
                <mds-card title="入库列表" :pack-up="false">
                    <el-table class="newTable markStyle" :data="targetQueryTableList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                        <el-table-column type="selection" fixed />
                        <el-table-column label="序号" type="index" fixed />
                        <el-table-column label="状态" prop="status" />
                        <el-table-column label="生产订单" prop="status" />
                        <el-table-column label="容器号" prop="status" />
                        <el-table-column label="发酵天数" prop="status" />
                        <el-table-column label="生产物料" prop="status" />
                        <el-table-column label="订单数量" prop="status" />
                        <el-table-column label="订单单位" prop="status" />
                        <el-table-column label="入库数量" prop="status" width="120px">
                            <template slot="header">
                                <span class="notNull">入库数量</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.aaaaaaaa" size="small" placeholder="入库数量" :disabled="!isRedact" />
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="status" />
                        <el-table-column label="批次" prop="status" width="120px">
                            <template slot="header">
                                <span class="notNull">批次</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.aaaaaaaa" size="small" placeholder="输入批次" :disabled="!isRedact" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="status" width="160px">
                            <template slot="header">
                                <span class="notNull">备注</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.aaaaaaaa" size="small" placeholder="输入备注" :disabled="!isRedact" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人员" prop="status" />
                        <el-table-column label="操作时间" prop="status" />
                        <el-table-column label="操作" width="120px" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="returnHandler(scope.row)">
                                    退回
                                </el-button>
                                <el-button type="text" size="small" @click="showLogHandler(scope.row)">
                                    审核日志
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </mds-card>
                <el-row>
                    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="sizeChangeHandler" @current-change="currentPageChangeHanlder" />
                </el-row>
            </template>
        </query-table>
        <redact-box :disabled="redactBoxDisable" :is-redact.sync="isRedact" redact-auth="steStgEdit" save-auth="steStgEdit" :is-show-submit-btn="true" :saved-rules="savedRules" :saved-datas="savedDatas" />
        <el-dialog
            title="审核日志"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose"
        >
            <el-table :data="logList">
                <el-table-column label="序号" type="index" />
                <el-table-column label="审核动作" prop="aaaaa" />
                <el-table-column label="审核意见" prop="aaaaa" />
                <el-table-column label="审核人" prop="aaaaa" />
                <el-table-column label="审核时间" prop="aaaaa" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    import RedactBox from 'components/RedactBox.vue'; // 下方状态 bar
    @Component({
        name: 'WarehouseManagement',
        components: {
            RedactBox
        }
    })
    export default class WarehouseManagement extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        targetQueryTableList: SaltWaterObj[] = [
            { id: 'ss' }
        ];

        isRedact = false; // 可否编辑

        currentRow = {
            name: '001发酵罐判定'
        }; // 当前判定项

        formObj = {
            name: 'hello '
        };

        redactBoxDisable = false; // control bar 可否禁用

        currentPage = 1;

        pageSize = 10;

        total = 20;

        dialogVisible = false;

        logList = [
            { aaaaa: 'xxxxxxxxxxx' }
        ]; // 审核日志列表

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                // labelWidth: 85,
                rule: [
                    { required: false, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '发酵'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderId',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }]
                // defaultValue: ''
            },
            {
                type: 'select',
                label: '订单类型',
                prop: 'orderType',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'materialId',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '容器号',
                prop: 'materialId3',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '状态',
                prop: 'status',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'date-interval',
                label: '订单日期',
                // labelWidth: 85,
                valueFormat: 'yyyy-MM-dd',
                // defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'orderStartDateBegin',
                propTwo: 'orderStartDateEnd'
            }
        ]

        // queryTable 查询请求
        queryTableListInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            let orderStatus: string[] = [];
            if (this.$refs.queryTable.activeName === '0') { // eslint-disable-line
                orderStatus = ['D'];
            } else if (this.$refs.queryTable.activeName === '1') {  // eslint-disable-line
                orderStatus = ['C', 'P'];
            } else {
                orderStatus = ['R'];
            }
            params.orderStatus = orderStatus; // eslint-disable-line
            params.current = this.currentPage;// eslint-disable-line
            params.size = this.pageSize;// eslint-disable-line
            params.total = this.total;// eslint-disable-line
            return COMMON_API.ORDER_QUERY_API(params);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                this.targetQueryTableList = data.data.records as SaltWaterObj[];
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        ruleMagnetSubmit() {
            return true;
        }

        ruleForiegnMatterSubmit() {
            return true;
        }

        // {redact-box} 提交需跑的验证 function
        savedRules(): Function[] {
            return [this.ruleMagnetSubmit, this.ruleForiegnMatterSubmit];
        }

        savedDatas() {
            return new Promise((resolve) => {
                resolve(null);
            });
        }

        showLogHandler(row) {
            console.log(row);
            this.dialogVisible = true;
        }

        returnHandler(row) {
            console.log(row);
            this.$confirm('是否退回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$successToast('退回成功');
            })
        }

        determinationHandler(row) {
            console.log(row);
            this.dialogVisible = true;
        }

        sizeChangeHandler(val) {
            this.pageSize = val;
        }

        currentPageChangeHanlder(val) {
            this.currentPage = val;
        }

        handleClose() {
            this.dialogVisible = false;
        }
    }
    interface SaltWaterObj {
        id: string;
    }
</script>

<style scoped>
.markStyle >>> th .notNull::before {
    margin-right: 4px;
    color: #f00;
    content: "*";
}
.markStyle >>> th .notNull {
    color: #fff;
}
.CategoryDetermination >>> .el-form-item {
    margin-bottom: 0;
}
</style>
<style lang="scss" scoped>
.dialog-btn-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 0;
}
</style>

