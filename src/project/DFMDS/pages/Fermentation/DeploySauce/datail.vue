<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.mixSauceStatusName"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            @success="getOrderList"
        >
            <template slot="contentBox" slot-scope="data">
                <deploy-sauce-table ref="tables" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import DeploySauceTable from './DeploySauceTable.vue'
    import { FER_API } from 'common/api/api';

    @Component({
        name: 'DeploySauceDedail',
        components: {
            DeploySauceTable
        }
    })
    export default class DeploySauceDedail extends Vue {
        $refs: {
            tables: HTMLFormElement;
        }

        mixPotList = []

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '调酱单号',
                value: 'mixSauceNo'
            },
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '开罐类型',
                value: 'ferOpen.openTypeName'
            },
            // {
            //     type: 'select',
            //     icon: 'factory-riqi',
            //     label: '调酱容器',
            //     value: 'mixPotId',
            //     disabled: true,
            //     option: {
            //         list: [],
            //         label: 'holderName',
            //         value: 'id'
            //     }
            // },
            {
                type: 'p',
                icon: 'factory-riqi',
                label: '调酱容器',
                value: 'mixPotName'
            },
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '状态',
                value: 'mixSauceStatusName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '发酵物料',
                value: ['ferOpen.applyMaterialCode', 'ferOpen.applyMaterialName']
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '调后物料',
                value: ['mixMaterialCode', 'mixMaterialName']
            },
            {
                type: 'orgSelectUser',
                required: true,
                icon: 'factory-xianchangrenyuan',
                label: '调酱操作人',
                value: 'user'
            },
            {
                type: 'date-time',
                required: true,
                icon: 'factory-riqi1',
                label: '调酱时间',
                value: 'mixDate'
            },
            {
                type: 'tooltip',
                icon: 'factory-xianchangrenyuan',
                label: '操作人员',
                value: 'changer'
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '操作时间',
                value: 'changed'
            },
            {
                type: 'radio',
                icon: 'factory-bianhao',
                label: '生产订单',
                value: 'orderFlag',
                option: {
                    list: [
                        { label: '是', value: 'Y' },
                        { label: '否', value: 'N' }
                    ],
                    label: 'label',
                    value: 'value'
                }
            }
        ]

        formHeader: HeadObj = {
            user: [],
            mixMans: '',
            ferOpen: {
                openTypeName: '11'
            }
        }

        mounted() {
            this.getOrderList()
        }

        getOrderList() {
            // COMMON_API.HOLDER_DROPDOWN_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     holderType: ['001', '028'],
            //     holderStatus: 'E'
            // }).then(({ data }) => {
            //     this.headerBase[2]['option'] = {
            //         list: data.data || [],
            //         label: 'holderName',
            //         value: 'id'
            //     }
            // })
            FER_API.FER_DEPLOY_SAUCE_GET_API({
                id: this.$store.state.fer.deploySauceObj.id
            }).then(({ data }) => {
                this.formHeader = data.data
                if (!this.formHeader.orderFlag && this.formHeader.ferOpen.openType === 'MANY') {
                    this.formHeader.orderFlag = 'Y'
                }
                this.formHeader.user = this.formHeader.mixMans.length > 0 ? this.formHeader.mixMans.split(',') : []
                this.$refs.tables.init(this.formHeader)
                this.formHeader.ferOpen['openType'] === 'MANY' ? this.headerBase[10]['disabled'] = true : this.headerBase[10]['disabled'] = false
            })
        }

        savedDatas() {
            const { ferMixFermentorUpdateDtoList, ferMixFermentorSaveDtoList, pickledMixMaterialList, receiveMixMaterialList, sauceMixMaterialList, materialRemoveIds } = this.$refs.tables.saveData()
            this.formHeader.pickledMixMaterialList = pickledMixMaterialList
            this.formHeader.receiveMixMaterialList = receiveMixMaterialList
            this.formHeader.sauceMixMaterialList = sauceMixMaterialList
            this.formHeader.materialRemoveIds = materialRemoveIds
            this.formHeader.ferMixFermentorUpdateDtoList = ferMixFermentorUpdateDtoList
            this.formHeader.ferMixFermentorSaveDtoList = ferMixFermentorSaveDtoList
            this.formHeader.mixMans = this.formHeader.user.length ? this.formHeader.user.join(',') : ''
            return FER_API.FER_DEPLOY_SAUCE_DETAIL_SAVE_API(this.formHeader)
        }

        submitDatas() {
            const { ferMixFermentorUpdateDtoList, ferMixFermentorSaveDtoList, pickledMixMaterialList, receiveMixMaterialList, sauceMixMaterialList, materialRemoveIds } = this.$refs.tables.saveData()
            this.formHeader.pickledMixMaterialList = pickledMixMaterialList
            this.formHeader.receiveMixMaterialList = receiveMixMaterialList
            this.formHeader.sauceMixMaterialList = sauceMixMaterialList
            this.formHeader.materialRemoveIds = materialRemoveIds
            this.formHeader.ferMixFermentorUpdateDtoList = ferMixFermentorUpdateDtoList
            this.formHeader.ferMixFermentorSaveDtoList = ferMixFermentorSaveDtoList
            this.formHeader.mixMans = this.formHeader.user.length ? this.formHeader.user.join(',') : ''
            return FER_API.FER_DEPLOY_SAUCE_DETAIL_SUBMIT_API(this.formHeader)
        }
    }
    interface HeadObj {
        openPotNo?: string;
        orderFlag?: string;
        ferMixFermentorUpdateDtoList?: ListObj[];
        ferMixFermentorSaveDtoList?: ListObj[];
        pickledMixMaterialList?: ListObj[];
        receiveMixMaterialList?: ListObj[];
        sauceMixMaterialList?: ListObj[];
        materialRemoveIds?: string[];
        user: string[];
        mixMans: string;
        ferOpen: OpenObj;
    }
    interface OpenObj{
        openTypeName?: string;
        openType?: string;
    }
    interface ListObj {
        id?: string;
    }
</script>

<style scoped>

</style>
