<template>
    <div>
        <data-entry
            ref="dataEntry"
            :redact-auth="'pkg:order:update'"
            :save-auth="'pkg:order:update'"
            :submit-auth="'pkg:order:update'"
            :order-status="formHeader.orderStatus"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            :urgent-submit="true"
            :submit-rules="submitRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            :submit-urgent="false"
            @success="getOrderList"
            @urgentSubmit="urgentSubmit"
        >
            <template slot="1" slot-scope="data">
                <ready-time ref="readyTime" :is-redact="data.isRedact" :classes-options="classesOptions" :status="tabs[0].status" />
            </template>
            <template slot="2" slot-scope="data">
                <product-people ref="productPeople" :is-redact="data.isRedact" :classes-options="classesOptions | classesOptionsFilter" :status="tabs[1].status" />
            </template>
            <template slot="3" slot-scope="data">
                <Equipment ref="equipment" :is-redact="data.isRedact" :classes-options="classesOptions | classesOptionsFilter" :product-line="formHeader.productLine" :status="tabs[2].status" />
            </template>
            <template slot="4" slot-scope="data">
                <product-in-storage ref="productInStorage" :is-redact="data.isRedact" :classes-options="classesOptions | classesOptionsFilter" :status="tabs[3].status" />
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
        <el-dialog width="400px" title="分批提交" :close-on-click-modal="false" :visible.sync="visible">
            <p style="margin-bottom: 20px; font-size: 18px;">
                本次提交是否提交全部数据
            </p>
            <el-radio v-model="submitRadio" label="1" style="font-size: 18px;">
                紧急提交
            </el-radio>
            <el-radio v-model="submitRadio" label="2">
                正常提交
            </el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="SubmitForm()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, PKG_API } from 'common/api/api';
    import ReadyTime from './common/ReadyTimes.vue';
    import Material from './common/Material.vue';
    import ProductPeople from './common/ProductPeople.vue';
    import PendingNum from './common/PendingNum.vue';
    import ProductInStorage from './common/ProductInStorage.vue';
    import Equipment from './common/Equipment.vue';

    @Component({
        name: 'PackagingDetail',
        components: {
            ReadyTime,
            ProductPeople,
            PendingNum,
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
        classesOptions: object[] = [];
        visible = false;
        submitRadio = '2';
        radio='';

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
                value: ['planOutput', 'outputUnit']
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: 'orderStartDate'
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
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        // tabs data
        tabs = [
            {
                label: '生产准备',
                status: '未录入'
            },
            {
                label: '生产人员',
                status: '未录入'
            },
            {
                label: '设备运行',
                status: '未录入'
            },
            {
                label: '生产入库',
                status: '未录入'
            },
            {
                label: '物料领用',
                status: '未录入'
            },
            {
                label: '待处理数量'
            },
            {
                label: '文本记录'
            }
        ];

        // 提交校验
        submitRules(): Function[] {
            return [this.$refs.readyTime.ruleSubmit, this.$refs.productPeople.ruleSubmit, this.$refs.pendingNum.ruleSubmit, this.$refs.material.ruleSubmit, this.$refs.equipment.ruleSubmit, this.$refs.productInStorage.ruleSubmit]
        }

        // 保存数据
        savedDatas() {
            const pkgTimeSheet = this.$refs.readyTime.savedData(this.formHeader);
            const pkgUserSaveRequestDto = this.$refs.productPeople.savedData(this.formHeader);
            const pkgInstorage = this.$refs.productInStorage.savedData(this.formHeader);
            const pkgGerms = this.$refs.pendingNum.savedData(this.formHeader);
            const pkgText = this.$refs.textRecord.savedData(this.formHeader);
            const { pkgDeviceSaveRequestDto, pkgExceptionSaveRequestDto } = this.$refs.equipment.savedData(this.formHeader);
            const { pkgPackingMaterial, pkgSemiMaterial } = this.$refs.material.savedData(this.formHeader);
            this.formHeader.orderId = this.formHeader.id;

            return PKG_API.PKG_ALL_SAVE_API({
                pkgOrderUpdate: this.formHeader,
                pkgTimeSheet,
                pkgUserSaveRequestDto,
                pkgDeviceSaveRequestDto,
                pkgExceptionSaveRequestDto,
                pkgInstorage,
                pkgPackingMaterial,
                pkgSemiMaterial,
                pkgGerms,
                pkgText
            })
        }

        // 提交数据
        submitDatas() {
            const pkgTimeSheet = this.$refs.readyTime.savedData(this.formHeader);
            const pkgUserSaveRequestDto = this.$refs.productPeople.savedData(this.formHeader);
            const pkgInstorage = this.$refs.productInStorage.savedData(this.formHeader);
            const pkgGerms = this.$refs.pendingNum.savedData(this.formHeader);
            const pkgText = this.$refs.textRecord.savedData(this.formHeader);
            const { pkgDeviceSaveRequestDto, pkgExceptionSaveRequestDto } = this.$refs.equipment.savedData(this.formHeader);
            const { pkgPackingMaterial, pkgSemiMaterial } = this.$refs.material.savedData(this.formHeader);
            this.formHeader.orderId = this.formHeader.id;

            return PKG_API.PKG_ALL_SUBMIT_API({
                pkgOrderUpdate: this.formHeader,
                pkgTimeSheet,
                pkgUserSaveRequestDto,
                pkgDeviceSaveRequestDto,
                pkgExceptionSaveRequestDto,
                pkgInstorage,
                pkgPackingMaterial,
                pkgSemiMaterial,
                pkgGerms,
                pkgText
            })
        }

        urgentSubmit() {
            this.visible = true
        }

        SubmitForm() {
            if (this.submitRadio === '1') {
                // 入库紧急提交校验
                if (!this.$refs.productInStorage.ruleSubmit('submit')) {
                    this.visible = false
                    return false;
                }
                this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const pkgTimeSheet = this.$refs.readyTime.savedData(this.formHeader);
                    const pkgUserSaveRequestDto = this.$refs.productPeople.savedData(this.formHeader);
                    const pkgInstorage = this.$refs.productInStorage.savedData(this.formHeader);
                    const pkgGerms = this.$refs.pendingNum.savedData(this.formHeader);
                    const pkgText = this.$refs.textRecord.savedData(this.formHeader);
                    const { pkgDeviceSaveRequestDto, pkgExceptionSaveRequestDto } = this.$refs.equipment.savedData(this.formHeader);
                    const { pkgPackingMaterial, pkgSemiMaterial } = this.$refs.material.savedData(this.formHeader);
                    this.formHeader.orderId = this.formHeader.id;
                    return PKG_API.PKG_URGENT_SUBMIT_API({
                        pkgOrderUpdate: this.formHeader,
                        pkgTimeSheet,
                        pkgUserSaveRequestDto,
                        pkgDeviceSaveRequestDto,
                        pkgExceptionSaveRequestDto,
                        pkgInstorage,
                        pkgPackingMaterial,
                        pkgSemiMaterial,
                        pkgGerms,
                        pkgText
                    }).then(() => {
                        this.$successToast('提交成功');
                        this.visible = false;
                    })
                })
            } else {

                // 工时前四个页签校验
                const pkgTimeSheet = this.$refs.readyTime.currentFormDataGroup;
                const productPeopleClass = this.$refs.productPeople.uniquenessClasses();
                const equipmentClass = this.$refs.equipment.uniquenessClasses();
                const productInStorageClass = this.$refs.productInStorage.uniquenessClasses();
                if (pkgTimeSheet.classes === 'D') { // 多班
                    if (productPeopleClass.length < 2) {
                        this.$warningToast('生产人员页签班次与准备工时不一致');
                        return false;
                    }
                    if (equipmentClass.length < 2) {
                        this.$warningToast('设备运行页签班次与准备工时不一致');
                        return false;
                    }
                    if (productInStorageClass.length < 2) {
                        this.$warningToast('生产入库页签班次与准备工时不一致');
                        return false;
                    }
                } else {
                    if (productPeopleClass.length !== 1 || pkgTimeSheet.classes !== productPeopleClass[0]) {
                        this.$warningToast('生产人员页签班次与准备工时不一致');
                        return false;
                    }
                    if (equipmentClass.length !== 1 || pkgTimeSheet.classes !== equipmentClass[0]) {
                        this.$warningToast('设备运行页签班次与准备工时不一致');
                        return false;
                    }
                    if (productInStorageClass.length !== 1 || pkgTimeSheet.classes !== productInStorageClass[0]) {
                        this.$warningToast('生产入库页签班次与准备工时不一致');
                        return false;
                    }
                }
                const arr = this.submitRules();
                for (const rule of arr) {
                    if (!rule('submit')) {
                        this.visible = false
                        return false;
                    }
                }
                this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.dataEntry.savedData('submit');
                })
            }
        }

        // 查询表头
        getOrderList() {
            this.visible = false;
            PKG_API.PKG_TAG_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.$store.state.packaging.packDetail.orderNo
            }).then(({ data }) => {
                if (data.data !== null) {
                    this.tabs[0].status = data.data.readyTagStatus;
                    this.tabs[1].status = data.data.userTagStatus;
                    this.tabs[2].status = data.data.deviceTagStatus;
                    this.tabs[3].status = data.data.storageTagStatus;
                    this.tabs[4].status = data.data.materialTagStatus;
                    this.$refs.dataEntry.updateTabs();
                }
            });
            PKG_API.PKG_HOME_QUERY_BY_NO_API({ // 基础数据-订单管理-根据订单号查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.$store.state.packaging.packDetail.orderNo
            }).then(({ data }) => {
                this.formHeader = data.data;
                this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptName;
                this.formHeader.orderId = this.formHeader.id;
                this.$refs.readyTime.init(this.formHeader);
                this.$refs.productPeople.init(this.formHeader);
                this.$refs.equipment.init(this.formHeader);
                this.$refs.productInStorage.init(this.formHeader);
                this.$refs.material.init(this.formHeader);
                this.$refs.pendingNum.init(this.formHeader);
                this.$refs.textRecord.init(this.formHeader);
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
    }
interface OrderData{
    factoryName?: string;
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
</script>

<style>
</style>
