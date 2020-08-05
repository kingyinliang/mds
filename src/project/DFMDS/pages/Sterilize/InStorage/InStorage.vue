<template>
    <div>
        <mds-card :title="cardTitle">
            <template slot="titleBtn">
                <el-button type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="btnAddOrEditDataRow">
                    新增
                </el-button>
            </template>

            <el-table header-row-class-name="tableHead" class="newTable semi__pot_table" max-height="400px" :data="currentFormDataGroup" size="small" :row-class-name="rowDelFlag" border tooltip-effect="dark" style="min-height: 90px;" @cell-dblclick="btnAddOrEditDataRow">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <template v-for="(item,index) in tableData">
                    <el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width" :min-width="item.minWidth" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.content }}
                        </template>
                    </el-table-column>
                </template>

                <el-table-column prop="packageLine" label="包装产线" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.packageLine }}
                    </template>
                </el-table-column>
                <el-table-column prop="packageOrderNo" label="包装订单" width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.packageOrderNo }}
                    </template>
                </el-table-column>
                <el-table-column prop="material" label="入库物料" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode }} {{ scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column prop="materialUnit" label="单位" width="70" :show-overflow-tooltip="true" />
                <el-table-column prop="inStorageAmount" label="入库数量" width="100" :show-overflow-tooltip="true" />
                <el-table-column prop="inStorageBatch" label="入库批次" width="100" :show-overflow-tooltip="true" />
                <el-table-column prop="remark" label="备注" width="100" :show-overflow-tooltip="true" />
                <el-table-column prop="changer" label="操作人" width="140" />
                <el-table-column prop="changed" label="操作时间" width="180" />
                <el-table-column width="70" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="semiAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <in-storage-dialog ref="inStorageDialogForAdd" width="40%" title="新增入库" />
        <in-storage-dialog ref="inStorageDialogForEdit" width="40%" title="编辑入库" />
        <!-- v-if="isShowInStorageDialog" -->
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { STE_API } from 'common/api/api';
    import { dataEntryData } from 'utils/utils';
    import InStorageDialog from './InStorageDialog.vue';

    @Component({
        components: {
            InStorageDialog
        }
    })
    export default class SemiReceive extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: '' }) cardTitle: string;
        @Prop({ default: [] }) tableData: object[];

        $refs: {
            inStorageDialogForAdd: HTMLFormElement;
            inStorageDialogForEdit: HTMLFormElement;
        }

        semiAudit = [];
        currentFormDataGroup: CurrentDataTable[] = [];
        orgSemiTable: SemiObj[] = [];
        visible=false
        isShowInStorageDialog=false

        init(formHeader) {
            STE_API.STE_SEMI_LIST_API({
                orderNo: formHeader.orderNo,
                potOrderNo: formHeader.potOrderNo
            }).then(({ data }) => {
                this.currentFormDataGroup = data.data;
                this.orgSemiTable = data.data;
            })
        }

        savedData(formHeader) {
            const delIds = [];
            const insertData = [];
            const updateData = [];

            dataEntryData(formHeader, this.currentFormDataGroup, this.orgSemiTable, delIds, insertData, updateData);

            return {
                orderNo: this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo,
                potOrderNo: this.$store.state.sterilize.SemiReceive.potOrderMap.potOrderNo,
                delIds,
                insertData,
                updateData
            }
        }

        btnAddOrEditDataRow(val) {

            if (val) {
                this.$refs.inStorageDialogForEdit.init();
                return false
            }

            this.$refs.inStorageDialogForAdd.init();

        }

        receive() {
            this.visible = true;
            this.$nextTick(() => {
                // this.$refs.SemiReceiveDialog.init()
            });
        }

        dataPush(data: SemiObj) {
            this.visible = false;
            this.currentFormDataGroup.push(data); //测试
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
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
        id?: string;
        orderId?: string;
        factory?: string;
        orderNo?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
    }

    interface CurrentDataTable{
        changed?: string;
        changer?: string;
        checkStatus?: string;
        id?: string;
        inStorageAmount?: number;
        inStorageBatch?: string;
        inStoragePot?: number;
        materialCode?: string;
        materialName?: string;
        materialUnit?: string;
        materialUnitName?: string;
        normalFlag?: string;
        orderId?: string;
        orderNo?: string;
        packageLine?: string;
        packageOrderNo?: string;
        productDate?: string;
        workShop?: string;
    }
</script>

<style lang="scss" scoped>

</style>
