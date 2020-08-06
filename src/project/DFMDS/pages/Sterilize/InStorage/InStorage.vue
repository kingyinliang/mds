<template lang="pug">
div
    mds-card(:title="cardTitle")
        template(slot="titleBtn")
            el-button(type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="btnAddOrEditDataRow()") 新增
        el-table.newTable.semi__pot_table(header-row-class-name="tableHead" max-height="400px" :data="currentFormDataGroup" size="small" :row-class-name="rowDelFlag" border="" tooltip-effect="dark" style="min-height: 90px;" @cell-dblclick="btnAddOrEditDataRow")
            template(v-for="(item,index) in tableData")
                el-table-column(
                    v-if="item.type==='index'"
                    type="index"
                    :label="item.label"
                    :width="item.width"
                    align="center"
                    fixed)
                el-table-column(
                    v-if="item.type==='string'"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.minWidth"
                    :show-overflow-tooltip="true"
                    )
                    template(slot-scope="scope")
                        template(v-for="(val) in item.content") {{ scope.row[val] }}

                el-table-column(
                    v-if="item.type==='control'"
                    :width="item.width"
                    :label="item.label"
                    fixed="right")
                    template(slot-scope="scope")
                        el-button(v-for="(val) in item.content" type="text" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)") {{val.buttonName}}
    audit-log(:table-data="semiAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true")
    in-storage-dialog(ref="inStorageDialogForAdd" width="40%" title="新增入库" @conformData="conformDataFromAdd")
    in-storage-dialog(ref="inStorageDialogForEdit" width="40%" title="编辑入库")
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    // import { STE_API } from 'common/api/api';
    // import { dataEntryData } from 'utils/utils';
    import InStorageDialog from './InStorageDialog.vue';

    @Component({
        components: {
            InStorageDialog
        }
    })
    export default class SemiReceive extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact
        @Prop({ default: '' }) cardTitle: string;
        @Prop({ default: [] }) tableData: object[];
        @Prop({ default: [] }) pkgWorkShopList: object[];


        $refs: {
            inStorageDialogForAdd: HTMLFormElement;
            inStorageDialogForEdit: HTMLFormElement;
        }

        semiAudit = [];
        currentFormDataGroup: CurrentDataTable[] = [];
        orderData: OptionsInList={}

        init(data, obj) {
            this.orderData = JSON.parse(JSON.stringify(obj))
            this.currentFormDataGroup = JSON.parse(JSON.stringify(data))
        }

        conformDataFromAdd(item) {
            console.log('item')
            console.log(item)
            this.currentFormDataGroup.push(JSON.parse(JSON.stringify(item)))
        }


        savedData() {
            const delIds = [];
            const insertData = [];
            const updateData = [];


            return {
                orderNo: this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo,
                potOrderNo: this.$store.state.sterilize.SemiReceive.potOrderMap.potOrderNo,
                delIds,
                insertData,
                updateData
            }
        }

        btnAddOrEditDataRow(val) {

            console.log(val)
            if (val) {
                this.$refs.inStorageDialogForEdit.init(this.orderData, this.pkgWorkShopList, val);
                return false
            }

            this.$refs.inStorageDialogForAdd.init(this.orderData, this.pkgWorkShopList);

        }

        receive() {
            this.$nextTick(() => {
                // this.$refs.SemiReceiveDialog.init()
            });
        }

        dataPush() {
        //
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
        packageLineName?: string;
        packageOrderNo?: string;
        productDate?: string;
        workShop?: string;
    }

    interface OptionsInList{
        changed?: string;
        changer?: string;
        // countMan: null;
        // countOutput: null;
        // countOutputUnit: '';
        // deviceTime: null;
        // dispatchMan: 'S01';
        // exceptionDateCount: null;
        // factory: '4F8122C62C6D6C6999';
        // factoryName: '(8300)济南欣昌';
        // germs: null;
        // id: '494837770712338449';
        materialCode?: string;
        materialName?: string;
        // operator: '';
        // operatorDate: null;
        // orderEndDate: '2020-08-03';
        orderNo?: string;
        // orderStartDate: '2020-08-03';
        orderStatus?: string;
        orderStatusName?: string;
        // orderType: '8330';
        // outputUnit: 'KG';
        // outputUnitName: '千克';
        // planOutput: 10000;
        // productDate: '2020-08-03';
        // productLine: '474262750789451776';
        // productLineName: '杀菌一线';
        // readyTime: null;
        // realInAmount: null;
        // realOutput: null;
        // userTime: null;
        workShop?: string;
        workShopName?: string;
    }
</script>

<style lang="scss" scoped>

</style>
