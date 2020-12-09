<!-- 报工管理 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steCkQuery"
            :factory-type="1"
            :rules="queryTableFormRules"
            :query-form-data="queryTableFormData"
            :tabs="tabs"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            :show-select-column="true"
            :show-index-column="true"
            :operation-column-width="140"
            :is-redact="isRedact"
            @get-data-success="returnDataFromQueryTableForm"
            @created-end="createdEnd"
            @select-change="calculateHandler"
        >
            <template slot="mds-button">
                <el-button type="primary" size="small" @click="produceHandler">
                    同步
                </el-button>
            </template>
            <template v-slot:tab-head0>
                <div class="box-card-title clearfix">
                    <div style="float: right;">
                        <span class="tab-label">执行结束日期：</span>
                        <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" size="small" :picker-options="pickerOptions" @change="endDateChange" />
                    </div>
                </div>
            </template>
            <template v-slot:tab-head1>
                <div class="box-card-title clearfix">
                    <div style="float: right;">
                        <span class="tab-label">执行结束日期：</span>
                        <el-date-picker v-model="endDate2" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" size="small" :picker-options="pickerOptions" @change="endDateChange" />
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="scope">
                <div>
                    <el-button v-show="scope.scope.row.checkStatus === 'S'" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.scope.row)">
                        删除
                    </el-button>
                    <el-button type="text" size="small" @click="showLogHandler(scope.scope.row)">
                        审核日志
                    </el-button>
                </div>
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
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import { AUDIT_API, COMMON_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';
    import RedactBox from 'components/RedactBox.vue'; // 下方状态 bar
    import FER_API from 'src/common/api/fer';
    import _ from 'lodash';

    @Component({
        name: 'JobReportingManagement',
        components: {
            RedactBox
        }
    })
    export default class JobReportingManagement extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        redactBoxDisable = false; // control bar 可否禁用

        isRedact = false; // 可否编辑

        dialogVisible = false;

        logList = [];

        // endDate = dateFormat(new Date(), 'yyyy-MM-dd');
        endDate = null;
        endDate2 = null;

        pickerOptions = {
            disabledDate(time) {
                return time.getTime() > Date.now() - (1000 * 3600 * 24);
            }
        };

        // 缓存数据
        oldDataList0 = [];
        oldDataList1 = [];
        oldDataList2 = [];

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
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
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: ''
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
                label: '发酵罐/池',
                prop: 'fermentorId',
                labelWidth: 90,
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
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'queryStartDate',
                propTwo: 'queryEndDate'
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        Column = [
            {
                prop: 'checkStatusName',
                label: '状态',
                minwidth: '80'
            },
            {
                prop: 'orderNo',
                label: '生产订单',
                minwidth: '120'
            },
            {
                prop: 'holderName',
                label: '发酵罐/池号',
                minwidth: '120'
            },
            {
                prop: 'productMaterialName',
                label: '生产物料',
                minwidth: '120'
            },
            {
                prop: 'orderAmount',
                label: '订单数量',
                minwidth: '85'
            },
            {
                prop: 'inStorageAmount',
                label: '入库数量',
                minwidth: '85'
            },
            {
                prop: 'unit',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'confActivity1',
                label: '准备工时',
                minwidth: '85'
            },
            {
                prop: 'confActiUnit1',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'confActivity2',
                label: '机器工时',
                minwidth: '85'
            },
            {
                prop: 'confActiUnit2',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'confActivity3',
                label: '人工工时',
                minwidth: '85'
            },
            {
                prop: 'confActiUnit3',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'startDate',
                label: '执行开始日期',
                minwidth: '140'
            },
            {
                prop: 'endDate',
                label: '执行结束日期',
                minwidth: '140',
                type: 'date-picker',
                redact: true,
                dataType: 'date',
                valueFormat: 'yyyy-MM-dd'
            },
            {
                prop: 'jobBookType',
                label: '部分/完全',
                minwidth: '100',
                type: 'select',
                redact: true,
                resVal: {
                    resData: 'data',
                    label: 'label',
                    value: 'value'
                }
                // formatter: (row) => {
                //     return row.materialName + ' ' + row.materialCode;
                // }
            },
            {
                prop: 'remark',
                label: '备注',
                minwidth: '160',
                redact: true,
                type: 'input'
            },
            {
                prop: 'changer',
                label: '操作人员',
                minwidth: '120'
            },
            {
                prop: 'changed',
                label: '操作时间',
                minwidth: '160'
            }
        ]

        tabs = [
            {
                label: '部分报工',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            },
            {
                label: '完全报工',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            },
            {
                label: '返工订单',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            }
        ]

        createdEnd() {
            this.$refs.queryTable.optionLists.jobBookType = [
                { label: '部分', value: 'N' },
                { label: '完全', value: 'Y' }
            ];
        }

        @Watch('isRedact')
        watchRedact() {
            this.tabs[this.$refs.queryTable.activeName].tableData.map((row: JobReportingObj) => {
                row.redact = this.isRedact && (row.checkStatus === 'N' || row.checkStatus === 'S');
            })
        }

        produceHandler() {
            FER_API.FER_JOB_BOOKING_PRODUCE_API({ }).then(res => {
                this.$refs.queryTable.getDataList(true);
                this.$successToast(res.data.msg)
            });
        }

        endDateChange(value) {
            console.log(value)
            this.$refs.queryTable.getDataList();
        }

        // queryTable 查询请求
        queryTableListInterface(param) {
            const params = JSON.parse(JSON.stringify(param));
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            let jobBookType;
            if (this.$refs.queryTable.activeName === '0') { // eslint-disable-line
                jobBookType = 'N';
                params.executeEndDate = this.endDate;
            } else if (this.$refs.queryTable.activeName === '1') {  // eslint-disable-line
                jobBookType = 'Y';
                params.executeEndDate = this.endDate2;
            } else {
                jobBookType = null;
                params.checkStatus = 'R';
                params.executeEndDate = null;
            }
            params.jobBookType = jobBookType; // eslint-disable-line
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            return FER_API.FER_JOB_BOOKING_QUERY_API(params);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(datas, st) {
            console.log('查询结果回传')
            console.log(datas)
            datas.data.records.map(row => {
                row.redact = false;
            })
            this.isRedact = false;
            if (st) {
                this.tabs.map((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = JSON.parse(JSON.stringify(this.$refs.queryTable.queryForm));
                        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        if (index === 0) {
                            params.jobBookType = 'N'; // 申请标识(Y,N)
                            params.executeEndDate = this.endDate;
                        } else if (index === 1) {
                            params.jobBookType = 'Y'; // 申请标识(Y,N)
                            params.executeEndDate = this.endDate2;
                        } else {
                            params.jobBookType = null;
                            params.checkStatus = 'R';
                            params.executeEndDate = null;
                        }
                        params.current = this.$refs.queryTable.tabs[index].pages.currPage;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        FER_API.FER_JOB_BOOKING_QUERY_API(params).then(({ data }) => {
                            this['oldDataList' + index] = JSON.parse(JSON.stringify(data.data.records));
                            this.tabs[index].tableData = data.data.records;
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                        this['oldDataList' + this.$refs.queryTable.activeName] = JSON.parse(JSON.stringify(datas.data.records));
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                this['oldDataList' + this.$refs.queryTable.activeName] = JSON.parse(JSON.stringify(datas.data.records));
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
            }
        }

        calculateHandler(row, index, val) {
            console.log(row, index, val);
            FER_API.FER_JOB_BOOKING_CALCULATE_API({ endDate: val, id: row.id }).then(({ data }) => {
                const { confActivity1, confActivity2, confActivity3 } = data.data;
                const obj = {
                    ...row,
                    confActivity1,
                    confActivity2,
                    confActivity3,
                    redact: true
                };
                // @ts-ignore
                this.tabs[this.$refs.queryTable.activeName].tableData.splice(index, 1, obj);
            })
        }

        ruleSaved() {
            const list = this.getEditData();
            if (!list.length) {
                this.$warningToast('请修改后再保存');
                return false;
            }
            return true;
        }

        categoryAndSort(fileName: string) {
            const map = { };
            this.tabs[this.$refs.queryTable.activeName][fileName].map((item: JobReportingObj) => {
                map[item.orderNo] ? map[item.orderNo].push(item) : map[item.orderNo] = [item];
            })
            for (const key in map) {
                if (Object.prototype.hasOwnProperty.call(map, key)) {
                    map[key].sort((a, b) => a.startDate > b.startDate ? 1 : -1);
                }
            }
            return map;
        }

        ruleSubmit() {
            if (!this.tabs[this.$refs.queryTable.activeName].multipleSelection.length) {
                this.$warningToast('请勾选要提交的报工单');
                return false;
            }
            /**
             * 1、将勾选的按照订单号分类并且按照执行开始时间排序，全部的按照订单分类并排序
             * 2、将勾选的最超前的开始执行日期与全部的最超前的开始日期进行对比，如若勾选的晚，则提示 请先提交此订单下日期更早的工时后再进行此操作！
             * 3、如若勾选的有修改执行结束日期，判断是不是最后一个，如若不是，则提示 请先提交此订单下日期更早的工时后再进行此操作！
             */
            // 所有报工列表依据单号分类并排序
            const allMap = this.categoryAndSort('tableData');
            // 勾选的报工列表依据单号分类并排序
            const map = this.categoryAndSort('multipleSelection');
            // 2、3
            for (const key in map) {
                if (Object.prototype.hasOwnProperty.call(map, key)) {
                    for (let index = 0; index < map[key].length; index++) {
                        const ele = map[key][index];
                        // 2
                        if (ele.id !== allMap[key][index].id) {
                            this.$warningToast('请先提交此订单下日期更早的工时后再进行此操作！');
                            return false;
                        }
                        // 3
                        const old = this['oldDataList' + this.$refs.queryTable.activeName].find(item => item.id === ele.id);
                        if (ele.endDate !== old.endDate && index !== map[key].length - 1) {
                            this.$warningToast('请先提交此订单下日期更早的工时后再进行此操作！');
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        // {redact-box} 提交需跑的验证 function
        savedRules(): Function[] {
            return [this.ruleSaved];
        }

        submitRules(): Function[] {
            return [this.ruleSubmit];
        }

        savedDatas() {
            const params: SaveObj = {
                ferJobBookingSaveDtoList: this.getEditData(),
                returnedOrder: this.$refs.queryTable.activeName === 2
            }
            // const arr = this.tabs[this.$refs.queryTable.activeName].tableData
            //     .filter((item: JobReportingObj) => item.checkStatus === 'N' || item.checkStatus === 'S')
            //     .map((item: JobReportingObj) => ({
            //         confActivity1: item.confActivity1,
            //         confActivity2: item.confActivity2,
            //         confActivity3: item.confActivity3,
            //         endDate: item.endDate,
            //         id: item.id,
            //         jobBookType: item.jobBookType,
            //         remark: item.remark
            //     }))
            return FER_API.FER_JOB_BOOKING_SAVE_API(params);
        }

        submitDatas() {
            const params: SubmitObj = {
                ferJobBookingSaveDtoList: this.getEditData(),
                submitIdSet: this.tabs[this.$refs.queryTable.activeName].multipleSelection.map((item: JobReportingObj) => item.id)
            }
            return FER_API.FER_JOB_BOOKING_SUBMIT_API(params);
        }

        getEditData() {
            const res = [];
            const arr = this.tabs[this.$refs.queryTable.activeName].tableData.filter((item: JobReportingObj) => item.checkStatus === 'N' || item.checkStatus === 'S');
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                // @ts-ignore
                const old = JSON.parse(JSON.stringify(this['oldDataList' + this.$refs.queryTable.activeName].find(item => item.id === element?.id)));
                old.redact = this.isRedact && (old.checkStatus === 'N' || old.checkStatus === 'S');
                if (!_.isEqual(old, element)) {
                    res.push(element);
                }
            }
            return res;
        }

        sendSuccess() {
            this.$refs.queryTable.getDataList(true);
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                FER_API.FER_JOB_BOOKING_DELETE_API({ id: row.id }).then(res => {
                    this.$successToast(res.data.msg);
                    this.$refs.queryTable.getDataList();
                })
            });
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
                verifyType: ['TIMESHEET'] // '审核类型'
            }).then(res => {
                this.dialogVisible = true;
                this.logList = res.data.data;
            })
        }

        handleClose() {
            this.dialogVisible = false;
        }
    }
    interface JobReportingObj {
        id: string;
        redact: boolean;
        checkStatus: string;
        confActivity1: string;
        confActivity2: string;
        confActivity3: string;
        endDate: string;
        jobBookType: string;
        remark: string;
        orderNo: string;
    }
    interface SaveObj {
        ferJobBookingSaveDtoList: JobReportingObj[];
        returnedOrder: boolean;
    }
    interface SubmitObj {
        ferJobBookingSaveDtoList: JobReportingObj[];
        submitIdSet: string[];
    }
</script>

<style lang="scss" scoped>

</style>

