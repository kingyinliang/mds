<template>
    <div>
        <data-entry
            ref="dataEntry"
            type="audit"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatus"
            :tabs="tabs"
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
            <template slot="custom_btn">
                <el-button type="primary" size="small" class="sub-red" @click="pass()">
                    审核不通过
                </el-button>
            </template>
        </data-entry>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleRefuse = false">
                    取消
                </el-button>
                <el-button type="primary" @click="refuse()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, PKG_API } from 'common/api/api';
    import ReadyTime from '../common/ReadyTimes.vue';
    import Material from '../common/Material.vue';
    import ProductPeople from '../common/ProductPeople.vue';
    import PendingNum from '../common/PendingNum.vue';
    import ProductInStorage from '../common/ProductInStorage.vue';
    import Equipment from '../common/Equipment.vue';

    @Component({
        name: 'AuditDetail',
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
    export default class AuditDetail extends Vue {
        $refs: {
            readyTime: HTMLFormElement; // 1生产准备
            productPeople: HTMLFormElement; // 2生产人员
            equipment: HTMLFormElement; // 3设备运行
            productInStorage: HTMLFormElement; // 4生产入库
            material: HTMLFormElement; // 5物料领用
            pendingNum: HTMLFormElement; // 6待处理数量
            textRecord: HTMLFormElement; // 7文本记录
            dataEntry: HTMLFormElement;
        };

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
                status: '未录入',
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

        formHeader: OrderData = {};
        classesOptions: object[] = [];
        visibleRefuse = false;
        ReText = '';

        mounted() {
            this.initData()
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

        initData() {
            PKG_API.PKG_TAG_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.$store.state.packaging.auditDetailDetail.orderNo
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
                orderNo: this.$store.state.packaging.auditDetailDetail.orderNo
            }).then(({ data }) => {
                this.formHeader = data.data;
                this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptName;
                this.formHeader.orderId = this.formHeader.id;
                this.$refs.readyTime.init(this.formHeader);
            })
        }

        pass() {
            if (this.$refs.dataEntry.activeName === '6' || this.$refs.dataEntry.activeName === '7') {
                return false
            }
            this.visibleRefuse = true;

        }

        refuse() {
            let refuseType;
            switch (this.$refs.dataEntry.activeName) {
                case '1':
                    refuseType = 'READY';
                    break;
                case '2':
                    refuseType = 'USER';
                    break;
                case '3':
                    refuseType = 'DEVICE';
                    break;
                case '4':
                    refuseType = 'STORAGE';
                    break;
                case '5':
                    refuseType = 'MATERIAL';
                    break;
                default: refuseType = ''
            }
            if (!refuseType) {
                return false
            }
            if (!this.ReText) {
                this.$warningToast('请填写原因');
                return false
            }
            PKG_API.PKG_AUDIT_DETAIL_REFUSE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                id: this.formHeader.id,
                orderId: this.formHeader.orderId,
                orderNo: this.formHeader.orderNo,
                memo: this.ReText,
                refuseType: refuseType
            }).then(() => {
                this.visibleRefuse = false;
                this.$successToast('操作成功');
                this.initData()
            })
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

<style scoped>

</style>
