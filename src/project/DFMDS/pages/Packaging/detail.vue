<template>
    <data-entry
        ref="dataEntry"
        :redact-auth="'pkg:order:update'"
        :save-auth="'pkg:order:update'"
        :submit-auth="'pkg:order:update'"
        :order-status="formHeader.orderStatus"
        :header-base="headerBase"
        :form-header="formHeader"
        :tabs="tabs"
        :saved-datas="savedDatas"
        :submit-urgent="false"
        @success="getOrderList"
    >
        <template slot="1" slot-scope="data">
            <ready-time ref="readyTime" :is-redact="data.isRedact" :classes-options="classesOptions" />
        </template>
        <template slot="2" slot-scope="data">
            <product-people ref="productPeople" :is-redact="data.isRedact" :classes-options="classesOptions | classesOptionsFilter" />
        </template>
        <template slot="3" slot-scope="data">
            <Equipment ref="equipment" :is-redact="data.isRedact" :classes-options="classesOptions | classesOptionsFilter" :product-line="formHeader.productLine" />
        </template>
        <template slot="4" slot-scope="data">
            <product-in-storage ref="productInStorage" :is-redact="data.isRedact" :classes-options="classesOptions | classesOptionsFilter" />
        </template>
        <template slot="5" slot-scope="data">
            <material ref="material" :is-redact="data.isRedact" />
        </template>
        <template slot="6" slot-scope="data">
            <pending-num ref="pendingNum" :is-redact="data.isRedact" :classes-options="classesOptions | classesOptionsFilter" />
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
    import Equipment from './common/Equipment.vue';
    // import _ from 'lodash';
    // import { getFactory } from '@/net/validate';

    @Component({
        name: 'PackagingDetail',
        components: {
            ReadyTime,
            ProductPeople,
            PendingNum,
            TextRecord,
            Material,
            ProductInStorage,
            Equipment
        },
        filters: {
            classesOptionsFilter: (value) => {
                return value.filter(item => item.dictValue !== '多班')
            }
        }
    })

    export default class PackagingDetail extends Vue {
        classesOptions: object[]=[] // 班次资料
        dataGroup: SendData = {}; // 提交整合物件容器

        // 提交物件
        pkgDeviceSaveRequestDto: PkgDeviceSaveRequestDto = {}
        pkgExceptionSaveRequestDto: PkgExceptionSaveRequestDto={}
        pkgGerms: PkgGerms = {}
        pkgInStorage: PkgInstorage ={}
        pkgOrderUpdate: PkgOrderUpdate={}
        pkgPackingMaterial: PkgPackingMaterial={}
        pkgSemiMaterial: PkgSemiMaterial={}
        pkgText: PkgText = {}
        pkgTimeSheet: PkgTimeSheet = {}
        pkgUserSaveRequestDto: PkgUserSaveRequestDto={}

        // 判断该页签是否有异动
        isReadyTimeLoaded = false
        isProductPeopleLoaded = false
        isEquipmentLoaded = false
        isProductInStorageLoaded = false
        isMaterialLoaded = false
        isPendingNumLoaded = false
        isTextLoaded = false
        // 初始页签位置
        currentTab='1'
        radio=''

        $refs: {
            readyTime: HTMLFormElement; // 1生产准备
            productPeople: HTMLFormElement; // 2生产人员
            equipment: HTMLFormElement; // 3设备运行
            productInStorage: HTMLFormElement; // 4生产入库
            material: HTMLFormElement; // 5物料领用
            pendingNum: HTMLFormElement; // 6待处理数量
            textRecord: HTMLFormElement; // 7文本记录
            dataEntry: HTMLFormElement;
        }

        formHeader: OrderData = {} // 表头资料

        // 表头 data
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

        // tabs data
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

        savedDatas() {
            const pkgTimeSheet = this.$refs.readyTime.savedData(this.formHeader);
            const pkgUserSaveRequestDto = this.$refs.productPeople.savedData(this.formHeader);
            this.formHeader.orderId = this.formHeader.id;
            return PKG_API.PKG_ALL_SAVE_API({
                pkgOrderUpdate: this.formHeader,
                pkgTimeSheet,
                pkgUserSaveRequestDto
            })
        }

        getOrderList() {
            PKG_API.PKG_HOME_QUERY_BY_NO_API({ // 基础数据-订单管理-根据订单号查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.$store.state.packaging.packDetail.orderNo
            }).then(({ data }) => {
                this.formHeader = data.data;
                if (data.data.orderStatus !== '已同步') {
                    this.$refs.readyTime.init(this.formHeader)
                    this.$refs.productPeople.init(this.formHeader)
                }
            })
        }

        mounted() {
            this.getOrderList()
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
                this.classesOptions = []
                data.data.forEach((item) => {
                    this.classesOptions.push({
                        dictValue: item.dictValue,
                        dictCode: item.dictCode
                    })
                })
            });
        }

        // # 2 生产人员
        initProductPeople() {
            PKG_API.PKG_USER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
                }).then(({ data }) => {
                    this.$refs.productPeople.init(data.data)

            });
        }

        // # 3 设备运行
        initEquipment() {
            PKG_API.PKG_DEVICE_QUERY_API({ // 设备运行-查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
                }).then(({ data }) => {
                    this.$refs.equipment.init(data.data, 'first')

            });
            PKG_API.PKG_EXCEPTION_QUERY_API({ // 停机情况-查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
                }).then(({ data }) => {
                    this.$refs.equipment.init(data.data, 'second')

            });
        }

        // # 4 生产入库
        initProductInStorage() {
            PKG_API.PKG_INSTORAGE_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo,
                materialCode: this.formHeader.materialCode
            }).then(({ data }) => {
                this.$refs.productInStorage.init(data.data)
            })
        }

        // # 5 料领领用
        initSemiMaterial() {
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
            // this.$refs.material.init(this.formHeader)
        }

        // # 6 待处理数量
        initPendingNum() {
            PKG_API.PKG_PENDGNUM_QUERY_API({ // 待杀菌检测-查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
                // materialCode: this.formHeader.materialCode
            }).then(({ data }) => {
                this.$refs.pendingNum.init(data.data)
            })
        }

         // # 7 文本记录
        initTextRecord() {
            PKG_API.PKG_TEXT_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                let dataTemp = {}
                if (data.data !== null) {
                    dataTemp = JSON.parse(JSON.stringify(data.data))
                }
                this.$refs.textRecord.init(dataTemp);
            })
        }

        urgentSubmit() {
            console.log('紧急提交!')

            this.dataGroup = {}
            this.pkgDataOrderUpdate()
            this.pkgDataInStorage()

            PKG_API.PKG_URGENT_SUBMIT_API(
                this.dataGroup
            ).then(({ data }) => {
                console.log(data)
            });

        }

        // # pkgOrderUpdate
        pkgDataOrderUpdate() {
            this.dataGroup.pkgOrderUpdate = {
                orderId: this.formHeader.id,
                orderNo: this.formHeader.orderNo,
                productDate: this.formHeader.productDate,
                productLine: this.formHeader.productLine,
                workShop: this.formHeader.workShop,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                materialCode: this.formHeader.materialCode,
                orderType: this.formHeader.orderType
            };
            this.dataGroup.pkgUserSaveRequestDto = {}
            this.dataGroup.pkgTimeSheet = {}
            this.dataGroup.pkgText = {}
            this.dataGroup.pkgSemiMaterial = {}
            this.dataGroup.pkgPackingMaterial = {}
            this.dataGroup.pkgInstorage = {}
            this.dataGroup.pkgGerms = {}
            this.dataGroup.pkgExceptionSaveRequestDto = {}
            this.dataGroup.pkgDeviceSaveRequestDto = {}
        }

        // # 1 pkgTimeSheet
        pkgDataTimeSheet() {
            if (this.$refs.readyTime.executeSave()) {
                const timeSheetTemp = this.$refs.readyTime.returnDataGroup()
                timeSheetTemp.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                timeSheetTemp.orderId = this.formHeader.id
                timeSheetTemp.orderNo = this.formHeader.orderNo

                if (timeSheetTemp.id) {
                    this.pkgTimeSheet = {
                        pkgTimeSheetInsertDto: {},
                        pkgTimeSheetUpdateDto: timeSheetTemp
                    }
                } else {

                    this.pkgTimeSheet = {
                        pkgTimeSheetInsertDto: timeSheetTemp,
                        pkgTimeSheetUpdateDto: {}
                    }
                }
                this.dataGroup.pkgTimeSheet = this.pkgTimeSheet;
            } else {
                this.dataGroup.pkgTimeSheet = {}
            }


        }

        // # 2 pkgProductPeople
        pkgDataProductPeople() {
            if (this.isProductPeopleLoaded === true && this.$refs.productPeople.tabChangeState()) { // 判断是否有点击过验签与内容有异动
                const productPeopleTemp = this.$refs.productPeople.returnDataGroup()
                if (productPeopleTemp.insertData.length !== 0) {
                    productPeopleTemp.insertData.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        item.orderId = this.formHeader.id;
                        item.orderNo = this.formHeader.orderNo;
                    });
                }
                if (productPeopleTemp.updateData.length !== 0) {
                    productPeopleTemp.updateData.forEach(item => {
                        item.orderId = this.formHeader.id;
                    });
                }

                this.pkgUserSaveRequestDto = {
                    countMan: productPeopleTemp.countMan,
                    ids: productPeopleTemp.deleteData,
                    pkgUserInsertDto: productPeopleTemp.insertData,
                    pkgUserUpdateDto: productPeopleTemp.updateData
                }
                this.dataGroup.pkgUserSaveRequestDto = this.pkgUserSaveRequestDto;
            } else {
                this.dataGroup.pkgUserSaveRequestDto = {}
            }
        }

        // # 3 pkgDataEquipment
        pkgDataEquipment() {
            if (this.isEquipmentLoaded === true && this.$refs.equipment.tabChangeState()) { // 判断是否有点击过验签与内容有异动
                const firstEquipmentTemp = this.$refs.equipment.returnFirstDataGroup()
                const secondEquipmentTemp = this.$refs.equipment.returnSecondDataGroup()

                if (firstEquipmentTemp.insertData.length !== 0) {
                    firstEquipmentTemp.insertData.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        item.orderId = this.formHeader.id;
                        item.orderNo = this.formHeader.orderNo;
                    });
                }
                if (firstEquipmentTemp.updateData.length !== 0) {
                    firstEquipmentTemp.updateData.forEach(item => {
                        item.orderId = this.formHeader.id;
                    });
                }


                if (secondEquipmentTemp.insertData.length !== 0) {
                    secondEquipmentTemp.insertData.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        item.orderId = this.formHeader.id;
                        item.orderNo = this.formHeader.orderNo;
                    });
                }
                if (secondEquipmentTemp.updateData.length !== 0) {
                    secondEquipmentTemp.updateData.forEach(item => {
                        item.orderId = this.formHeader.id;
                    });
                }


                this.pkgDeviceSaveRequestDto = {
                    deviceRunTime: firstEquipmentTemp.deviceRunTime,
                    ids: firstEquipmentTemp.updateData,
                    pkgDeviceInsertDtos: firstEquipmentTemp.deleteData,
                    pkgDeviceUpdateDtos: firstEquipmentTemp.insertData

                }

                this.pkgExceptionSaveRequestDto = {
                    devicePauseTime: secondEquipmentTemp.devicePauseTime,
                    ids: secondEquipmentTemp.updateData,
                    pkgExceptionInsertDtos: secondEquipmentTemp.deleteData,
                    pkgExceptionUpdateDtos: secondEquipmentTemp.insertData

                }

                this.dataGroup.pkgDeviceSaveRequestDto = this.pkgDeviceSaveRequestDto;
                this.dataGroup.pkgExceptionSaveRequestDto = this.pkgExceptionSaveRequestDto;

            }
        }

        // # 4 pkgInStorage
        pkgDataInStorage() {
            if (this.isProductInStorageLoaded === true && this.$refs.productInStorage.tabChangeState()) { // 判断是否有点击过验签与内容有异动
                const productInStorageTemp = this.$refs.productInStorage.returnDataGroup()
                if (productInStorageTemp.insertData.length !== 0) {
                    productInStorageTemp.insertData.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        item.orderId = this.formHeader.id;
                        item.orderNo = this.formHeader.orderNo;
                    });
                }
                if (productInStorageTemp.updateData.length !== 0) {
                    productInStorageTemp.updateData.forEach(item => {
                        item.orderId = this.formHeader.id;
                    });
                }

                this.pkgInStorage = {
                    counOutputUnit: productInStorageTemp.unit,
                    countOutput: productInStorageTemp.amount,
                    instorageDelete: productInStorageTemp.deleteData,
                    instorageInsert: productInStorageTemp.insertData,
                    instorageUpdate: productInStorageTemp.updateData
                }
                this.dataGroup.pkgInstorage = this.pkgInStorage;
            } else {
                this.dataGroup.pkgInstorage = {}
            }
        }

        // # 5 pkgMaterial
        pkgDataMaterial() {
            //
        }

        // # 6 pkgPendingNum
        pkgPendingNum() {
            if (this.isPendingNumLoaded === true && this.$refs.pendingNum.tabChangeState()) { // 判断是否有点击过验签与内容有异动
                const pendingNumTemp = this.$refs.pendingNum.returnDataGroup()
                if (pendingNumTemp.insertData.length !== 0) {
                    pendingNumTemp.insertData.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        item.orderId = this.formHeader.id;
                        item.orderNo = this.formHeader.orderNo;
                    });
                }
                if (pendingNumTemp.updateData.length !== 0) {
                    pendingNumTemp.updateData.forEach(item => {
                        item.orderId = this.formHeader.id;
                    });
                }

                this.pkgGerms = {
                    germsDelete: pendingNumTemp.deleteData,
                    germsInsert: pendingNumTemp.insertData,
                    germsUpdate: pendingNumTemp.updateData
                }
                this.dataGroup.pkgGerms = this.pkgGerms;
            } else {
                this.dataGroup.pkgGerms = {}
            }
        }

        // # 7 文本记录
        pkgDataText() {
            if (this.isTextLoaded === true && this.$refs.textRecord.executeSave()) { // 判断是否有点击过验签与内容有异动
                const textRecordTemp = this.$refs.textRecord.returnDataGroup()
                textRecordTemp.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                textRecordTemp.orderId = this.formHeader.id
                textRecordTemp.orderNo = this.formHeader.orderNo
                if (textRecordTemp.id) {
                    this.pkgText = {
                        pkgTextInsert: {},
                        pkgTextUpdate: textRecordTemp
                    }
                } else {
                    this.pkgText = {
                        pkgTextInsert: textRecordTemp,
                        pkgTextUpdate: {}
                    }
                }
                this.dataGroup.pkgText = this.pkgText;
            } else {
                this.dataGroup.pkgText = {}
            }
        }
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
    orderId?: string;
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
    pkgPackingMaterial?: object;
    pkgSemiMaterial?: object;
    pkgText?: object;
    pkgTimeSheet?: object;
    pkgDeviceSaveRequestDto?: object;
    pkgExceptionSaveRequestDto?: object;
    pkgUserSaveRequestDto?: object;
}

interface PkgGerms {
    germsDelete?: string[];
    germsInsert?: object[];
    germsUpdate?: object[];
}

interface PkgInstorage{
    counOutputUnit?: string;
    countOutput?: number;
    // factory?: string;
    instorageDelete?: string[];
    instorageInsert?: object[];
    instorageUpdate?: object[];
    // remark?: string;
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

interface PkgText { // 文本记录
    pkgTextInsert?: object;
    pkgTextUpdate?: object;
}

interface PkgDeviceSaveRequestDto{
    ids?: string[];
    pkgDeviceInsertDtos?: object[];
    pkgDeviceUpdateDtos?: object[];
}

interface PkgExceptionSaveRequestDto{
    ids?: string[];
    pkgExceptionInsertDtos?: object[];
    pkgExceptionUpdateDtos?: object[];
}

interface PkgUserSaveRequestDto{
    countMan?: number;
    ids?: string[];
    pkgUserInsertDto?: object[];
    pkgUserUpdateDto?: object[];
}

interface PkgDeviceSaveRequestDto{
    deviceRunTime?: number;
    ids?: string[];
    pkgDeviceInsertDtos?: object [];
    pkgDeviceUpdateDto?: object [];
}

interface PkgExceptionSaveRequestDto{
    devicePauseTime?: number;
    ids?: string[];
    pkgDeviceInsertDtos?: object [];
    pkgDeviceUpdateDto?: object [];
}
</script>

<style>
</style>
