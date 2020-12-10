<template>
    <div>
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
                <steamed-bean-craft ref="steamedBeanCraft" :is-redact="data.isRedact" />
            </template>
            <template slot="2" slot-scope="data">
                <steamed-in-storage ref="steamedInStorage" :pot-no-now="potNoNow" :is-redact="data.isRedact" />
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
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';

    import SteamedBeanCraft from './common/SteamedBeanCraft.vue';
    import SteamedInStorage from './common/SteamedInStorage.vue';
    import KojiExcRecord from './common/KojiExcRecord.vue';
    import KojiTextRecord from './common/KojiTextRecord.vue';

    @Component({
        name: 'SteamedBeanIndex',
        components: {
            SteamedBeanCraft,
            SteamedInStorage,
            KojiExcRecord,
            KojiTextRecord
        }
    })
    export default class SteamedBeanIndex extends Vue {
        $refs: {
            steamedBeanCraft: HTMLFormElement;
            steamedInStorage: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
            dataEntry: HTMLFormElement;
        }

        orderIndex=['已同步', '已保存', '待审核', '已审核', '已过账', '已退回', '未录入']

        formHeader: OrderData = {};
        jumpFromAudit=false // is from audit ?
        // 泡豆罐list
        scanList: Holder[] = []

        // 当前罐号
        potNoNow: string|number = '';

        @Watch('formHeader.potNo', { immediate: true, deep: true })
        onChangeValue(newVal: number| string) {
            if (newVal) {
                this.potNoNow = newVal
            }
        }

        get headerBase() {
            return [
                {
                    type: 'p',
                    label: '生产车间',
                    icon: 'factory-shengchanchejian',
                    value: 'workShopName'
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
                    label: '生产日期',
                    icon: 'factory--meirijihuachanliangpeizhi',
                    value: 'productDate'
                },
                {
                    type: 'select',
                    icon: 'factory-bianhaoguize',
                    label: '泡豆罐',
                    value: 'potNo',
                    disabled: true,
                    option: {
                        list: this.scanList,
                        label: 'holderName',
                        value: 'id'
                    }
                },
                {
                    type: 'tooltip',
                    icon: 'factory-xianchangrenyuan',
                    label: '提交人员',
                    value: 'changer'
                },
                {
                    type: 'tooltip',
                    icon: 'factory-riqi',
                    label: '提交时间',
                    value: 'changed'
                }
            ];
        }

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

        // 获取页签状态
        getHouseTag() {
            KOJI_API.KOJI_PAGE_TAG_STATUS_QUERY_API({
                orderNo: this.formHeader.orderNo,
                kojiOrderNo: this.formHeader.kojiOrderNo
            }).then(({ data }) => {

                this.$store.commit('koji/updateHouseTag', data.data);
                this.tabs[0].status = data.data.steamBeanCraftName
                this.tabs[1].status = data.data.steamBeanInStorageName
                this.$refs.dataEntry.updateTabs();
                this.$set(this.formHeader, 'statusName', this.orderIndex[Math.min(this.orderIndex.indexOf(data.data.steamBeanCraftName), this.orderIndex.indexOf(data.data.steamBeanInStorageName))])

            })
        }

        submitRules(): Function[] {
            return [this.$refs.steamedBeanCraft.ruleSubmit, this.$refs.steamedInStorage.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        mounted() {
            if (typeof this.$route.params.order !== 'undefined') {
                this.jumpFromAudit = true
            }
            this.getOrderList()
        }

        // 查询表头
        getOrderList() {
            COMMON_API.OREDER_QUERY_BY_NO_API({
                // orderNo: this.$store.state.koji.orderScInfo.orderNo || ''
                orderNo: this.jumpFromAudit ? this.$route.params.order : this.$store.state.koji.orderScInfo.orderNo || ''
            }).then(({ data }) => {
                // KOJI_API.KOJI_STEAM_INSTORAGE_LIST_API({
                //     // kojiOrderNo: null,
                //     orderNo: data.data.orderNo
                // }).then(({ data: res }) => {
                //     // const queryInStorageData = res.data;
                //     this.formHeader = {
                //         ...data.data,
                //         // potNo: queryInStorageData && queryInStorageData[0] ? queryInStorageData[0].scPotNo : '',
                //         potNo: this.potNoNow,
                //         kojiOrderNo: null
                //     };
                //     // 获取页签状态
                //     this.getHouseTag();
                //     this.formHeader.textStage = 'ZD';
                //     this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;
                //     this.getScanList();
                //     this.$refs.steamedBeanCraft.init(this.formHeader);
                //     this.$refs.steamedInStorage.init(this.formHeader);
                //     this.$refs.excRecord.init(this.formHeader, 'ZD');
                //     this.$refs.textRecord.init(this.formHeader, 'koji');
                // });
                KOJI_API.KOJI_QUERY_STEAMBEAN_API({
                    orderNo: this.jumpFromAudit ? this.$route.params.order : this.$store.state.koji.orderScInfo.orderNo || ''
                }).then(({ data: res }) => {
                    this.potNoNow = res.data.beanJarId

                    this.formHeader = {
                        ...data.data,
                        // potNo: queryInStorageData && queryInStorageData[0] ? queryInStorageData[0].scPotNo : '',
                        potNo: this.potNoNow,
                        kojiOrderNo: null
                    };
                    // 获取页签状态
                    this.getHouseTag();
                    this.formHeader.textStage = 'ZD';
                    this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;
                    this.getScanList();
                    this.$refs.steamedBeanCraft.init(this.formHeader);
                    this.$refs.steamedInStorage.init(this.formHeader);
                    this.$refs.excRecord.init(this.formHeader, 'ZD');
                    this.$refs.textRecord.init(this.formHeader, 'koji');
                });

            })

            // 获取泡豆罐栏位资讯
            // KOJI_API.KOJI_QUERY_STEAMBEAN_API({
            //     orderNo: this.jumpFromAudit ? this.$route.params.order : this.$store.state.koji.orderScInfo.orderNo || ''
            // }).then(({ data: res }) => {
            //     console.log('888888888')
            //     console.log(data)
            //     this.potNoNow = res.data.beanJarId

            //         this.formHeader = {
            //             ...data.data,
            //             // potNo: queryInStorageData && queryInStorageData[0] ? queryInStorageData[0].scPotNo : '',
            //             potNo: this.potNoNow,
            //             kojiOrderNo: null
            //         };
            //         // 获取页签状态
            //         this.getHouseTag();
            //         this.formHeader.textStage = 'ZD';
            //         this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;
            //         this.getScanList();
            //         this.$refs.steamedBeanCraft.init(this.formHeader);
            //         this.$refs.steamedInStorage.init(this.formHeader);
            //         this.$refs.excRecord.init(this.formHeader, 'ZD');
            //         this.$refs.textRecord.init(this.formHeader, 'koji');
            // });
        }

        // 获取泡豆罐
        getScanList() {
            COMMON_API.HOLDER_DROPDOWN_API({
                // deptId: this.formHeader.workShop,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: ['029']
            }).then(({ data }) => {
                console.log('泡豆罐下拉')
                console.log(data)
                this.scanList = data.data || [];
            });
        }

        savedDatas() {
            const steSemi = this.$refs.steamedBeanCraft.getSavedOrSubmitData(this.formHeader);
            const inStorage = this.$refs.steamedInStorage.getSavedOrSubmitData(this.formHeader, 'submit');
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'ZD');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');

            const tempScanList = this.scanList.filter(item => item.id === this.potNoNow)[0] || {}
            return KOJI_API.KOJI_STEAM_BEAN_SAVE_API({
                ...steSemi,
                ...inStorage,
                exception: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                text: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo,
                kojiHouseNo: this.formHeader.kojiHouseNo,
                beanJarId: this.potNoNow,
                beanJarName: tempScanList.holderName || '',
                beanJarNo: tempScanList.holderNo || ''
            })
        }

        submitDatas() {
            const steSemi = this.$refs.steamedBeanCraft.getSavedOrSubmitData(this.formHeader, 'submit');

            const inStorage = this.$refs.steamedInStorage.getSavedOrSubmitData(this.formHeader, 'submit');

            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'ZD');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');
            const tempScanList = this.scanList.filter(item => item.id === this.potNoNow)[0] || {}

            return KOJI_API.KOJI_STEAM_BEAN_SUBMIT_API({
                ...steSemi,
                ...inStorage,
                exception: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                text: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo,
                kojiHouseNo: this.formHeader.kojiHouseNo,
                beanJarId: this.potNoNow,
                beanJarName: tempScanList.holderName || '',
                beanJarNo: tempScanList.holderNo || ''
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
        workShop?: string;
    }
    interface UserObj {
        label?: string;
        key?: string;
        value?: string;
    }

    interface Holder {
        deptId?: string;
        holderArea?: string;
        holderBatch?: string;
        holderName?: string;
        holderNo?: string;
        holderStatus?: string;
        holderType?: string;
        holderVolume?: number;
        id?: string;
    }
</script>
