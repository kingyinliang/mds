<template>
    <div class="header_main">
        <el-row class="dataEntry-head-leftRight" :gutter="10">
            <el-col :span="4">
                <div class="card-left" style="background: #ffbf00;">
                    <p class="dataEntry-head-leftRight__title" />
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
                            <p>{{ formData.workShopName ? formData.workShopName : '' }}</p>
                            <p><em class="iconfont factory-quyu" />车间</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.location ? formData.location : '' }}
                            </p>
                            <p> <em class="iconfont factory-bianhao" />库位 </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <el-tooltip class="item" effect="dark" :content="(formData.materialName ? formData.materialName : '') + ' ' + (formData.materialCode ? formData.materialCode : '')" placement="top">
                                <p>
                                    {{ (formData.materialName ? formData.materialName : '') + ' ' + (formData.materialCode ? formData.materialCode : '') }}
                                </p>
                            </el-tooltip>
                            <p> <em class="iconfont factory-cunchurongliang" />物料</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.sumAmount }}
                            </p>
                            <p> <em class="iconfont factory-bianma" />总容量  </p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p> L </p>
                            <p> <em class="iconfont factory-shujurongliang" />单位 </p>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" style=" overflow: hidden; border-radius: 15px;">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    当前库存信息
                </span>
                <el-table header-row-class-name="" :data="dataList" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" align="center" fixed />
                    <el-table-column label="物料" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入库日期" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.postingDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入库数量 (L)" :show-overflow-tooltip="true" width="160" align="right">
                        <template slot-scope="scope">
                            {{ scope.row.quantity !== null ? scope.row.quantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="当前数量 (L)" width="160" align="right">
                        <template slot-scope="scope">
                            {{ scope.row.currentQuantity !== null ? scope.row.currentQuantity.toLocaleString() : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showMoreDetail(scope.row.batch)">
                                <em class="iconfont factory-fangdajing-copy" style=" margin-right: 5px; font-size: 12px;" />查看
                            </el-button>
                            <el-button v-if="isAuth('Gra:adjust:material:wheatUpdate')" type="text" size="small" @click="makeAdjust(scope.row)">
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
                    <el-table-column type="index" label="序号" width="55" align="center" fixed />
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
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
                    <el-table-column label="数量(L)" :show-overflow-tooltip="true" width="120" align="right">
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
                <span>明细</span>
            </div>
            <el-table header-row-class-name="" :data="applyInStorageList" border tooltip-effect="dark" class="newTable">
                <el-table-column type="index" label="序号" width="55" align="center" fixed />
                <el-table-column label="物料" :show-overflow-tooltip="true" width="190">
                    <template slot-scope="scope">
                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="批次" :show-overflow-tooltip="true" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.batch }}
                    </template>
                </el-table-column>
                <el-table-column label="领用量(L)" :show-overflow-tooltip="true" width="100" align="right" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.entryQnt ? scope.row.entryQnt.toLocaleString() : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="领用订单" :show-overflow-tooltip="true" width="130">
                    <template slot-scope="scope">
                        {{ scope.row.orderNo }}
                    </template>
                </el-table-column>
                <el-table-column label="曲房" prop="houseName" width="100" />
                <el-table-column label="领用时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.created }}
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="isShowMessageBoxCheck" width="400px" custom-class="dialog__class">
            <div slot="title" class="title">
                <span>盘点调整</span>
            </div>
            <div>
                <el-form ref="adjustForm" :model="adjustForm" label-width="100px" size="small">
                    <el-form-item label="物料：">
                        <p class="disabled-text" style="width: 220px;">
                            {{ adjustForm.materialName + ' ' + adjustForm.materialCode }}
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
                            <em slot="suffix">L</em>
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
import { INVENTORY_API } from '@/api/api';
@Component({
    components: {},
    name: 'DataEntryInventoryManagementBrineDetail'
})
export default class Index extends Vue {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    factoryId = '';
    location = '';
    activeName = '1';
    // 批次数据
    dataList: any = [];
    dataCurrPage = 1;
    dataPageSize = 10;
    dataTotalCount = 0;
    // 调整数据
    adjustList: any = [];
    totalAdjustList = [];
    adjustCurrPage = 1;
    adjustPageSize = 10;
    adjustTotalCount = 0;
    // 入库数据
    applyInStorageList: any = [];
    isShowMessageBoxAdjust = false;
    isShowMessageBoxCheck = false;
    formData = {
        factoryId: '',
        factoryName: '',
        workShopName: '',
        location: '',
        materialCode: '',
        materialName: '',
        sumAmount: ''
    };

    adjustForm = {
        id: '',
        materialCode: '',
        materialName: '',
        batch: '',
        adjustType: '0',
        quantity: 0,
        remark: ''
    };

    activeDialogFormName = 'inStorage';
    mounted() {
        this.formData = JSON.parse(JSON.stringify(this.$store.state.common.BrineInventory));
        this.retrieveDataList();
    }

    validatePassAdjustNum = (rule, value, callback) => {
        if (value === 0) {
            return callback(new Error('请填写调整量'));
        }
            return callback();
    };

    showMoreDetail(batch) {
        this.retrieveLogList(batch);
    }

    makeAdjust(row) {
        this.adjustForm = {
            id: row.id,
            materialCode: row.materialCode,
            materialName: row.materialName,
            batch: row.batch,
            adjustType: '0',
            quantity: 0,
            remark: ''
        };
        this.isShowMessageBoxCheck = true;
    }

    // 当前库存量 调整信息
    retrieveDataList() {
        this.dataList = [];
        this.dataTotalCount = 0;
        this.dataCurrPage = 1;
        this.dataPageSize = 10;
        Vue.prototype
            .$http(`${INVENTORY_API.BRINE_INVENTPRY_DETAIL_API}`, `POST`, {
                factory: this.formData.factoryId,
                location: this.formData.location,
                currPage: this.dataCurrPage,
                pageSize: this.dataPageSize
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.inList
                    this.adjustList = data.adjustList.list
                    this.adjustTotalCount = data.adjustList.totalCount
                } else {
                    this.$errorToast(data.msg);
                }
            });
    }

    handleAdjustSizeChange(val: number) {
        this.adjustPageSize = val;
        this.adjustCurrPage = 1;
        this.activeName = '2';
        this.retrieveDataList();
    }

    handleAdjustCurrentChange(val: number) {
        this.adjustCurrPage = val;
        this.activeName = '2';
        this.retrieveDataList();
    }

    // 查看（当前库存信息）
    retrieveLogList(batch) {
        this.applyInStorageList = [];
        Vue.prototype
            .$http(`${INVENTORY_API.BRINE_INVENTPRY_USELIST_API}`, `POST`, {
                batch: batch
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    this.applyInStorageList = data.useList;
                    this.isShowMessageBoxAdjust = true;
                } else {
                    this.$errorToast(data.msg);
                }
            });
    }

    saveAdjust(formName) {
        const ref: any = this.$refs[formName];
        ref.validate(valid => {
            if (valid) {
                Vue.prototype.$http(`${INVENTORY_API.BRINE_INVENTPRY_ADJUST_API}`, `POST`, this.adjustForm).then(({ data }) => {
                    if (data.code === 0) {
                        // this.$successToast('保存成功');
                        this.retrieveDataList();
                        ref.resetFields();
                    } else {
                        this.$errorToast(data.msg);
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

}
</script>
<style lang="scss">
@import "@/assets/scss/_common.scss";
@import "@/assets/scss/_share.scss";
.wheat-pot-data-entry {
    .header {
        height: 200px;
        .header-pot {
            width: 250px;
            .header-pot__label {
                width: 300px;
                height: 30px;
                overflow: hidden;
                color: rgba(102, 102, 102, 1);
                font-weight: 400;
                font-size: 18px;
                line-height: 30px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .header-pot__image {
                position: relative;
                width: 250px;
                height: 160px;
                margin-top: 10px;
                background: url("~@/assets/img/pot.png") no-repeat top right;
                background-size: contain;
                .header-pot__image_content {
                    position: absolute;
                    right: 40px;
                    bottom: 61px;
                    width: 46px;
                    height: 65px;
                    background: linear-gradient(#35c3ff, #1890ff);
                }
            }
        }
        .header-form {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 600px;
            margin-left: 50px;
            .header-form_input {
                width: 150px;
                overflow: hidden;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 400;
                font-size: 14px;
                font-family: PingFangSC-Regular, sans-serif;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }

    .topform {
        .el-form-item__content {
            height: 32px;
            border-bottom: 1px solid #d8d8d8;
        }
    }
}
</style>
<style lang="scss" scoped>
.el-form-item--small.el-form-item {
    margin-bottom: 18px;
}
</style>
