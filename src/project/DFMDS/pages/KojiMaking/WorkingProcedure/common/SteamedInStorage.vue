<template>
    <div class="koji-process-control">
        <mds-card title="生产入库" name="table1" icon-bg="#487BFF">
            <el-table header-row-class-name="tableHead" class="newTable" :data="tableData" border tooltip-effect="dark" size="mini">
                <el-table-column type="index" :index="index => getIndexMethod(index, tableData)" label="序号" width="50px" fixed />
                <el-table-column label="大豆量" width="140">
                    <template slot-scope="scope">
                        <p>{{ scope.row.feBeanMount }}</p>
                    </template>
                </el-table-column>
                <el-table-column width="146">
                    <template slot="header">
                        <span class="notNull">* </span>入库数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.inStorageAmount" placeholder="请输入" :disabled="!isRedact" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="80">
                    <template slot-scope="scope">
                        <p>{{ scope.row.unit }}</p>
                    </template>
                </el-table-column>
                <el-table-column width="186">
                    <template slot="header">
                        <span class="notNull">* </span>入库批次
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.inStorageBatch" placeholder="请输入" :disabled="!isRedact" size="small" maxlength="10" style="width: 160px;" />
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="craftAuditList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
    import { KOJI_API, AUDIT_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import _ from 'lodash';


    @Component({
        name: 'WashBeanMaterialCraft'
    })
    export default class WashBeanMaterialCraft extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: '' }) potNoNow: number|string;

        // 订单信息
        formHeader: Craft = {};

        // 蒸豆记录表格数据
        tableData: CraftList[] = [];
        temTableData: CraftList[] = [];

        // 审核记录
        craftAuditList = [];

        // 泡豆罐选择改变 触发字段变更值
        @Watch('potNoNow', { immediate: true, deep: true })
        onChangeValue(newVal: number| string) {
            if (newVal && this.tableData[0]) {
                this.tableData[0].scPotNo = String(newVal) || ''
                this.tableData[0].inStorageBatch = this.getNowFormatDate() + '1' + newVal
                this.$infoToast('生产入库的入库批次自动生成')
            }
        }

        // 获取当前年月日 (年两位) 201010
        getNowFormatDate() {
            const date = new Date();
            const year = String(date.getFullYear());
            let month: string|number = date.getMonth() + 1;
            let strDate: number|string = date.getDate();
            if (Number(month) >= 1 && Number(month) <= 9) {
                month = '0' + String(month);
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            const currentdate = year.substr(2, 2) + month + strDate;
            return currentdate;
        }

        // 提交保存时获取处理数据
        getSavedOrSubmitData(formHeader) {
            const tableDataDto: SendDataForm = {
                deleteDto: [],
                insertDto: [],
                updateDto: []
            };

            this.tableData.forEach((item: CraftList, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        tableDataDto.deleteDto.push(item.id)
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.temTableData[index], item)) {
                        item.kojiOrderNo = formHeader.kojiOrderNo
                        item.orderNo = formHeader.orderNo
                        tableDataDto.updateDto.push(item)
                    }
                } else if (!_.isEqual(this.temTableData[index], item)) {
                        item.kojiOrderNo = formHeader.kojiOrderNo
                        item.orderNo = formHeader.orderNo
                        tableDataDto.insertDto.push(item)
                    }
            })

            return {
                inStorage: tableDataDto.insertDto.length === 0 && tableDataDto.updateDto.length === 0 && tableDataDto.deleteDto.length === 0 ? null : {
                    insertDto: tableDataDto.insertDto,
                    updateDto: tableDataDto.updateDto,
                    deleteDto: tableDataDto.deleteDto,
                    kojiOrderNo: formHeader.kojiOrderNo,
                    orderNo: formHeader.orderNo
                }
            };
        }


        // 初始化数据
        init(formHeader) {

            this.formHeader = formHeader;
            const { kojiOrderNo, orderNo, workShop, orderType, planOutput } = formHeader;
            // 查询蒸面记录
            this.getTableList(kojiOrderNo, orderNo, workShop, orderType, planOutput);
            // 查询审核记录
            this.getAuditList(orderNo);
        }

        // ==== 提交处理汇总 ====== //
        // 提交时字段校验
        ruleSubmit() {
            // /(?:^[1-9]([0-9])?(?:\.[0-9]{1})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9]$)/
            if (!this.potNoNow) {
                this.$warningToast('请选择 "泡豆罐"');
                return false;
            }

            if (!this.tableData[0].inStorageAmount || !this.tableData[0].inStorageBatch) {
                this.$warningToast('请填写"生产入库页签"必填项');
                return false;
            }
            return true;
        }

        // === 查询 汇总 ==== //
        // 查询入库记录
        getTableList(kojiOrderNo, orderNo, workShop, orderType, planOutput) {
            KOJI_API.KOJI_STEAM_INSTORAGE_LIST_API({
                kojiOrderNo,
                orderNo
            }).then(({ data }) => {
                const queryInStorageData = data.data;
                // 查询大豆领用记录计算总量
                KOJI_API.KOJI_MATERIAL_GET_QUERY_API({
                    kojiOrderNo,
                    orderNo,
                    materialType: 'BEAN'
                }).then(({ data: res }) => {
                    let totalNum = 0;
                    res.data && res.data.map(item => {
                        totalNum += Number(item.amount)
                    });
                    if (queryInStorageData && queryInStorageData.length > 0) {
                        this.tableData = [{
                            ...queryInStorageData[0],
                            feBeanMount: totalNum,
                            unit: '千克',
                            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                            changer: getUserNameNumber(),
                            kojiOrderNo,
                            orderNo,
                            workShop,
                            orderType
                        }];
                    } else {
                        this.tableData = [{
                            feBeanMount: totalNum,
                            inStorageAmount: planOutput || '',
                            inStorageBatch: '',
                            unit: '千克',
                            scPotNo: '',
                            remark: '',
                            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                            changer: getUserNameNumber(),
                            kojiOrderNo,
                            orderNo,
                            workShop,
                            orderType
                        }];
                    }

                    this.temTableData = JSON.parse(JSON.stringify(this.tableData))
                })
            });
        }

        // 查询最新审核记录
        getAuditList(orderNo) {
            // AUDIT_API.AUDIT_LOG_LIST_API({ orderNo, verifyType: 'INSTORAGE' }).then(({ data }) => {
            //     this.craftAuditList = data.data;
            // });
            AUDIT_API.STE_AUDIT_LOG_API({ orderNo, splitOrderNo: this.formHeader.kojiOrderNo, verifyType: ['SB_INSTORAGE', 'INSTORAGE'] }).then(({ data }) => {
                this.craftAuditList = data.data;
            });
        }
    }

    interface Craft {
        id?: string;
        items?: CraftList[];
        kojiOrderNo?: string;
        orderNo?: string;
        workShop?: string;
        potSaveDto?: object[];
        relStr?: string;
        sieveStartDate?: string;
        sieveEndDate?: string;
        cleanliness?: string;
        steamFlourMans?: string;
        washStartDate?: string;
        washEndDate?: string;
        steamPacketPressure?: string;
        steamFlourSpeed?: string;
        steamBallNo?: string;
        delFlag?: number;
        orderId?: string;
        factory?: string;
        orderType?: string;
    }
    interface CraftList {
        id?: string;
        kojiOrderNo?: string;
        orderNo?: string;
        sieveBeanBatch?: string;
        sieveBeanSupplier?: string;
        sieveDeviceId?: string;
        sieveDeviceName?: string;
        sieveImpurityAmount?: number | string;
        sieveImpurityType?: string;
        sieveMans?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        delFlag?: number;
        drainEndDate?: string;
        drainMans?: string;
        drainStartDate?: string;
        steepDuration?: string;
        washBeanId?: string;
        waterEndDate?: string;
        waterMans?: string;
        waterStartDate?: string;
        batch?: string;
        supplier?: string;
        relStr?: string;
        flourWindTemp?: string;
        beanWindTempOne?: string;
        beanWindTempTwo?: string;
        mixtureTempOne?: string;
        mixtureTempTwo?: string;
        beanWindFrequency?: string;
        mixtureStart?: string;
        mixtrueEnd?: string;
        addSteamStart?: string;
        addSteamEnd?: string;
        steamPocketPressure?: string;
        turnCount?: string;
        pressureDuration?: string;
        addBeanDate?: string;
        steamBallNo?: string;
        feBeanMount?: number | string;
        inStorageAmount?: number | string;
        inStorageBatch?: string;
        unit?: string;
        scPotNo?: string;
        workShop?: number | string;
        orderType?: number | string;
        processCode?: string;
    }

    interface SieveDeviceList {
        sieveDeviceId?: string;
        sieveDeviceName?: string;
        deviceNo?: string;
        deviceName?: string;
    }

    interface SendDataForm{
        deleteDto: string[];
        insertDto: CraftList[];
        updateDto: CraftList[];
    }
</script>

<style lang="scss" scoped>
    .koji-process-control {
        .stock-form_item_input_suffix {
            margin-right: 6px;
        }
        .cleanMarginBottom {
            margin-bottom: 10px;
        }
        .koji-control-form_select {
            min-width: 200px;
            max-width: 300px;
            padding-left: 8px;
            overflow: hidden;
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            background: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
        }
    }
</style>
