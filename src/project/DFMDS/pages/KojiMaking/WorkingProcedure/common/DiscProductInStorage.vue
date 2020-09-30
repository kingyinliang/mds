<template>
    <div>
        <mds-card :title="'生产入库'" :name="'productInStore'">
            <el-form ref="ruleForm" :model="ruleForm" class="ruleForm">
                <el-table header-row-class-name="tableHead" class="newTable" :data="currentFormDataGroup" :row-class-name="rowDelFlag" border tooltip-effect="dark" style="width: 100%; min-height: 90px;">
                    <el-table-column type="index" label="序号" width="50" fixed="left" align="center" />
                    <el-table-column label="大豆量" prop="beanAmount" width="210">
                        <template slot="header">
                            <span class="notNull">* </span>大豆量
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.beanAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="面粉量" prop="flourAmount" width="210">
                        <template slot="header">
                            <span class="notNull">* </span>面粉量
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.flourAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="菌种量" prop="strainAmount" width="210">
                        <template slot="header">
                            <span class="notNull">* </span>菌种量
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.strainAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入库数量" prop="inStorageAmount" width="210">
                        <template slot="header">
                            <span class="notNull">* </span>入库数量
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="inStorageAmount">
                                <el-input v-model.trim="scope.row.inStorageAmount" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="入库批次" prop="inStorageBatch" width="210">
                        <template slot="header">
                            <span class="notNull">* </span>入库批次
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="inStorageBatch">
                                <el-input v-model.trim="scope.row.inStorageBatch" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column label="单位" prop="unit" width="210">
                        <template slot="header">
                            <span class="notNull">* </span>单位
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.unit }}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" width="100">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="changer" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.changer }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" prop="changed" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.changed }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </mds-card>
        <audit-log :table-data="currentAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { KOJI_API, AUDIT_API } from 'common/api/api';
    // import { dateFormat, getUserNameNumber, dataEntryData } from 'utils/utils';
    // import _ from 'lodash';

    @Component({
        name: 'DiscProductInStorage',
        components: {
        }
    })
    export default class ProductInStore extends Vue {
        $refs: {
            ruleForm: HTMLFormElement;
        }

        @Prop({ type: Object, default: () => { return {} } }) formHeader: object;
        @Prop({ type: Boolean, default: false }) isRedact;
        @Prop({ type: String, default: '' }) status;

        targetOrderObj: OrderObject={}
        currentAudit = [];

        // 常有变数
        currentFormDataGroup: CurrentDataTable[] = [] // 主 data
        // orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制


        dataRules= {
            inStorageAmount: [
                { required: true, message: '请输入数量', trigger: 'blur' }
            ],
            inStorageBatch: [
                { required: true, message: '请输入', trigger: 'blur' }
            ]
        }

        mounted() {
            this.targetOrderObj = this.$store.state.koji.orderKojiInfo
            // 生产入库
            this.getKojiStatus()
        }

        getKojiStatus() {
            KOJI_API.KOJI_DISC_QUERY_INSTORAGE_API({
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.currentFormDataGroup = []
                if (data.data) {
                    this.currentFormDataGroup = data.data
                }
            });
            // this.currentAudit = await this.getAudit(formHeader, 'INSTORAGE');
        }

        async getAudit(formHeader, verifyType) {
            const result = await AUDIT_API.AUDIT_LOG_LIST_API({
                orderNo: formHeader.orderNo,
                verifyType: verifyType
            })
            return result.data.data
        }

        // 提交时跑校验
        ruleSubmit() {
            // if (this.currentFormDataGroup.filter(it => it.delFlag !== 1).length === 0) {
            //     this.$warningToast('请录入生产入库');
            //     return false
            // }
            for (const item of this.currentFormDataGroup) {
                if (!item.inStorageAmount || !item.inStorageBatch) {
                    this.$warningToast('请填写生产入库必填项');
                    return false
                }
            }
            return true
        }


        savedData() {
            // const instorageDelete = [];
            // const instorageInsert = [];
            // const instorageUpdate = [];

            // dataEntryData(formHeader, this.currentFormDataGroup, this.orgFormDataGroup, instorageDelete, instorageInsert, instorageUpdate);

            // return {
            //     countOutput: this.computedTotal,
            //     counOutputUnit: this.unitOptions[0].key,
            //     instorageDelete,
            //     instorageInsert,
            //     instorageUpdate
            // }
        }


    }

interface CurrentDataTable{
    beanAmount?: string;
    changed?: string;
    changer?: string;
    flourAmount?: string;
    id?: string;
    inStorageAmount?: number;
    inStorageBatch?: string;
    kojiOrderNo?: string;
    orderNo?: string;
    remark?: string;
    strainAmount?: string;
    unit?: string;
    unitName?: string;
}

interface OrderObject{
    orderNoTemp?: string;
    statusName?: string;
    addKojiDate?: string;
    changed?: string;
    changer?: string;
    fermentPotId?: string;
    fermentPotNo?: string;
    id?: string;
    kojiDuration?: string;
    kojiEndTime?: string;
    kojiHouseId?: string;
    kojiHouseNo?: string;
    kojiOrderNo?: string;
    kojiStartTime?: string;
    materialCode?: string;
    materialName?: string;
    orderId?: string;
    orderNo?: string;
    orderType?: string;
    outKojiDate?: string;
    outputUnit?: string;
    outputUnitName?: string;
    planOutput?: number;
    productDate?: string;
    status?: string;
    workShop?: string;
    workShopName?: string;
}
</script>
<style scoped>

.ruleForm >>> .el-form-item__content {
    line-height: normal;
}
</style>
<style lang="scss" scoped>
.solerow {
    margin: 5px 0;
    line-height: 33px;
    div {
        float: left;
    }
    .input_bottom {
        margin-right: 50px;
    }
}
</style>
