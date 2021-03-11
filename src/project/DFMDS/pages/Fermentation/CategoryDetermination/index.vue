<!-- 类别判定 -->
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
                <mds-card title="类别判定" :pack-up="false">
                    <el-table class="newTable markStyle" :data="targetQueryTableList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                        <el-table-column type="index" label="序号" fixed />
                        <el-table-column label="冻结状态" prop="freezeFlag">
                            <template slot-scope="scope">
                                {{ scope.row.freezeFlag === 'Y' ? '冻结' : '正常' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="容器号" prop="fermentorName" width="120px" />
                        <el-table-column label="容器状态" prop="fermentorStatusName" />
                        <el-table-column label="生产订单" prop="orderNo" width="120px" />
                        <el-table-column label="发酵天数" prop="fermentDays" />
                        <el-table-column label="生产物料" prop="productMaterialName" show-overflow-tooltip width="140px">
                            <template slot-scope="scope">
                                {{ scope.row.productMaterialName + ' ' + scope.row.productMaterialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单数量" prop="amount" />
                        <el-table-column label="订单单位" prop="unit" />
                        <el-table-column label="满罐日期" prop="startDate" width="160px" />
                        <el-table-column label="判定结果" prop="judgeResult">
                            <template slot-scope="scope">
                                {{ scope.row.judgeResult === 'ZC' ? '正常' : '超期' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="remark" width="160px" />
                        <el-table-column label="操作人员" prop="changer" width="160px" />
                        <el-table-column label="操作时间" prop="changed" width="160px" />
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <!--
                                    判定按钮在以下状态时不可操作
                                    1、状态发酵中但无订单判定按钮不可操作
                                    2、待清洗时判定按钮不可操作
                                -->
                                <el-button type="primary" size="small" :disabled="scope.row.fermentorStatus === 'C' || (scope.row.fermentorStatus === 'F' && !scope.row.orderNo)" @click="determinationHandler(scope.row)">
                                    判定
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
        <el-dialog
            :title="formObj.fermentorName"
            :visible.sync="dialogVisible"
            width="400px"
            :before-close="handleClose"
        >
            <el-form :model="formObj" :inline="false" label-suffix="：" label-width="90px">
                <el-form-item label="容器号" prop="fermentorName">
                    <el-input v-model="formObj.fermentorName" size="small" disabled />
                </el-form-item>
                <el-form-item label="状态" prop="fermentorStatusName">
                    <el-input v-model="formObj.fermentorStatusName" size="small" disabled />
                </el-form-item>
                <el-form-item label="生产订单" prop="orderNo">
                    <el-input v-model="formObj.orderNo" size="small" disabled />
                </el-form-item>
                <el-form-item label="生产物料" prop="productMaterialName">
                    <!-- <el-input v-model="formObj.productMaterialName" size="small" disabled /> -->
                    <el-input size="small" disabled :value="formObj.productMaterialName + ' ' + formObj.productMaterialCode" />
                </el-form-item>
                <el-form-item label="发酵天数" prop="fermentDays">
                    <el-input v-model="formObj.fermentDays" size="small" disabled />
                </el-form-item>
                <el-form-item label="判定结果" prop="judgeResult">
                    <el-select v-model="formObj.judgeResult" size="small" placeholder="请选择">
                        <el-option label="超期" value="CQ" />
                        <el-option label="正常" value="ZC" />
                    </el-select>
                </el-form-item>
                <el-form-item label="冻结状态" prop="freezeFlag">
                    <el-radio-group v-model="formObj.freezeFlag">
                        <el-radio :label="'N'">
                            正常
                        </el-radio>
                        <el-radio :label="'Y'">
                            冻结
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formObj.remark" size="small" />
                </el-form-item>
                <el-form-item label="操作人" prop="changer">
                    <el-input v-model="formObj.changer" size="small" disabled />
                </el-form-item>
                <el-form-item label="操作时间" prop="changed">
                    <el-input v-model="formObj.changed" size="small" disabled />
                </el-form-item>
                <el-form-item>
                    <div class="dialog-btn-box">
                        <el-button type="default" size="small" @click="handleClose">
                            取消
                        </el-button>
                        <el-button type="primary" size="small" @click="judgedHandler">
                            确定
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    import { dateFormat } from 'src/utils/utils';
    @Component({
        name: 'CategoryDetermination',
        components: {}
    })
    export default class CategoryDetermination extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        targetQueryTableList: CategoryJudgedType[] = [];

        isRedact = false; // 可否编辑

        currentRow = {
            name: '001发酵罐判定'
        }; // 当前判定项

        formObj: CategoryJudgedType = {};

        redactBoxDisable = false; // control bar 可否禁用

        currentPage = 1;

        pageSize = 10;

        total = 0;

        dialogVisible = false;

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
                },
                linkageProp: ['fermentorId']
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
                label: '容器号',
                prop: 'fermentorId',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                filterable: true,
                optionsFn: val => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_DROPDOWN_API({ // /sysHolder/query
                            deptId: val,
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
                label: '冻结状态',
                prop: 'freezeFlag',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsList: [
                    { label: '冻结', value: 'Y' },
                    { label: '正常', value: 'N' }
                ]
            },
            {
                type: 'date-interval',
                label: '订单日期',
                // labelWidth: 85,
                valueFormat: 'yyyy-MM-dd',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ]

        // queryTable 查询请求
        queryTableListInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            params.current = this.currentPage;// eslint-disable-line
            params.size = this.pageSize;// eslint-disable-line
            params.total = this.total;// eslint-disable-line
            return FER_API.FER_CATEGORY_JUDGED_QUERY_API(params);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                this.targetQueryTableList = data.data.records as CategoryJudgedType[];
                this.total = data.data.total;
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        determinationHandler(row) {
            console.log(row);
            this.formObj = {
                ...row
            }
            this.dialogVisible = true;
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

        judgedHandler() {
            const params = {
                freezeFlag: this.formObj.freezeFlag,
                id: this.formObj.id,
                judgeResult: this.formObj.judgeResult,
                remark: this.formObj.remark,
                orderNo: this.formObj.orderNo
            }
            FER_API.FER_CATEGORY_JUDGED_API(params).then(res => {
                this.dialogVisible = false;
                this.$successToast(res.data.msg);
                this.$refs.queryTable.getDataList();
            })
        }
    }
    interface CategoryJudgedType {
        [name: string]: string;
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
