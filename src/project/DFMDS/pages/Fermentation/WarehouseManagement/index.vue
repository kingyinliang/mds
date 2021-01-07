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
                    <el-table class="newTable markStyle" :data="targetQueryTableList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;" @selection-change="selectionChange">
                        <el-table-column type="selection" fixed />
                        <el-table-column label="序号" type="index" fixed />
                        <el-table-column label="状态" prop="checkStatus" width="120px">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.checkStatus" disabled size="small">
                                    <el-option v-for="item in $refs.queryTable.optionLists.checkStatus" :key="item.value" :label="item.dictValue" :value="item.dictCode" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="生产订单" prop="orderNo" width="120px" />
                        <el-table-column label="容器号" prop="fermentorName" width="120px" />
                        <el-table-column label="发酵天数" prop="fermentDays" width="120px" />
                        <el-table-column label="生产物料" prop="productMaterialName" width="160px" />
                        <el-table-column label="订单数量" prop="amount" width="120px" />
                        <el-table-column label="订单单位" prop="orderUnit" width="120px" />
                        <el-table-column label="移动类型" prop="inStorageType" width="120px" />
                        <el-table-column label="入库数量" prop="inStorageAmount" width="140px">
                            <template slot="header">
                                <span class="notNull">入库数量</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.inStorageAmount" oninput="value=value.replace(/\D*/g,'')" size="small" placeholder="入库数量" :disabled="!isRedact || (scope.row.checkStatus !== 'N' && scope.row.checkStatus !== 'R' && scope.row.checkStatus !== 'S' && scope.row.checkStatus !== '')" />
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="unit" width="100px" />
                        <el-table-column label="批次" prop="" width="160px">
                            <template slot="header">
                                <span class="notNull">批次</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.inStorageBatch" :maxlength="10" size="small" placeholder="输入批次" :disabled="!isRedact || (scope.row.checkStatus !== 'N' && scope.row.checkStatus !== 'R' && scope.row.checkStatus !== 'S' && scope.row.checkStatus !== '')" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="" width="180px">
                            <template slot="header">
                                <span>备注</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" :maxlength="255" size="small" placeholder="输入备注" :disabled="!isRedact || (scope.row.checkStatus !== 'N' && scope.row.checkStatus !== 'R' && scope.row.checkStatus !== 'S' && scope.row.checkStatus !== '')" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人员" prop="changer" width="160px" />
                        <el-table-column label="操作时间" prop="changed" width="160px" />
                        <el-table-column label="操作" width="120px" fixed="right">
                            <template slot-scope="scope">
                                <el-button v-if="Number(scope.row.inStorageType) === 531" type="text" size="small" :disabled="!isRedact || (scope.row.checkStatus !== 'N' && scope.row.checkStatus !== 'R' && scope.row.checkStatus !== 'S' && scope.row.checkStatus !== '')" @click="returnHandler(scope.row)">
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
        <redact-box :disabled="redactBoxDisable" :is-redact.sync="isRedact" redact-auth="steStgEdit" save-auth="steStgEdit" :is-show-submit-btn="true" :saved-rules="savedRules" :submit-rules="submitRules" :saved-datas="savedDatas" :submit-datas="submitDatas" @sendSuccess="sendSuccess" />
        <el-dialog title="审核日志" width="900px" :close-on-click-modal="false" :visible.sync="dialogVisible">
            <audit-log :table-data="logList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { AUDIT_API, COMMON_API } from 'common/api/api';
    import RedactBox from 'components/RedactBox.vue'; // 下方状态 bar
    import FER_API from 'src/common/api/fer';
    import { dateFormat } from 'src/utils/utils';
    import _ from 'lodash';

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

        targetQueryTableList: SaltWaterObj[] = [];

        selections: SaltWaterObj[] = [];

        isRedact = false; // 可否编辑

        currentRow = {}; // 当前判定项

        formObj = {};

        redactBoxDisable = false; // control bar 可否禁用

        currentPage = 1;

        pageSize = 10;

        total = 0;

        dialogVisible = false;

        logList = []; // 审核日志列表

        // 缓存数据
        oldDataList = [];

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
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ]

        selectionChange(row) {
            // console.log(row, '=====');
            this.selections = row;
        }

        // queryTable 查询请求
        queryTableListInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            params.current = this.currentPage;// eslint-disable-line
            params.size = this.pageSize;// eslint-disable-line
            params.total = this.total;// eslint-disable-line
            return FER_API.FER_INSTORAGE_QUERY_API(params);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                data.data.records.map((item, index) => {
                    if (!item.id) {
                        item.onlyOne = Date.now() + index;
                    }
                })
                this.targetQueryTableList = data.data.records as SaltWaterObj[];
                this.oldDataList = JSON.parse(JSON.stringify(data.data.records));
                this.total = data.data.total;
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        ruleSave() {
            // for (const item of this.targetQueryTableList) {
            //     if (!item.inStorageAmount || !item.inStorageBatch) {
            //         this.$warningToast('请填写必填栏位');
            //         return false;
            //     }
            // }
            const list = this.getEditData('targetQueryTableList');
            if (!list.length) {
                this.$warningToast('请修改后再保存');
                return false;
            }
            return true;
        }

        ruleSubmit() {
            if (!this.selections.length) {
                this.$warningToast('请选择入库提交项');
                return false;
            }
            for (const item of this.selections) {
                if (!item.inStorageAmount || !item.inStorageBatch) {
                    this.$warningToast('请填写必填栏位');
                    return false;
                }
            }
            return true;
        }

        // {redact-box} 提交需跑的验证 function
        savedRules(): Function[] {
            return [this.ruleSave];
        }

        submitRules(): Function[] {
            return [this.ruleSubmit];
        }

        savedDatas() {
            const params = this.getSaveOrSubmitDtos('save', 'targetQueryTableList');
            return FER_API.FER_INSTORAGE_SAVE_API(params);
        }

        submitDatas() {
            // 选中的提交
            /**
             * 保存里面获取的是已经编辑的，有id 或者 没id
             * 提交里面获取的是勾选的，也就是说有可能没编辑，也有可能编辑了， 有id 或者 没id
             *
             * 1、有id的，勾选的全部放入submitIdSet
             * 2、有id的，编辑了，放到ferInStorageUpdateDtoList
             * 3、无id的，编辑了，没勾选，放到ferInStorageInsertDtoList 标识 false
             * 4、无id的，编辑了，勾选了，放到ferInStorageInsertDtoList 标识 true
             */
            const params: SaveOrSubmitDto = {
                ferInStorageInsertDtoList: [],
                ferInStorageUpdateDtoList: [],
                submitIdSet: []
            };
            // 1
            this.selections.map(item => {
                if (item.id) {
                    // @ts-ignore
                    params.submitIdSet.push(item.id);
                }
            })
            this.targetQueryTableList.map(item => {
                // 2
                if (item.id) {
                    // @ts-ignore
                    const old = this.oldDataList.find(row => row.id === item.id);
                    if (!_.isEqual(old, item)) {
                        params.ferInStorageUpdateDtoList.push({
                            id: item.id,
                            inStorageAmount: item.inStorageAmount,
                            inStorageBatch: item.inStorageBatch,
                            remark: item.remark
                        })
                    }
                } else {
                    // 3
                    // row有值 则勾选了， 没值 则未勾选
                    const row = this.selections.find(o => o.onlyOne === item.onlyOne);
                    // @ts-ignore
                    const old = this.oldDataList.find(row1 => row1.onlyOne === item.onlyOne);
                    if (!_.isEqual(old, item)) {
                        const obj: InsertDto = {
                            fermentDays: item.fermentDays,
                            inStorageAmount: item.inStorageAmount,
                            inStorageBatch: item.inStorageBatch,
                            inStorageType: item.inStorageType,
                            needSubmit: Boolean(row),
                            orderId: item.orderId,
                            orderNo: item.orderNo,
                            remark: item.remark,
                            unit: item.unit
                        }
                        params.ferInStorageInsertDtoList.push(obj);
                    }
                }
            });
            return FER_API.FER_INSTORAGE_SUBMIT_API(params);
        }

        getSaveOrSubmitDtos(type = 'save', fileName = 'targetQueryTableList') {
            const list: SaltWaterObj[] = this.getEditData(fileName);
            const params: SaveOrSubmitDto = {
                ferInStorageInsertDtoList: [],
                ferInStorageUpdateDtoList: [],
                submitIdSet: []
            };
            if (type === 'submit') {
                this.selections.map(item => {
                    if (item.id) {
                        // @ts-ignore
                        params.submitIdSet.push(item.id);
                    }
                })
            }
            list.map(item => {
                if (item.id) {
                    params.ferInStorageUpdateDtoList.push({
                        id: item.id,
                        inStorageAmount: item.inStorageAmount,
                        inStorageBatch: item.inStorageBatch,
                        remark: item.remark
                    })
                } else {
                    const selectRow = this.selections.find(row => row.onlyOne === item.onlyOne);
                    const obj: InsertDto = {
                        fermentDays: item.fermentDays,
                        inStorageAmount: item.inStorageAmount,
                        inStorageBatch: item.inStorageBatch,
                        inStorageType: item.inStorageType,
                        needSubmit: type === 'submit' && Boolean(selectRow),
                        orderId: item.orderId,
                        orderNo: item.orderNo,
                        remark: item.remark,
                        unit: item.unit,
                        onlyOne: item.onlyOne
                    }
                    params.ferInStorageInsertDtoList.push(obj);
                }
            });
            return params;
        }

        getEditData(fileName) {
            const res: SaltWaterObj[] = [];
            // targetQueryTableList
            const arr = this[fileName].filter((item: SaltWaterObj) => item.checkStatus === 'N' || item.checkStatus === 'S' || item.checkStatus === 'R' || item.checkStatus === '');
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                const old = JSON.parse(JSON.stringify(this.oldDataList.find((item: { id: string; onlyOne: number }) => {
                    if (item.id) {
                        return item.id === element?.id;
                    }
                    return item.onlyOne === element.onlyOne;
                })));
                if (!_.isEqual(old, element)) {
                    // @ts-ignore
                    res.push(element);
                }
            }
            return res;
        }

        sendSuccess() {
            this.$refs.queryTable.getDataList();
        }

        showLogHandler(row) {
            /**
             * 工时 TIMESHEET
             * 入库 INSTORAGE
             * 发料 MATERIAL
             */
            AUDIT_API.STE_AUDIT_LOG_API({
                orderNo: row.orderNo,
                // splitOrderNo: row.splitOrderNo, // 拆分单号<有拆分单时必填>
                verifyType: ['INSTORAGE'] // '审核类型'
            }).then(res => {
                this.dialogVisible = true;
                this.logList = res.data.data;
            })
        }

        returnHandler(row) {
            console.log(row);
            this.$confirm('是否退回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                FER_API.FER_INSTORAGE_RETURN_API([row.id]).then(res => {
                    this.$successToast(res.data.msg);
                    this.$refs.queryTable.getDataList();
                })
            })
        }

        determinationHandler(row) {
            console.log(row);
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
    }
    interface SaltWaterObj {
        id: string;
        checkStatus: string;
        orderNo: string;
        fermentorName: string;
        fermentDays: number;
        productMaterialName: string;
        amount: string;
        inStorageAmount: number;
        inStorageType: string;
        unit: string;
        orderId: string;
        inStorageBatch: string;
        remark: string;
        changer: string;
        changed: string;
        onlyOne?: number; // 唯一标识
    }
    interface SaveOrSubmitDto {
        ferInStorageInsertDtoList: InsertDto[];
        ferInStorageUpdateDtoList: UpdateDto[];
        submitIdSet?: string[];
    }
    interface InsertDto {
        fermentDays: number;
        inStorageAmount: number;
        inStorageBatch: string;
        inStorageType: string;
        needSubmit: boolean;
        orderId: string;
        orderNo: string;
        remark: string;
        unit: string;
        onlyOne?: number;
    }
    interface UpdateDto {
        id: string;
        inStorageAmount: number;
        inStorageBatch: string;
        remark: string;
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
