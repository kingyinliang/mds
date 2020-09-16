<template>
    <div>
        <mds-card title="物料领用">
            <el-row class="home_card__main" :gutter="10">
                <el-col v-for="item in stockInfoList" :key="item.potId" :span="6">
                    <div class="card-stock">
                        <div class="card-stock__head">
                            <span>{{ `${item.workShopName}${item.beanLocationName || item.beanWareHouseName? '：'+(item.beanLocationName || item.beanWareHouseName) : ''}` }}</span>
                            <el-button class="floatr" type="text" @click="receive(item)">
                                领用
                            </el-button>
                        </div>
                        <div class="card-stock__content">
                            <div class="stock-image">
                                <div class="stock-image_content">
                                    <div class="stock-image_info">
                                        <i class="iconfont factory-chejianguanli" />
                                        <img src="~DFMDS/assets/img/kojiScan.png" alt="">
                                    </div>
                                </div>
                                <div class="stock-image_content stock-image_content_right">
                                    <div class="stock-image_info stock-image_info_right">
                                        <i class="iconfont factory-zongliangguanli" />
                                        <div class="stock-image_info_num">
                                            <el-tooltip effect="dark" :content="item.storageTotal+'kg'" placement="top">
                                                <span class="stock-image_info_num_toolTip">{{ item.storageTotal&&item.storageTotal.length>4? item.storageTotal.subStr(0,3): item.storageTotal }}</span>
                                                <span class="stock-image_info_num_span">{{ item.storageTotal&&item.storageTotal.length>4?'...':'' }}kg</span>
                                            </el-tooltip>
                                        </div>
                                        <div class="stock-image_info_title">
                                            库存总量
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <mds-card class="table-card" title="库存明细" :pack-up="false" :name="'fermenterTotal'">
                                <detail-table :current-data="item.detailsList" />
                            </mds-card>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="semi">
                <el-table header-row-class-name="tableHead" class="newTable semi__pot_table" :data="semiTable" :row-class-name="rowDelFlag" :height="semiTable.length>4? '' : '196'" border tooltip-effect="dark" @row-dblclick="EditRow">
                    <el-table-column :index="index => getIndexMethod(index, semiTable)" type="index" label="序号" width="50px" fixed />
                    <el-table-column prop="stePotNo" label="领用库位" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="aiShelves" label="BOM物料" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="fermentPotNo" label="领用批次" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="aiShelves" label="领用物料" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="consumeUnit" label="库存量" width="70" :show-overflow-tooltip="true" />
                    <el-table-column prop="consumeAmount" label="领用数量" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="consumeBatch" label="小豆数量" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="fermentStorage" label="单位" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="fermentStorage" label="大豆厂家" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="fermentStorage" label="备注" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="操作人" prop="changer" width="140" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column width="70" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row, scope.$index)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </mds-card>
        <audit-log :table-data="semiAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <semi-receive-dialog v-if="visible" ref="SemiReceiveDialog" :form-header="formHeader" @success="dataPush" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { STE_API } from 'common/api/api';
    import SemiReceiveDialog from './SemiReceiveDialog.vue'
    import DetailTable from './DetailTable.vue'
    import { dataEntryData } from 'utils/utils';

    @Component({
        components: {
            SemiReceiveDialog,
            DetailTable
        }
    })
    export default class SemiReceive extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        $refs: {SemiReceiveDialog: HTMLFormElement};

        formHeader = {};
        semiAudit = [];
        semiTable: SemiObj[] = [];
        orgSemiTable: SemiObj[] = [];
        visible = false;
        // 物料list
        stockInfoList: object[] = [{}, {}, {}, {}];

        // indexMethod(tableIndex) {
        //     const num = this.semiTable.reduce((total, currentValue: SemiObj, index) => {
        //         return total + (tableIndex < index ? 0 : currentValue.delFlag === 1 ? 1 : 0)
        //     }, 0);
        //     return tableIndex + 1 - num
        // }

        init(formHeader) {
            this.formHeader = formHeader
            STE_API.STE_SEMI_LIST_API({
                orderNo: formHeader.orderNo,
                potOrderNo: formHeader.potOrderNo
            }).then(({ data }) => {
                this.semiTable = JSON.parse(JSON.stringify(data.data));
                this.orgSemiTable = JSON.parse(JSON.stringify(data.data));
            })
        }

        ruleSubmit(): boolean {
            // for (const item of this.semiTable.filter(it => it.delFlag !== 1)) {
            //     if (!item.realUseAmount) {
            //         this.$warningToast('请填写半成品领用页签必填项');
            //         return false
            //     }
            // }
            return true
        }

        savedData(formHeader) {
            const delIds = [];
            const insertData = [];
            const updateData = [];

            dataEntryData(formHeader, this.semiTable, this.orgSemiTable, delIds, insertData, updateData);

            return {
                orderNo: this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo,
                potOrderNo: this.$store.state.sterilize.SemiReceive.potOrderMap.potOrderNo,
                delIds,
                insertData,
                updateData
            }
        }

        semiCopy() {
            STE_API.STE_SEMI_COPY_API({
                orderNo: this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo,
                potOrderNo: this.$store.state.sterilize.SemiReceive.potOrderMap.potOrderNo
            }).then(({ data }) => {
                this.semiTable = this.semiTable.concat(data.data);
            })
        }

        receive() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.SemiReceiveDialog.init()
            });
        }

        EditRow(row) {
            if (!this.isRedact) {
                return false
            }
            for (const it of this.semiTable) {
                delete it.modifiedId
            }
            row.modifiedId = 1;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.SemiReceiveDialog.init(row)
            });
        }

        dataPush(data: SemiObj) {
            if (data.modifiedId === 1) {
                for (const it of this.semiTable) {
                    if (it.modifiedId === 1) {
                        Reflect.ownKeys(data).forEach(key => {
                            it[key] = data[key];
                        });
                        delete it.modifiedId
                    }
                }
            } else {
                this.semiTable.push(data);
            }
            this.visible = false;
        }

        removeDataRow(row, index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
                this.$set(this.semiTable, index, row)
            });
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }
    }
    interface SemiObj {
        delFlag?: number;
        modifiedId?: number;
        id?: string;
        orderId?: string;
        factory?: string;
        orderNo?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
    }
</script>

<style lang="scss" scoped>
.semi {
    display: flex;
    &__pot_box {
        min-width: 150px;
        max-width: 250px;
        height: 196px;
        margin-right: 5px;
        padding-bottom: 10px;
        background: #f5f5f5;
        border-radius: 8px;
        &__main {
            width: 122px;
            margin: auto;
            img {
                display: block;
                margin: 10px auto;
            }
        }
    }
    &___table {
        display: flex;
        flex: 1;
    }
}
.home_card__main {
    .card-stock {
        margin-bottom: 20px;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.09);
        border-radius: 4px;
        -webkit-box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.09);
        box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.09);
        .card-stock__head {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 10px;
            font-size: 14px;
            border-bottom: 1px #e8e8e8 solid;
            .el-button {
                font-weight: 400;
                font-size: 14px;
            }
        }
        .card-stock__content {
            .stock-image {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 6px 10px 10px;
                .stock-image_content {
                    width: 50%;
                    height: 90px;
                    padding-right: 5px;
                    padding-left: 0;
                    .stock-image_info {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        padding-left: 28px;
                        background: #ffbf00;
                        border-radius: 8px;
                        box-shadow: 3px 3px 5px 0 #d6d2c4;
                        i {
                            position: absolute;
                            top: 8px;
                            right: 12px;
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            color: #fff;
                        }
                        img {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            display: block;
                            width: 70%;
                            transform: translate(-50%, -50%);
                        }
                        .stock-image_info_num {
                            height: 128px;
                            padding-top: 28px;
                            color: #fff;
                            font-weight: 600;
                            font-size: 72px;
                            line-height: 100px;
                        }
                        .stock-image_info_num_span {
                            font-size: 18px;
                        }
                        .stock-image_info_title {
                            height: 28px;
                            color: #fff;
                            font-weight: 600;
                            font-size: 20px;
                            line-height: 28px;
                        }
                    }
                    .stock-image_info_right {
                        background: #487bff;
                    }
                }
                .stock-image_content_right {
                    padding-right: 0;
                    padding-left: 5px;
                }
            }
            .table-card {
                padding: 8px 10px 0 !important;
                border: 0;
                box-shadow: none;
            }
        }
    }
}
</style>
