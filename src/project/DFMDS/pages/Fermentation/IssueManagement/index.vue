<!-- 发料管理 -->
<template>
    <div class="header_main">
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
                <mds-card title="发料列表" :pack-up="false">
                    <el-table class="newTable markStyle" :data="targetQueryTableList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                        <el-table-column type="selection" width="55" fixed />
                        <el-table-column type="index" label="序号" fixed />
                        <el-table-column label="状态" prop="checkStatusName" />
                        <el-table-column label="生产订单" prop="orderNo" />
                        <el-table-column label="容器号" prop="aaaaaaaaaaaaaaaaaaaa" />
                        <el-table-column label="生产物料" prop="productMaterialName" />
                        <el-table-column label="订单数量" prop="amount" />
                        <el-table-column label="订单单位" prop="unit" />
                        <el-table-column label="组件物料" prop="materialName" />
                        <el-table-column prop="" width="160px">
                            <template slot="header">
                                <span class="notNull">数量</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.useAmount" size="small" placeholder="输入数量" :disabled="!isRedact" />
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="useUnit" />
                        <el-table-column prop="" width="160px">
                            <template slot="header">
                                <span class="notNull">批次</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.useBatch" size="small" placeholder="输入批次" :disabled="!isRedact" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="" width="160px">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="small" placeholder="输入备注" :disabled="!isRedact" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人员" prop="changer" />
                        <el-table-column label="操作时间" prop="changed" />
                        <el-table-column label="操作" width="175px" fixed="right">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.isSplit" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row, scope.$index)">
                                    删除
                                </el-button>
                                <el-button type="text" size="mini" :disabled="!isRedact" @click="splitHandler(scope.row, scope.$index)">
                                    拆分
                                </el-button>
                                <el-button type="text" size="samll" @click="showLogHandler(scope.row)">
                                    审核日志
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </mds-card>
                <el-row>
                    <el-pagination :current-page.sync="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="sizeChangeHandler" @current-change="currentPageChangeHanlder" />
                </el-row>
            </template>
        </query-table>
        <redact-box :disabled="redactBoxDisable" :is-redact.sync="isRedact" redact-auth="steStgEdit" save-auth="steStgEdit" :is-show-submit-btn="true" :saved-rules="savedRules" :submit-rules="savedRules" :saved-datas="savedDatas" :submit-datas="submitDatas" />
        <el-dialog
            title="审核日志"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose"
        >
            <el-table :data="logList">
                <el-table-column label="序号" type="index" />
                <el-table-column label="审核动作" prop="verifyType" />
                <el-table-column label="审核意见" prop="memo" />
                <el-table-column label="审核人" prop="verifyMan" />
                <el-table-column label="审核时间" prop="verifyDate" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API, AUDIT_API } from 'common/api/api';
    import RedactBox from 'components/RedactBox.vue'; // 下方状态 bar

    @Component({
        name: 'IssueManagement',
        components: {
            RedactBox
        }
    })
    export default class IssueManagement extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        targetQueryTableList: SaltWaterObj[] = [
            {}
        ];

        isRedact = false; // 可否编辑

        redactBoxDisable = false; // control bar 可否禁用

        currentPage = 1;

        pageSize = 10;

        total = 0;

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
                prop: 'orderNo',
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
                        COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            dictType: 'ORDER_TYPE' // 字典类型
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'productMaterialCode',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                filterable: true,
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.ALLMATERIAL_API({
                            materialTypes: ['ZHAL'] // 物料类型列表 - 半成品
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
            {
                type: 'select',
                label: '组件物料',
                prop: 'materialCode',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                filterable: true,
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.ALLMATERIAL_API({
                            materialTypes: ['ZROH', 'ZFZC', 'ZHAL'] // 物料类型列表 - 原料、辅料、半成品
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
            {
                type: 'select',
                label: '容器号',
                prop: 'holderNo',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                filterable: true,
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_DROPDOWN_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            holderType: ['001', '029', '028'] // 发酵罐/池、泡豆罐、调酱罐/池 参数编码
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '状态',
                prop: 'checkStatus',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.DICTIONARY_ITEM_DROPDOWN_API({
                            dictType: 'COMMON_CHECK_STATUS'
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'date-interval',
                label: '订单日期',
                // labelWidth: 85,
                valueFormat: 'yyyy-MM-dd',
                // defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ]

        // queryTable 查询请求
        queryTableListInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            const obj = {
                ...params,
                current: this.currentPage,
                size: this.pageSize,
                total: this.total
            }
            return FER_API.FER_MATERIAL_QUERY_API(obj);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                this.targetQueryTableList = data.data.records as SaltWaterObj[];
                this.total = data.data.total;
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        showLogHandler(row) {
            /**
             * 工时 TIMESHEET
             * 入库 INSTORAGE
             * 发料 MATERIAL
             */
            AUDIT_API.STE_AUDIT_LOG_API({
                orderNo: row.orderNo
                // splitOrderNo: row.splitOrderNo, // 拆分单号<有拆分单时必填>
                // verifyType: ['MATERIAL'] // '审核类型'
            }).then(res => {
                this.dialogVisible = true;
                this.logList = res.data;
            })
        }

        splitHandler(row, index) {
            this.targetQueryTableList.splice(index + 1, 0, { ...row, isSplit: true });
        }

        removeDataRow(row, index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row, index);
                this.targetQueryTableList.splice(index, 1);
                // this.$set(row, 'delFlag', 1)
                // this.$successToast('删除成功');
            });
        }

        ruleMagnetSubmit() {
            for (const item of this.targetQueryTableList) {
                if (!item.useAmount || !item.useBatch) {
                    this.$warningToast('请填写发料列表必填栏位');
                    return false;
                }
            }
            return true;
        }

        // {redact-box} 提交需跑的验证 function
        savedRules(): Function[] {
            return [this.ruleMagnetSubmit];
        }

        savedDatas() {
            const params = { };
            return FER_API.FER_MATERIAL_SAVE_API(params);
        }

        submitDatas() {
            const params = { };
            return FER_API.FER_MATERIAL_SUBMIT_API(params);
        }

        sizeChangeHandler(val) {
            this.pageSize = val;
            this.$refs.queryTable.getDataList();
        }

        currentPageChangeHanlder(val) {
            this.currentPage = val;
            this.$refs.queryTable.getDataList();
        }

        handleClose() {
            this.dialogVisible = false;
        }
    }
    interface SaltWaterObj {
        id?: string;
        amount?: number; //订单数量
        changed?: string; //修改日期
        changer?: string; //修改人
        checkStatus?: string; //审核状态，生产发料审核
        checkStatusName?: string; //审核状态名称，生产发料审核
        fermentorId?: string; //发酵罐ID
        fermentorName?: string; //发酵罐名称
        materialCode?: string; //组件物料编码
        materialName?: string; //组件物料描述
        orderNo?: string; //订单号
        productMaterialCode?: string; //生产物料编码
        productMaterialName?: string; //生产物料描述
        remark?: string; //备注
        unit?: string; //单位
        useAmount?: number; //领用数量
        useBatch?: string; //领用批次
        useUnit?: string; //领用数量单位
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
</style>
