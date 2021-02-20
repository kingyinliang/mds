<template>
    <div>
        <data-entry
            ref="dataEntry"
            redact-auth="kjSBEdit"
            save-auth="kjSBSave"
            submit-auth="kjSBSubmit"
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
                <steamed-bean-craft ref="steamedBeanCraft" :is-status="steamedBeanCraftStatus" :is-redact="data.isRedact" />
            </template>
            <template slot="2" slot-scope="data">
                <steamed-in-storage ref="steamedInStorage" :is-status="steamedInStorageStatus" :pot-no-now.sync="potNoNow" :scan-list="scanList" :is-redact="data.isRedact" />
            </template>
            <template slot="3" slot-scope="data">
                <koji-exc-record ref="excRecord" :is-redact="data.isRedact" exp-add="kjSBExpAdd" :form-header="formHeader" />
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

        formHeader: OrderData = {};
        jumpFromAudit=false // is from audit ?
        // 泡豆罐list
        scanList: Holder[] = []

        // 当前罐号
        potIdNow: string|number = '';
        potNoNow: string|number = '';

        steamedBeanCraftStatus='N';
        steamedInStorageStatus='N';

        @Watch('formHeader.potId', { immediate: true, deep: true })
        onChangeValue(newVal: number| string) {
            if (newVal) {
                this.potIdNow = newVal
                if (this.scanList.length !== 0) {
                    this.potNoNow = this.scanList.filter(item => item.id === newVal)[0].holderNo as string
                }

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
                    value: 'potId',
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
                kojiOrderNo: this.formHeader.kojiOrderNo || ''
            }).then(({ data }) => {

                this.$store.commit('koji/updateHouseTag', data.data);
                this.tabs[0].status = data.data.steamBeanCraft
                this.tabs[1].status = data.data.steamBeanInStorage

                this.steamedBeanCraftStatus = data.data.steamBeanCraft;
                this.steamedInStorageStatus = data.data.steamBeanInStorage;

                this.$refs.dataEntry.updateTabs();
                this.$set(this.formHeader, 'statusName', data.data.steamBeanStatusName);
            })
        }

        submitRules(): Function[] {
            return [this.$refs.steamedBeanCraft.ruleSubmit, this.$refs.steamedInStorage.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        async mounted() {
            // 跳转用
            if (typeof this.$route.params.order !== 'undefined') {
                this.jumpFromAudit = true;
                setTimeout(() => {
                    this.$refs.dataEntry.activeName = this.$route.params.activeName;
                }, 2000);
            }
            await this.getOrderList()
            // await this.getScanList();
        }

        // 查询表头
        async getOrderList() {
            COMMON_API.OREDER_QUERY_BY_NO_API({
                // this.jumpFromAudit 承接判断跳转过来
                orderNo: this.jumpFromAudit ? this.$route.params.order : this.$store.state.koji.orderScInfo.orderNo || ''
            }).then(({ data }) => {
                // 1.德兴程式
                // KOJI_API.KOJI_QUERY_STEAMBEAN_API({
                //     orderNo: this.jumpFromAudit ? this.$route.params.order : this.$store.state.koji.orderScInfo.orderNo || ''
                // }).then(({ data: res }) => {
                //     this.potIdNow = res.data.beanJarId
                //     console.log('res')
                //     console.log(res)
                //     if (this.scanList.length !== 0 && res.data.beanJarId !== '') {
                //             this.potNoNow = this.scanList.filter(item => item.id === res.data.beanJarId)[0].holderNo as string
                //     }
                //     this.formHeader = {
                //         ...data.data,
                //         potNo: this.potIdNow,
                //         kojiOrderNo: null
                //     };
                //     // 获取页签状态
                //     this.getHouseTag();
                //     this.formHeader.textStage = 'ZD';
                //     this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;

                //     this.$refs.steamedBeanCraft.init(this.formHeader);
                //     this.$refs.steamedInStorage.init(this.formHeader);
                //     this.$refs.excRecord.init(this.formHeader, 'ZD');
                //     this.$refs.textRecord.init(this.formHeader, 'koji');
                // });

                // 2.雪健建议
                // kojiInStorage/queryList
                KOJI_API.KOJI_STEAM_INSTORAGE_LIST_API({
                    kojiOrderNo: '',
                    orderNo: this.jumpFromAudit ? this.$route.params.order : this.$store.state.koji.orderScInfo.orderNo || ''
                }).then(({ data: res }) => {
                    this.potIdNow = '';
                    this.potNoNow = '';
                    this.formHeader = {
                        ...data.data,
                        potId: this.potIdNow,
                        kojiOrderNo: null
                    };
                    if (res.data.length !== 0) {
                        this.potIdNow = res.data[0].scPotId;
                        this.potNoNow = res.data[0].scPotNo;
                        this.formHeader.kojiOrderNo = res.data[0].kojiOrderNo;
                        this.formHeader.potId = res.data[0].scPotId
                    }

                    // 获取页签状态
                    this.getHouseTag();
                    this.formHeader.textStage = 'ZD';
                    this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;

                    this.$refs.steamedBeanCraft.init(this.formHeader);
                    this.$refs.steamedInStorage.init(this.formHeader);
                    this.$refs.excRecord.init(this.formHeader, 'ZD');
                    this.$refs.textRecord.init(this.formHeader, 'koji');
                    // 获取泡豆罐
                    this.getScanList()

                });

            })


        }

        // 获取泡豆罐
        getScanList() {
            COMMON_API.HOLDER_DROPDOWN_BY_STATUS_API({
                // deptId: this.formHeader.workShop,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: ['025']
            }).then(({ data }) => {
                console.log('泡豆罐下拉')
                console.log(data)
                // this.scanList = data.data || [];
                this.scanList = [];
                if (data.data.length !== 0) {
                    console.log('this.potIdNow')
                    console.log(this.potIdNow)

                    data.data.forEach(item => {
                        // 是空罐或是已有的罐
                        if (item.holderStatus === 'E' || item.id === this.potIdNow) {
                            this.scanList.push({ holderNo: item.holderNo, holderName: item.holderName, id: item.id })
                        }
                    })
                }
            });
        }

        savedDatas() {
            const steSemi = this.$refs.steamedBeanCraft.getSavedOrSubmitData(this.formHeader);
            const inStorage = this.$refs.steamedInStorage.getSavedOrSubmitData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'ZD');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');
            const tempScanList = this.scanList.filter(item => item.id === this.potIdNow)[0] || {}
            return KOJI_API.KOJI_STEAM_BEAN_SAVE_API({
                ...steSemi,
                ...inStorage,
                exception: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                text: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo || '',
                orderNo: this.formHeader.orderNo,
                kojiHouseNo: this.formHeader.kojiHouseNo,
                beanJarId: this.potIdNow,
                beanJarName: tempScanList.holderName || '',
                beanJarNo: this.potNoNow
            })
        }

        submitDatas() {
            const steSemi = this.$refs.steamedBeanCraft.getSavedOrSubmitData(this.formHeader);
            const inStorage = this.$refs.steamedInStorage.getSavedOrSubmitData(this.formHeader);

            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'ZD');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');
            const tempScanList = this.scanList.filter(item => item.id === this.potIdNow)[0] || {}

            return KOJI_API.KOJI_STEAM_BEAN_SUBMIT_API({
                ...steSemi,
                ...inStorage,
                exception: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                text: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo || '',
                orderNo: this.formHeader.orderNo,
                kojiHouseNo: this.formHeader.kojiHouseNo,
                beanJarId: this.potIdNow,
                beanJarName: tempScanList.holderName || '',
                beanJarNo: this.potNoNow
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
        potId?: string;
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
