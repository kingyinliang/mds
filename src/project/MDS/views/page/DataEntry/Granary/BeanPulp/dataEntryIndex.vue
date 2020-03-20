<template>
    <div class="header_main">
        <el-row class="dataEntry-head-leftRight" :gutter="10">
            <el-col :span="4">
                <div class="card-left" style="background: #ffbf00;">
                    <p class="dataEntry-head-leftRight__title">
                        罐号：{{ formData.holderName ? formData.holderName : '' }}
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
                        <i class="iconfont factory-gongchang" />{{ formData.factoryName ? formData.factoryName : '' }}
                    </p>
                    <div class="dataEntry-head-leftRight-message">
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>{{ formData.area ? formData.area : '' }}</p>
                            <p><i class="iconfont factory-quyu" />物理区域</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.holderName ? formData.holderName : '' }}
                            </p>
                            <p> <i class="iconfont factory-bianhao" />容器号 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.capacity ? formData.capacity.toLocaleString() : '' }}
                                KG
                            </p>
                            <p> <i class="iconfont factory-cunchurongliang" />罐体容量 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <el-tooltip class="item" effect="dark" :content="(formData.materialNo ? formData.materialNo : '') + ' ' + (formData.materialName ? formData.materialName : '')" placement="top">
                                <p>
                                    {{ (formData.materialNo ? formData.materialNo : '') + ' ' + (formData.materialName ? formData.materialName : '') }}
                                </p>
                            </el-tooltip>
                            <p> <i class="iconfont factory-bianma" />物料编码 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>{{ total }} KG</p>
                            <p> <i class="iconfont factory-shujurongliang" />当前总量 </p>
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
                <el-table headerRowClassName="" :data="dataList" border tooltipEffect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column label="物料" :showOverflowTooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :showOverflowTooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入库日期" :showOverflowTooltip="true" width="170">
                        <template slot-scope="scope">
                            {{ scope.row.postingDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入库数量(KG)" :showOverflowTooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.quantity ? scope.row.quantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="当前数量(KG)" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showMoreDetail(scope.row.batch)">
                                <em class="iconfont factory-fangdajing-copy" style="font-size: 12px; margin-right: 5px;" />查看
                            </el-button>
                            <el-button v-if="isAuth('Gra:adjust:material:soybeanUpdate')" type="text" size="small" @click="makeAdjust(scope.row)">
                                <em class="iconfont factory-banshou" style="font-size: 12px; margin-right: 5px;" />调整
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="dataList.length !== 0">
                    <el-pagination :currentPage="dataCurrPage" :pageSizes="[10, 20, 50]" :pageSize="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataTotalCount" @size-change="handleDataSizeChange" @current-change="handleDataCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    调整信息记录
                </span>
                <el-table headerRowClassName="" :data="adjustList" border tooltipEffect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column label="物料" :showOverflowTooltip="true" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :showOverflowTooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="调整类型" :showOverflowTooltip="true" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.adjustType === '0' ? '盘盈' : '盘亏' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="数量(KG)" :showOverflowTooltip="true" width="120">
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
                    <el-pagination :currentPage="adjustCurrPage" :pageSizes="[10, 20, 50]" :pageSize="adjustPageSize" layout="total, sizes, prev, pager, next, jumper" :total="adjustTotalCount" @size-change="handleAdjustSizeChange" @current-change="handleAdjustCurrentChange" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :closeOnClickModal="false" :visible.sync="isShowMessageBoxAdjust" width="900px" customClass="dialog__class">
            <div slot="title" class="title">
                <span>领用明细</span>
            </div>
            <div>
                <el-table headerRowClassName="" :data="applyList" border tooltipEffect="dark" class="datatTableHead-normal newTable">
                    <el-table-column type="index" label="序号" width="55" align="center" />
                    <el-table-column label="物料" :showOverflowTooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :showOverflowTooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用量(KG)" :showOverflowTooltip="true" width="100" align="right" headerAlign="center">
                        <template slot-scope="scope">
                            {{ scope.row.useWeight ? scope.row.useWeight.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用订单" :showOverflowTooltip="true" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.orderNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用时间">
                        <template slot-scope="scope">
                            {{ scope.row.changed }}
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="applyList.length !== 0">
                    <el-pagination :currentPage="currPage" :pageSizes="[10, 20, 50]" :pageSize="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="isShowMessageBoxAdjust = false">
                    取消
                </el-button>
                <el-button type="primary" size="small" style="background-color: #1890ff; color: #fff; border-color: #1890ff;" @click="isShowMessageBoxAdjust = false">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :closeOnClickModal="false" :visible.sync="isShowMessageBoxCheck" width="400px" customClass="dialog__class">
            <div slot="title" class="title">
                <span>盘点调整</span>
            </div>
            <div>
                <el-form ref="adjustForm" :model="adjustForm" labelWidth="100px" size="small">
                    <el-form-item label="物料：">
                        <p class="disabled-text" style="width: 220px;">
                            {{ adjustForm.MATERIAL_CODE + ' ' + adjustForm.MATERIAL_NAME }}
                        </p>
                    </el-form-item>
                    <el-form-item label="批次：">
                        <p class="disabled-text" style="width: 220px;">
                            {{ adjustForm.BATCH }}
                        </p>
                    </el-form-item>
                    <el-form-item label="调整类型：" required>
                        <el-select v-model="adjustForm.ADJUST_TYPE" placeholder="请选择" style="width: 220px;">
                            <el-option label="盘亏" value="1" />
                            <el-option label="盘盈" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="调整量："
                        prop="QUANTITY"
                        :rules="[
                            {
                                required: true,
                                validator: validatePassAdjustNum,
                                message: '请填写调整量 ',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input v-model.number="adjustForm.QUANTITY" type="number" style="width: 220px;">
                            <i slot="suffix">KG</i>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="说明："
                        prop="REMARK"
                        :rules="[
                            {
                                required: true,
                                message: '请填写调整说明',
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <el-input v-model.trim="adjustForm.REMARK" type="text" style="width: 220px;" />
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="cannalSaveAdjust('adjustForm')">
                    取消
                </el-button>
                <el-button type="primary" size="small" style="background-color: #1890ff; color: #fff; border-color: #1890ff;" @click="saveAdjust('adjustForm')">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { GRANARY_API } from '@/api/api';
import MSG from '@/assets/js/hint-msg';
@Component({
    components: {},
    name: 'GranaryBeanPulpDataEntryIndex'
})
export default class Index extends Vue {
    factoryId = '';
    holderId = '';
    activeName = '1';
    // 批次数据
    dataList = [];
    totalDataList = [];
    dataCurrPage = 1;
    dataPageSize = 10;
    dataTotalCount = 0;
    // 调整数据
    adjustList = [];
    totalAdjustList = [];
    adjustCurrPage = 1;
    adjustPageSize = 10;
    adjustTotalCount = 0;
    // 领用数据
    applyList = [];
    totalList = [];
    currPage = 1;
    pageSize = 10;
    totalCount = 0;
    isShowMessageBoxAdjust = false;
    isShowMessageBoxCheck = false;
    formData = {};
    adjustForm = {
        MATERIAL_CODE: '',
        MATERIAL_NAME: '',
        BATCH: '',
        MATERIAL_TYPE_NAME: '',
        LOCATION: '',
        MOVE_TYPE: '',
        MATERIAL_TYPE_CODE: '',
        POSTING_DATE: '',
        CURRENT_QUANTITY: 0,
        FACTORY: '',
        HOLDER_ID: '',
        ADJUST_TYPE: '0',
        QUANTITY: 0,
        UNIT: 'KG',
        REMARK: ''
    };

    mounted() {
        this.factoryId = this.$store.state.common.BeanPulp.factory;
        this.holderId = this.$store.state.common.BeanPulp.holderId;
        this.retrieveDetail();
        this.retrieveDataList();
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
            MATERIAL_CODE: row.materialCode,
            MATERIAL_NAME: row.materialName,
            BATCH: row.batch,
            MATERIAL_TYPE_NAME: row.materialTypeName,
            LOCATION: row.location,
            MOVE_TYPE: row.moveType,
            MATERIAL_TYPE_CODE: row.materialTypeCode,
            POSTING_DATE: row.postingDate,
            CURRENT_QUANTITY: row.currentQuantity,
            FACTORY: row.factory,
            HOLDER_ID: row.holderId,
            ADJUST_TYPE: '0',
            QUANTITY: 0,
            UNIT: row.unit,
            REMARK: ''
        };
        this.isShowMessageBoxCheck = true;
    }

    // 改变每页条数
    handleSizeChange(val: number) {
        this.pageSize = val;
        this.currPage = 1;
        this.applyList = this.totalList.slice((this.currPage - 1) * this.pageSize, (this.currPage - 1) * this.pageSize + this.pageSize);
    }

    handleDataSizeChange(val: number) {
        this.dataPageSize = val;
        this.dataCurrPage = 1;
        this.dataList = this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize);
    }

    handleAdjustSizeChange(val: number) {
        this.adjustPageSize = val;
        this.adjustCurrPage = 1;
        this.adjustList = this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (this.adjustCurrPage - 1) * this.adjustPageSize + this.adjustPageSize);
    }

    // 跳转页数
    handleCurrentChange(val: number) {
        this.currPage = val;
        this.applyList = this.totalList.slice((this.currPage - 1) * this.pageSize, (val - 1) * this.pageSize + this.pageSize);
    }

    handleDataCurrentChange(val: number) {
        this.dataCurrPage = val;
        this.dataList = this.totalDataList.slice((this.dataCurrPage - 1) * this.dataPageSize, (val - 1) * this.dataPageSize + this.dataPageSize);
    }

    handleAdjustCurrentChange(val: number) {
        this.adjustCurrPage = val;
        this.adjustList = this.totalAdjustList.slice((this.adjustCurrPage - 1) * this.adjustPageSize, (val - 1) * this.adjustPageSize + this.adjustPageSize);
    }

    retrieveDetail() {
        this.formData = {};
        Vue.prototype.$http(`${GRANARY_API.WHEAT_POT_DETAIL}/${this.factoryId}/${this.holderId}`, `GET`).then(({ data }) => {
            if (data.code === 0) {
                this.formData = data.data;
            } else {
                this.$notify.error({
                    title: MSG.API.normalError.title,
                    message: data.msg
                });
            }
        });
    }

    // 当前库存量
    retrieveDataList() {
        this.totalDataList = [];
        this.dataList = [];
        this.dataTotalCount = 0;
        this.dataCurrPage = 1;
        this.dataPageSize = 10;
        Vue.prototype
            .$http(`${GRANARY_API.WHEAT_BATCH_LIST}`, `POST`, {
                holderId: this.holderId
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.totalDataList = data.page.list;
                    this.dataTotalCount = this.totalDataList.length;
                    this.dataList = this.totalDataList.slice(0, this.dataPageSize);
                } else {
                    this.$notify.error({
                        title: MSG.API.normalError.title,
                        message: data.msg
                    });
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
            .$http(`${GRANARY_API.WHEAT_ADJSUT_LIST}`, `POST`, {
                factory: this.factoryId,
                holderId: this.holderId
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.totalAdjustList = data.adjustInfo.list;
                    this.adjustTotalCount = this.totalAdjustList.length;
                    this.adjustList = this.totalAdjustList.slice(0, this.adjustPageSize);
                } else {
                    this.$notify.error({
                        title: MSG.API.normalError.title,
                        message: data.msg
                    });
                }
            });
    }

    // 领用记录
    retrieveLogList(batch) {
        this.totalList = [];
        this.applyList = [];
        this.currPage = 1;
        this.pageSize = 10;
        this.totalCount = 0;
        Vue.prototype
            .$http(`${GRANARY_API.WHEAT_APPLY_LIST}`, `POST`, {
                materielType: 'Soybean',
                batch
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.totalList = data.collarUseInfo.list;
                    this.totalCount = this.totalList.length;
                    this.applyList = this.totalList.slice(0, this.pageSize);
                } else {
                    this.$notify.error({
                        title: MSG.API.normalError.title,
                        message: data.msg
                    });
                }
            });
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    saveAdjust(formName) {
        const ref: any = this.$refs[formName];
        ref.validate(valid => {
            if (valid) {
                Vue.prototype.$http(`${GRANARY_API.WHEAT_ADJUST}`, `POST`, this.adjustForm).then(({ data }) => {
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
        // if (this.adjustForm.QUANTITY.toString() === '') {
        //   Vue.prototype.$warning_SHINHO(MSG.VALIDATE.updatNumNotEmpty)
        //   return false
        // }
    }

    cannalSaveAdjust(formName) {
        const ref: any = this.$refs[formName];
        ref.resetFields();
        this.isShowMessageBoxCheck = false;
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */
    get total() {
        return this.totalDataList
            .reduce((prev, next) => {
                return prev + (next['currentQuantity'] ? next['currentQuantity'] : 0);
            }, 0)
            .toLocaleString();
    }
}
</script>
<style lang="scss"></style>
