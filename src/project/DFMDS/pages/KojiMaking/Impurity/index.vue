<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="kjImQuery"
            :type="'home'"
            :rules="queryTableFormRules"
            :query-form-data="queryTableFormData"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            @get-data-success="returnDataFromQueryTableForm"
        >
            <template v-if="isShowContent" slot="home">
                <mds-card :title="'异物统计'" :name="'magnet'">
                    <template slot="titleBtn">
                        <div style="float: right;">
                            <el-button v-if="isAuth('kjImAdd')" type="primary" size="small" :disabled="!isRedact" @click="addNewForiegnMatterRow">
                                新增
                            </el-button>
                        </div>
                    </template>
                    <el-table class="newTable markStyle" :data="targetQueryTableListOfForiegnMatter" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; min-height: 80px;" tooltip-effect="dark">
                        <el-table-column label="序号" type="index" :index="index => getIndexMethod(index, targetQueryTableListOfForiegnMatter)" width="55" fixed="left" align="center" />
                        <el-table-column width="150" :show-overflow-tooltip="true" class="star">
                            <template slot="header">
                                <span class="notNull">设备名称</span>
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.deviceId" size="small" clearable style="width: 100%;" :disabled="!isRedact" @change="val=>setObjectProp(val,scope.row,'deviceName',deviceNameOptions)">
                                    <el-option
                                        v-for="item in deviceNameOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" width="130">
                            <template slot="header">
                                <span class="notNull">异物数量</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.impurityAmount" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </template>
                        </el-table-column>
                        <el-table-column width="150" :show-overflow-tooltip="true">
                            <template slot="header">
                                <span class="notNull">异物种类</span>
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.impurityType" size="small" clearable style="width: 100%;" :disabled="!isRedact" @change="val=>setObjectProp(val,scope.row,'impurityName',foriegnMatterImpurityTypeOptions)">
                                    <el-option
                                        v-for="item in foriegnMatterImpurityTypeOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" width="100">
                            <template slot="header">
                                <span>单位</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.unitName" size="small" placeholder="" :disabled="true" />
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" min-width="200">
                            <template slot="header">
                                <span>备注</span>
                            </template>
                            <template slot-scope="scope">
                                <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="changer" width="140" label="操作人" :show-overflow-tooltip="true" />
                        <el-table-column prop="changed" width="180" label="操作时间" :show-overflow-tooltip="true" />
                        <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="solerow">
                        <span>
                            异物数量汇总:
                        </span>
                        <span class="input_bottom">
                            {{ totalImpurityAmount }} 个
                        </span>
                    </div>
                </mds-card>
            </template>
            <template v-if="isShowContent" slot="home">
                <mds-card :title="'磁铁检查'" :name="'foriegnMatter'">
                    <template slot="titleBtn">
                        <div style="float: right;">
                            <el-button v-if="isAuth('kjImAdd')" type="primary" size="small" :disabled="!isRedact" @click="addNewMagnetRow">
                                新增
                            </el-button>
                        </div>
                    </template>
                    <el-table class="newTable markStyle" :data="targetQueryTableListOfMagnet" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border tooltip-effect="dark" style="width: 100%; min-height: 80px;">
                        <el-table-column label="序号" type="index" width="50" fixed="left" align="center" />
                        <el-table-column width="150" :show-overflow-tooltip="true">
                            <template slot="header">
                                <span class="notNull">磁铁编号</span>
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.magnetNo" size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                    <el-option
                                        v-for="item in magnetNoOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column width="150" :show-overflow-tooltip="true">
                            <template slot="header">
                                <span class="notNull">异物种类</span>
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.impurityType" size="small" clearable style="width: 100%;" :disabled="!isRedact" @change="val=>setImpurityInfo(val,scope.row,'impurityName',magnetImpurityTypeOptions)">
                                    <el-option
                                        v-for="item in magnetImpurityTypeOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" min-width="200">
                            <template slot="header">
                                <!-- <span :class="[scope.row.impurityInfo==='OTHER'?'notNull':'']">异物描述</span> -->
                                <span>异物描述</span>
                            </template>
                            <template slot-scope="scope">
                                <el-tooltip :disabled="!scope.row.impurityInfo" effect="dark" :content="scope.row.impurityInfo" placement="top">
                                    <el-input v-model.trim="scope.row.impurityInfo" :disabled="!(scope.row.impurityType==='OTHER'&&isRedact)" size="small" placeholder="请输入" />
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" min-width="200">
                            <template slot="header">
                                <span>处理措施</span>
                            </template>
                            <template slot-scope="scope">
                                <el-tooltip :disabled="!scope.row.measures" effect="dark" :content="scope.row.measures" placement="top">
                                    <el-input v-model.trim="scope.row.measures" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                            <template slot="header">
                                <span>备注</span>
                            </template>
                            <template slot-scope="scope">
                                <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true" />
                        <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true" />
                        <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </mds-card>
            </template>
        </query-table>
        <redact-box v-if="isShowContent" :disabled="redactBoxDisable" :is-redact.sync="isRedact" redact-auth="kjImEdit" save-auth="kjImSave" :is-show-submit-btn="false" :saved-rules="savedRules" :saved-datas="savedDatas" />
    </div>
</template>
<script lang="ts">

    import { Vue, Component } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import { COMMON_API, KOJI_API } from 'common/api/api';
    import RedactBox from 'components/RedactBox.vue' // 下方状态 bar
    import _ from 'lodash';

    @Component({
        name: 'DissolveBucketIndex',
        components: {
            RedactBox
        }
    })
    export default class DissolveBucketIndex extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        // common variate
        // queryTable data
        globalVal: GlobalVal
        targetQueryTableListOfMagnet: MagnetDataListObj[] = []
        orgTargetQueryTableListOfMagnet: MagnetDataListObj[] = []
        targetQueryTableListOfForiegnMatter: ForiegnMatterDataListObj[] = []
        orgTargetQueryTableListOfForiegnMatter: ForiegnMatterDataListObj[] = []


        isRedact=false // 可否编辑
        redactBoxDisable=true // control bar 可否禁用
        isShowContent=false // control bar 可否显示


        // queryTable header setting
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                rule: [{ required: true, message: ' ', trigger: 'change' }],
                labelWidth: 90,
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
                label: '检查日期',
                labelWidth: 90,
                prop: 'checkDate',
                valueFormat: 'yyyy-MM-dd',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd')
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            },
            {
                prop: 'checkDate',
                text: '请选择检查日期'
            }
        ]

        // 下拉选单 Options
        deviceNameOptions: Options[]=[]
        foriegnMatterImpurityTypeOptions: Options[]=[]
        magnetNoOptions: Options[]=[]
        magnetImpurityTypeOptions: Options[]=[]

        // 下拉选单 Options
        ruleForiegnMatterForm={}
        ruleMagnetForm={}

        get totalImpurityAmount() {
            let amountTemp = 0;
            if (this.targetQueryTableListOfForiegnMatter.length !== 0) {
                this.targetQueryTableListOfForiegnMatter.forEach(item => {
                    if (item.delFlag === 0 && typeof item.impurityAmount === 'number') {
                        amountTemp = amountTemp + item.impurityAmount
                    }
                })
            }
            return amountTemp
        }

        setImpurityInfo(val, target, prop, who) {
            this.setObjectProp(val, target, prop, who)
            target.impurityInfo = ''
        }

        // 表格内下拉选项
        optionInit(workShop) {
            // 获取设备
            COMMON_API.DEVICE_LISTBYTYPE_API({
                deptId: workShop,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
                }).then(({ data }) => {
                    this.deviceNameOptions = []
                    if (data.data) {
                        data.data.forEach(item => {
                        this.deviceNameOptions.push({ optLabel: item.deviceName, optValue: item.id })
                        })
                    }
                });
            // 异物种类
            this.dictQuery('OTHER_FNG_MATTER', 'foriegnMatterImpurityTypeOptions')
            // 磁铁编号
            this.dictQuery('MAGNET_NO', 'magnetNoOptions')
            // 磁铁检查异物种类
            this.dictQuery('MAGNET_FGN_MATTER', 'magnetImpurityTypeOptions')
        }


        // 字典 API 取质
        dictQuery(dictString, target) {
            COMMON_API.DICTQUERY_API({ dictType: dictString }).then(({ data }) => {
                this[target] = []
                if (data.data) {
                    data.data.forEach(item => {
                        this[target].push({ optLabel: item.dictValue, optValue: item.dictCode })
                    })
                }
            });
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
            });
        }

        //  rowDelFlag (item display:none)
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        setObjectProp(val, target, prop, who) {
            target[prop] = who.filter(item => item.optValue === val)[0].optLabel
        }

        // queryTable 查询请求
        queryTableListInterface(params) {
            this.globalVal = params

            // ：若今天以后时间，终止查询并提示
            if (new Date(params.checkDate).getTime() >= new Date().getTime()) {
                this.$infoToast(`请选择 ${dateFormat(new Date(), 'yyyy-MM-dd')} 以前日期`);
                return
            }

            // 表拉下拉选单赋值
            this.optionInit(params.workShop)

            return KOJI_API.KOJI_IMPURITY_MAGNET_API(params)
        }

        // [v]queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            this.targetQueryTableListOfMagnet = []
            if (data.data.length !== 0) {
                this.targetQueryTableListOfMagnet = data.data
                this.targetQueryTableListOfMagnet.forEach(item => {
                        item.delFlag = 0
                    })
                this.orgTargetQueryTableListOfMagnet = JSON.parse(JSON.stringify(this.targetQueryTableListOfMagnet))

            } else {
                this.$infoToast('磁铁检查暂无任何内容');
            }

            KOJI_API.KOJI_IMPURITY_FOREIGNMATTER_API(this.globalVal).then(({ data: target }) => {
                this.targetQueryTableListOfForiegnMatter = []
                if (target.data.length !== 0) {
                    this.targetQueryTableListOfForiegnMatter = target.data
                    this.targetQueryTableListOfForiegnMatter.forEach(item => {
                        item.delFlag = 0
                    })
                    this.orgTargetQueryTableListOfForiegnMatter = JSON.parse(JSON.stringify(this.targetQueryTableListOfForiegnMatter))
                } else {
                    this.$infoToast('异物统计暂无任何内容');

                }
            })

            this.isRedact = false
            this.isShowContent = true
            this.redactBoxDisable = false

        }

        // [新增]异物
        addNewForiegnMatterRow() {
            const sole: ForiegnMatterDataListObj = {
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                checkDate: this.globalVal.checkDate,
                deviceId: '',
                deviceName: '',
                id: '',
                impurityAmount: null,
                impurityName: '',
                impurityType: '',
                remark: '',
                unit: 'EA',
                unitName: '个',
                workShop: this.globalVal.workShop,
                delFlag: 0
            }
            this.targetQueryTableListOfForiegnMatter.push(sole);
        }

        // [新增]磁铁
        addNewMagnetRow() {
            const sole: MagnetDataListObj = {
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                checkDate: this.globalVal.checkDate,
                id: '',
                impurityInfo: '',
                impurityName: '',
                impurityType: '',
                magnetNo: '',
                measures: '',
                remark: '',
                workShop: this.globalVal.workShop,
                delFlag: 0
            }
            this.targetQueryTableListOfMagnet.push(sole);
        }

    getSavedMagnetData() {
        const deleteDto: string[] = [];
        const insertDto: MagnetDataListObj[] = [];
        const updateDto: MagnetDataListObj[] = [];
        const tempCurrentFormDataGroup = JSON.parse(JSON.stringify(this.targetQueryTableListOfMagnet))

        tempCurrentFormDataGroup.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    deleteDto.push(item.id)
                }
            } else if (item.id) {
                if (!_.isEqual(this.orgTargetQueryTableListOfMagnet[index], item)) {
                    updateDto.push(item)
                }
            } else {
                insertDto.push(item)
            }
        })

        return {
            deleteDto,
            insertDto,
            updateDto
        }
    }

    getSavedForiegnMatterData() {
        const deleteDto: string[] = [];
        const insertDto: ForiegnMatterDataListObj[] = [];
        const updateDto: ForiegnMatterDataListObj[] = [];
        const tempCurrentFormDataGroup = JSON.parse(JSON.stringify(this.targetQueryTableListOfForiegnMatter))

        tempCurrentFormDataGroup.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    deleteDto.push(item.id)
                }
            } else if (item.id) {
                if (!_.isEqual(this.orgTargetQueryTableListOfForiegnMatter[index], item)) {
                    updateDto.push(item)
                }
            } else {
                insertDto.push(item)
            }
        })

        return {
            deleteDto,
            insertDto,
            updateDto
        }
    }

        ruleMagnetSubmit() {
            for (const item of this.targetQueryTableListOfMagnet.filter(it => it.delFlag !== 1)) {
                if (!item.magnetNo || !item.impurityType) {
                    this.$warningToast('请填写磁铁检查必填栏位');
                    return false;
                }

                if (item.impurityType === 'OTHER' && !item.impurityInfo) {
                    this.$warningToast('请填写磁铁检查必填栏位');
                    return false;
                }

            }
            return true;
        }

        ruleForiegnMatterSubmit() {
            for (const item of this.targetQueryTableListOfForiegnMatter.filter(it => it.delFlag !== 1)) {
                if (!item.deviceId || !item.impurityAmount || !item.impurityType) {
                    this.$warningToast('请填写异物统计必填栏位');
                    return false;
                }
            }
            return true;
        }

        // {redact-box} 提交需跑的验证 function
        savedRules(): Function[] {
            return [this.ruleMagnetSubmit, this.ruleForiegnMatterSubmit]
        }

        // {redact-box} 保存
        savedDatas() {
            const magnetDataTemp: Magnet = this.getSavedMagnetData()
            const foriegnMatterDataTemp: ForiegnMatter = this.getSavedForiegnMatterData()
            return KOJI_API.KOJI_IMPURITY_SAVE_API({
                magnet: {
                    deleteDto: magnetDataTemp.deleteDto,
                    insertDto: magnetDataTemp.insertDto,
                    updateDto: magnetDataTemp.updateDto
                    // orderNo
                },
                other: {
                    deleteDto: foriegnMatterDataTemp.deleteDto,
                    insertDto: foriegnMatterDataTemp.insertDto,
                    updateDto: foriegnMatterDataTemp.updateDto
                    // orderNo
                }
            })
        }
    }

interface GlobalVal {
    checkDate: string;
    workShop: string;
}

interface MagnetDataListObj {
    changed: string;
    changer: string;
    checkDate: string;
    id: string;
    impurityInfo: string;
    impurityName: string;
    impurityType: string;
    magnetNo: string;
    measures: string;
    remark: string;
    workShop: string;
    delFlag: number;
}

interface Magnet {
    deleteDto?: string[];
    insertDto?: MagnetDataListObj[];
    updateDto?: MagnetDataListObj[];
}

interface ForiegnMatter {
    deleteDto?: string[];
    insertDto?: object[];
    updateDto?: object[];
}

interface ForiegnMatterDataListObj{
    changed: string;
    changer: string;
    checkDate: string;
    deviceId: string;
    deviceName: string;
    id: string;
    impurityAmount: number |null;
    impurityName: string;
    impurityType: string;
    remark: string;
    unit: string;
    unitName: string;
    workShop: string;
    delFlag: number;
}

interface Options {
    optValue?: string;
    optLabel?: string;
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

<style lang="scss" scoped>

.el-form-item {
    margin-bottom: 0;
}

.orderMangedialog {
    .el-form-item {
        margin-bottom: 10px;
    }
}


.solerow {
    display: flex;
    width: 220px;
    margin-top: 5px;
    font-weight: 500;
    font-size: 12px;
    line-height: 33px;
    span:first-child {
        flex: 2;
    }
    .input_bottom {
        flex: 1;
        padding: 0 14px;
        color: #bbb;
        text-align: left;
        background-color: #f5f5f5;
        border: none;
        border-radius: 4px;
    }
}
</style>
