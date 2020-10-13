<template>
    <div>
        <data-entry
            ref="dataEntry"
            redact-auth="steSemiEdit"
            save-auth="steSemiEdit"
            submit-auth="steSemiSubmit"
            :order-status="formHeader.statusName"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="currentTabs"
            :submit-rules="submitRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            @success="getOrderList"
        >
            <template slot="1" slot-scope="data">
                <flour-material-apply ref="flourMaterialApply" :is-redact="data.isRedact" :sieve-total-num="sieveTotalNum" @setMaterialTable="setMaterialTable" />
            </template>
            <template slot="2" slot-scope="data">
                <flour-material-craft ref="flourMaterialCraft" :is-redact="data.isRedact" :set-material-table-data="setMaterialTableData" @changeSieveTotalNum="changeSieveTotalNum" />
            </template>
            <template slot="3" slot-scope="data">
                <koji-exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
            </template>
            <template slot="4" slot-scope="data">
                <koji-text-record ref="textRecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { KOJI_API } from 'common/api/api';

    import FlourMaterialApply from './common/FlourMaterialApply.vue';
    import FlourMaterialCraft from './common/FlourMaterialCraft.vue';
    import KojiExcRecord from './common/KojiExcRecord.vue';
    import KojiTextRecord from './common/KojiTextRecord.vue';

    @Component({
        name: 'SteamedFlourIndex',
        components: {
            FlourMaterialApply,
            FlourMaterialCraft,
            KojiExcRecord,
            KojiTextRecord
        }
    })
    export default class SteamedFlourIndex extends Vue {
        $refs: {
            flourMaterialApply: HTMLFormElement;
            flourMaterialCraft: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        formHeader: OrderData = {};

        // 杂质数量
        sieveTotalNum = 0;
        // 物料领用记录 == 批次信息
        setMaterialTableData = [];

        changeSieveTotalNum(num) {
            this.sieveTotalNum = num;
        }

        setMaterialTable(data) {
            this.setMaterialTableData = data
        }

        headerBase = [
            {
                type: 'p',
                label: '生产车间',
                icon: 'factory-shengchanchejian',
                value: 'workShopName'
            },
            {
                type: 'p',
                label: '曲房编号',
                icon: 'factory-qiyaguanjianhua',
                value: ['kojiHouseName', 'kojiHouseNo']
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialName', 'materialCode']
            },
            {
                type: 'p',
                label: '生产订单',
                icon: 'factory-bianhao',
                value: 'orderNo'
            },
            {
                type: 'p',
                label: '制曲日期',
                icon: 'factory--meirijihuachanliangpeizhi',
                value: 'addKojiDate'
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '发酵罐号',
                value: 'fermentPotName'
            },
            {
                type: 'tooltip',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员', // 操作人员
                value: 'changer'
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        get currentTabs() {
            const { steamFlourMaterialName, steamFlourCraftName } = this.$store.state.koji.houseTagInfo;
            return [
                {
                    label: '物料领用',
                    status: steamFlourMaterialName || ''
                },
                {
                    label: '工艺控制',
                    status: steamFlourCraftName || ''
                },
                {
                    label: '异常记录'
                },
                {
                    label: '文本记录'
                }
            ]
        }

        // 获取页签状态
        getHouseTag() {
            KOJI_API.KOJI_PAGE_TAG_STATUS_QUERY_API({
                orderNo: this.formHeader.orderNo,
                kojiOrderNo: this.formHeader.kojiOrderNo
            }).then(({ data }) => {
                this.$store.commit('koji/updateHouseTag', data.data);
            })
        }

        submitRules(): Function[] {
            return [this.$refs.flourMaterialCraft.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        mounted() {
            this.getOrderList()
        }

        // 查询表头
        getOrderList() {
            KOJI_API.KOJI_CRAFT_HEAD_INFO_QUERY_API({
                id: this.$store.state.koji.orderKojiInfo.id || ''
            }).then(({ data }) => {
                this.formHeader = data.data;
                // 获取页签状态
                this.getHouseTag();
                this.formHeader.textStage = 'ZM';
                this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;
                this.$refs.flourMaterialApply.init(this.formHeader);
                this.$refs.flourMaterialCraft.init(this.formHeader);
                this.$refs.excRecord.init(this.formHeader, 'ZM');
                this.$refs.textRecord.init(this.formHeader, 'koji');
            })
        }

        savedDatas() {
            const steSemi = this.$refs.flourMaterialCraft.getSavedOrSubmitData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'ZM');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');
            return KOJI_API.KOJI_CRAFT_STEAM_SAVE_API({
                ...steSemi,
                exception: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                text: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo,
                kojiHouseNo: this.formHeader.kojiHouseNo
            })
        }

        submitDatas() {
            const materialTableList = this.$refs.flourMaterialApply.getSavedOrSubmitData(this.formHeader);
            const steSemi = this.$refs.flourMaterialCraft.getSavedOrSubmitData(this.formHeader, 'submit');
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'ZM');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');
            return KOJI_API.KOJI_CRAFT_STEAM_SUBMIT_API({
                ...steSemi,
                material: {
                    deleteDto: [],
                    insertDto: [],
                    updateDto: materialTableList
                },
                exception: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                text: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo,
                kojiHouseNo: this.formHeader.kojiHouseNo
            })
        }
    }
    interface TabsObj {
        label?: string;
        status?: string;
    }
    interface StatusObj {
        semiMaterialStatus?: string;
    }
    interface OrderData {
        orderNo?: string;
        kojiHouseNo?: string;
        kojiOrderNo?: string;
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
        steTagPot?: StatusObj;
    }
</script>

