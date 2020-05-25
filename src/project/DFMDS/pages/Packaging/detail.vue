<template>
    <data-entry
        ref="dataEntry"
        :redact-auth="'pkg:order:update'"
        :save-auth="'pkg:order:update'"
        :submit-auth="'pkg:order:update'"
        :order-status="orderStatus"
        :header-base="headerBase"
        :form-header="formHeader"
        :tabs="tabs"
        :saved-datas="sentData"
    >
        <template slot="1" slot-scope="data">
            <ready-time ref="readyTime" :is-redact="data.isRedact" />
        </template>
        <template slot="2" slot-scope="data">
            <product-people ref="productPeople" :is-redact="data.isRedact" />
        </template>
        <template slot="4" slot-scope="data">
            <product-in-storage ref="productInStorage" :is-redact="data.isRedact" />
        </template>
        <template slot="5" slot-scope="data">
            <material ref="material" :is-redact="data.isRedact" />
        </template>
        <template slot="6" slot-scope="data">
            <pending-num ref="pendingNum" :is-redact="data.isRedact" />
        </template>
        <template slot="7" slot-scope="data">
            <text-record ref="textRecord" :is-redact="data.isRedact" />
        </template>
    </data-entry>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, PKG_API } from 'common/api/api';
    import ReadyTime from './common/ReadyTimes.vue';
    import Material from './common/Material.vue';
    import ProductPeople from './common/ProductPeople.vue';
    import PendingNum from './common/PendingNum.vue';
    import TextRecord from './common/TextRecord.vue';
    import ProductInStorage from './common/ProductInStorage.vue';

    @Component({
        components: {
            ReadyTime,
            ProductPeople,
            PendingNum,
            TextRecord,
            Material,
            ProductInStorage
        }
    })

    export default class PackagingDetail extends Vue {

        $refs: {
            readyTime: HTMLFormElement;
            productPeople: HTMLFormElement;
            productInStorage: HTMLFormElement;
            material: HTMLFormElement;

            // material: HTMLFormElement;
            readytime: HTMLFormElement;
            pendingNum: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        orderStatus = ''
        currentOrderNo = ''
        formHeader: OrderData = {}

        pkgGerms: PkgGerms = {}
        pkgInstorage: PkgInstorage ={}
        pkgOrderUpdate: PkgOrderUpdate={}
        pkgPackingMaterial: PkgPackingMaterial={}
        pkgSemiMaterial: PkgSemiMaterial={}
        pkgTimeSheet: PkgTimeSheet = {}
        pkgText: PkgText = {}

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShopName'
            },
            {
                type: 'p',
                icon: 'factory-shengchanxian',
                label: '生产产线',
                value: 'productLineName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产订单',
                value: 'orderNo'
            },
            {
                type: 'p',
                icon: 'factory--meirijihuachanliangpeizhi',
                label: '订单产量',
                value: ['planOutput', 'realOutput']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: ['orderStartDate', 'orderEndDate']
            },
            {
                type: 'date-picker',
                icon: 'factory-riqi1',
                label: '生产日期',
                value: 'productDate'
            },
            {
                type: 'p',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员', // 操作人员
                value: 'operator'
            },
            {
                type: 'p',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'operatorDate'
            }
        ];

        tabs = [
            {
                label: '生产准备',
                status: '未录入',
                isRedact: false
            },
            {
                label: '生产人员',
                status: '未录入',
                isRedact: false
            },
            {
                label: '设备运行',
                isRedact: false
            },
            {
                label: '生产入库',
                status: '未录入',
                isRedact: false
            },
            {
                label: '物料领用',
                status: '未录入',
                isRedact: false
            },
            {
                label: '待处理数量',
                isRedact: false
            },
            {
                label: '文本记录',
                isRedact: false
            }
        ];

        classList = [];

        created() {
            // 班次拉取
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
                this.classList = data.data
            });
        }

        mounted() {
            this.currentOrderNo = this.$route.params.orderNo
            PKG_API.PKG_HOME_QUERY_BY_NO_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.currentOrderNo
            }).then(({ data }) => {
                this.formHeader = JSON.parse(JSON.stringify(data.data))
                this.formHeader.productLineName = this.$route.params.productLineName
                this.formHeader.workShopName = this.$route.params.workShopName
                this.orderStatus = data.data.orderStatus


                // PKG_API.PKG_ALL_SAVE_API({
                //         // pkgGerms: {
                //         //     germsDelete: [],
                //         //     germsInsert: [],
                //         //     germsUpdate: []
                //         // },
                //         // pkgInstorage: {
                //         //     instorageDelete: [],
                //         //     instorageInsert: [],
                //         //     instorageUpdate: []
                //         // },
                //         pkgOrderUpdate: {
                //             orderId: this.$route.params.orderId,
                //             orderNo: this.currentOrderNo,
                //             productDate: this.formHeader.productDate,
                //             productLine: this.formHeader.productLine,
                //             workShop: this.formHeader.workShop
                //         },
                //         // pkgPackingMaterial: {
                //         //     packingMaterialDelete: [],
                //         //     packingMaterialInsert: [],
                //         //     packingMaterialItemDel: [],
                //         //     packingMaterialUpdate: []
                //         // },
                //         // pkgSemiMaterial: {
                //         //     pkgSemiMaterialDelete: [],
                //         //     pkgSemiMaterialInsert: [],
                //         //     pkgSemiMaterialItemDelete: [],
                //         //     pkgSemiMaterialUpdate: []
                //         // },
                //         pkgText: {
                //             pkgTextInsert: {
                //                 factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                //                 orderId: this.$route.params.orderId,
                //                 orderNo: this.currentOrderNo,
                //                 pkgText: '我是测试文本'
                //             },
                //             pkgTextUpdate: {}
                //         }
                //         // pkgTimeSheet: {
                //         //     pkgTimeSheetInsertDto: {},
                //         //     pkgTimeSheetUpdateDto: {}
                //         // }
                //     }).then((res) => {
                //         console.log(res)
                //     })
                // PKG_API.PKG_PACKAGEMATERIAL_QUERY_API({
                //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                //     orderNo: this.$route.params.orderNo,
                //     orderStatus: this.orderStatus,
                //     productLine: this.formHeader.productLine
                // }).then((res) => {
                //     console.log('物料领用-查询')
                //     console.log(res)
                //     // this.$refs.ProductInStorage.init(data.data)
                // })

            })

            // # 生产准备
            PKG_API.PKG_TIMESHEET_QUERY_API({
                // orderId: this.$route.params.orderId,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.$route.params.orderNo
            }).then(({ data }) => {
                console.log('生产准备-查询')
                console.log(data)
                if (data.data.length !== 0) {
                    this.$refs.readyTime.init(data.data)
                }
                // this.formHeader = data.data;
                // this.getList(data.data);
                // this.$refs.material.init(this.formHeader);
            })

            // # 生产人员
            // # 设备运行
            // # 生产入库
            // PKG_API.PKG_INSTORAGE_QUERY_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     orderNo: this.$route.params.orderNo
            // }).then(({ data }) => {
            //     console.log('生产入库-查询')
            //     console.log(data)
            //     if (data.data.inStorages.length !== 0) {
            //         this.$refs.productInStorage.init(data.data)
            //     }

            // })

            // # 物料领用
            // # 待处理数量

            // # 文本记录
            // PKG_API.PKG_TEXT_QUERY_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     orderNo: this.currentOrderNo
            // }).then(({ data }) => {
            //     // if (data.data.length !== 0) {
            //     //     console.log('22222')
            //     // }
            //     console.log('是否有值')
            //     console.log(data)
            //     // this.$refs.textRecord.init();
            // })


        }

        sentData() {

            this.pkgOrderUpdate = {
                orderId: this.$route.params.orderId,
                orderNo: this.currentOrderNo,
                productDate: this.formHeader.productDate,
                productLine: this.formHeader.productLine,
                workShop: this.formHeader.workShop
            }
            // TimeSheet 规则
            const TimeSheetTemp = this.$refs.readyTime.returnDataGroup()
                // TimeSheetTemp.id = this.$route.params.orderId
                // TimeSheetTemp.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                console.log('TimeSheetTemp')
                console.log(TimeSheetTemp)
                if (Object.prototype.hasOwnProperty.call('TimeSheetTemp', 'id')) {
                    this.pkgTimeSheet = {
                        pkgTimeSheetInsertDto: {},
                        pkgTimeSheetUpdateDto: TimeSheetTemp
                    }
                } else {
                    this.pkgTimeSheet = {
                        pkgTimeSheetInsertDto: TimeSheetTemp,
                        pkgTimeSheetUpdateDto: {}
                    }
                }

                //const dataGroup = Object.assign({}, pkgGerms, pkgInstorage, pkgOrderUpdate, pkgPackingMaterial, pkgSemiMaterial, pkgText, this.pkgTimeSheet);
                const dataGroup = Object.assign({}, this.pkgOrderUpdate, this.pkgTimeSheet);
            //     {
            //         // pkgGerms: {
            //         //     germsDelete: [],
            //         //     germsInsert: [],
            //         //     germsUpdate: []
            //         // },
            //         // pkgInstorage: {
            //         //     instorageDelete: [],
            //         //     instorageInsert: [],
            //         //     instorageUpdate: []
            //         // },
            //         pkgOrderUpdate: {
            //             orderId: this.$route.params.orderId,
            //             orderNo: this.currentOrderNo,
            //             productDate: this.formHeader.productDate,
            //             productLine: this.formHeader.productLine,
            //             workShop: this.formHeader.workShop
            //         },
            //         // pkgPackingMaterial: {
            //         //     packingMaterialDelete: [],
            //         //     packingMaterialInsert: [],
            //         //     packingMaterialItemDel: [],
            //         //     packingMaterialUpdate: []
            //         // },
            //         // pkgSemiMaterial: {
            //         //     pkgSemiMaterialDelete: [],
            //         //     pkgSemiMaterialInsert: [],
            //         //     pkgSemiMaterialItemDelete: [],
            //         //     pkgSemiMaterialUpdate: []
            //         // },
            //         // pkgText: {
            //         //     pkgTextInsert: {
            //         //         factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //         //         orderId: this.$route.params.orderId,
            //         //         orderNo: this.currentOrderNo,
            //         //         pkgText: '我是测试文本'
            //         //     },
            //         //     pkgTextUpdate: {}
            //         // }
            //         pkgTimeSheet: {
            //             pkgTimeSheetInsertDto: TimeSheetTemp,
            //             pkgTimeSheetUpdateDto: {}
            //         }
            // }
            return PKG_API.PKG_ALL_SAVE_API(dataGroup).then((data) => {
                console.log(data)
            })
        }

        // getList(formHeader: object) {
        //     this.$refs.readyTime.getDataList(formHeader['orderNo']);
        //     this.$refs.pendingNum.getDataList(formHeader);
        //     this.$refs.textRecord.getDataInfo(formHeader);
        // }
    }
interface OrderData{
    changed?: string;
    countMan?: number;
    countOutput?: number;
    countOutputUnit?: string;
    dispatchMan?: string;
    exceptionDateCount?: number;
    factory?: string;
    factoryCode?: string;
    germs?: number;
    id?: string;
    materialCode?: string;
    materialName?: string;
    operator?: string;
    operatorDate?: string;
    orderEndDate?: string;
    orderNo?: string;
    orderStartDate?: string;
    orderStatus?: string;
    orderType?: string;
    outputUnit?: string;
    planOutput?: number;
    productDate?: string;
    productLine?: string;
    productLineName?: string;
    realInAmount?: number;
    realOutput?: number;
    version?: number;
    workShop?: string;
    workShopName?: string;
}

interface PkgGerms {
    germsDelete?: object[];
    germsInsert?: object[];
    germsUpdate?: object[];
}

interface PkgInstorage{
    counOutputUnit?: string;
    countOutput?: number;
    factory?: string;
    instorageDelete?: string[];
    instorageInsert?: object[];
    instorageUpdate?: object[];
    remark?: string;
}

interface PkgOrderUpdate {
    orderId?: string;
    orderNo?: string;
    productDate?: string;
    productLine?: string;
    workShop?: string;
}

interface PkgPackingMaterial{
    packingMaterialDelete?: string[];
    packingMaterialInsert?: object[];
    packingMaterialItemDelete?: object[];
}

interface PkgSemiMaterial{
    pkgSemiMaterialDelete?: string[];
    pkgSemiMaterialInsert?: object[];
    pkgSemiMaterialItemDelete?: object[];
}

interface PkgTimeSheet {
    pkgTimeSheetInsertDto?: object;
    pkgTimeSheetUpdateDto?: object;
}

interface PkgText {
    pkgTextInsert?: object;
    pkgTextUpdate?: object;
}
</script>

<style>
</style>
