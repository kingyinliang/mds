<template>
    <div class="header_main">
        <el-row class="dataEntry-head-leftRight" :gutter="10">
            <el-col :span="4">
                <div class="card-left" style="background: #fff;">
                    <p class="dataEntry-head-leftRight__title" style="color: #333;">
                        罐号：{{ formData.potNo }}
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
                            <p><i class="iconfont factory-37_zhusu" />杀菌车间</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.prodcutMaterial ? formData.prodcutMaterial : '' }}
                            </p>
                            <p> <i class="iconfont factory-bianhao" />生产物料 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.potAmount ? formData.potAmount.toLocaleString() : 0 }}
                                KG
                            </p>
                            <p> <i class="iconfont factory-cunchurongliang" />数量 </p>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activetTabName" class="NewDaatTtabs tabsPages" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    当前库存
                </span>
                <el-table header-row-class-name="" :data="currentInventoryDataGroup" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="罐号" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.potNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.prodcutMaterial }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" :show-overflow-tooltip="true" width="170">
                        <template slot-scope="scope">
                            {{ scope.row.postingDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅号" :show-overflow-tooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.quantity ? scope.row.quantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅单" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="currentInventoryDataGroup.length !== 0">
                    <el-pagination :current-page="currentInventoryCurrentPage" :page-sizes="[10, 20, 50]" :page-size="currentInventoryPageSize" layout="total, sizes, prev, pager, next, jumper" :total="currentInventoryTotalCount" @size-change="handleCurrentInventorySizeChange" @current-change="handleCurrentInventoryCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    历史库存
                </span>
                <el-table header-row-class-name="" :data="historyInventoryDataGroup" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="罐号" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.potNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.prodcutMaterial }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" :show-overflow-tooltip="true" width="170">
                        <template slot-scope="scope">
                            {{ scope.row.postingDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅号" :show-overflow-tooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.quantity ? scope.row.quantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅单" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="historyInventoryDataGroup.length !== 0">
                    <el-pagination :current-page="historyInventoryCurrentPage" :page-sizes="[10, 20, 50]" :page-size="historyInventoryCurrentPageSize" layout="total, sizes, prev, pager, next, jumper" :total="historyInventoryTotalCount" @size-change="handleHistoryInventorySizeChange" @current-change="handleHistoryInventoryCurrentSizeChange" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { GRANARY_API } from '@/api/api';
// import { STE_API } from 'common/api/api';
import MSG from '@/assets/js/hint-msg';
@Component({
    components: {},
    name: 'DissolveBucketDetail'
})
export default class DissolveBucketDetail extends Vue {
    factoryId = '';
    holderId = '';
    activetTabName = '1';
    // 批次数据
    currentInventoryDataGroup = [];
    totalDataList = [];
    currentInventoryCurrentPage = 1;
    currentInventoryPageSize = 10;
    currentInventoryTotalCount = 0;
    // 调整数据
    historyInventoryDataGroup = [];
    totalAdjustList = [];
    historyInventoryCurrentPage = 1;
    historyInventoryCurrentPageSize = 10;
    historyInventoryTotalCount = 0;
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
        // this.factoryId = this.$store.state.common.BeanPulp.factory;
        // this.holderId = this.$store.state.common.BeanPulp.holderId;
        this.retrieveDetail();
        //this.retrieveDataList();
        //this.retrieveAdjustList();

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

    handleCurrentInventorySizeChange(val: number) {
        this.currentInventoryPageSize = val;
        this.currentInventoryCurrentPage = 1;
        this.currentInventoryDataGroup = this.totalDataList.slice((this.currentInventoryCurrentPage - 1) * this.currentInventoryPageSize, (this.currentInventoryCurrentPage - 1) * this.currentInventoryPageSize + this.currentInventoryPageSize);
    }

    handleHistoryInventorySizeChange(val: number) {
        this.historyInventoryCurrentPageSize = val;
        this.historyInventoryCurrentPage = 1;
        this.historyInventoryDataGroup = this.totalAdjustList.slice((this.historyInventoryCurrentPage - 1) * this.historyInventoryCurrentPageSize, (this.historyInventoryCurrentPage - 1) * this.historyInventoryCurrentPageSize + this.historyInventoryCurrentPageSize);
    }

    // 跳转页数
    handleCurrentChange(val: number) {
        this.currPage = val;
        this.applyList = this.totalList.slice((this.currPage - 1) * this.pageSize, (val - 1) * this.pageSize + this.pageSize);
    }

    handleCurrentInventoryCurrentChange(val: number) {
        this.currentInventoryCurrentPage = val;
        this.currentInventoryDataGroup = this.totalDataList.slice((this.currentInventoryCurrentPage - 1) * this.currentInventoryPageSize, (val - 1) * this.currentInventoryPageSize + this.currentInventoryPageSize);
    }

    handleHistoryInventoryCurrentSizeChange(val: number) {
        this.historyInventoryCurrentPage = val;
        this.historyInventoryDataGroup = this.totalAdjustList.slice((this.historyInventoryCurrentPage - 1) * this.historyInventoryCurrentPageSize, (val - 1) * this.historyInventoryCurrentPageSize + this.historyInventoryCurrentPageSize);
    }

    retrieveDetail() {
        this.formData = {};

        console.log(this.$store.state.sterilize.dissolveBucketDetail)

        // STE_API.STE_DISSOLUTIONBUCKET_ITEM_QUERY_API({
        //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        //     workShop:
        //     }).then(({ data }) => {

        // });


        // Vue.prototype.$http(`${GRANARY_API.WHEAT_POT_DETAIL}/${this.factoryId}/${this.holderId}`, `GET`).then(({ data }) => {
        //     if (data.code === 0) {
        //         this.formData = data.data;
        //     } else {
        //         this.$notify.error({
        //             title: MSG.API.normalError.title,
        //             message: data.msg
        //         });
        //     }
        // });
    }

    // 当前库存量
    retrieveDataList() {
        this.totalDataList = [];
        this.currentInventoryDataGroup = [];
        this.currentInventoryTotalCount = 0;
        this.currentInventoryCurrentPage = 1;
        this.currentInventoryPageSize = 10;
        Vue.prototype
            .$http(`${GRANARY_API.WHEAT_BATCH_LIST}`, `POST`, {
                holderId: this.holderId
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.totalDataList = data.page.list;
                    this.currentInventoryTotalCount = this.totalDataList.length;
                    this.currentInventoryDataGroup = this.totalDataList.slice(0, this.currentInventoryPageSize);
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
        this.historyInventoryDataGroup = [];
        this.historyInventoryTotalCount = 0;
        this.historyInventoryCurrentPage = 1;
        this.historyInventoryCurrentPageSize = 10;
        Vue.prototype
            .$http(`${GRANARY_API.WHEAT_ADJSUT_LIST}`, `POST`, {
                factory: this.factoryId,
                holderId: this.holderId
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.totalAdjustList = data.adjustInfo.list;
                    this.historyInventoryTotalCount = this.totalAdjustList.length;
                    this.historyInventoryDataGroup = this.totalAdjustList.slice(0, this.historyInventoryCurrentPageSize);
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
        //   Vue.prototype.$warningToast(MSG.VALIDATE.updatNumNotEmpty)
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
<style lang="scss" scoped>
.el-form-item--small.el-form-item {
    margin-bottom: 18px;
}
</style>
