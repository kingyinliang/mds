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
    // import { getFactory } from '@/net/validate';

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
            pendingNum: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        orderStatus = ''
        currentOrderNo = ''
        formHeader: OrderData = {}

        packDetail: OrderData={}

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
                value: 'changer'
            },
            {
                type: 'p',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
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

            this.formHeader = this.$store.state.packaging.packDetail
            console.log('表头数据顯示')
            console.log(this.formHeader)

            PKG_API.PKG_HOME_QUERY_BY_NO_API({ // 基础数据-订单管理-根据订单号查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                this.orderStatus = data.data.orderStatus
                console.log('訂單查詢結果顯示')
                console.log(data)
            })
        }

        mounted() {
            this.initData()
        }

        initData() {
            // # 生产准备
            PKG_API.PKG_TIMESHEET_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('生产准备-查询')
                console.log(data)
                let dataTemp = {};
                if (dataTemp !== null) {
                    dataTemp = JSON.parse(JSON.stringify(data.data))
                } else {
                    dataTemp = {}
                }
                this.$refs.readyTime.init(dataTemp)
            })

            // # 生产人员
            // # 设备运行

            // # 生产入库
            // PKG_API.PKG_INSTORAGE_QUERY_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     orderNo: this.formHeader.orderNo,
            //     materialCode: this.formHeader.materialCode
            // }).then(({ data }) => {
            //     console.log('生产入库-查询')
            //     console.log(data)
            //     // if (data.data.inStorages.length !== 0) {
            //         this.$refs.productInStorage.init(data.data)
            //     // }
            // })

            // # 物料领用
            // PKG_API.PKG_MATERIAL_P_QUERY_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     orderNo: this.formHeader.orderNo,
            //     orderStatus: this.orderStatus,
            //     productLine: this.formHeader.productLine
            // }).then(({ data }) => {
            //     console.log('物料领用-查询')
            //     console.log(data)
            //     this.$refs.material.init(data.data)
            // })
            this.$refs.material.init(this.formHeader)

            // # 待处理数量


            // # 文本记录
            // PKG_API.PKG_TEXT_QUERY_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     orderNo: this.formHeader.orderNo
            // }).then(({ data }) => {
            //     console.log('文本记录-查询')
            //     console.log(data)
            //     let dataTemp = {}
            //     if (data.data !== null) {
            //         dataTemp = JSON.parse(JSON.stringify(data.data))
            //     } else {
            //         dataTemp = {}
            //     }
            //     this.$refs.textRecord.init(dataTemp);
            // })


        }

        sentData() {
            const dataGroup: SendData = {};
            // # pkgOrderUpdate
            this.pkgOrderUpdate = {
                orderId: this.formHeader.id,
                orderNo: this.formHeader.orderNo,
                productDate: this.formHeader.productDate,
                productLine: this.formHeader.productLine,
                workShop: this.formHeader.workShop
            }
            dataGroup.pkgOrderUpdate = this.pkgOrderUpdate;

            // pkgTimeSheet
            const timeSheetTemp = this.$refs.readyTime.returnDataGroup()
            timeSheetTemp.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
            if (timeSheetTemp.id !== '') {
                this.pkgTimeSheet = {
                    pkgTimeSheetInsertDto: {},
                    pkgTimeSheetUpdateDto: timeSheetTemp
                }
            } else {
                timeSheetTemp.orderId = this.formHeader.id
                timeSheetTemp.orderNo = this.formHeader.orderNo
                this.pkgTimeSheet = {
                    pkgTimeSheetInsertDto: timeSheetTemp,
                    pkgTimeSheetUpdateDto: {}
                }
            }
            dataGroup.pkgTimeSheet = this.pkgTimeSheet;

            // 文本记录
            // const textRecordTemp = this.$refs.textRecord.returnDataGroup()
            // textRecordTemp.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id

            // console.log('textRecordTemp')
            // console.log(textRecordTemp)
            // if (textRecordTemp.id !== '') {
            //     this.pkgText = {
            //         pkgTextInsert: {},
            //         pkgTextUpdate: textRecordTemp
            //     }
            // } else {
            //     textRecordTemp.orderId = this.formHeader.id
            //     textRecordTemp.orderNo = this.formHeader.orderNo
            //     this.pkgText = {
            //         pkgTextInsert: textRecordTemp,
            //         pkgTextUpdate: {}
            //     }
            // }
            // dataGroup.pkgText = this.pkgText;


            return PKG_API.PKG_ALL_SAVE_API(dataGroup).then(() => {
                setTimeout(() => {
                    this.initData() // 刷新
                }, 1000);
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

interface SendData{
    pkgGerms?: object;
    pkgInstorage?: object;
    pkgOrderUpdate?: object;
    pkgPackingMateria?: object;
    pkgSemiMaterial?: object;
    pkgText?: object;
    pkgTimeSheet?: object;
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
