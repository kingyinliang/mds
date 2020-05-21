<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="fiex">
                <el-col>
                    <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi_row">
                        <el-form-item label="生产车间：">
                            <el-input v-model="formHeader.workShop" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产产线：">
                            <el-input v-model="formHeader.productLine" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <el-input v-model="formHeader.productMaterial" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <el-input v-model="formHeader.orderNo" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="订单产量：">
                            <el-input v-model="formHeader.planOutput" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="订单日期：">
                            <el-input v-model="formHeader.orderStartDate" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-input v-model="formHeader.productDate" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <el-input v-model="formHeader.submitPeople" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <el-input v-model="formHeader.changed" size="small" class="header_main__input" disabled />
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs v-model="activeName" type="border-card" class="NewDaatTtabs tabsPages">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    <el-button>密封度检测</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>密封度：Kpa</span>
                    <div style="float: right;">
                        <el-button :disabled="!isRedact" type="primary" size="small" @click="sealAddRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="sealList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column width="200">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.checkDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" placeholder="请选择时间" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第一排" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.pressOne" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第二排" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.pressTwo" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第三排" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.pressThree" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第四排" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.pressFour" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!isRedact" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="记录人" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.changer" disabled size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="sealDelRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    <el-button>称重记录</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>称重记录：g</span>
                    <div style="float: right;">
                        <el-button :disabled="!isRedact" type="primary" size="small" @click="weightAddRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table2" class="newTable" header-row-class-name="tableHead" :data="weightList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column width="200">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.recordDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" placeholder="请选择时间" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第一排净含量" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.netWeightOne" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第一排调称" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.adjustmentOne" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第二排净含量" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.netWeightTwo" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第二排调称" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.adjustmentTwo" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第三排净含量" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.netWeightThree" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第三排调称" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.adjustmentThree" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第四排净含量" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.netWeightFour" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第四排调称" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.adjustmentFour" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="酱盒重量下限" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.boxWeightFloor" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="酱盒重量上限" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.boxWeightCeiling" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="厂家" width="180" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.manufactor" :disabled="!isRedact" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" width="180" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!isRedact" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="记录人" width="180" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.changer" disabled size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="weightDelRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label" class="spanview">
                    <el-button>NR检测</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>NR检测</span>
                    <div style="float: right;">
                        <el-button :disabled="!isRedact" type="primary" size="small" @click="NRAddRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table3" class="newTable borderTable" header-row-class-name="tableHead" :data="NRList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.checkDate" :disabled="!isRedact" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="NR含量（%）">
                        <el-table-column label="第一排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrContentOne" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第二排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrContentTwo" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第三排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrContentThree" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第四排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrContentFour" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="NR流量（L/min）">
                        <el-table-column label="第一排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrFlowOne" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第二排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrFlowTwo" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第三排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrFlowThree" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第四排" width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.nrFlowFour" :disabled="!isRedact" maxlength="12" size="mini" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="罐内温度（°C）" width="140" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.potTemplate" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="NR温度（°C）" width="140" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.nrTemplate" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="NR纯度（%）" width="140" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.nrFineness" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="二级储压（Mpa）" width="140">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.pressure" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="混合比重（%）" width="140" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.proportion" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" width="180" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!isRedact" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="记录人" width="180" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.changer" disabled size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="NRDelRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="4">
                <span slot="label" class="spanview">
                    <el-button>扭力检测</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>扭力检测</span>
                    <div style="float: right;">
                        <el-button :disabled="!isRedact" type="primary" size="small" @click="torqueAddRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table4" class="newTable" header-row-class-name="tableHead" :data="torqueList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column width="200">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.checkDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" placeholder="请选择时间" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="扭力矩/N.m" width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.torque" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="真空度/Mpa" width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.vacuum" :disabled="!isRedact" maxlength="12" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!isRedact" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="检查人" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.checkMan" disabled size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="torqueDelRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_tips">
                        <i class="el-icon-info" />
                        <span v-if="isRedact">请及时保存数据</span>
                        <span v-else>点击编辑按钮，对当前页面进行编辑</span>
                    </div>
                    <div class="redact_btn">
                        <el-button v-if="isRedact" type="primary" size="small" @click="cancel">
                            取消
                        </el-button>
                        <el-button type="primary" size="small" @click="save">
                            {{ isRedact ? '保存' : '编辑' }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { PKG_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    export default {
        data() {
            return {
                formHeader: {
                    workShop: this.$store.state.packaging.packCheckData.workShop,
                    productLine: this.$store.state.packaging.packCheckData.productLine,
                    productMaterial: this.$store.state.packaging.packCheckData.materialName,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo,
                    planOutput: this.$store.state.packaging.packCheckData.planOutput + this.$store.state.packaging.packCheckData.outputUnit,
                    orderStartDate: this.$store.state.packaging.packCheckData.orderStartDate,
                    productDate: this.$store.state.packaging.packCheckData.productDate,
                    submitPeople: '',
                    changed: this.$store.state.packaging.packCheckData.changed
                },
                activeName: '1',
                isRedact: false,
                sealList: [],
                sealDelList: [],
                newSealList: {
                    id: '',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo,
                    orderId: '1234567',
                    checkDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                    pressOne: '',
                    pressTwo: '',
                    pressThree: '',
                    pressFour: '',
                    reamrk: '',
                    changer: getUserNameNumber()
                },
                weightList: [],
                weightDelList: [],
                newWeightList: {
                    id: '',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo,
                    orderId: '1234567',
                    recordDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                    netWeightOne: '',
                    adjustmentOne: '',
                    netWeightTwo: '',
                    adjustmentTwo: '',
                    netWeightThree: '',
                    adjustmentThree: '',
                    netWeightFour: '',
                    adjustmentFour: '',
                    boxWeightFloor: '',
                    boxWeightCeiling: '',
                    manufactor: '',
                    remark: '',
                    changer: getUserNameNumber()
                },
                NRList: [],
                NRDelList: [],
                newNRList: {
                    id: '',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo,
                    orderId: '1234567',
                    checkDate: '',
                    nrContentOne: '',
                    nrContentTwo: '',
                    nrContentThree: '',
                    nrContentFour: '',
                    nrFlowOne: '',
                    nrFlowTwo: '',
                    nrFlowThree: '',
                    nrFlowFour: '',
                    potTemplate: '',
                    nrTemplate: '',
                    nrFineness: '',
                    pressure: '',
                    proportion: '',
                    remark: '',
                    changer: getUserNameNumber()
                },
                torqueList: [],
                torqueDelList: [],
                newTorqueList: {
                    id: '',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo,
                    orderId: '1234567',
                    checkDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                    torque: '',
                    vacuum: '',
                    remark: '',
                    checkMan: getUserNameNumber()
                },
                originData: {
                    originSealData: [],
                    originWeightData: [],
                    originNRData: [],
                    originTourqeData: []
                }
            };
        },
        computed: {
                sidebarFold: {
                    get() {
                        return this.$store.state.common.sidebarFold;
                    }
                }
            },
        mounted() {
            this.getAllData()
        },
        methods: {
            getAllData() {
                this.getSealList();
                this.getWeightList();
                this.getNRList();
                this.getTourqeList();
            },
            getSealList() {
                PKG_API.PKG_CHECKDATA_SEAL_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo
                }).then(({ data }) => {
                    this.sealList = data.data
                    this.originData.originSealData = JSON.parse(JSON.stringify(this.sealList))
                })
            },
            getWeightList() {
                PKG_API.PKG_CHECKDATA_WEIGHT_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo
                }).then(({ data }) => {
                    this.weightList = data.data
                    this.originData.originWeightData = JSON.parse(JSON.stringify(this.weightList))
                })
            },
            getNRList() {
                 PKG_API.PKG_CHECKDATA_NR_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo
                }).then(({ data }) => {
                    this.NRList = data.data
                    this.originData.originNRData = JSON.parse(JSON.stringify(this.NRList))
                })
            },
            getTourqeList() {
                 PKG_API.PKG_CHECKDATA_TORQUE_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.$store.state.packaging.packCheckData.orderNo
                }).then(({ data }) => {
                    this.torqueList = data.data
                    this.originData.originTourqeData = JSON.parse(JSON.stringify(this.torqueList))
                })
            },
            //密封度新增
            sealAddRow() {
                 if (this.sealList.length) {
                    const last = JSON.parse(JSON.stringify(this.sealList[this.sealList.length - 1]));
                    last.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    last.id = '';
                    this.sealList.push(last);
                } else {
                    this.sealList.push(this.newSealList);
                }
            },
            //密封度删除
            sealDelRow(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row.id.length) {
                        this.sealDelList.push(row.id);
                    }
                    this.sealList.splice(this.sealList.indexOf(row), 1);
                });
            },
            //称重新增
            weightAddRow() {
                if (this.weightList.length) {
                    const last = JSON.parse(JSON.stringify(this.weightList[this.weightList.length - 1]));
                    last.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    last.id = '';
                    this.newWeightList.boxWeightFloor = last.boxWeightFloor;
                    this.newWeightList.boxWeightCeiling = last.boxWeightCeiling;
                    this.newWeightList.manufactor = last.manufactor;
                    this.weightList.push(this.newWeightList);
                } else {
                    this.weightList.push(this.newWeightList);
                }
            },
            //称重删除
            weightDelRow(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row.id.length) {
                        this.weightDelList.push(row.id);
                    }
                    this.weightList.splice(this.weightList.indexOf(row), 1);
                });
            },
            //NR新增
            NRAddRow() {
                if (this.NRList.length) {
                    const last = JSON.parse(JSON.stringify(this.NRList[this.NRList.length - 1]));
                    last.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    last.id = '';
                    this.newNRList.nrFlowOne = last.nrFlowOne;
                    this.newNRList.nrFlowTwo = last.nrFlowTwo;
                    this.newNRList.nrFlowThree = last.nrFlowThree;
                    this.newNRList.nrFlowFour = last.nrFlowFour;
                    this.NRList.push(this.newNRList);
                } else {
                    this.NRList.push(this.newNRList);
                }
            },
            //NR删除
            NRDelRow(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row.id.length) {
                        this.NRDelList.push(row.id);
                    }
                    this.NRList.splice(this.NRList.indexOf(row), 1);
                });
            },
            //扭力新增
            torqueAddRow() {
                this.torqueList.push(this.newTorqueList);
            },
            //扭力删除
            torqueDelRow(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row.id.length) {
                        this.torqueDelList.push(row.id);
                    }
                    this.torqueList.splice(this.torqueList.indexOf(row), 1);
                });
            },
            //取消
            cancel() {
                this.isRedact = false;
                this.sealList = JSON.parse(JSON.stringify(this.originData.sealData));
                this.weightList = JSON.parse(JSON.stringify(this.originData.weightData));
                this.NRList = JSON.parse(JSON.stringify(this.originData.NRData));
                this.torqueList = JSON.parse(JSON.stringify(this.originData.tourqeData));
            },
            //保存
            save() {
                if (!this.isRedact) {
                    this.isRedact = !this.isRedact;
                } else {
                    const pkgSeal = {
                        sealDels: JSON.parse(JSON.stringify(this.sealDelList)),
                        sealInserts: [],
                        sealUpdates: []
                    }
                    this.sealList.forEach(item => {
                        if (item.id.length) {
                            this.originData.originSealData.forEach(newItem => {
                                if (newItem.id === item.id) {
                                    if (!this.cmp(item, newItem)) {
                                        pkgSeal.sealUpdates.push(item);
                                    }
                                }
                            })
                        } else {
                            pkgSeal.sealInserts.push(item);
                        }
                    })
                    const pkgWeight = {
                        pkgWeightDelete: JSON.parse(JSON.stringify(this.weightDelList)),
                        pkgWeightInsert: [],
                        pkgWeightUpdate: []
                    }
                    this.weightList.forEach(item => {
                        if (item.id.length) {
                            this.originData.originWeightData.forEach(newItem => {
                                if (newItem.id === item.id) {
                                    if (!this.cmp(item, newItem)) {
                                        pkgWeight.pkgWeightUpdate.push(item);
                                    }
                                }
                            })
                        } else {
                            pkgWeight.pkgWeightInsert.push(item);
                        }
                    })
                    const pkgNr = {
                        pkgNrDelete: JSON.parse(JSON.stringify(this.NRDelList)),
                        pkgNrInsert: [],
                        pkgNrUpdate: []
                    }
                    this.NRList.forEach(item => {
                        if (item.id.length) {
                            this.originData.originNRData.forEach(newItem => {
                                if (newItem.id === item.id) {
                                    if (!this.cmp(item, newItem)) {
                                        pkgNr.pkgNrUpdate.push(item);
                                    }
                                }
                            })
                        } else {
                            pkgNr.pkgNrInsert.push(item);
                        }
                    })
                    const pkgTorque = {
                        pkgTorqueDelete: JSON.parse(JSON.stringify(this.torqueDelList)),
                        pkgTorqueInsert: [],
                        pkgTorqueUpdate: []
                    }
                    this.torqueList.forEach(item => {
                        if (item.id.length) {
                            this.originData.originTourqeData.forEach(newItem => {
                                if (newItem.id === item.id) {
                                    if (!this.cmp(item, newItem)) {
                                        pkgTorque.pkgTorqueUpdate.push(item);
                                    }
                                }
                            })
                        } else {
                            pkgTorque.pkgTorqueInsert.push(item);
                        }
                    })
                    PKG_API.PKG_CHECKDATA_SAVE_API({
                        pkgSealData: pkgSeal,
                        pkgWeightData: pkgWeight,
                        pkgNrData: pkgNr,
                        pkgTorqueData: pkgTorque
                    }).then(({ data }) => {
                        this.$successToast(data.msg);
                        this.isRedact = !this.isRedact;
                        this.sealDelList = [];
                        this.weightDelList = [];
                        this.NRDelList = [];
                        this.torqueDelList = [];
                        this.getAllData();
                    })
                }
            },
            cmp(x, y) {
                // remember that NaN === NaN returns false
                // and isNaN(undefined) returns true
                if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                    return true;
                }
                // If both x and y are null or undefined and exactly the same
                if (x === y) {
                    return x !== 0 || 1 / x === 1 / y;
                }

                if (x === null || y === null) return x === y;

                // Works in case when functions are created in constructor.
                // Comparing dates is a common scenario. Another built-ins?
                // We can even handle functions ㄋpassed across iframes
                if ((typeof x === 'function' && typeof y === 'function') || (x instanceof Date && y instanceof Date) || (x instanceof RegExp && y instanceof RegExp) || (x instanceof String && y instanceof String) || (x instanceof Number && y instanceof Number)) {
                    return x.toString() === y.toString();
                }

                // If they are not strictly equal, they both need to be Objects
                if (!(x instanceof Object) || !(y instanceof Object)) {
                    return false;
                }

                if (Object.prototype.isPrototypeOf.call(x, y) || Object.prototype.isPrototypeOf.call(y, x)) {
                    return false;
                }

                //They must have the exact same prototype chain,the closest we can do is
                //test the constructor.
                if (x.constructor !== y.constructor) {
                    return false;
                }

                if (x.prototype !== y.prototype) {
                    return false;
                }
                for (const p in x) {
                    //Inherited properties were tested using x.constructor === y.constructor
                    if (Object.prototype.hasOwnProperty.call(x, p)) {
                        // Allows comparing x[ p ] and y[ p ] when set to undefined
                        if (!Object.prototype.hasOwnProperty.call(y, p)) {
                            return false;
                        }
                        // If they have the same strict value or identity then they are equal
                        if (x[p] === y[p]) {
                            continue;
                        }
                        // Numbers, Strings, Functions, Booleans must be strictly equal
                        if (typeof x[p] !== 'object') {
                            return false;
                        }
                        // Objects and Arrays must be tested recursively
                        // if (!Object.is(x[ p ], y[ p ])) {
                        //     return false;
                        // }
                    }
                }
                for (const q in y) {
                    // allows x[ p ] to be set to undefined
                    if (Object.prototype.hasOwnProperty.call(y, q) && !Object.prototype.hasOwnProperty.call(x, q)) {
                        return false;
                    }
                }
                return true;
            }
        }
    };
</script>

<style scoed lang="scss">
.header_main__input .el-input__inner {
    width: 170px;
    color: #666 !important;
    background-color: #f5f5f5;
    border: none;
}
.tab__heads {
    margin-bottom: 10px;
    line-height: 32px;
}
.title-icon {
    float: left;
    width: 4px;
    height: 12px;
    margin-top: 10px;
    margin-right: 5px;
    background: #487bff;
    border-radius: 2px;
}

</style>
