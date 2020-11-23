<template>
    <data-entry
        ref="dataEntry"
        redact-auth="steSemiEdit"
        save-auth="steSemiEdit"
        submit-auth="steSemiSubmit"
        :status-title="'工序状态'"
        :order-status="formHeader.statusName"
        :header-base="headerBase"
        :form-header="formHeader"
        :tabs="tabs"
        :submit-rules="submitRules"
        :saved-datas="savedDatas"
        :submit-datas="submitDatas"
        @success="getOrderList"
    >
        <template slot="1" slot-scope="data">
            <craft-control ref="craftControl" :is-redact="data.isRedact" :form-header="formHeader" />
        </template>
        <template slot="2" slot-scope="data">
            <product-in-storage ref="productInStorage" :pot-no-now="potNoNow" :pot-no-list="potNoList" :is-redact="data.isRedact" :form-header="formHeader" />
        </template>
        <template slot="3" slot-scope="data">
            <koji-exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
        </template>
        <template slot="4" slot-scope="data">
            <koji-text-record ref="textRecord" :is-redact="data.isRedact" />
        </template>
    </data-entry>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';

    import CraftControl from './common/DiscCraftControl.vue'; // import tab 工艺控制
    import ProductInStorage from './common/DiscProductInStorage.vue'; // import tab 生产入库
    import kojiExcRecord from './common/DiscKojiExcRecord.vue'; // import 异常记录
    import kojiTextRecord from './common/DiscKojiTextRecord.vue'; // import 文本记录

    @Component({
        name: 'DiscIndex',
        components: {
            CraftControl,
            ProductInStorage,
            kojiExcRecord,
            kojiTextRecord
        }
    })
    export default class WashBeanIndex extends Vue {
        $refs: {
            dataEntry: HTMLFormElement;
            craftControl: HTMLFormElement; // tab 工艺控制
            productInStorage: HTMLFormElement; // tab 工艺控制
            excRecord: HTMLFormElement; // 异常记录
            textRecord: HTMLFormElement; // 文本记录
        }

        orderIndex=['已同步', '已保存', '待审核', '已审核', '已过账', '已退回', '未录入']
        formHeader: OrderData = {};
        fermentPotNoOptions: OptionObj[] = [];
        classesOptions: object[] = [];

        jumpFromAudit=false // is from audit ?

        headerBase: HeaderBase[] = [
            {
                type: 'p',
                label: '生产车间',
                icon: 'factory-shengchanchejian',
                value: ['workShopName']
            },
            {
                type: 'p',
                label: '曲房编号',
                icon: 'factory-qiyaguanjianhua',
                value: ['kojiHouseName']
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                label: '生产订单',
                icon: 'factory-bianhao',
                value: ['orderNo']
            },
            {
                type: 'p',
                icon: 'factory--meirijihuachanliangpeizhi',
                label: '制曲日期',
                value: ['addKojiDate']
            },
            {
                type: 'select',
                icon: 'factory-riqi1',
                label: '发酵罐/池号',
                value: ['fermentPotNo'],
                disabled: true,
                option: {
                        list: [],
                        label: 'optLabel',
                        value: 'optValue'
                    }
            },
            {
                type: 'tooltip',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员', // 操作人员
                value: ['changer']
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: ['changed']
            }
        ];

        // 当前发酵罐号
        potNoNow: string|number = '';
        potNoList: OptionPotNoList[]=[]


        tabs = [
                {
                    label: '工艺控制',
                    status: '未录入'
                },
                {
                    label: '生产入库',
                    status: '未录入'
                },
                {
                    label: '异常记录'
                },
                {
                    label: '文本记录'
                }
            ]

        @Watch('formHeader.fermentPotNo', { immediate: true, deep: true })
        onChangeValue(newVal: number| string) {
            if (newVal) {
                this.potNoNow = newVal
            }
        }

        // 获取页签状态
        getHouseTag() {
            KOJI_API.KOJI_PAGE_TAG_STATUS_QUERY_API({
                orderNo: this.formHeader.orderNo,
                kojiOrderNo: this.formHeader.kojiOrderNo
            }).then(({ data }) => {
                this.$store.commit('koji/updateHouseTag', data.data);
                this.tabs[0].status = data.data.discCraftName
                this.tabs[1].status = data.data.discInStorageName
                this.$refs.dataEntry.updateTabs();
                this.$set(this.formHeader, 'statusName', this.orderIndex[Math.min(this.orderIndex.indexOf(data.data.discCraftName), this.orderIndex.indexOf(data.data.discInStorageName))])
            })
        }


        submitRules(): Function[] {
            return [this.$refs.craftControl.ruleSubmit, this.$refs.productInStorage.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        mounted() {
            if (typeof this.$route.params.order !== 'undefined') {
                this.jumpFromAudit = true
            }

            // [下拉]获取溶解罐选项
            this.getFermentationHolder()
            // [下拉]获取班次选项
            this.getClassesList()
            // 查询表头
            this.getOrderList()

        }

        // 获取溶解罐下拉选项
        getFermentationHolder() {
            COMMON_API.HOLDER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: '001',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                if (this.headerBase[5].option) {
                    this.headerBase[5].option.list = []
                    data.data.records.forEach(item => {
                        if (this.headerBase[5].option) {
                            this.headerBase[5].option.list.push({ optLabel: item.holderName, optValue: item.holderNo })
                        }
                        this.potNoList.push({ optValue: item.holderNo, optId: item.id })
                    })

                }
            })
        }

        // 获取班次下拉选项
        getClassesList() {
            COMMON_API.DICTQUERY_CLASSLIST_API({}).then(({ data }) => {
                this.classesOptions = data.data;
            });
        }

        // 查询表头
        getOrderList() {
            KOJI_API.KOJI_CRAFT_HEAD_INFO_QUERY_API({
                // id: this.$store.state.koji.orderKojiInfo.id || ''
                id: this.jumpFromAudit ? this.$route.params.order : this.$store.state.koji.orderKojiInfo.id || ''
            }).then(({ data }) => {
                this.formHeader = data.data
                this.getHouseTag();

                this.$set(this.formHeader, 'factoryName', JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort)
                this.$set(this.formHeader, 'textStage', 'YP')

                this.$refs.craftControl.init(this.formHeader);
                this.$refs.productInStorage.init(this.formHeader);
                this.$refs.excRecord.init(this.formHeader, 'YP'); // 洗豆:XD;SC洗豆:SC;蒸豆:ZD;蒸面:ZM;圆盘:YP
                this.$refs.textRecord.init(this.formHeader, 'YP', 'koji'); // 洗豆:XD;SC洗豆:SC;蒸豆:ZD;蒸面:ZM;圆盘:YP
            })
        }

        savedDatas() {
            const craftControlTemp = this.$refs.craftControl.savedData(this.formHeader);
            const productInStorageTemp = this.$refs.productInStorage.savedData(this.formHeader);
            const excRecordTemp = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'YP');
            const textRecordTemp = this.$refs.textRecord.savedData(this.formHeader);

            return KOJI_API.KOJI_DISC_QUERY_SAVE_API({
                discEvaluate: craftControlTemp.discEvaluate,
                discGuard: craftControlTemp.discGuard,
                discIn: craftControlTemp.discIn,
                discOut: craftControlTemp.discOut,
                discTurn1: craftControlTemp.discTurn1,
                discTurn2: craftControlTemp.discTurn2,
                discGuardException: craftControlTemp.discGuardException, // 看曲记录异常情况
                discTurnException: craftControlTemp.discTurnException, // 翻曲记录异常情况
                exception: { // 异常记录
                    insertDatas: excRecordTemp.insertDto,
                    removeIds: excRecordTemp.ids,
                    updateDatas: excRecordTemp.updateDto
                }, // 异常记录
                fermentPotId: this.formHeader.fermentPotId, // 发酵罐Id
                fermentPotNo: this.formHeader.fermentPotNo, // 发酵罐号
                inStorage: productInStorageTemp,
                kojiOrderNo: this.formHeader.kojiOrderNo, // 曲房单号
                orderNo: this.formHeader.orderNo, // 订单号
                text: textRecordTemp
            })
        }

        submitDatas() {
            if (this.$refs.craftControl.ruleSubmit() && this.$refs.productInStorage.ruleSubmit() && this.$refs.excRecord.ruleSubmit()) {
                const craftControlTemp = this.$refs.craftControl.savedData(this.formHeader);
                const productInStorageTemp = this.$refs.productInStorage.savedData(this.formHeader);
                const excRecordTemp = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'YP');
                const textRecordTemp = this.$refs.textRecord.savedData(this.formHeader);

                return KOJI_API.KOJI_DISC_QUERY_SUBMIT_API({
                    discEvaluate: craftControlTemp.discEvaluate,
                    discGuard: craftControlTemp.discGuard,
                    discIn: craftControlTemp.discIn,
                    discOut: craftControlTemp.discOut,
                    discTurn1: craftControlTemp.discTurn1,
                    discTurn2: craftControlTemp.discTurn2,
                    discGuardException: craftControlTemp.discGuardException, // 看曲记录异常情况
                    discTurnException: craftControlTemp.discTurnException, // 翻曲记录异常情况
                    exception: { // 异常记录
                        insertDatas: excRecordTemp.insertDto,
                        removeIds: excRecordTemp.ids,
                        updateDatas: excRecordTemp.updateDto
                    }, // 异常记录
                    fermentPotId: this.formHeader.fermentPotId, // 发酵罐Id
                    fermentPotNo: this.formHeader.fermentPotNo, // 发酵罐号
                    inStorage: productInStorageTemp,
                    kojiOrderNo: this.formHeader.kojiOrderNo, // 曲房单号
                    orderNo: this.formHeader.orderNo, // 订单号
                    text: textRecordTemp
                })
            }
        }
    }


    interface OptionObj {
        optLabel?: string;
        optValue?: string;
        optId?: string;
    }
    interface OptionPotNoList {
        optValue?: string;
        optId?: string;
    }

    interface HeaderBaseOption{
        list: OptionObj[];
        label: string;
        value: string;
    }

    interface HeaderBase{
        type: string;
        label: string;
        icon: string;
        value: string[];
        disabled?: boolean;
        option?: HeaderBaseOption;
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
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
        steTagPot?: StatusObj;
        fermentPotNo?: string;
        fermentPotId?: string;
        kojiOrderNo?: string;
    }
</script>
