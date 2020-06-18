<template>
    <div>
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-form :model="queryForm" :rules="queryFormRules" :inline="true" size="small" label-width="70px" class="multi_row clearfix" style="font-size: 0;">
                <template v-for="item in queryFormData">
                    <template v-if="!item.hide">
                        <el-form-item v-if="item.type === 'select'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop">
                            <el-select :ref="item.prop" v-model="queryForm[item.prop]" style="width: 170px;" :filterable="item.filterable" :multiple="item.multiple" :clearable="!item.clearable" :disabled="item.disabled" :placeholder="'请选择' + item.label">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(opt, optIndex) in optionLists[item.prop]" :key="optIndex" :label="setLabel(opt, item)" :value="opt[item.resVal.value]" />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'input'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop">
                            <el-input :ref="item.prop" v-model="queryForm[item.prop]" style="width: 170px;" />
                        </el-form-item>
                        <el-form-item v-if="item.type === 'date-interval'" :key="item.prop" class="dateinput" :label="`${item.label}：` || ''" :prop="item.prop">
                            <el-row>
                                <el-col :span="12">
                                    <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" :type="item.dataType ? item.dataType : 'date'" placeholder="选择日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" style="width: 140px;" />
                                    <span style="margin-left: 5px;">-</span>
                                </el-col>
                                <el-col :span="12">
                                    <el-date-picker :ref="item.propTwo" v-model="queryForm[item.propTwo]" :type="item.dataType ? item.dataType : 'date'" placeholder="选择日期" :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'" style="width: 140px;" />
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item v-if="item.type === 'date-picker'" :key="item.prop" :label="`${item.label}：` || ''" :prop="item.prop">
                            <el-date-picker :ref="item.prop" v-model="queryForm[item.prop]" :type="item.dataType" placeholder="请选择" :value-format="item.valueFormat" style="width: 170px;" />
                        </el-form-item>
                    </template>
                </template>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth(queryAuth)" type="primary" size="small" @click="getDataList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div v-if="tabs.length === 1">
            <mds-card :title="tabs[0]['title']" :name="'productPeople'">
                <el-table :data="dataList" border tooltip-effect="dark" class="newTable" header-row-class-name="tableHead" @selection-change="handleSelectionChange" @row-dblclick="clickLine">
                    <el-table-column v-if="tabs[0]['showSelectColumn']" :selectable="selectableFn" type="selection" fixed="left" width="50" />
                    <el-table-column v-if="tabs[0]['showIndexColumn']" type="index" :index="indexMethod" label="序号" width="50" />
                    <template v-for="(item, index) in tabs[0]['column']">
                        <el-table-column :key="index" :fixed="item.fixed" :width="item.width || ''" :min-width="item.minwidth || ''" :show-overflow-tooltip="true">
                            <template slot="header">
                                <span v-if="item.require" class="notNull">*</span>{{ item.label }}
                            </template>
                            <template slot-scope="scope">
                                <template v-if="item.type === 'input'">
                                    <el-input v-model="scope.row[item.prop]" size="mini" placeholder="手工录入" :disabled="(!isRedact || scope.row.lineStatus === 0)" />
                                </template>
                                <template v-else>
                                    <p
                                        :style="{
                                            color: scope.row.color && item.colorprop === true ? scope.row.color : ''
                                        }"
                                    >
                                        <span v-if="typeof item.prop === 'object'">
                                            <i v-for="(sole, soleIndex) in item.prop" :key="soleIndex">
                                                {{ scope.row[sole] }}
                                            </i>
                                        </span>
                                        <span v-else>
                                            {{ scope.row[item.prop] }}
                                        </span>
                                    </p>
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column v-if="tabs[0]['showOperationColumn']" label="操作" fixed="right" :width="tabs[0]['showOperationColumn']">
                        <template slot-scope="scope">
                            <slot :scope="scope" name="operation_column" />
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    :current-page="queryForm[currpageConfig]"
                    :page-sizes="[10, 20, 50]"
                    :page-size="queryForm[pagesizeConfig]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="queryForm.totalCount"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </mds-card>
        </div>
        <!--编辑-->
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_btn">
                        <el-button v-if="isAuth(editAuth)" type="primary" size="small" @click="isRedact = !isRedact">
                            {{ isRedact ? '取消' : '编辑' }}
                        </el-button>
                        <template v-if="isRedact">
                            <el-button type="primary" size="small" @click="savedData">
                                保存
                            </el-button>
                            <el-button type="primary" size="small" @click="submitData">
                                提交
                            </el-button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'QueryTable',
        components: {},
        props: {
            factoryType: {
                type: Number,
                default: 0
            },
            queryFormData: { // 表头
                type: Array,
                default: () => {
                    return [];
                }
            },
            rules: { // 查询校验
                type: Array,
                default: () => {
                    return [];
                }
            },
            queryAuth: { // 查询
                type: String,
                default: ''
            },
            editAuth: { // 编辑
                type: String,
                default: ''
            },
            tabs: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            listInterface: {
                type: Function,
                default: () => 1
            },
            fakePage: { // 是否假翻页
                type: Boolean,
                default: false
            },
            getListField: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                queryForm: {
                    totalCount: 0
                },
                isRedact: false,
                dataList: [],
                dataListAll: [],
                queryFormRules: {},
                optionLists: {},
                multipleSelection: [],
                currpageConfig: 'currPage',
                pagesizeConfig: 'pageSize'
            };
        },
        computed: {
            sidebarFold: {
                get() {
                    return this.$store.state.common.sidebarFold;
                }
            }
        },
        created() {
            this.init();
        },
        mounted() {
            this.headanimation(this.$);
        },
        methods: {
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
                    this.$set(this.queryForm, item.prop, item.defaultValue || item.multiple ? [] : '');
                    if (item.type === 'date-interval') {
                        this.$set(this.queryForm, item.prop, item.defaultValue || '');
                        this.$set(this.queryForm, item.propTwo, item.defaultValueTwo || '');
                    }
                    // 下拉框获取下拉
                    if (item.options) {
                        this.$set(this.optionLists, item.prop, item.options || []);
                    } else if (item.defaultOptionsFn) {
                        // 初始化下拉
                        item.defaultOptionsFn().then(({ data }) => {
                            const dataTemp = data[item.resVal.resData];
                            this.$set(this.optionLists, item.prop, dataTemp);
                            if (dataTemp.length > 0 && item.defaultValue === '') {
                                this.$set(this.queryForm, item.prop, dataTemp[0][item.resVal.value]);
                                this.$nextTick(() => {
                                    this.$refs[item.prop][0].emitChange(dataTemp[0][item.resVal.value]);
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
                                    this.queryForm[linkagePropItemObj.prop] = linkagePropItemObj.multiple ? [] : '';
                                    this.$refs[linkagePropItemObj.prop][0].emitChange('');
                                    // 获取联动的下拉
                                    if (val) {
                                        let secondVal = '';
                                        let fromVal = '';
                                        if (linkagePropItemObj.returnValue) {
                                            // 抓取其他接口返回的其他参数
                                            secondVal = this.optionLists[linkagePropItemObj.returnValue.findList].find(it => it[linkagePropItemObj.returnValue.findId] === val)[linkagePropItemObj.returnValue.findField]
                                        }
                                        if (linkagePropItemObj.formValue) {
                                            fromVal = this.queryForm[linkagePropItemObj.formValue];
                                        }
                                        linkagePropItemObj.optionsFn(val, secondVal, fromVal).then(({ data }) => {
                                            let dataTemp = data
                                            if (linkagePropItemObj.resVal.resDataArray) {
                                                linkagePropItemObj.resVal.resDataArray.map(sole => {
                                                    dataTemp = dataTemp[sole]
                                                })
                                            } else {
                                                dataTemp = data[linkagePropItemObj.resVal.resData];
                                            }
                                            this.$set(this.optionLists, linkagePropItemObj.prop, dataTemp);
                                            if (dataTemp.length > 0 && linkagePropItemObj.defaultValue === '') {
                                                this.$set(this.queryForm, linkagePropItemObj.prop, dataTemp[0][linkagePropItemObj.resVal.value]);
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
                this.dataList = [];
                this.queryForm[this.currpageConfig] = 1;
                this.queryForm.totalCount = 0;
            },
            // 设置下拉label
            setLabel(opt, item) {
                let label = '';
                item.resVal.label.forEach(it => {
                    label += opt[it] + ' ';
                });
                return label;
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
                    this.queryForm[this.currpageConfig] = 1;
                }
                this.listInterface(this.queryForm).then(({ data }) => {
                    this.queryForm['totalCount'] = data[this.getListField].length;
                    if (this.fakePage === true) {
                        this.dataListAll = data[this.getListField];
                        this.changeList();
                    } else {
                        this.dataList = data[this.getListField];
                    }
                    this.$emit('get-data-success', this.dataList);
                });
            },
            // 复选框状态
            selectableFn(row) {
                if (!this.isRedact || row.lineStatus === 0) {
                    return 0;
                }
                return 1;
            },
            savedData() {
                this.$emit('saved-data');
            },
            // 提交
            submitData() {
                this.$emit('submit-data');
            },
            // 双击行事件
            clickLine(row) {
                this.$emit('click-line', row);
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
            // 表格选中
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.queryForm[this.currpageConfig]) - 1) * (Number(this.queryForm[this.pagesizeConfig]));
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.queryForm[this.pagesizeConfig] = val;
                if (this.fakePage === true) {
                    this.changeList();
                    this.$emit('get-data-success', this.dataList);
                }
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.queryForm[this.currpageConfig] = val;
                if (this.fakePage === true) {
                    this.changeList();
                    this.$emit('get-data-success', this.dataList);
                }
            },
            // 针对前段翻页
            changeList() {
                this.dataList = this.dataListAll.slice((this.queryForm[this.currpageConfig] - 1) * this.queryForm[this.pagesizeConfig], (this.queryForm[this.currpageConfig] - 1) * this.queryForm[this.pagesizeConfig] + this.queryForm[this.pagesizeConfig]);
            }
        }
    };
</script>

<style scoped></style>
