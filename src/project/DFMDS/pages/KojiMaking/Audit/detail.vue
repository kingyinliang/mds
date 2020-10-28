<template>
    <div>
        <data-entry
            ref="dataEntry"
            type="audit"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatusName"
            :tabs="tabs"
            @tab-click="tabClick"
        >
            <template slot="1">
                <el-table ref="manHourList" class="newTable" :data="manHourList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="工序" prop="process" min-width="120" />
                    <el-table-column label="曲房" prop="kojiHouseName" min-width="120" />
                    <el-table-column label="入曲时间" prop="addKojiDate" width="180" />
                    <el-table-column label="准备工时" prop="prepairedHour" width="180" />
                    <el-table-column label="单位" prop="" width="120">
                        <template>
                            {{ '小时' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="人工工时" prop="manHour" width="120" />
                    <el-table-column label="单位" prop="" width="120">
                        <template>
                            {{ '小时' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disable="scope.row.enableBack!==1" @click="reject">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="2">
                <el-table ref="machineHourList" class="newTable" :data="machineHourList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="工序" prop="process" min-width="120" />
                    <el-table-column label="曲房" prop="kojiHouseName" min-width="120" />
                    <el-table-column label="入曲日期" prop="addKojiDate" width="180" />
                    <el-table-column label="机器工时" prop="machineHour" width="120" />
                    <el-table-column label="单位" prop="" width="120">
                        <template>
                            {{ '小时' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disable="scope.row.enableBack!==1" @click="reject">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="3">
                <el-table ref="inStorageList" class="newTable" :data="inStorageList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="曲房号" prop="kojiHouseName" min-width="120" />
                    <el-table-column label="入曲日期" prop="addKojiDate" width="180" />
                    <el-table-column label="大豆量(KG)" prop="beanAmount" width="120" />
                    <el-table-column label="麦粉量(KG)" prop="wheatAmount" width="120" />
                    <el-table-column label="菌种量" prop="strainAmount" width="120" />
                    <el-table-column label="入库量" prop="inStorageAmount" width="120" />
                    <el-table-column label="入库批次" prop="inStorageBatch" min-width="120" />
                    <el-table-column label="单位" prop="unit" width="120" />
                    <el-table-column label="操作人" prop="changer" min-width="120" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column label="操作" prop="" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disable="scope.row.enableBack!==1" @click="reject">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row class="solerow">
                    <div>
                        入库量：
                    </div>
                    <div class="input_bottom">
                        {{ inStorageComputed }} KG
                    </div>
                </el-row>
            </template>
            <template slot="4">
                <el-table ref="meterialList" class="newTable" :data="meterialList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="曲房" prop="kojiHouseName" width="120" />
                    <el-table-column label="入曲日期" prop="addKojiDate" width="180" />
                    <el-table-column label="物料" prop="material" min-width="120" />
                    <el-table-column label="批次" prop="batch" min-width="120" />
                    <el-table-column label="数量" prop="amount" width="120" />
                    <el-table-column label="单位" prop="unit" width="120" />
                    <el-table-column label="操作人员" prop="changer" width="180" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column label="操作" prop="" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disable="scope.row.enableBack!==1" @click="reject">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="5">
                <el-table ref="craftList" class="newTable" :data="craftList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="曲房" prop="kojiHouseName" min-width="120" />
                    <el-table-column label="入曲日期" prop="addKojiDate" min-width="120" />
                    <el-table-column label="工序" prop="process" min-width="120" />
                    <el-table-column label="详情" prop="arg" min-width="120">
                        <template slot-scope="scope">
                            <span @click="goProcessDetail">{{ `${scope.row.process}详情` }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="提交人" prop="changer" min-width="120" />
                    <el-table-column label="提交时间" prop="changed" min-width="120" />
                </el-table>
            </template>
            <template slot="custom_btn">
                <el-button v-if="rejectBtn === 'D' && isAuth('pkgCkRefuse')" type="primary" size="small" class="sub-red" @click="reject">
                    审核不通过
                </el-button>
            </template>
        </data-entry>
        <el-dialog title="审核日志" width="900px" :close-on-click-modal="false" :visible.sync="visibleAuditLog">
            <audit-log :table-data="auditLogData" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="7" class="textarea" style="width: 100%;" />
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
    import { COMMON_API, PKG_API, KOJI_API, AUDIT_API } from 'common/api/api';

    @Component({
        name: 'KojiAuditDetail'
    })
    export default class AuditDetail extends Vue {
        $refs: {
            manHourList: HTMLFormElement; // 1人工工时
            machineHourList: HTMLFormElement; // 2机械工时
            inStorageList: HTMLFormElement; // 3生产入库
            meterialList: HTMLFormElement; // 4物料领用
            craftList: HTMLFormElement; // 5工艺列表
            dataEntry: HTMLFormElement;
        };

        currentOrderNo=''

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShopName'
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
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: 'orderStartDate'
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
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
                label: '准备人工',
                status: '未录入',
                isRedact: false
            },
            {
                label: '机器工时',
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
                label: '工艺列表',
                isRedact: false
            }
        ];

        rejectBtn = '';
        formHeader: OrderData = {};
        auditLogData = [] // 审核日志
        // classesOptions: object[] = [];
        visibleRefuse = false; // 退回弹窗
        visibleAuditLog= false; // 审核日志弹窗
        ReText = '';

        manHourList: ManHourList[] = [];
        machineHourList: MachineHourList[] = [];
        inStorageList: InStorageList[] = [];
        meterialList: MeterialList[]= [];
        craftList: CraftList[] = [];

        async mounted() {
            this.currentOrderNo = '851000002087'

            await this.initData(this.currentOrderNo)

            this.getManHourList()
            this.getMachineHourList()
            this.getInStorageList()
            this.getMeterialList()
            this.getCraftList()
            // COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
            //     this.classesOptions = []
            //     data.data.forEach((item) => {
            //         this.classesOptions.push({
            //             dictValue: item.dictValue,
            //             dictCode: item.dictCode
            //         })
            //     })
            // });
        }


        // 工艺列表 tab 工序详情
        goProcessDetail() {
            //
        }

        get inStorageComputed() {
            let result = 0
            if (this.inStorageList.length !== 0) {
                this.inStorageList.forEach(item => {
                    result += item.inStorageAmount
                })
            }
            //
            return result
        }

        getManHourList() {
            KOJI_API.KOJI_ADDIT_QUERY_MANHOUR_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('准备工时data')
                console.log(data)
                this.manHourList = []
                if (data.data !== null) {
                    this.manHourList = data.data
                }
            });
        }

        getMachineHourList() {
            KOJI_API.KOJI_ADDIT_QUERY_MACHINEHOUR_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('机械工时data')
                console.log(data)
                this.machineHourList = []
                if (data.data !== null) {
                    this.machineHourList = data.data
                }
            });
        }

        getInStorageList() {
            KOJI_API.KOJI__AUDIT_QUERY_INSTORAGE_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('生产入库data')
                console.log(data)
                this.inStorageList = []
                if (data.data !== null) {
                    this.inStorageList = data.data
                }
            });
        }

        getMeterialList() {
            KOJI_API.KOJI_AUDIT_QUERY_MARTERIAL_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('物料领用data')
                console.log(data)
                this.meterialList = []
                if (data.data !== null) {
                    this.meterialList = data.data
                }
            });
        }

        getCraftList() {
            KOJI_API.KOJI_AUDIT_QUERY_CRAFT_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('工艺列表data')
                console.log(data)
                this.craftList = []
                if (data.data !== null) {
                    this.craftList = data.data
                }
            });
        }

        tabClick(val) {
            const num = Number(val.name) - 1;
            const status: (any) =  this.tabs[num].status;// eslint-disable-line
            status ? this.rejectBtn = status : this.rejectBtn = ''
        }

        async initData(order) {
            // 表头讯息
            await COMMON_API.COMMON_QUERY_BY_ORDERNO_API({ // 基础数据-订单管理-根据订单号查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: order
            }).then(({ data }) => {
                console.log('订单号data')
                console.log(data)
                this.formHeader = data.data;
                this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptName;
                this.formHeader.orderId = this.formHeader.id;
            })


            // 页签状态
            await KOJI_API.KOJI_PAGE_TAG_STATUS_QUERY_API({
                kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('页签data')
                console.log(data)
                if (data.data !== null) {
                    // this.rejectBtn = data.data.readyTagStatus;
                    // this.tabs[0].status = data.data.readyTagStatus;
                    // this.tabs[1].status = data.data.userTagStatus;
                    // this.tabs[2].status = data.data.deviceTagStatus;
                    // this.tabs[3].status = data.data.storageTagStatus;
                    // this.tabs[4].status = data.data.materialTagStatus;
                    // this.$refs.dataEntry.updateTabs();
                }
            });
        }

        reject() {
            // if (this.$refs.dataEntry.activeName === '6' || this.$refs.dataEntry.activeName === '7') {
            //     return false
            // }
            // if (this.tabs[Number(this.$refs.dataEntry.activeName) - 1].status !== 'D') {
            //     return false
            // }
            this.ReText = '';
            this.visibleRefuse = true;

        }

        auditLog(row) {

            AUDIT_API.AUDIT_DIALOG_LOG_LIST_API({
                verifyId: row.id,
                verifyType: 'TIMESHEET'
            }).then(({ data }) => {
                this.auditLogData = data.data
                this.visibleAuditLog = true
            })
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
                this.initData(this.currentOrderNo)
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

    interface ManHourList {
        addKojiDate: string;
        enableBack: number;
        kojiHouseNo: string;
        kojiHouseName: string;
        machineHour: number;
        manHour: number;
        prepairedHour: number;
        process: string;
    }
    interface MachineHourList {
        addKojiDate: string;
        enableBack: number;
        kojiHouseNo: string;
        kojiHouseName: string;
        machineHour: number;
        manHour: number;
        prepairedHour: number;
        process: string;
    }
    interface InStorageList {
        addKojiDate: string;
        beanAmount: number;
        changed: string;
        changer: string;
        enableBack: number;
        inStorageAmount: number;
        inStorageBatch: string;
        kojiHouseNo: string;
        kojiHouseName: string;
        strainAmount: number;
        unit: string;
        unitName: string;
        wheatAmount: number;
    }
    interface MeterialList {
        addKojiDatestring;
        amount: number;
        batch: string;
        changedstring;
        changer: string;
        enableBack: number;
        kojiHouseNo: string;
        kojiHouseName: string;
        material: string;
        materialName: string;
        unit: string;
        unitName: string;
    }
    interface CraftList {
        addKojiDate: string;
        arg: string;
        changed: string;
        changer: string;
        kojiHouseNo: string;
        kojiHouseName: string;
        process: string;
    }
</script>

<style scoped>

</style>
