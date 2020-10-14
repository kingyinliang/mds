<template>
    <data-entry
        ref="dataEntry"
        redact-auth="steSemiEdit"
        save-auth="steSemiEdit"
        submit-auth="steSemiSubmit"
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
            <craft-control ref="craftControl" :is-redact="data.isRedact" :target-obj="formHeader" />
        </template>
        <template slot="2" slot-scope="data">
            <product-in-storage ref="productInStorage" :is-redact="data.isRedact" :target-obj="formHeader" />
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
    import { Vue, Component } from 'vue-property-decorator';
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
            craftControl: HTMLFormElement; // tab 工艺控制
            productInStorage: HTMLFormElement; // tab 工艺控制
            excRecord: HTMLFormElement; // 异常记录
            textRecord: HTMLFormElement; // 文本记录
        }

        formHeader: OrderData = {};
        fermentPotNoOptions: OptionObj[] = [];
        classesOptions: object[] = [];

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

        headerBase: HeaderBase[] = [
            {
                type: 'p',
                label: '生产车间',
                icon: 'factory-shengchanchejian',
                value: ['workShopName']
            },
            {
                type: 'p',
                label: '曲房号',
                icon: 'factory-qiyaguanjianhua',
                value: ['kojiHouseNo']
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

        tabs: TabsObj[] = [
            {
                label: '工艺控制'
            },
            {
                label: '生產入庫'
            },
            {
                label: '异常记录'
            },
            {
                label: '文本记录'
            }
        ];


        submitRules(): Function[] {
            return [this.$refs.craftControl.ruleSubmit, this.$refs.productInStorage.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        mounted() {
            // 获取溶解罐下拉选项
            this.getFermentationHolder()
            // 班次下拉选项
            this.getClassesList()

            this.getOrderList()

        }

        // 获取溶解罐下拉选项
        getFermentationHolder() {
                COMMON_API.HOLDER_QUERY_API({
                    // deptId: params.workShop,
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
                        })
                    }
                })
        }

        // 班次
        getClassesList() {
            COMMON_API.DICTQUERY_CLASSLIST_API({}).then(({ data }) => {
                this.classesOptions = data.data;
            });
        }

        // 查询表头
        getOrderList() {
            // KOJI_API.KOJI_CRAFT_HEAD_INFO_QUERY_API({
            //     id: this.$store.state.koji.orderKojiInfo.id || ''
            // }).then(({ data }) => {
            //     this.formHeader = data.data;
            //     this.formHeader.textStage = 'YP';
            //     this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;
            //     this.$refs.craftControl.init(this.formHeader);
            //     this.$refs.productInStorage.init(this.formHeader);
            //     this.$refs.excRecord.init(this.formHeader, 'YP'); // 洗豆:XD;SC洗豆:SC;蒸豆:ZD;蒸面:ZM;圆盘:YP
            //     this.$refs.textRecord.init(this.formHeader, 'YP', 'koji'); // 洗豆:XD;SC洗豆:SC;蒸豆:ZD;蒸面:ZM;圆盘:YP
            // })

                this.formHeader = JSON.parse(JSON.stringify(this.$store.state.koji.orderKojiInfo))
                this.$set(this.formHeader, 'factoryName', JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort)
                this.$set(this.formHeader, 'textStage', 'YP')
                console.log('this.formHeader')
                console.log(this.formHeader)
                this.$refs.craftControl.init(this.formHeader);
                this.$refs.productInStorage.init(this.formHeader);
                this.$refs.excRecord.init(this.formHeader, 'YP'); // 洗豆:XD;SC洗豆:SC;蒸豆:ZD;蒸面:ZM;圆盘:YP
                this.$refs.textRecord.init(this.formHeader, 'YP', 'koji'); // 洗豆:XD;SC洗豆:SC;蒸豆:ZD;蒸面:ZM;圆盘:YP

        }

        savedDatas() {
            const craftControlTemp = this.$refs.craftControl.savedData(this.formHeader);
            const productInStorageTemp = this.$refs.productInStorage.savedData(this.formHeader);
            const excRecordTemp = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader);
            const textRecordTemp = this.$refs.textRecord.savedData(this.formHeader);


            return KOJI_API.KOJI_DISC_QUERY_SAVE_API({
                discEvaluate: {
                    deleteIds: [], // 曲料生长评价待删除id列表
                    insertList: [], // 曲料生长评价新增列表
                    updateList: [] //曲料生长评价更新列表
                },
                discGuard: {
                    deleteIds: [], // 看曲记录待删除id列表
                    insertList: [], // 看曲记录新增列表
                    updateList: [] // 看曲记录更新列表
                },
                discIn: [],
                discOut: [],
                discTurn1: craftControlTemp.discTurn1,
                discTurn2: craftControlTemp.discTurn2,
                discGuardException: craftControlTemp.discGuardException, // 看曲记录异常情况
                discTurnException: craftControlTemp.discTurnException, // 翻曲记录异常情况
                exception: { // 异常记录
                    insertDatas: excRecordTemp.InsertDto,
                    removeIds: excRecordTemp.ids,
                    updateDatas: excRecordTemp.UpdateDto
                }, // 异常记录
                fermentPotId: this.formHeader.fermentPotId, // 发酵罐Id
                fermentPotNo: this.formHeader.fermentPotNo, // 发酵罐号
                inStorage: productInStorageTemp,
                kojiOrderNo: this.formHeader.kojiHouseNo, // 曲房单号
                orderNo: this.formHeader.orderNo, // 订单号
                text: textRecordTemp
            })
        }

        submitDatas() {

            if (this.$refs.craftControl.ruleSubmit() && this.$refs.productInStorage.ruleSubmit() && this.$refs.excRecord.ruleSubmit()) {

                const craftControlTemp = this.$refs.craftControl.savedData(this.formHeader);
                const productInStorageTemp = this.$refs.productInStorage.savedData(this.formHeader);
                const excRecordTemp = this.$refs.excRecord.savedData(this.formHeader);
                const textRecordTemp = this.$refs.textRecord.savedData(this.formHeader);


                return KOJI_API.KOJI_DISC_QUERY_SUBMIT_API({
                discEvaluate: {
                        deleteIds: [], // 曲料生长评价待删除id列表
                        insertList: [], // 曲料生长评价新增列表
                        updateList: [] //曲料生长评价更新列表
                    },
                    discGuard: {
                        deleteIds: [], // 看曲记录待删除id列表
                        insertList: [], // 看曲记录新增列表
                        updateList: [] // 看曲记录更新列表
                    },
                    discIn: [],
                    discOut: [],
                    discTurn1: craftControlTemp.discTurn1,
                    discTurn2: craftControlTemp.discTurn2,
                    discGuardException: productInStorageTemp.discGuardException, // 看曲记录异常情况
                    discTurnException: productInStorageTemp.discTurnException, // 翻曲记录异常情况
                    exception: excRecordTemp, // 异常记录
                    fermentPotId: this.formHeader.fermentPotId, // 发酵罐Id
                    fermentPotNo: this.formHeader.fermentPotNo, // 发酵罐号
                    inStorage: productInStorageTemp,
                    kojiOrderNo: this.formHeader.kojiHouseNo, // 曲房单号
                    orderNo: this.formHeader.orderNo, // 订单号
                    text: textRecordTemp
                })
            }

        }
    }


    interface OptionObj {
        optLabel?: string;
        optValue?: string;
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
    }
</script>
