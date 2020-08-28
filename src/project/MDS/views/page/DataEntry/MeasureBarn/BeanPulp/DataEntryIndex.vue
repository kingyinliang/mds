<template>
    <div class="header_main">
        <el-row class="dataEntry-head-leftRight" :gutter="10">
            <el-col :span="4">
                <div class="card-left" style="background: #ffbf00;">
                    <p class="dataEntry-head-leftRight__title">
                        计量仓号：{{ formData.holderName ? formData.holderName : '' }}
                    </p>
                    <div class="dataEntry-head-leftRight-pot">
                        <div class="dataEntry-head-leftRight-pot__tank">
                            <div class="dataEntry-head-leftRight-pot__tank__bg" />
                        </div>
                        <img src="@/assets/img/ui2.0/pot.png" alt="">
                    </div>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="card-right" style="background: #487bff;">
                    <p class="dataEntry-head-leftRight__title">
                        <em class="iconfont factory-gongchang" />{{ formData.factoryName ? formData.factoryName : '' }}
                    </p>
                    <div class="dataEntry-head-leftRight-message">
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>{{ formData.area ? formData.area : '' }}</p>
                            <p><em class="iconfont factory-quyu" />物理区域</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.holderName ? formData.holderName : '' }}
                            </p>
                            <p> <em class="iconfont factory-bianhao" />容器号 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.capacity ? formData.capacity.toLocaleString() : '' }}
                                KG
                            </p>
                            <p> <em class="iconfont factory-cunchurongliang" />仓体容量 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <el-tooltip class="item" effect="dark" :content="(formData.materialNo ? formData.materialNo : '') + ' ' + (formData.materialName ? formData.materialName : '')" placement="top">
                                <p>
                                    {{ (formData.materialNo ? formData.materialNo : '') + ' ' + (formData.materialName ? formData.materialName : '') }}
                                </p>
                            </el-tooltip>
                            <p> <em class="iconfont factory-bianma" />物料编码 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>{{ total }} KG</p>
                            <p> <em class="iconfont factory-shujurongliang" />当前总量 </p>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    当前库存信息
                </span>
                <el-table header-row-class-name="" :data="dataList" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" align="center" fixed />
                    <el-table-column label="物料" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入罐数量(KG)" :show-overflow-tooltip="true" width="160" align="right">
                        <template slot-scope="scope">
                            {{ scope.row.inAmount !== null ? scope.row.inAmount.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="当前数量(KG)" width="160" align="right">
                        <template slot-scope="scope">
                            {{ scope.row.amount !== null ? scope.row.amount.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showMoreDetail(scope.row.batch)">
                                <em class="iconfont factory-fangdajing-copy" style=" margin-right: 5px; font-size: 12px;" />查看
                            </el-button>
                            <el-button v-if="isAuth('Gra:adjust:material:soybeanUpdate')" type="text" size="small" @click="makeAdjust(scope.row)">
                                <em class="iconfont factory-banshou" style=" margin-right: 5px; font-size: 12px;" />调整
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    调整信息记录
                </span>
                <el-table header-row-class-name="" :data="adjustList" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="调整类型" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.adjustType === '0' ? '盘盈' : '盘亏' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="数量(KG)" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.quantity ? scope.row.quantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="说明" width="170">
                        <template slot-scope="scope">
                            {{ scope.row.remark }}
                        </template>
                    </el-table-column>
                    <el-table-column label="调整时间">
                        <template slot-scope="scope">
                            {{ scope.row.adjustTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="调整人">
                        <template slot-scope="scope">
                            {{ scope.row.adjuster }}
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="adjustList.length !== 0">
                    <el-pagination
                        v-if="adjustList.length !== 0"
                        :current-page="adjustCurrPage"
                        :page-sizes="[10, 20, 50]"
                        :page-size="adjustPageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="adjustTotalCount"
                        @size-change="handleAdjustSizeChange"
                        @current-change="handleAdjustCurrentChange"
                    />
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :close-on-click-modal="false" :visible.sync="isShowMessageBoxAdjust" width="900px" custom-class="dialog__class bg_dialog">
            <div slot="title" class="title">
                <span>查询明细</span>
            </div>
            <el-tabs v-model="activeDialogFormName" type="border-card" class="tabsPages">
                <el-tab-pane label="入罐信息" name="inStorage">
                    <el-table header-row-class-name="" :data="applyInStorageList" border tooltip-effect="dark" class="newTable">
                        <el-table-column type="index" label="序号" width="55" align="center" fixed />
                        <el-table-column label="物料" :show-overflow-tooltip="true" width="160">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
                            <template slot-scope="scope">
                                {{ scope.row.batch }}
                            </template>
                        </el-table-column>
                        <el-table-column label="入罐量(KG)" :show-overflow-tooltip="true" width="100" align="right" header-align="center">
                            <template slot-scope="scope">
                                {{ scope.row.useWeight ? scope.row.useWeight.toLocaleString() : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="粮仓号" :show-overflow-tooltip="true" width="130">
                            <template slot-scope="scope">
                                {{ scope.row.foodHolderNo }}
                            </template>
                        </el-table-column>
                        <el-table-column label="入罐时间" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.created }}
                            </template>
                        </el-table-column>
                        <el-table-column label="入罐人" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.creator }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row v-if="applyInStorageList.length !== 0">
                        <el-pagination :current-page="currPageInStorageList" layout="total, prev, pager, next, jumper" :total="totalCountInStorageList" @current-change="handleInStorageListCurrentChange" />
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="领用信息" name="receive">
                    <el-table header-row-class-name="" :data="applyReceiveList" border tooltip-effect="dark" class="newTable">
                        <el-table-column type="index" label="序号" width="55" align="center" fixed />
                        <el-table-column label="物料" :show-overflow-tooltip="true" width="160">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="批次" :show-overflow-tooltip="true" width="140">
                            <template slot-scope="scope">
                                {{ scope.row.batch }}
                            </template>
                        </el-table-column>
                        <el-table-column label="领用量(KG)" :show-overflow-tooltip="true" width="100" align="right">
                            <template slot-scope="scope">
                                {{ scope.row.useWeight ? scope.row.useWeight.toLocaleString() : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="领用订单" :show-overflow-tooltip="true" width="130">
                            <template slot-scope="scope">
                                {{ scope.row.orderNo }}
                            </template>
                        </el-table-column>
                        <el-table-column label="领用时间" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.created }}
                            </template>
                        </el-table-column>
                        <el-table-column label="领用人" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.creator }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row v-if="applyReceiveList.length !== 0">
                        <el-pagination :current-page="currPageReceiveList" :page-sizes="[10, 20, 50]" :page-size="pageSizeReceiveList" layout="total, prev, pager, next, jumper" :total="totalCountReceiveList" @size-change="handleReceiveListSizeChange" @current-change="handleReceiveListCurrentChange" />
                    </el-row>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="isShowMessageBoxAdjust = false">
                    取消
                </el-button>
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="isShowMessageBoxAdjust = false">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="isShowMessageBoxCheck" width="400px" custom-class="dialog__class">
            <div slot="title" class="title">
                <span>盘点调整</span>
            </div>
            <div>
                <el-form ref="adjustForm" :model="adjustForm" label-width="100px" size="small">
                    <el-form-item label="物料：">
                        <p class="disabled-text" style="width: 220px;">
                            {{ adjustForm.materialCode + ' ' + adjustForm.materialName }}
                        </p>
                    </el-form-item>
                    <el-form-item label="批次：">
                        <p class="disabled-text" style="width: 220px;">
                            {{ adjustForm.batch }}
                        </p>
                    </el-form-item>
                    <el-form-item label="调整类型：" required>
                        <el-select v-model="adjustForm.adjustType" placeholder="请选择" style="width: 220px;">
                            <el-option label="盘亏" value="1" />
                            <el-option label="盘盈" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="调整量："
                        prop="quantity"
                        :rules="[
                            {
                                required: true,
                                validator: validatePassAdjustNum,
                                message: '请填写调整量 ',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input v-model.number="adjustForm.quantity" type="number" style="width: 220px;">
                            <em slot="suffix">KG</em>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="说明："
                        prop="remark"
                        :rules="[
                            {
                                required: true,
                                message: '请填写调整说明',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input v-model.trim="adjustForm.remark" type="text" style="width: 220px;" />
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="cannalSaveAdjust('adjustForm')">
                    取消
                </el-button>
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="saveAdjust('adjustForm')">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { MEASUREBARN_BEAN_API } from '@/api/api';
import { deepCopy } from '@/assets/js/util.js';
import MSG from '@/assets/js/hint-msg';
@Component({
    components: {},
    name: 'MeasureBarnBeanPulpDataEntryIndex'
})
export default class Index extends Vue {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    factoryId = '';
    deptId = '';
    holderId = '';
    activeName = '1';
    // 批次数据
    dataList: any = [];
    totalDataList = [];
    dataCurrPage = 1;
    dataPageSize = 10;
    dataTotalCount = 0;
    // 调整数据
    adjustList: any = [];
    totalAdjustList = [];
    adjustCurrPage = 1;
    adjustPageSize = 10;
    adjustTotalCount = 0;
    // 入罐数据
    applyInStorageList: any = [];
    totalInStorageList = [];
    currPageInStorageList = 1;
    pageSizeInStorageList = 10;
    totalCountInStorageList = 0;
    // 领用数据
    applyReceiveList: any = [];
    totalReceiveList = [];
    currPageReceiveList = 1;
    pageSizeReceiveList = 10;
    totalCountReceiveList = 0;
    isShowMessageBoxAdjust = false;
    isShowMessageBoxCheck = false;
    formData = {
        area: '',
        capacity: '',
        factory: '',
        factoryName: '',
        holderNo: '',
        holderName: '',
        materialName: '',
        materialNo: '',
        totalWeight: 0
    };

    adjustForm = {
        materialCode: '',
        materialName: '',
        batch: '',
        // MATERIAL_TYPE_NAME: '',
        // LOCATION: '',
        // MOVE_TYPE: '',
        // MATERIAL_TYPE_CODE: '',
        // POSTING_DATE: '',
        // CURRENT_QUANTITY: 0,
        factory: '',
        holderId: '',
        adjustType: '0',
        quantity: 0,
        // UNIT: 'KG',
        deptId: '',
        remark: ''
    };

    activeDialogFormName = 'inStorage';
    mounted() {
        const orgData = this.$store.state.common.MeasureBarnBeanPulp;
        this.factoryId = this.$store.state.common.MeasureBarnBeanPulp.factory;
        this.holderId = this.$store.state.common.MeasureBarnBeanPulp.holderId;
        this.deptId = this.$store.state.common.MeasureBarnBeanPulp.deptId;
        // 获取基本讯息
        // this.retrieveDetail()
        this.formData.factoryName = orgData.factoryName; // 生产工厂名
        this.formData.area = orgData.holderArea; // 物理区域
        this.formData.holderName = orgData.holderName; // 容器号/名称
        this.formData.capacity = orgData.holderHold; // 罐体容量
        this.formData.materialName = typeof orgData.pulpList[0] !== 'undefined' ? orgData.pulpList[0].materialName : '';
        this.formData.materialNo = typeof orgData.pulpList[0] !== 'undefined' ? orgData.pulpList[0].materialCode : '';
        this.formData.factory = orgData.factory; // 生产工厂 ID
        this.formData.holderNo = orgData.holderNo;
        this.formData.totalWeight = orgData.pulpList.length !== 0 ? orgData.pulpList.map(item => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue) : 0;

        // 当前库存量
        this.retrieveDataList();
        // this.dataList = []
        // orgData.pulpList.map((item) => {
        //   this.dataList.push({
        //     'materialCode': item.materialCode,
        //     'materialName': item.materialName,
        //     'batch': item.batch, // 批次
        //     'inAmount': item.inAmount, // 入罐数量
        //     'amount': item.amount // 当前数量
        //   })
        // })
        // 调整信息记录
        this.retrieveAdjustList();
    }

    validatePassAdjustNum = (rule, value, callback) => {
        if (value === 0) {
            return callback(new Error('请填写调整量'));
        }
            return callback();

    };

    showMoreDetail(batch) {
        this.retrieveLogList(batch);
        this.isShowMessageBoxAdjust = true;
    }

    makeAdjust(row) {
        this.adjustForm = {
            materialCode: row.materialCode,
            materialName: row.materialName,
            batch: row.batch,
            // MATERIAL_TYPE_NAME: row.materialTypeName,
            // LOCATION: row.location,
            // MOVE_TYPE: row.moveType,
            // MATERIAL_TYPE_CODE: row.materialTypeCode,
            // POSTING_DATE: row.postingDate,
            // CURRENT_QUANTITY: row.currentQuantity,
            factory: this.factoryId,
            holderId: this.holderId,
            adjustType: '0',
            quantity: 0,
            deptId: this.deptId,
            // UNIT: row.unit,
            remark: ''
        };
        this.isShowMessageBoxCheck = true;
    }

    // 改变每页条数
    handleReceiveListSizeChange(val: number) {
        this.pageSizeReceiveList = val;
        this.currPageReceiveList = 1;
        this.applyReceiveList = deepCopy(this.totalReceiveList.slice((this.currPageReceiveList - 1) * this.pageSizeReceiveList, (this.currPageReceiveList - 1) * this.pageSizeReceiveList + this.pageSizeReceiveList));
    }

    handleInStorageListSizeChange(val: number) {
        this.pageSizeInStorageList = val;
        this.currPageInStorageList = 1;
        this.applyInStorageList = deepCopy(this.totalInStorageList.slice((this.currPageInStorageList - 1) * this.pageSizeInStorageList, (this.currPageInStorageList - 1) * this.pageSizeInStorageList + this.pageSizeInStorageList));
    }

    handleDataSizeChange(val: number) {
        this.dataPageSize = val;
        this.dataCurrPage = 1;
        this.dataList = deepCopy(this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize));
    }

    handleAdjustSizeChange(val: number) {
        this.adjustPageSize = val;
        this.adjustCurrPage = 1;
        this.adjustList = deepCopy(this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (this.adjustCurrPage - 1) * this.adjustPageSize + this.adjustPageSize));
    }

    // 跳转页数
    handleReceiveListCurrentChange(val: number) {
        this.currPageReceiveList = val;
        this.applyReceiveList = deepCopy(this.totalReceiveList.slice((this.currPageReceiveList - 1) * this.pageSizeReceiveList, (val - 1) * this.pageSizeReceiveList + this.pageSizeReceiveList));
    }

    handleInStorageListCurrentChange(val: number) {
        this.currPageInStorageList = val;
        this.applyInStorageList = deepCopy(this.totalInStorageList.slice((this.currPageInStorageList - 1) * this.pageSizeInStorageList, (val - 1) * this.pageSizeInStorageList + this.pageSizeInStorageList));
    }

    handleDataCurrentChange(val: number) {
        this.dataCurrPage = val;
        this.dataList = deepCopy(this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (val - 1) * this.dataPageSize + this.dataPageSize));
    }

    handleAdjustCurrentChange(val: number) {
        this.adjustCurrPage = val;
        this.adjustList = deepCopy(this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (val - 1) * this.adjustPageSize + this.adjustPageSize));
    }

    // 当前库存量
    retrieveDataList() {
        this.dataList = [];
        this.dataTotalCount = 0;
        this.dataCurrPage = 1;
        this.dataPageSize = 10;
        Vue.prototype
            .$http(`${MEASUREBARN_BEAN_API.BEANPULP_POT_LIST}`, `POST`, {
                factory: this.factoryId,
                workShop: this.deptId,
                holderId: this.holderId
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    if (data.infoList.length !== 0) {
                        this.totalDataList = data.infoList[0].pulpList;
                        this.dataTotalCount = this.totalDataList.length;
                        this.dataList = deepCopy(this.totalDataList.slice(0, this.dataPageSize));
                    } else {
                        this.$notify.info({
                            title: MSG.API.WheatPot.BeanPulp.searchResult.title,
                            message: MSG.API.WheatPot.BeanPulp.searchResult.message
                        });
                    }
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
    }

    // 调整信息
    retrieveAdjustList() {
        this.totalAdjustList = [];
        this.adjustList = [];
        this.adjustTotalCount = 0;
        this.adjustCurrPage = 1;
        this.adjustPageSize = 10;
        Vue.prototype
            .$http(`${MEASUREBARN_BEAN_API.BEANPULP_ADJSUT_LIST}`, `POST`, {
                factory: this.factoryId,
                holderId: this.holderId,
                currPage: this.adjustCurrPage,
                pageSize: this.adjustPageSize
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.totalAdjustList = data.adjustInfo.list;
                    this.adjustTotalCount = this.totalAdjustList.length;
                    this.adjustList = deepCopy(this.totalAdjustList.slice(0, this.adjustPageSize));
                } else {
                    this.$notify.error({
                        title: MSG.API.normalError.title,
                        message: data.msg
                    });
                }
            });
    }

    // 查看（领用记录| 入罐）
    retrieveLogList(batch) {
        this.activeDialogFormName = 'inStorage';
        this.totalInStorageList = [];
        this.applyInStorageList = [];
        this.totalReceiveList = [];
        this.applyReceiveList = [];
        // 入罐
        // 领用记录
        this.currPageInStorageList = 1;
        this.pageSizeInStorageList = 10;
        this.totalCountInStorageList = 0;
        this.currPageReceiveList = 1;
        this.pageSizeReceiveList = 10;
        this.totalCountReceiveList = 0;
        Vue.prototype
            .$http(`${MEASUREBARN_BEAN_API.BEANPULP_APPLY_LIST}`, `POST`, {
                holderId: this.holderId,
                batch: batch
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.totalInStorageList = data.detailListIn;
                    this.totalReceiveList = data.detailListOut;
                    this.totalCountInStorageList = data.detailListIn.length;
                    this.totalCountReceiveList = data.detailListOut.length;
                    this.applyInStorageList = deepCopy(data.detailListIn.slice(0, this.pageSizeInStorageList));
                    this.applyReceiveList = deepCopy(data.detailListOut.slice(0, this.pageSizeReceiveList));
                } else {
                    this.$notify.error({
                        title: MSG.API.normalError.title,
                        message: data.msg
                    });
                }
            });
    }

    saveAdjust(formName) {
        const ref: any = this.$refs[formName];
        ref.validate(valid => {
            if (valid) {
                Vue.prototype.$http(`${MEASUREBARN_BEAN_API.BEANPULP_ADJUST}`, `POST`, this.adjustForm).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: MSG.OPERATE.saveSuccess.title,
                            message: MSG.OPERATE.saveSuccess.message,
                            type: 'success'
                        });
                        this.retrieveDataList();
                        this.retrieveAdjustList();
                        ref.resetFields();
                    } else {
                        this.$notify.error({
                            title: MSG.API.normalError.title,
                            message: data.msg
                        });
                    }
                });
                this.isShowMessageBoxCheck = false;
            } else {
                return false;
            }
        });
    }

    cannalSaveAdjust(formName) {
        const ref: any = this.$refs[formName];
        ref.resetFields();
        this.isShowMessageBoxCheck = false;
    }

    get total() {
        return this.totalDataList
            .reduce((prev, next: any) => {// eslint-disable-line
                return prev + (next.amount ? next.amount : 0);
            }, 0)
            .toLocaleString();
    }
}
</script>
<style lang="scss" scoped>
.el-form-item--small.el-form-item {
    margin-bottom: 18px;
}
</style>
