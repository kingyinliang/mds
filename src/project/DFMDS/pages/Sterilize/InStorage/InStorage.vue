<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-03 18:13:58
 * @LastEditors: Telliex
 * @LastEditTime: 2020-11-26 10:42:18
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
                        template(v-for="(val,indexs) in item.content" ) {{ scope.row[val] | itemValue(item.wrapper) }} {{ }}
                el-table-column(
                    v-if="item.type==='control'"
                    :width="item.width"
                    :label="item.label"
                    fixed="right")
                    template(slot-scope="scope")
                        el-button(:class="val.btn" :icon="val.icon" v-for="(val,index) in item.content" :key="index" type="text" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)") {{val.buttonName}}
    audit-log(:table-data="semiAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true")
    in-storage-dialog(ref="inStorageDialogForAdd" width="40%" title="新增入库" @conformData="conformDataFromAdd")
    in-storage-dialog(ref="inStorageDialogForEdit" width="40%" title="编辑入库" @conformData="conformDataFromAdd")
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
                if (typeof target !== 'undefined') {
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
            if (item.id) {
                this.currentFormDataGroup.forEach((element, index) => {
                    if (element.id === item.id) {
                        this.$set(this.currentFormDataGroup, index, item)
                    }
                })
            } else {
                this.currentFormDataGroup.push(item)
            }

        }


        ruleSubmit() {
            // 无必填,不需验证
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
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
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
        materialCode?: string;
        materialName?: string;
        orderNo?: string;
        orderStatus?: string;
        orderStatusName?: string;
        workShop?: string;
        workShopName?: string;
    }
</script>

<style lang="scss" scoped>

</style>
