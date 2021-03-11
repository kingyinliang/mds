<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-02-26 10:58:05
 * @LastEditors: Telliex
 * @LastEditTime: 2021-03-10 17:28:18
-->
<template>
    <div>
        <el-card v-if="queryFormSetting.isQueryFormShow" class="searchCard" style="margin-bottom: 5px;">
            <el-form :model="queryForm" :inline="true" size="small" label-width="70px" class="multi_row clearfix" style="font-size: 0;" @keyup.enter.native="getDataList(true)">
                <template v-for="item in queryFormData">
                    <template v-if="!item.hide">
                        <el-form-item v-if="item.type === 'select'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`" :class="{ marked: item.marked }">
                            <el-select v-if="item.defaultOptionsList" :ref="item.prop" v-model="queryForm[item.prop]" :style="`width: ${item.width ? item.width : 170}px;`" :filterable="item.filterable" :clearable="item.clearable" :disabled="item.disabled" :placeholder="'请选择' + item.label">
                                <el-option v-for="(opt, optIndex) in item.defaultOptionsList" :key="optIndex" :label="opt.label" :value="opt.value" />
                            </el-select>
                            <el-select v-else :ref="item.prop" v-model="queryForm[item.prop]" :style="`width: ${item.width ? item.width : 170}px;`" :filterable="item.filterable" :clearable="item.clearable" :disabled="item.disabled" :placeholder="'请选择' + item.label">
                                <el-option v-for="(opt, optIndex) in optionLists[item.prop]" :key="optIndex" :label="setLabel(opt, item)" :value="opt[item.resVal.value]" />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'input'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`" :class="{ marked: item.marked }">
                            <el-input :ref="item.prop" v-model.trim="queryForm[item.prop]" :style="`width: ${item.width ? item.width : 170}px;`" :clearable="item.clearable" :disabled="item.disabled" />
                        </el-form-item>
                        <el-form-item v-if="item.type === 'radio'" :key="item.prop" :label="item.label?`${item.label}：` : ''" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`" :class="{ marked: item.marked }">
                            <el-radio-group :ref="item.prop" v-model="queryForm[item.prop]">
                                <el-radio v-for="(it, num) in item.radioArr" :key="num" :label="it.val" :disabled="item.disabled">
                                    {{ it.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'single-checkbox'" :key="item.prop" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`" :class="{ marked: item.marked }">
                            <el-checkbox :ref="item.prop" v-model="queryForm[item.prop]" :disabled="item.disabled">
                                {{ item.label }}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'date-interval'" :key="item.prop" class="dateinput" :label="`${item.label}：` || ''" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`" :class="{ marked: item.marked }">
                            <el-row :style="`width: ${item.width ? item.width : 305}px;`">
                                <el-col :span="11">
                                    <el-form-item :prop="item.prop">
                                        <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" :type="item.dataType ? item.dataType : 'date'" placeholder="开始日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" :style="`width: ${item.width ? (item.width/24)*11 : 140}px;`" :disabled="item.disabled" />
                                    </el-form-item>
                                </el-col>
                                <el-col class="line" :span="2" style="text-align: center;">
                                    -
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item :prop="item.propTwo">
                                        <el-date-picker :ref="item.propTwo" v-model="queryForm[item.propTwo]" :type="item.dataType ? item.dataType : 'date'" placeholder="结束日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" :style="`width: ${item.width ? (item.width/24)*11 : 140}px;`" :disabled="item.disabled" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'date-picker'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop" :rules="item.rule" :label-width="`${item.labelWidth ? item.labelWidth : 70}px`" :class="{ marked: item.marked }">
                            <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" :type="item.dataType" placeholder="请选择" :value-format="item.valueFormat" :style="`width: ${item.width ? item.width : 170}px;`" :disabled="item.disabled" @blur="v => dateChange(v)" />
                        </el-form-item>
                    </template>
                </template>
                <el-form-item class="floatr">
                    <el-button type="primary" size="small" @click="getDataList(true)">
                        查询
                    </el-button>
                    <el-button v-if="queryFormSetting.exportExcel" type="primary" size="small" @click="tableExportExcel">
                        导出
                    </el-button>
                    <slot name="mds-button" />
                </el-form-item>
            </el-form>
        </el-card>
        <!-- custom data table-->
        <div v-if="type === 'customDataTable'" class="tableCard box-card" style="min-height: 400px; background: #fff;">
            <slot name="customDataTable" />
        </div>
        <!-- default data table-->
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
                v-if="dataTableSetting.showIt"
                ref="table"
                class="newTable"
                :class="dataTableSetting.tableClass"
                :data="tableData.slice((currentPage - 1) * currentSize, (currentPage - 1) * currentSize + currentSize)"
                :height="dataTableSetting.tableHeightSet"
                :span-method="spanMethod"
                border
                size="small"
                tooltip-effect="dark"
                :header-row-class-name="tableHead"
                :header-cell-style="tableHeaderCellStyle"
                style="width: 100%; margin-bottom: 20px;"
                :show-summary="dataTableSetting.tableAttributes.isShowSummary"
                :summary-method="getSummaries"
                @selection-change="handleSelectionChange"
            >
                <el-table-column v-if="dataTableSetting.showSelectColumn" :selectable="selectableFn" type="selection" width="50px" fixed />
                <el-table-column v-if="dataTableSetting.showIndexColumn" type="index" :index="indexMethod" label="序号" width="50px" fixed />
                <template v-for="(item, index) in dataTableSetting.column">
                    <el-table-column v-if="!item.hide" :key="item.prop + '' + index" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width || ''" :min-width="item.minwidth || ''" :formatter="item.formatter" :show-overflow-tooltip="(item.showOverFlowTooltip? false : true)">
                        <template slot="header">
                            {{ item.label }} <span v-if="item.subLabel" style="font-size: 10px;">{{ item.subLabel }}</span>
                        </template>
                        <template v-if="item.child">
                            <el-table-column v-for="child in item.child" :key="child.prop" :prop="child.prop" :label="child.label" :formatter="child.formatter" :show-overflow-tooltip="child.showOverFlowTooltip" :width="child.width || ''">
                                <template slot="header">
                                    {{ child.label }} <span v-if="child.subLabel" style="font-size: 10px;">{{ child.subLabel }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template slot-scope="scope">
                            <!-- array content -->
                            <template v-if="item.dataType==='list'">
                                <ul v-if="scope.row[item.prop].length===1">
                                    <li v-for="(subChild,subIndex) in scope.row[item.prop]" :key="subIndex" style="cursor: pointer;" @click="goParentAction(scope.row,scope.$index)">
                                        {{ subChild }}
                                    </li>
                                </ul>
                                <ul v-else>
                                    <li v-for="(subChild,subIndex) in scope.row[item.prop]" :key="subIndex">
                                        {{ subChild }}
                                    </li>
                                </ul>
                            </template>
                            <!-- multi props content -->
                            <template v-else-if="item.dataType==='multi'">
                                <span v-for="(subChild,subIndex) in item.data" :key="subIndex" style="margin-right: 5px;">
                                    {{ scope.row[subChild] }}
                                </span>
                            </template>
                            <!-- single props content -->
                            <template v-else>
                                {{ scope.row[item.prop] }}
                            </template>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column v-if="dataTableSetting.showOperationColumn" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <slot :scope="scope" name="operation_column" />
                    </template>
                </el-table-column>
            </el-table>
            <slot name="showTableOther" />
            <slot v-if="!dataTableSetting.showIt" name="card-main" />
            <el-row v-if="dataTableSetting.showPagination===true && dataTableSetting.showIt === true && tableData.length!==0">
                <el-pagination v-if="dataTableSetting.dataChangeByAPI" :current-page="queryForm[currpageConfig]" :page-sizes="[10, 20, 50]" :page-size="queryForm[pagesizeConfig] " layout="total, sizes, prev, pager, next, jumper" :total="queryForm.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                <el-pagination
                    v-if="!dataTableSetting.dataChangeByAPI"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50]"
                    :page-size="currentSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </el-row>
        </div>
    </div>
</template>

<script>
    import { exportFileFor2Excel, exportFile2ExcelWithMultiHeader } from 'utils/utils.ts';
    import { creatGetPath } from 'utils/utils.ts';
    export default {
        name: 'QueryTable',
        components: {},
        props: {
            // factoryType: {
            //     type: Number,
            //     default: 0
            // },
            queryTableType: { // querytable 类型
                type: String,
                default: ''
            },
            type: { // customDataTable / normalDataTable
                type: String,
                default: 'normalDataTable'
            },
            resData: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            // 外置 pagination
            // pagePagination: {
            //     type: Object,
            //     default: () => {
            //         return {}
            //     }
            // },
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
            listInterface: { // search of call API function
                type: Function,
                default: () => 1
            },
            getSummaries: { // push amount
                type: Function,
                default: () => 1
            },

            selectableFn: {
                type: Function,
                default: () => 1
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
            isRedact: {
                type: Boolean,
                default: false
            },
            // query from setting
            queryFormSetting: {
                type: Object,
                 default: () => {
                     return {
                        isQueryFormShow: true, // 标头搜寻区块是否显示
                        exportExcel: false,
                        exportOption: {
                            exportInterface: '',
                            auth: '',
                            text: ''
                        }
                     }
                 }
            },

            // data table setting
            dataTableSetting: {
                type: Object,
                default: () => {
                    return {
                        type: 'default', // multiHeader
                        merges: [],
                        showIt: false,
                        showSelectColumn: false,
                        showIndexColumn: false,
                        showOperationColumn: false,
                        showPagination: true,
                        tableClass: 'newTable',
                        column: [],
                        tableAttributes: {
                            isShowSummary: false // 数据是否显示合计
                        },
                        dataChangeByAPI: false, // table data change by API
                        tableHeightSet: 405
                    };
                }
            }
            // multiHeader: {
            //     type: Boolean,
            //     default: false
            // }
        },
        data() {
            return {
                queryForm: {
                },
                activeName: 0,
                optionLists: {},
                tableData: [],
                multipleSelection: [],
                currpageConfig: 'currPage',
                pagesizeConfig: 'pageSize',
                // prePage: 1,
                currentPage: 1,
                currentSize: 10,
                totalCount: 0
            };
        },
        created() {
            this.init(); // 初始化 setting
        },
        mounted() {
            this.headanimation(this.$);
            this.$nextTick(() => {
                this.begin(); // 初始化 data setting for layout
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
                // if (this.factoryType === 1) {
                //     this.currpageConfig = 'current';
                //     this.pagesizeConfig = 'size';
                // }

                if (this.dataTableSetting.dataChangeByAPI) {
                    this.$set(this.queryForm, this.currpageConfig, 1);
                    this.$set(this.queryForm, this.pagesizeConfig, 10);
                    this.$set(this.queryForm, 'totalCount', 0);
                    // this.queryForm[this.currpageConfig] = 1;
                    // this.queryForm[this.pagesizeConfig] = 10;
                } else {
                    this.currentPage = 1;
                    this.currentSize = 10;
                    this.totalCount = 0;
                }

                this.queryFormData.forEach(item => {
                    // ==设置查询表单
                    this.$set(this.queryForm, item.prop, item.defaultValue || '');
                    // ==设置时间区间
                    if (item.type === 'date-interval') {
                        this.$set(this.queryForm, item.propTwo, item.defaultValueTwo || '');
                    }
                    // ==下拉框获取下拉
                    if (item.options) {
                        this.$set(this.optionLists, item.prop, item.options || []);
                    } else if (item.defaultOptionsFn) { // from API
                        // 初始化下拉
                        item.defaultOptionsFn().then(({ data }) => {
                            const getPath = creatGetPath(item.resVal.resData);
                            const dataTemp = getPath(data);
                            this.$set(this.optionLists, item.prop, dataTemp);
                            if (dataTemp.length > 0 && !item.defaultValue && item.defaultValue !== '') {
                                this.$set(this.queryForm, item.prop, dataTemp[0][item.resVal.value]);
                                this.$emit('created-end');
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
                    // ==联动监听事件对象
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
                                            secondVal = this.optionLists[linkagePropItemObj.returnValue.findList].find(it => it[linkagePropItemObj.returnValue.findId] === val)[linkagePropItemObj.returnValue.findField];
                                        }
                                        linkagePropItemObj.optionsFn(val, secondVal).then(({ data }) => {
                                            const getPath = creatGetPath(linkagePropItemObj.resVal.resData);
                                            const dataTemp = getPath(data);
                                            this.$set(this.optionLists, linkagePropItemObj.prop, dataTemp);
                                            if (dataTemp.length > 0 && !linkagePropItemObj.defaultValue && linkagePropItemObj.defaultValue !== '') {
                                                this.$set(this.queryForm, linkagePropItemObj.prop, dataTemp[0][linkagePropItemObj.resVal.value]);
                                                this.$emit('created-end');
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
                    // ==联动监听事件对象
                    if (item.changeToAction) {
                        this.$nextTick(() => {
                            // 添加监听
                            this.$refs[item.prop][0].emitChange = val => {
                                // 获取联动的下拉
                                if (val) {
                                    item.changeToAction(val).then((data) => {
                                        this.queryFormData.forEach(element => {
                                            element.disabled = false;
                                            data.forEach(subItem => {
                                                if (element.prop === subItem) {
                                                    element.disabled = true;
                                                }
                                            })
                                        })
                                    })
                                }
                            };
                        });
                    }
                });
                console.timeEnd('组件初始化');
            },

            //初始化 data setting for layout
            begin() {
                this.queryFormData.forEach(item => {
                    if (item.defaultDisabled) {
                        item.defaultDisabled.forEach(element => {
                            if (this.queryFormData.find(subItem => subItem.prop === element)) {
                                this.queryFormData.find(subItem => subItem.prop === element).disabled = true
                            }
                        })
                    }
                })
            },

            goParentAction(row, index) {
                this.$emit('data-action', row, index);
            },

            // 清空表格和分页
            clearTableAndPage() {
                // this.tableData = [];
                if (this.dataTableSetting.dataChangeByAPI) {
                    this.queryForm[this.currpageConfig] = 1;
                    this.queryForm.totalCount = 0;
                } else {
                    this.currentPage = 1;
                    this.totalCount = 0;
                }
                // if (this.clearSearch) {
                //     this.getDataList(true);
                // }
            },
            // [查询] 获取 table 数据
            getDataList(st) {
                if (this.queryFormSetting.rules.length !== 0) {
                    for (const item of this.queryFormSetting.rules) {
                        if (!this.queryForm[item.prop]) {
                            this.$warningToast(item.text);
                            return false;
                        }
                    }
                }
                if (!this.isAuth(this.queryFormSetting.queryAuth) && this.queryFormSetting.queryAuth !== '') {
                    this.$warningToast('无查询权限');
                    return false;
                }
                if (st) {
                    if (this.dataTableSetting.dataChangeByAPI) {
                        this.queryForm[this.currpageConfig] = 1;
                        return
                    }
                    this.currentPage = 1;
                }

                // 外置 pagination
                // if (this.pagePagination.currPage) {
                //     this.queryForm[this.pagePagination.currPage] = this.queryForm[this.currpageConfig]
                // }
                // if (this.pagePagination.pageSize) {
                //     this.queryForm[this.pagePagination.pageSize] = this.queryForm[this.pagesizeConfig]
                // }
                // if (this.pagePagination.currPage) {
                //     this.queryForm[this.pagePagination.totalCount] = this.queryForm.totalCount
                // }

                this.tableData = [];
                this.listInterface(this.queryForm).then(({ data }) => {
                    // if (this.getListField) {
                    //     const getPath = creatGetPath(this.getListField);
                    //     this.tableData = getPath(data);
                    // } else if (!this.customData) {
                    //     const getPath = creatGetPath(this.returnColumnType);
                    //     const path = getPath(data);
                    //     if (this.resData.list) {
                    //         this.tableData = path[this.resData.list];
                    //     } else {
                    //         this.tableData = path.list;
                    //     }
                    //     if (this.resData.currPage) {
                    //         this.queryForm.currPage = Number(path[this.resData.currPage]);
                    //     } else {
                    //         this.queryForm.currPage = Number(path.currPage);
                    //     }
                    //     if (this.resData.pageSize) {
                    //         this.queryForm[this.pagesizeConfig] = Number(path[this.resData.pageSize]);
                    //     } else {
                    //         this.queryForm[this.pagesizeConfig] = Number(path.pageSize);
                    //     }
                    //     if (this.resData.totalCount) {
                    //         this.queryForm.totalCount = Number(path[this.resData.totalCount]);
                    //     } else {
                    //         this.queryForm.totalCount = Number(path.totalCount);
                    //     }
                    // } else if (this.factoryType === 1) {
                    //     this.tableData = data.data.records;
                    //     this.queryForm.totalCount = data.data.total;
                    // } else if (this.queryTableType === 'report') { // 类型：报表
                    this.tableData = JSON.parse(JSON.stringify(data.data)) || [];
                    if (this.dataTableSetting.dataChangeByAPI) {
                        this.queryForm[this.currpageConfig] = 1;
                        this.queryForm[this.pagesizeConfig] = 10;
                        this.queryForm.totalCount = data.data.length;
                    } else {
                        this.currentPage = 1;
                        this.currentSize = 10;
                        this.totalCount = this.tableData.length;
                    }
                    // }
                    this.$emit('get-data-success', data, st);
                });
            },
            // [导出] download EXCEL file
            tableExportExcel() {
                if (this.queryFormSetting.rules.length !== 0) {
                    for (const item of this.queryFormSetting.rules) {
                        if (!this.queryForm[item.prop]) {
                            this.$warningToast(item.text);
                            return;
                        }
                    }
                }

                if (!this.isAuth(this.queryFormSetting.exportOption.auth) && this.queryFormSetting.exportOption.auth !== '') {
                    this.$warningToast('无导出权限');
                    return;
                }

                this.listInterface(this.queryForm).then(({ data }) => {
                    const tableData = data.data;
                    if (data.data.length === 0) {
                        this.$infoToast('暂无任何内容');
                        return;
                    }
                    if (this.queryTableType === 'report') { // 类型：报表
                        const tableDataTemp = JSON.parse(JSON.stringify(tableData));
                        if (this.dataTableSetting.tableAttributes.isShowSummary && tableData[0].totalData) {
                            tableData[0].totalData[this.dataTableSetting.column[0].prop] = '合计';
                            tableDataTemp.push(tableData[0].totalData);
                        }
                        if (this.dataTableSetting.type === 'multiHeader') {
                            exportFile2ExcelWithMultiHeader(this.dataTableSetting.column, this.dataTableSetting.merges, tableDataTemp, this.queryFormSetting.exportOption.text)
                            return
                        }
                        exportFileFor2Excel(this.dataTableSetting.column, tableDataTemp, this.queryFormSetting.exportOption.text);
                    }
                });
                // exportFileForm(`${this.queryFormSetting.exportOption.exportInterface}`, this.queryFormSetting.exportOption.text, this);
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
                if (this.dataTableSetting.dataChangeByAPI) {
                    return index + 1 + (Number(this.queryForm[this.currpageConfig]) - 1) * (Number(this.queryForm[this.pagesizeConfig]));
                }
                return index + 1 + (Number(this.currentPage) - 1) * (Number(this.currentSize));
            },
            // tab表格选中
            // tabHandleSelectionChange(val, index) {
            //     this.tabs[index].multipleSelection = [];
            //     val.forEach((item) => {
            //         this.tabs[index].multipleSelection.push(item);
            //     });
            // },
            // 表格选中
            handleSelectionChange(val) {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item);
                });
            },
            // 改变每页条数
            // tabHandleSizeChange(item, val) {
            //     if (this.isRedact) {
            //         this.$warningToast('请先保存数据');
            //         return false;
            //     }
            //     item.pageSize = val;
            //     this.getDataList();
            // },
            // 跳转页数
            // tabHandleCurrentChange(item, val) {
            //     if (this.isRedact) {
            //         this.$warningToast('请先保存数据');
            //         item.currPage = item.prePage;
            //         return false;
            //     }
            //     item.prePage = item.currPage;
            //     item.currPage = val;
            //     this.getDataList();
            // },
            // 改变每页条数
            handleSizeChange(val) {
                if (this.dataTableSetting.dataChangeByAPI) {
                    this.queryForm[this.pagesizeConfig] = val;
                    this.getDataList();
                    return;
                }
                this.currentSize = val;
            },
            // 跳转页数
            handleCurrentChange(val) {
                if (this.dataTableSetting.dataChangeByAPI) {
                    this.queryForm[this.currpageConfig] = val;
                    this.getDataList();
                    return;
                }
                this.currentPage = val;
            },
            // tabClick(tab) {
            //     const tabName = JSON.parse(JSON.stringify(tab.name));
            //     this.$emit('tab-click', tabName);
            // },
            // lineClick(row) {
            //     this.$emit('line-click', row);
            // },
            // 选择变化
            // selectChange(row, index, val) {
            //     this.$emit('select-change', row, index, val);
            // },
            dateChange(v) {
                this.$emit('date-change', v.value);
            },

            // 修改 table header cell的背景色
            tableHeaderCellStyle() {
                return 'outline: rgb(255 255 255 / 25%) solid 1px'
            },
            tableHead() {
                return ''
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

.searchCard >>> .marked .el-form-item__label::before {
    color: #f00;
    content: "* ";
}
</style>

<style scoped></style>
