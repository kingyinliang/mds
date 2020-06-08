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
        :saved-datas="sentData"
        :submit-urgent="false"
        @tab-click="tabClick"
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

        created() {

            this.formHeader = this.$store.state.packaging.packDetail
            console.log('表头数据顯示')
            console.log(this.formHeader)

            PKG_API.PKG_HOME_QUERY_BY_NO_API({ // 基础数据-订单管理-根据订单号查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {

                this.formHeader.orderStatus = data.data.orderStatus
                this.formHeader.orderType = data.data.orderType
                console.log('訂單查詢結果顯示')
                console.log(data)
            })
        }

        async mounted() {
            await COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
                    this.classesOptions = []
                    data.data.forEach((item) => {
                        this.classesOptions.push({
                            dictValue: item.dictValue,
                            dictCode: item.dictCode
                        })
                    })
                });

            this.initData()
        }

        // open() {
        // const h = this.$createElement;
        // // const self = this;
        //     this.$msgbox({
        //     title: '消息',
        //     message: `
        //         <el-radio-group v-model="radio">
        //             <el-radio :label="3">备选项</el-radio>
        //             <el-radio :label="6">备选项</el-radio>
        //             <el-radio :label="9">备选项</el-radio>
        //         </el-radio-group>
        //     `,
        //     dangerouslyUseHTMLString: true,
        //     showCancelButton: true,
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     beforeClose: (action, instance, done) => {
        //         if (action === 'confirm') {
        //         instance.confirmButtonLoading = true;
        //         instance.confirmButtonText = '执行中...';
        //         setTimeout(() => {
        //             done();
        //             setTimeout(() => {
        //             instance.confirmButtonLoading = false;
        //             }, 300);
        //         }, 3000);
        //         } else {
        //         done();
        //         }
        //     }
        //     }).then(action => {
        //     this.$message({
        //         type: 'info',
        //         message: 'action: ' + action
        //     });
        //     });
        // }

        // # 1 生产准备
        initReadyTime() {
            PKG_API.PKG_TIMESHEET_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                this.$refs.readyTime.init(JSON.parse(JSON.stringify(data.data)))
            })
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
                    this.$refs.equipment.initDevice(data.data)

            });
            PKG_API.PKG_EXCEPTION_QUERY_API({ // 停机情况-查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
                }).then(({ data }) => {
                    this.$refs.equipment.initException(data.data)

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
            setTimeout(() => {
                this.$refs.material.init(this.formHeader)
            }, 1000);
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

        initData() {
            // 切换页签时判断是否加载过
            this.isReadyTimeLoaded = false
            this.isProductPeopleLoaded = false
            this.isEquipmentLoaded = false
            this.isProductInStorageLoaded = false
            this.isMaterialLoaded = false
            this.isPendingNumLoaded = false
            this.isTextLoaded = false
            this.$refs.dataEntry.activeName = '1'
            // # 1生产准备
            this.initReadyTime()
            // # 2生产人员
            // this.initProductPeople()
            // # 3设备运行
            // this.initEquipment()
            // # 4生产入库
            // this.initProductInStorage()
            // # 5物料领用
            // this.initSemiMaterial()
            // # 6待处理数量
            // this.initPendingNum()
            // # 7文本记录
            // this.initTextRecord()

        }

        tabClick(val) {
            if (val.name === '1') {
                // if (!this.isReadyTimeLoaded) {
                //     this.isReadyTimeLoaded = true
                //     this.initReadyTime()
                // }
            } else if (val.name === '2') {
                if (!this.isProductPeopleLoaded) {
                    this.isProductPeopleLoaded = true
                    this.initProductPeople()
                }
            } else if (val.name === '3') {
                if (!this.isEquipmentLoaded) {
                    this.isEquipmentLoaded = true
                    this.initEquipment()
                }
            } else if (val.name === '4') {
                if (!this.isProductInStorageLoaded) {
                    this.isProductInStorageLoaded = true
                    this.initProductInStorage()
                }
            } else if (val.name === '5') {
                if (!this.isMaterialLoaded) {
                    this.isMaterialLoaded = true
                    this.initSemiMaterial()
                }
            } else if (val.name === '6') {
                if (!this.isPendingNumLoaded) {
                    this.isPendingNumLoaded = true
                    this.initPendingNum()
                }
            } else if (val.name === '7') {
                if (!this.isTextLoaded) {
                    this.isTextLoaded = true
                    this.initTextRecord()
                }
            } else {
                //
            }
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

        sentData(str) {
            console.log(str)
            // this.urgentSubmit()
            // # pkgOrderUpdate
            this.pkgDataOrderUpdate();
            // # v 1 pkgTimeSheet
            this.pkgDataTimeSheet();
            // # 2 pkgProductPeople
            this.pkgDataProductPeople();
            // # 3 pkgDataEquipment
            this.pkgDataEquipment();
            // # 4 pkgInStorage
            this.pkgDataInStorage()
            // # 5 pkgMaterial
            this.pkgDataMaterial()
            // # 6 pkgPendingNum
            this.pkgPendingNum()
            // # v 7 textRecord
            this.pkgDataText();

            return PKG_API.PKG_ALL_SAVE_API(this.dataGroup).then(() => {
                setTimeout(() => {
                    this.initData() // 刷新
                }, 1000);
            })
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
            if (this.isMaterialLoaded === true) {
                const materialTemp = this.$refs.productInStorage.returnDataGroup()

                this.dataGroup.pkgPackingMaterial = {
                    packingMaterialDelete: materialTemp.packingMaterialDelete,
                    packingMaterialInsert: materialTemp.packingMaterialInsert,
                    packingMaterialItemDelete: materialTemp.packingMaterialItemDelete,
                    packingMaterialUpdate: materialTemp.packingMaterialUpdate
                }
                this.dataGroup.pkgSemiMaterial = {
                    pkgSemiMaterialDelete: materialTemp.pkgSemiMaterialDelete,
                    pkgSemiMaterialInsert: materialTemp.pkgSemiMaterialInsert,
                    pkgSemiMaterialItemDelete: materialTemp.pkgSemiMaterialItemDelete,
                    pkgSemiMaterialUpdate: materialTemp.pkgSemiMaterialUpdate
                }
            } else {
                this.dataGroup.pkgPackingMaterial = {}
                this.dataGroup.pkgSemiMaterial = {}
            }
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
