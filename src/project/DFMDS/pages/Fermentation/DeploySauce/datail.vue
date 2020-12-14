<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            :header-base="headerBase"
            :form-header="formHeader"
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
            {
                type: 'select',
                icon: 'factory-riqi',
                label: '调酱容器',
                value: 'mixPotName',
                disabled: true,
                option: {
                    list: [],
                    label: 'holderName',
                    value: 'holderId'
                }
            },
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '状态',
                value: 'workShopName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '发酵物料',
                value: ['mixMaterialCode', 'mixMaterialName']
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '调后物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'orgSelectUser',
                icon: 'factory-xianchangrenyuan',
                label: '调酱操作人',
                value: 'user'
            },
            {
                type: 'date-picker',
                icon: 'factory-riqi1',
                label: '调酱时间',
                value: 'productDate'
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
                value: 'order',
                option: {
                    list: [
                        { label: '是', value: 1 },
                        { label: '否', value: 2 }
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
            this.init()
        }

        init() {
            FER_API.FER_DEPLOY_SAUCE_GET_API({
                id: this.$store.state.fer.deploySauceObj.id
            }).then(({ data }) => {
                this.formHeader = data.data
                this.formHeader.user = this.formHeader.mixMans.split('.')
                this.$refs.tables.init(this.formHeader)
            })
        }
    }
    interface HeadObj {
        openPotNo?: string;
        user?: string[];
        mixMans: string;
        ferOpen?: OpenObj;
    }
    interface OpenObj{
        openTypeName?: string;
    }
</script>

<style scoped>

</style>
