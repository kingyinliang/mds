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
                <el-table ref="semiReceive" class="newTable" :data="semiReceiveList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <!-- <el-table-column label="发酵罐/池号" prop="fermentPotName" min-width="120" /> -->
                    <table-tree-column label="发酵罐/池号" prop="fermentPotName" min-width="120" tree-key="id" show-overflow-tooltip />
                    <el-table-column label="生产锅号" prop="stePotNo" min-width="80" />
                    <el-table-column label="锅序" prop="potOrder" min-width="65" />
                    <el-table-column label="锅单号" prop="potOrderNo" min-width="180" />
                    <el-table-column label="领用物料" min-width="220">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }} {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="consumeUnit" min-width="55" />
                    <el-table-column label="领用数量" prop="consumeAmount" min-width="100" />
                    <el-table-column label="领用批次" prop="consumeBatch" min-width="120" />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                    <el-table-column label="操作" prop="" min-width="65" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.children" type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="2">
                <el-table ref="acceAdd" class="newTable" :data="acceAddList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <!-- <el-table-column label="领用物料" prop="" min-width="120" /> -->
                    <table-tree-column label="领用物料" prop="material" min-width="220" tree-key="id" show-overflow-tooltip />
                    <el-table-column label="前处理阶段" prop="preStage" min-width="90" />
                    <el-table-column label="需求用量" prop="needAmount" min-width="80" />
                    <el-table-column label="单位" prop="unit" min-width="55" />
                    <el-table-column label="生产锅号" prop="potNo" min-width="80" />
                    <el-table-column label="锅序" prop="potOrder" min-width="65" />
                    <el-table-column label="锅单号" prop="potOrderNo" min-width="180" />
                    <el-table-column label="领用数量" prop="useAmount" min-width="90" />
                    <el-table-column label="领用批次" prop="useBatch" min-width="115" />
                    <el-table-column label="添加时间" prop="addTime" min-width="165" />
                    <el-table-column label="操作" prop="" min-width="65" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.children" type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="3">
                <el-table ref="craft" class="newTable" :data="craftList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="生产锅号" prop="potNo" min-width="90" />
                    <el-table-column label="锅序" prop="potOrder" min-width="80" />
                    <el-table-column label="锅单号" prop="potOrderNo" min-width="180" />
                    <el-table-column label="入料时间" prop="" min-width="180">
                        <template slot-scope="scope">
                            {{ scope.row.feedStartDate }} - {{ scope.row.feedEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="升温时间" prop="" min-width="180">
                        <template slot-scope="scope">
                            {{ scope.row.riseStartDate }} - {{ scope.row.riseEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="保温阶段-ZK" prop="keepZkFlag" min-width="85" />
                    <el-table-column label="降温阶段-ZK" prop="coolZkFlag" min-width="85" />
                    <el-table-column label="类型" prop="controlType" min-width="120" />
                    <el-table-column label="阶段" prop="controlStage" min-width="120" />
                    <el-table-column label="记录时间" prop="recordDate" min-width="165" />
                    <el-table-column label="温度" prop="temp" min-width="60" />
                    <el-table-column label="操作" min-width="65" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="4">
                <el-row class="solerow">
                    <div>
                        订单产量：
                    </div>
                    <div class="input_bottom">
                        {{ inStorage.planOutPut }}
                    </div>
                    <div>
                        实际产量：
                    </div>
                    <div class="input_bottom">
                        {{ inStorage.realOutPut }}
                    </div>
                    <div>
                        生产锅数：
                    </div>
                    <div class="input_bottom">
                        {{ inStorage.realPotCount }}
                    </div>
                </el-row>
                <el-table ref="inStorage" class="newTable" :data="inStorageList" header-row-class-name="tableHead" style="margin-top: 10px;" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="正常入库" prop="normalFlag" min-width="50" />
                    <el-table-column label="包装产线" prop="packageLine" min-width="180" show-overflow-tooltip />
                    <el-table-column label="包装订单" prop="packageOrderNo" min-width="120" />
                    <el-table-column label="入库物料" prop="" min-width="220" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.materialName }} {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="materialUnit" min-width="65" />
                    <el-table-column label="入库数量" prop="inStorageAmount" min-width="90" />
                    <el-table-column label="入库批次" prop="inStorageBatch" min-width="110" />
                    <el-table-column label="备注" prop="remark" min-width="90" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                    <el-table-column label="操作" min-width="65" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="5">
                <el-table ref="excRecord" class="newTable" :data="excRecordList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="生产锅号" prop="potNo" min-width="90" />
                    <el-table-column label="锅序" prop="potOrder" min-width="80" />
                    <el-table-column label="锅单号" prop="potOrderNo" min-width="120" />
                    <el-table-column label="班次" prop="className" min-width="70" />
                    <el-table-column label="异常情况" prop="exceptionSituationName" min-width="120" show-overflow-tooltip />
                    <el-table-column label="开始时间" prop="startDate" min-width="145" />
                    <el-table-column label="结束时间" prop="endDate" min-width="145" />
                    <el-table-column label="时长" prop="duration" min-width="80" />
                    <el-table-column label="单位" prop="durationUnit" min-width="65" />
                    <el-table-column label="异常原因" prop="exceptionReason" min-width="120" />
                    <el-table-column label="异常描述" prop="exceptionInfo" min-width="120" show-overflow-tooltip />
                    <el-table-column label="备注" prop="remark" min-width="90" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                </el-table>
            </template>
            <template slot="6">
                <el-table ref="working" class="newTable" :data="workingList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="准备工时" prop="readyTime" min-width="80" />
                    <el-table-column label="单位" prop="readyUnit" min-width="60" />
                    <el-table-column label="人员工时" prop="manTime" min-width="80" />
                    <el-table-column label="单位" prop="manUnit" min-width="60" />
                    <el-table-column label="机器工时" prop="machineTime" min-width="80" />
                    <el-table-column label="单位" prop="machineUnit" min-width="60" />
                    <!-- <el-table-column label="锅序" prop="" min-width="120" /> -->
                    <table-tree-column label="锅序" prop="potOrder" min-width="90" tree-key="id" show-overflow-tooltip />
                    <el-table-column label="锅单号" prop="potOrderNo" min-width="180" show-overflow-tooltip />
                    <el-table-column label="备注" prop="remark" min-width="90" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                    <el-table-column label="操作" min-width="65" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </data-entry>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="visibleRefuse = false">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="refuse()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import TableTreeColumn from '@/views/components/table-tree-column'
    import { COMMON_API, STE_API } from 'common/api/api';

    @Component({
        // components: {
        //     // AuditDetail,
        //     TableTreeColumn
        // }
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
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialName', 'materialCode']
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
                type: 'date-picker',
                icon: 'factory-bianhao',
                label: '生产锅数',
                value: 'planPotCount'
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
                label: '半成品领用',
                status: '未录入',
                isRedact: false
            },
            {
                label: '辅料添加',
                status: '未录入',
                isRedact: false
            },
            {
                label: '工艺控制',
                status: '未录入',
                isRedact: false
            },
            {
                label: '杀菌入库',
                status: '未录入',
                isRedact: false
            },
            {
                label: '异常记录',
                isRedact: false
            },
            {
                label: '杀菌工时',
                status: '未录入',
                isRedact: false
            }
        ];

        passBtn = '';
        auditDetail = {};
        formHeader: OrderData = {};
        inStorage: object = {};
        classesOptions: object[] = [];
        visibleRefuse = false;
        ReRow: object = {};
        ReText = '';

        semiReceiveList = [];
        acceAddList = [];
        craftList = [];
        inStorageList = [];
        excRecordList = [];
        workingList: object[] = [];
        computedSoy = 0;
        abnormalList = [];
        excReasonTotal: ExcReasonTotal = {
            FAULTSHUTDOWN: [],
            POORPROCESSWAIT: [],
            ENERGY: []
        };


        mounted() {
            this.auditDetail = this.$store.state.sterilize.auditDetailDetail;
            console.log(this.auditDetail);

            this.initData();
        }

        // 页签状态
        initData() {
            STE_API.STE_INSTORAGE_QUERY_TABS_STATUS_API([this.auditDetail['orderNo']]).then(({ data }) => {
                if (data.data !== null) {
                    this.passBtn = data.data[0].readyTagStatus;
                    this.tabs[0].status = data.data[0].materialStatus;
                    this.tabs[1].status = data.data[0].accessoriesStatus;
                    this.tabs[2].status = data.data[0].controlStatus;
                    this.tabs[3].status = data.data[0].instorageStatus;
                    this.tabs[5].status = data.data[0].timesheetStatus;
                    this.$refs.dataEntry.updateTabs();

                    this.getHeaderInfo(this.auditDetail['orderNo']);
                    this.getSemiMaterial(this.auditDetail['orderNo']);
                    this.getAccessList(this.auditDetail['orderNo']);
                    this.getInstorageList(this.auditDetail['orderNo']);
                    this.getCraftList(this.auditDetail['orderNo']);

                    const net1 = new Promise((resolve) => {
                        this.getexcReasonTwo(resolve);
                    });
                    const net2 = new Promise((resolve) => {
                        this.getexcReasonThree(resolve);
                    });
                    const net3 = new Promise((resolve) => {
                        this.getClassesList(resolve);
                    });
                    const net4 = new Promise((resolve) => {
                        this.getAbnormalList(resolve);
                    });
                    Promise.all([net1, net2, net3, net4]).then(() => {
                        // COMMON_API.DEVICE_LISTBYTYPE_API({ deptId: this.auditDetail['workShop'] }).then(({ data }) => {
                        //     data.data.map(item => {
                        //         this.excReasonTotal.FAULTSHUTDOWN.push({
                        //             dictValue: item.deviceName,
                        //             dictCode: item.deviceNo
                        //         })
                        //     })
                        //     this.getExceptionList(this.auditDetail['orderNo'], this.auditDetail['workShop']);
                        // })
                        this.getExceptionList(this.auditDetail['orderNo'], this.auditDetail['workShop']);
                    })

                    this.getTimeList(this.auditDetail['orderNo']);
                }
            });
        }

        getHeaderInfo(orderNo) {
            COMMON_API.OREDER_QUERY_BY_NO_API({ orderNo: orderNo, workShopType: 'sterilize' }).then(({ data }) => {
                this.formHeader = data.data;
            })
        }

        // 半成品
        getSemiMaterial(orderNo) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_SEMI_API({ orderNo: orderNo }).then(({ data }) => {
                this.semiReceiveList = this.RegroupData(data.data, 1, -1);
            })
        }

        // 辅料添加
        getAccessList(orderNo) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_ACCESS_API({ orderNo: orderNo }).then(({ data }) => {
                this.acceAddList = this.RegroupData(data.data, 1, -1);
            })
        }

        // 杀菌入库
        getInstorageList(orderNo) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_INSTORAGE_API({ orderNo: orderNo }).then(({ data }) => {
                this.inStorage = data.data;
                this.inStorageList = this.RegroupData(data.data.list, 1, -1);
            })
        }

        // 工艺
        getCraftList(orderNo) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_CRAFT_API({ orderNo: orderNo }).then(({ data }) => {
                this.craftList = data.data;
            })
        }

        // 班次
        getClassesList(resolve) {
            COMMON_API.DICTQUERY_CLASSLIST_API({}).then(({ data }) => {
                this.classesOptions = data.data;
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常
        getAbnormalList(resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'ABNORMAL_HALT' }).then(({ data }) => {
                this.abnormalList = data.data
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常原因
        getexcReasonTwo(resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'WAIT' }).then(({ data }) => {
                this.excReasonTotal.POORPROCESSWAIT = data.data
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常原因
        getexcReasonThree(resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'ENERGY' }).then(({ data }) => {
                this.excReasonTotal.ENERGY = data.data
            });
            if (resolve) {
                resolve('resolve');
            }
        }

        // 异常
        getExceptionList(orderNo, workShop) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_EXCEPTION_API({ orderNo: orderNo, workShop: workShop }).then(({ data }) => {
                this.excRecordList = data.data;
                data.data.map(item => {
                    const classesSole = this.classesOptions.find(it => it['dictCode'] === item.classes);
                    if (classesSole) {
                        item['className'] = classesSole['dictValue'];
                    }
                    const abnormalSole = this.abnormalList.find(it => it['dictCode'] === item.exceptionSituation);
                    if (abnormalSole) {
                        item['exceptionSituationName'] = abnormalSole['dictValue'];
                    }
                })
            })
        }

        // 工时
        getTimeList(orderNo) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_TIME_API({ orderNo: orderNo }).then(({ data }) => {
                // this.workingList.push(data.data);
                this.workingList = this.RegroupData([data.data], 1, -1);
            })
        }

        // 数据重组
        RegroupData(dataList, level, parentId) {
            for (let i = 0; i < dataList.length; i++) {
                dataList[i]['_level'] = level
                dataList[i]['parentId'] = parentId
                if (dataList[i]['materialCode']) {
                    dataList[i]['material'] = dataList[i]['materialName'] + ' ' + dataList[i]['materialCode'];
                }
                dataList[i]['children'] = dataList[i]['list']
                if (dataList[i]['list']) {
                    this.RegroupData(dataList[i]['list'], level + 1, dataList[i]['id'])
                }
            }
            return dataList;
        }

        tabClick(val) {
            const num = Number(val.name) - 1;
            const status: (any) =  this.tabs[num].status;// eslint-disable-line
            status ? this.passBtn = status : this.passBtn = ''
        }

        refuse() {
            if (!this.ReText) {
                this.$warningToast('请填写原因');
                return false
            }
            this.ReRow['orderNo'] = this.auditDetail['orderNo'];
            switch (this.$refs.dataEntry.activeName) {
                case '1':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_SEMI_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '2':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_ACCESS_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '3':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_TIMESHEET_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '4':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_INSTORAGE_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '6':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_TIMESHEET_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                default: console.log('123')
            }
        }

        pass(row) {
            if (this.$refs.dataEntry.activeName === '5') {
                return false
            }
            // if (this.tabs[Number(this.$refs.dataEntry.activeName) - 1].status !== 'D') {
            //     return false
            // }
            this.ReText = '';
            this.ReRow = row;
            this.visibleRefuse = true;
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
    interface ExcReasonTotal {
        FAULTSHUTDOWN: object[];
        POORPROCESSWAIT: object[];
        ENERGY: object[];
    }
</script>

<style scoped>

</style>
