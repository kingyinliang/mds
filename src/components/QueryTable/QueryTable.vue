<template>
    <div>
        <el-card v-if="isQueryFormShow" class="searchCard" style="margin-bottom: 5px;">
            <el-form :model="queryForm" :rules="queryFormRules" :inline="true" size="small" label-width="70px" class="multi_row clearfix" style="font-size: 0;" @keyup.enter.native="getDataList(true)">
                <template v-for="item in queryFormData">
                    <template v-if="!item.hide">
                        <el-form-item v-if="item.type === 'select'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`">
                            <el-select v-if="item.defaultOptionsList" :ref="item.prop" v-model="queryForm[item.prop]" :style="`width: ${item.width ? item.width : 170}px;`" :filterable="item.filterable" :clearable="!item.clearable" :disabled="item.disabled" :placeholder="'请选择' + item.label">
                                <!-- <el-option label="请选择" value="" /> -->
                                <el-option v-for="(opt, optIndex) in item.defaultOptionsList" :key="optIndex" :label="opt.label" :value="opt.value" />
                            </el-select>
                            <el-select v-else :ref="item.prop" v-model="queryForm[item.prop]" :style="`width: ${item.width ? item.width : 170}px;`" :filterable="item.filterable" :clearable="!item.clearable" :disabled="item.disabled" :placeholder="'请选择' + item.label">
                                <!-- <el-option label="请选择" value="" /> -->
                                <el-option v-for="(opt, optIndex) in optionLists[item.prop]" :key="optIndex" :label="setLabel(opt, item)" :value="opt[item.resVal.value]" />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'input'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`">
                            <el-input :ref="item.prop" v-model.trim="queryForm[item.prop]" style="width: 170px;" clearable />
                        </el-form-item>
                        <el-form-item v-if="item.type === 'radio'" :key="item.prop" :label="item.label?`${item.label}：` : ''" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`">
                            <!-- <el-radio v-for="(it, num) in item.radioArr" :key="num" v-model="queryForm[item.prop]" :label="it.val">
                                {{ it.label }}
                            </el-radio> -->
                            <el-radio-group :ref="item.prop" v-model="queryForm[item.prop]">
                                <el-radio v-for="(it, num) in item.radioArr" :key="num" :label="it.val">
                                    {{ it.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'date-interval'" :key="item.prop" class="dateinput" :label="`${item.label}：` || ''" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`">
                            <el-row :style="`width: ${item.width ? item.width : 305}px;`">
                                <el-col :span="11">
                                    <el-form-item :prop="item.prop">
                                        <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" :type="item.dataType ? item.dataType : 'date'" placeholder="开始日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" :style="`width: ${item.width ? (item.width/24)*11 : 140}px;`" />
                                    </el-form-item>
                                </el-col>
                                <el-col class="line" :span="2" style="text-align: center;">
                                    -
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item :prop="item.propTwo">
                                        <el-date-picker :ref="item.propTwo" v-model="queryForm[item.propTwo]" :type="item.dataType ? item.dataType : 'date'" placeholder="结束日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" :style="`width: ${item.width ? (item.width/24)*11 : 140}px;`" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'date-picker'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`">
                            <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" :type="item.dataType" placeholder="请选择" :value-format="item.valueFormat" :style="`width: ${item.width ? item.width : 170}px;`" @blur="v => dateChange(v)" />
                        </el-form-item>
                    </template>
                </template>
                <el-form-item class="floatr">
                    <el-button type="primary" size="small" @click="searchHandler()">
                        查询
                    </el-button>
                    <el-button v-if="exportExcel" type="primary" size="small" @click="formExportExcel">
                        导出
                    </el-button>
                    <slot name="mds-button" />
                </el-form-item>
            </el-form>
            <div v-if="!tabs.length && type !== 'home'" class="toggleSearchBottom">
                <em class="el-icon-caret-top" />
            </div>
        </el-card>
        <div v-if="type === 'home'">
            <slot name="home" />
        </div>
        <el-tabs v-else-if="tabs.length" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" @tab-click="tabClick">
            <el-tab-pane v-for="(tabItem, index) in tabs" :key="index" :name="index.toString()" :label="tabItem.label">
                <div>
                    <slot :name="'tab-head' + index" />
                </div>
                <el-table
                    v-if="tabItem.column"
                    ref="table"
                    class="newTable"
                    :class="tableClass"
                    :data="tabItem.tableData"
                    max-height="420"
                    border
                    tooltip-effect="dark"
                    header-row-class-name="tableHead"
                    style="width: 100%; margin-bottom: 20px;"
                    @selection-change=" val => tabHandleSelectionChange(val, index)"
                >
                    <el-table-column v-if="showSelectColumn" :selectable="selectableFn" type="selection" width="50px" fixed />
                    <el-table-column v-if="showIndexColumn" type="index" :index="indexMethod" label="序号" width="50px" fixed />
                    <template v-for="(item, index2) in tabItem.column">
                        <el-table-column v-if="!item.hide" :key="index2" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width || ''" :min-width="item.minwidth || ''" :formatter="item.formatter" :show-overflow-tooltip="true">
                            <template v-if="item.child">
                                <el-table-column v-for="chind in item.child" :key="chind.prop" :prop="chind.prop" :label="chind.label" :formatter="chind.formatter" :show-overflow-tooltip="chind.showOverFlowTooltip || false" :width="chind.width || ''" />
                            </template>
                            <template v-if="item.header" slot="header">
                                <em class="reqI">*</em><span>{{ item.label }}</span>
                            </template>
                            <template slot-scope="scope">
                                <div v-if="item.type === 'clickSpan'" style="color: #45c2b5; cursor: pointer;" @click="item.onclick(scope.row)">
                                    {{ scope.row[item.prop] }}
                                </div>
                                <el-tooltip v-else-if="item.redact && item.type === 'input'" class="item" effect="dark" :content="scope.row[item.prop]" placement="top">
                                    <el-input v-model="scope.row[item.prop]" :disabled="!scope.row.redact" placeholder="手工录入" size="small" />
                                </el-tooltip>
                                <el-date-picker v-else-if="item.redact && item.type === 'date-picker'" v-model="scope.row[item.prop]" :disabled="!scope.row.redact" :type="item.dataType" placeholder="请选择" :value-format="item.valueFormat" :style="{width: item.width - 25 + 'px'}" size="small" @change="val => selectChange(scope.row, scope.$index, val)" />
                                <el-select v-else-if="item.redact && item.type === 'select'" v-model="scope.row[item.prop]" :disabled="!scope.row.redact || (scope.row.notEditableProp ? scope.row.notEditableProp.includes(item.prop) : false)" :type="item.dataType" placeholder="请选择" size="small">
                                    <!--<el-option label="请选择" value="" />-->
                                    <el-option v-for="(opt, optIndex) in optionLists[item.prop]" :key="optIndex" :label="opt[item.resVal.label]" :value="opt[item.resVal.value]" />
                                </el-select>
                                <span v-else-if="item.onclick === true">
                                    <a @click="lineClick(scope.row)">{{ item.formatter? item.formatter(scope.row) : scope.row[item.prop] }}</a>
                                </span>
                                <span v-else>{{ item.formatter? item.formatter(scope.row) : scope.row[item.prop] }}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column v-if="tabItem.showOperationColumn" label="操作" fixed="right" :width="operationColumnWidth">
                        <template slot-scope="scope">
                            <slot :scope="scope" name="operation_column" />
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="tabItem.pages">
                    <el-pagination :current-page.sync="tabItem.pages.currPage" :page-sizes="[10, 20, 50]" :page-size="tabItem.pages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tabItem.pages.totalCount" @size-change="(val) => {tabHandleSizeChange(tabItem.pages, val)}" @current-change="(val) => {tabHandleCurrentChange(tabItem.pages, val)}" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <div v-else class="tableCard box-card" style="min-height: 400px; background: #fff;">
            <div class="toggleSearchTop">
                <em class="el-icon-caret-bottom" />
            </div>
            <div>
                <slot :name="'tab-head-main'" />
            </div>
            <el-row>
                <el-col style=" margin-bottom: 10px; text-align: right;">
                    <slot name="mds-button-middle" />
                </el-col>
            </el-row>
            <el-table
                v-if="showTable"
                ref="table"
                class="newTable"
                :class="tableClass"
                :data="tableData"
                :height="tableHeightSet"
                :span-method="spanMethod"
                border
                tooltip-effect="dark"
                header-row-class-name="tableHead"
                style="width: 100%; margin-bottom: 20px;"
                :show-summary="isShowSummary"
                :summary-method="getSummaries"
                @selection-change="handleSelectionChange"
            >
                <el-table-column v-if="showSelectColumn" :selectable="selectableFn" type="selection" width="50px" fixed />
                <el-table-column v-if="showIndexColumn" type="index" :index="indexMethod" label="序号" width="50px" fixed />
                <template v-for="(item, index) in column">
                    <el-table-column v-if="!item.hide" :key="item.prop + '' + index" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width || ''" :min-width="item.minwidth || ''" :formatter="item.formatter" :show-overflow-tooltip="(item.showOverFlowTooltip? false : true)">
                        <template slot="header">
                            {{ item.label }} <span v-if="item.subLabel" style="font-size: 10px;">{{ item.subLabel }}</span>
                        </template>
                        <template v-if="item.child">
                            <el-table-column v-for="chind in item.child" :key="chind.prop" :prop="chind.prop" :label="chind.label" :formatter="chind.formatter" :show-overflow-tooltip="chind.showOverFlowTooltip" :width="chind.width || ''">
                                <template slot="header">
                                    {{ chind.label }} <span v-if="chind.subLabel" style="font-size: 10px;">{{ chind.subLabel }}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column v-if="showOperationColumn" label="操作" fixed="right" :width="operationColumnWidth">
                    <template slot-scope="scope">
                        <slot :scope="scope" name="operation_column" />
                    </template>
                </el-table-column>
            </el-table>
            <slot name="showTableOther" />
            <slot v-if="!showTable" name="card-main" />
            <el-row v-if="showPage === true && tableData.length!==0">
                <el-pagination :current-page="queryForm[currpageConfig]" :page-sizes="[10, 20, 50]" :page-size="queryForm[pagesizeConfig] " layout="total, sizes, prev, pager, next, jumper" :total="queryForm.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </div>
    </div>
</template>

<script>
    import { exportFileForm, exportFileFor2Excel } from 'utils/utils.ts';
    import { creatGetPath } from 'utils/utils.ts';
    export default {
        name: 'QueryTable',
        components: {},
        props: {
            isQueryFormShow: { // 标头搜寻区块是否显示
                type: Boolean,
                default: true
            },
            isShowSummary: { // 数据是否显示合计
                type: Boolean,
                default: false
            },
            tableClass: {
                type: String,
                default: 'newTable'
            },
            factoryType: {
                type: Number,
                default: 0
            },
            queryTabkeType: { // querytable 类型
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'queryTable'
            },
            resData: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            pagePagination: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            showTable: {
                type: Boolean,
                default: true
            },
            customData: {
                type: Boolean,
                default: false
            },
            getListField: {
                type: String,
                default: ''
            },
            returnColumnType: {
                type: String,
                default: 'page'
            },
            queryFormData: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            exportExcel: {
                type: Boolean,
                default: false
            },
            exportOption: {
                type: Object,
                default: () => {
                    return {
                        exportInterface: '',
                        auth: '',
                        text: ''
                    };
                }
            },
            exportInterface: {
                type: String,
                default: ''
            },
            exportAuth: {
                type: String,
                default: ''
            },
            exportText: {
                type: String,
                default: ''
            },
            rules: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            queryAuth: {
                type: String,
                default: ''
            },
            listInterface: {
                type: Function,
                default: () => 1
            },
            getSummaries: {
                type: Function,
                default: () => 1
            },
            column: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            showOperationColumn: {
                type: Boolean,
                default: false
            },
            operationColumnWidth: {
                type: Number,
                default: 0
            },
            showSelectColumn: {
                type: Boolean,
                default: false
            },
            showIndexColumn: {
                type: Boolean,
                default: false
            },
            selectableFn: {
                type: Function,
                default: () => 1
            },
            showPage: {
                type: Boolean,
                default: true
            },
            fixTableHeightFromTop: {
                type: Number,
                default: 0
            },
            spanMethod: {
                type: Function,
                default: () => 1
            },
            tabs: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            tableHeight: {
                type: Number,
                default: 405
            },
            isRedact: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                queryForm: {
                    totalCount: 0
                },
                activeName: 0,
                queryFormRules: {},
                optionLists: {},
                tableData: [],
                multipleSelection: [],
                tableHeightSet: this.tableHeight,
                currpageConfig: 'currPage',
                pagesizeConfig: 'pageSize',
                prePage: 1
            };
        },
        computed: {},
        created() {
            this.init();
        },
        mounted() {
            this.headanimation(this.$);
            this.$nextTick(() => {
                if (this.fixTableHeightFromTop !== 0) {
                    // this.tableHeightSet = window.innerHeight - this.$refs.table.$el.offsetTop - this.fixTableHeightFromTop;
                    // 监听窗口大小变化
                    // let self = this
                    // window.onresize = function () {
                    //   self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - this.fixTableHeightFromTop
                    // }
                }
            });
        },
        methods: {
            // 设置下拉label
            setLabel(opt, item) {
                let label = '';
                item.resVal.label.forEach(it => {
                    label += opt[it] + ' ';
                });
                return label;
            },
            // 初始化
            init() {
                console.time('组件初始化');
                if (this.factoryType === 1) {
                    this.currpageConfig = 'current';
                    this.pagesizeConfig = 'size';
                }
                this.queryForm[this.currpageConfig] = 1;
                this.queryForm[this.pagesizeConfig] = 10;
                this.queryFormData.forEach(item => {
                    // 设置查询表单
                    this.$set(this.queryForm, item.prop, item.defaultValue || '');
                    if (item.type === 'date-interval') {
                        this.$set(this.queryForm, item.propTwo, item.defaultValueTwo || '');
                    }
                    // 下拉框获取下拉
                    if (item.options) {
                        this.$set(this.optionLists, item.prop, item.options || []);
                    } else if (item.defaultOptionsFn) {
                        // 初始化下拉
                        item.defaultOptionsFn().then(({ data }) => {
                            const getPath = creatGetPath(item.resVal.resData);
                            const dataTemp = getPath(data);
                            this.$set(this.optionLists, item.prop, dataTemp);
                            if (dataTemp.length > 0 && !item.defaultValue && item.defaultValue !== '') {
                                this.$set(this.queryForm, item.prop, dataTemp[0][item.resVal.value]);
                                this.$emit('created-end')
                                this.$nextTick(() => {
                                    this.$refs[item.prop][0].emitChange(dataTemp[0][item.resVal.value]);
                                });
                            }
                        });
                    } else if (item.defaultOptionsMore) {
                        item.defaultOptionsMore().then(({ data }) => {
                            if (/\./g.test(item.resVal.resData)) {
                                item.resVal.resData.split('.').forEach(resIt => {
                                    const dataSole = data.iotListInfo[resIt];
                                    // console.log(dataSole)
                                    if (dataSole.length > 0 && resIt === 'factory') {
                                        this.$set(this.queryForm, resIt, dataSole[0][item.resVal.value]);
                                        this.$nextTick(() => {
                                            this.$refs[item.prop][0].emitChange(dataSole[0][item.resVal.value]);
                                        });
                                    }
                                    this.$set(this.optionLists, resIt, dataSole);
                                });
                            }
                        });
                    }
                    // 联动监听事件对象
                    if (item.linkageProp) {
                        this.$nextTick(() => {
                            // 添加监听
                            this.$refs[item.prop][0].emitChange = val => {
                                this.clearTableAndPage();
                                item.linkageProp.forEach(linkagePropItem => {
                                    // 联动的对象
                                    const linkagePropItemObj = this.queryFormData.filter(it => it.prop === linkagePropItem)[0];
                                    // 联动的对象赋值
                                    this.queryForm[linkagePropItemObj.prop] = '';
                                    this.$refs[linkagePropItemObj.prop][0].emitChange('');
                                    // 获取联动的下拉
                                    if (val) {
                                        let secondVal = '';
                                        if (linkagePropItemObj.returnValue) {
                                            // 抓取其他接口返回的其他参数
                                            secondVal = this.optionLists[linkagePropItemObj.returnValue.findList].find(it => it[linkagePropItemObj.returnValue.findId] === val)[linkagePropItemObj.returnValue.findField]
                                        }
                                        linkagePropItemObj.optionsFn(val, secondVal).then(({ data }) => {
                                            const getPath = creatGetPath(linkagePropItemObj.resVal.resData);
                                            const dataTemp = getPath(data);
                                            this.$set(this.optionLists, linkagePropItemObj.prop, dataTemp);
                                            if (dataTemp.length > 0 && !linkagePropItemObj.defaultValue && linkagePropItemObj.defaultValue !== '') {
                                                this.$set(this.queryForm, linkagePropItemObj.prop, dataTemp[0][linkagePropItemObj.resVal.value]);
                                                this.$emit('created-end')
                                                this.$nextTick(() => {
                                                    this.$refs[linkagePropItemObj.prop][0].emitChange(dataTemp[0][linkagePropItemObj.resVal.value]);
                                                });
                                            }
                                        });
                                    } else {
                                        this.$set(this.optionLists, linkagePropItemObj.prop, []);
                                    }
                                });
                            };
                        });
                    } else {
                        this.$nextTick(() => {
                            this.$refs[item.prop][0].emitChange = () => {
                                this.clearTableAndPage();
                            };
                            if (item.propTwo) {
                                this.$refs[item.propTwo][0].emitChange = () => {
                                    this.clearTableAndPage();
                                };
                            }
                        });
                    }
                });
                console.timeEnd('组件初始化');
            },
            // 清空表格和分页
            clearTableAndPage() {
                // this.tableData = [];
                this.queryForm[this.currpageConfig] = 1;
                this.queryForm.totalCount = 0;
                // if (this.clearSearch) {
                //     this.getDataList(true);
                // }
            },
            searchHandler() {
                this.$emit('search-init')
                this.getDataList(true)
            },
            // 获取table数据
            getDataList(st) {
                if (this.rules.length) {
                    for (const item of this.rules) {
                        if (!this.queryForm[item.prop]) {
                            this.$warningToast(item.text);
                            return false;
                        }
                    }
                }
                if (!this.isAuth(this.queryAuth) && this.queryAuth !== '') {
                    this.$warningToast('无查询权限');
                    return false;
                }
                if (st) {
                    if (this.tabs.length && this.tabs[this.activeName].pages) {
                        this.tabs[this.activeName].pages[this.currpageConfig] = 1;
                    } else {
                        this.queryForm[this.currpageConfig] = 1;
                    }
                }
                if (this.pagePagination.currPage) {
                    this.queryForm[this.pagePagination.currPage] = this.queryForm[this.currpageConfig]
                }
                if (this.pagePagination.pageSize) {
                    this.queryForm[this.pagePagination.pageSize] = this.queryForm[this.pagesizeConfig]
                }
                if (this.pagePagination.currPage) {
                    this.queryForm[this.pagePagination.totalCount] = this.queryForm.totalCount
                }
                this.listInterface(this.queryForm).then(({ data }) => {
                    if (this.getListField) {
                        const getPath = creatGetPath(this.getListField);
                        this.tableData = getPath(data);
                    } else if (!this.customData) {
                        const getPath = creatGetPath(this.returnColumnType);
                        const path = getPath(data);
                        if (this.resData.list) {
                            this.tableData = path[this.resData.list];
                        } else {
                            this.tableData = path.list;
                        }
                        if (this.resData.currPage) {
                            this.queryForm.currPage = Number(path[this.resData.currPage]);
                        } else {
                            this.queryForm.currPage = Number(path.currPage);
                        }
                        if (this.resData.pageSize) {
                            this.queryForm[this.pagesizeConfig] = Number(path[this.resData.pageSize]);
                        } else {
                            this.queryForm[this.pagesizeConfig] = Number(path.pageSize);
                        }
                        if (this.resData.totalCount) {
                            this.queryForm.totalCount = Number(path[this.resData.totalCount]);
                        } else {
                            this.queryForm.totalCount = Number(path.totalCount);
                        }
                    } else if (this.factoryType === 1) {
                        this.tableData = data.data.records;
                        this.queryForm.totalCount = data.data.total;
                    } else if (this.queryTabkeType === 'report') { // 类型：报表
                        this.tableData = data.data;
                        this.queryForm[this.currpageConfig] = 1;
                        this.queryForm[this.pagesizeConfig] = 10;
                        this.queryForm.totalCount = data.data.length;
                    }
                    this.$emit('get-data-success', data, st);
                });
            },
            // 导出
            formExportExcel() {
                if (this.rules.length) {
                    for (const item of this.rules) {
                        if (!this.queryForm[item.prop]) {
                            this.$warningToast(item.text);
                            return false;
                        }
                    }
                }
                if (!this.isAuth(this.exportOption.auth) && this.exportOption.auth !== '') {
                    this.$warningToast('无导出权限');
                    return false;
                }

                if (this.queryTabkeType === 'report') { // 类型：报表
                    const tableDataTemp = JSON.parse(JSON.stringify(this.tableData))
                    this.tableData[0].totalData[this.column[0].prop] = '合计';
                    tableDataTemp.push(this.tableData[0].totalData);
                    exportFileFor2Excel(this.column, tableDataTemp, this.exportOption.text)
                    return
                }

                exportFileForm(`${this.exportOption.exportInterface}`, this.exportOption.text, this);
            },
            // 显示隐藏动画
            /* eslint-disable no-invalid-this */
            headanimation($) {
                $('.toggleSearchBottom')
                    .parents('.searchCard')
                    .css('padding-bottom', '7px');
                // 搜索切换显隐
                $('.toggleSearchBottom').click(function() {
                    $('.toggleSearchBottom')
                        .parents('.searchCard')
                        .css('padding-bottom', '0');
                    $('.searchCard').animate({ height: 0 }, 300, () => {
                        $(this).hide();
                        $('.toggleSearchTop').show();
                    });
                });
                $('.toggleSearchTop').click(function() {
                    const hei = $('.searchCard .el-card__body').height();
                    $('.searchCard').animate({ height: `${hei + 20}px` }, 300, () => {
                        $('.searchCard').css('padding-bottom', '15px');
                        $(this).hide();
                        $('.toggleSearchBottom').show();
                    });
                });
            },
             /* eslint-enable no-invalid-this */
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.queryForm[this.currpageConfig]) - 1) * (Number(this.queryForm[this.pagesizeConfig]));
            },
            // tab表格选中
            tabHandleSelectionChange(val, index) {
                this.tabs[index].multipleSelection = [];
                val.forEach((item) => {
                    this.tabs[index].multipleSelection.push(item);
                });
            },
            // 表格选中
            handleSelectionChange(val) {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item);
                });
            },
            // 改变每页条数
            tabHandleSizeChange(item, val) {
                if (this.isRedact) {
                    this.$warningToast('请先保存数据');
                    return false;
                }
                item.pageSize = val;
                this.getDataList();
            },
            // 跳转页数
            tabHandleCurrentChange(item, val) {
                if (this.isRedact) {
                    this.$warningToast('请先保存数据');
                    item.currPage = item.prePage;
                    return false;
                }
                item.prePage = item.currPage;
                item.currPage = val;
                this.getDataList();
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.queryForm[this.pagesizeConfig] = val;
                this.getDataList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.queryForm[this.currpageConfig] = val;
                this.getDataList();
            },
            tabClick(tab) {
                const tabName = JSON.parse(JSON.stringify(tab.name));
                this.$emit('tab-click', tabName);
            },
            lineClick(row) {
                this.$emit('line-click', row);
            },
            // 选择变化
            selectChange(row, index, val) {
                this.$emit('select-change', row, index, val);
            },
            dateChange(v) {
                this.$emit('date-change', v.value);
            }
        }
    };
</script>
<style scoped>
.searchCard >>> .el-form-item.is-error .el-input__inner,
.searchCard >>> .el-form-item.is-success .el-input__inner,
.searchCard >>> .el-form-item.is-error .el-input__inner:focus,
.searchCard >>> .el-form-item.is-success .el-input__inner:focus {
    border-color: #dcdfe6;
}
.searchCard >>> .el-form-item__error {
    display: none;
}

</style>

<style scoped></style>
