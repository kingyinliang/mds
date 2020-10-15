<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-03 18:13:58
 * @LastEditors: Telliex
 * @LastEditTime: 2020-10-14 21:53:13
 * @Describe 弹窗式新增
-->
<template lang="pug">
div
    mds-card(:title="cardTitle")
        template(slot="titleBtn")
            el-button(type="primary" size="small" style="float: right; margin-bottom: 5px;" :disabled="!isRedact" @click="btnAddOrEditDataRow()") 新增
        el-table.newTable.semi__pot_table(header-row-class-name="tableHead"  :data="currentFormDataGroup" size="small" :row-class-name="rowDelFlag" border="" tooltip-effect="dark" style="min-height: 90px;" @cell-dblclick="btnAddOrEditDataRow")
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
                        template(v-for="(val,indexs) in item.content" ) {{ scope.row[val] | itemValue(item.wrapper) }}
                el-table-column(
                    v-if="item.type==='control'"
                    :width="item.width"
                    :label="item.label"
                    fixed="right")
                    template(slot-scope="scope")
                        el-button(:class="val.btn" :icon="val.icon" v-for="(val,index) in item.content" :key="index" type="text" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)") {{val.buttonName}}
    audit-log(:table-data="semiAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true")
    in-storage-dialog(ref="inStorageDialogForAdd" width="40%" title="新增入库" @conformData="conformDataFromAdd")
    in-storage-dialog(ref="inStorageDialogForEdit" width="40%" title="编辑入库")
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import InStorageDialog from './InStorageDialog.vue';
    import _ from 'lodash';

    @Component({
        components: {
            InStorageDialog
        },
        filters: {
            itemValue(value: string, target: object) {
                if (target) {
                    return target[value]
                }
                return value

            }
        }
    })
    export default class SemiReceive extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact
        @Prop({ default: '' }) cardTitle: string;
        @Prop({ default: () => { return [] } }) tableData: object[];
        @Prop({ default: () => { return [] } }) pkgWorkShopList: object[];


        $refs: {
            inStorageDialogForAdd: HTMLFormElement;
            inStorageDialogForEdit: HTMLFormElement;
        }

        semiAudit = [];
        currentFormDataGroup: CurrentDataTable[] = [];
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制
        orderData: OptionsInList={}

        init(data, obj) {
            this.orderData = JSON.parse(JSON.stringify(obj))
            this.currentFormDataGroup = JSON.parse(JSON.stringify(data))
            this.orgFormDataGroup = JSON.parse(JSON.stringify(data))
        }

        conformDataFromAdd(item) {
            this.currentFormDataGroup.push(JSON.parse(JSON.stringify(item)))
        }


        ruleSubmit() {
            // if (!this.craftInfo.feedStartDate || !this.craftInfo.feeEndDate || !this.craftInfo.riseStartDate || !this.craftInfo.riseEndDate) {
            //     this.$warningToast('请填写工艺控制页签时间必填项');
            //     return false;
            // }
            // if (this.craftTable.filter(it => it.delFlag !== 1).length === 0) {
            //     this.$warningToast('请录入工艺控制页签杀菌时间及温度数据');
            //     return false;
            // }

            // for (const item of this.craftTable.filter(it => it.delFlag !== 1)) {
            //     if (!item.controlType || !item.controlStage) {
            //         this.$warningToast('请填写工艺控制页签杀菌时间及温度类型、阶段');
            //         return false;
            //     }
            //     if ((item.controlStage === 'START' || item.controlStage === 'END' || item.controlStage === 'DISCHARGE_START' || item.controlStage === 'DISCHARGE_END') && !item.recordDate) {
            //         this.$warningToast('请填写工艺控制页签杀菌时间及温度下记录时间');
            //         return false;
            //     }
            // }
            return true;
        }

        btnAddOrEditDataRow(val) {
            if (this.isRedact === true) {
                if (val) {
                    this.$refs.inStorageDialogForEdit.init(this.orderData, this.pkgWorkShopList, val);
                    return false
                }

                this.$refs.inStorageDialogForAdd.init(this.orderData, this.pkgWorkShopList);
            }


        }

        getSavedOrSubmitData() {

        const ids: string[] = [];
        const steControlInsertDto: CurrentDataTable[] = [];
        const steControlUpdateDto: CurrentDataTable[] = [];
        const tempCurrentFormDataGroup = JSON.parse(JSON.stringify(this.currentFormDataGroup))

        tempCurrentFormDataGroup.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    ids.push(item.id)
                }
            } else if (item.id) {
                if (!_.isEqual(this.orgFormDataGroup[index], item)) {
                    steControlUpdateDto.push(item)
                }
            } else {
                steControlInsertDto.push(item)
            }
        })
        // 将 data 清空
        this.currentFormDataGroup = [];
        this.orgFormDataGroup = [];
        return {
            steControlInsertDto,
            steControlUpdateDto,
            ids
        }
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
