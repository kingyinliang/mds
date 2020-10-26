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
                <el-table ref="semiReceive" class="newTable" :data="semiReceiveList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="发酵罐/池号" prop="" min-width="120" />
                    <el-table-column label="生产锅号" prop="" min-width="120" />
                    <el-table-column label="锅序" prop="" min-width="120" />
                    <el-table-column label="锅单号" prop="" min-width="120" />
                    <el-table-column label="领用物料" prop="" min-width="120" />
                    <el-table-column label="单位" prop="" min-width="120" />
                    <el-table-column label="领用数量" prop="" min-width="120" />
                    <el-table-column label="领用批次" prop="" min-width="120" />
                    <el-table-column label="操作人" prop="" min-width="120" />
                    <el-table-column label="操作时间" prop="" min-width="120" />
                    <el-table-column label="操作" prop="" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="scope.row">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="2">
                <el-table ref="acceAdd" class="newTable" :data="acceAddList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="领用物料" prop="" min-width="120" />
                    <el-table-column label="前处理阶段" prop="" min-width="120" />
                    <el-table-column label="需求用量" prop="" min-width="120" />
                    <el-table-column label="单位" prop="" min-width="120" />
                    <el-table-column label="生产锅号" prop="" min-width="120" />
                    <el-table-column label="锅序" prop="" min-width="120" />
                    <el-table-column label="锅单号" prop="" min-width="120" />
                    <el-table-column label="领用数量" prop="" min-width="120" />
                    <el-table-column label="领用批次" prop="" min-width="120" />
                    <el-table-column label="添加时间" prop="" min-width="120" />
                    <el-table-column label="操作" prop="" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="scope.row">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="3">
                <el-table ref="craft" class="newTable" :data="craftList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="生产锅号" prop="" min-width="120" />
                    <el-table-column label="锅序" prop="" min-width="120" />
                    <el-table-column label="锅单号" prop="" min-width="120" />
                    <el-table-column label="入料时间" prop="" min-width="120" />
                    <el-table-column label="升温时间" prop="" min-width="120" />
                    <el-table-column label="保温阶段-ZK" prop="" min-width="120" />
                    <el-table-column label="降温阶段-ZK" prop="" min-width="120" />
                    <el-table-column label="类型" prop="" min-width="120" />
                    <el-table-column label="阶段" prop="" min-width="120" />
                    <el-table-column label="记录时间" prop="" min-width="120" />
                    <el-table-column label="温度" prop="" min-width="120" />
                    <el-table-column label="操作" prop="" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="scope.row">
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
                        0{{ computedSoy }}
                    </div>
                    <div>
                        实际产量：
                    </div>
                    <div class="input_bottom">
                        0{{ computedSoy }}
                    </div>
                    <div>
                        生产锅数：
                    </div>
                    <div class="input_bottom">
                        0{{ computedSoy }}
                    </div>
                </el-row>
                <el-table ref="inStorage" class="newTable" :data="inStorageList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="正常入库" prop="" min-width="120" />
                    <el-table-column label="包装产线" prop="" min-width="120" />
                    <el-table-column label="包装订单" prop="" min-width="120" />
                    <el-table-column label="入库物料" prop="" min-width="120" />
                    <el-table-column label="单位" prop="" min-width="120" />
                    <el-table-column label="入库数量" prop="" min-width="120" />
                    <el-table-column label="入库批次" prop="" min-width="120" />
                    <el-table-column label="备注" prop="" min-width="120" />
                    <el-table-column label="操作人" prop="" min-width="120" />
                    <el-table-column label="操作时间" prop="" min-width="120" />
                    <el-table-column label="操作" prop="" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="scope.row">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="5">
                <el-table ref="excRecord" class="newTable" :data="excRecordList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="生产锅号" prop="" min-width="120" />
                    <el-table-column label="锅序" prop="" min-width="120" />
                    <el-table-column label="锅单号" prop="" min-width="120" />
                    <el-table-column label="班次" prop="" min-width="120" />
                    <el-table-column label="异常情况" prop="" min-width="120" />
                    <el-table-column label="开始时间" prop="" min-width="120" />
                    <el-table-column label="结束时间" prop="" min-width="120" />
                    <el-table-column label="时长" prop="" min-width="120" />
                    <el-table-column label="单位" prop="" min-width="120" />
                    <el-table-column label="异常原因" prop="" min-width="120" />
                    <el-table-column label="异常描述" prop="" min-width="120" />
                    <el-table-column label="备注" prop="" min-width="120" />
                    <el-table-column label="操作人" prop="" min-width="120" />
                    <el-table-column label="操作时间" prop="" min-width="120" />
                </el-table>
            </template>
            <template slot="6">
                <el-table ref="working" class="newTable" :data="workingList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="准备工时" prop="" min-width="120" />
                    <el-table-column label="单位" prop="" min-width="120" />
                    <el-table-column label="人员工时" prop="" min-width="120" />
                    <el-table-column label="单位" prop="" min-width="120" />
                    <el-table-column label="机器工时" prop="" min-width="120" />
                    <el-table-column label="单位" prop="" min-width="120" />
                    <el-table-column label="锅序" prop="" min-width="120" />
                    <el-table-column label="锅单号" prop="" min-width="120" />
                    <el-table-column label="备注" prop="" min-width="120" />
                    <el-table-column label="操作人" prop="" min-width="120" />
                    <el-table-column label="操作时间" prop="" min-width="120" />
                    <el-table-column label="操作" prop="" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="scope.row">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="custom_btn">
                <el-button v-if="passBtn === 'D' && isAuth('pkgCkRefuse')" type="primary" size="small" class="sub-red" @click="pass()">
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

    @Component({
        name: 'AuditDetail'
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
                type: 'date-picker',
                icon: 'factory-bianhao',
                label: '生产锅数',
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
                status: '未录入',
                isRedact: false
            },
            {
                label: '杀菌工时',
                isRedact: false
            }
        ];

        passBtn = '';
        formHeader: OrderData = {};
        classesOptions: object[] = [];
        visibleRefuse = false;
        ReText = '';

        semiReceiveList = [];
        acceAddList = [];
        craftList = [];
        inStorageList = [];
        excRecordList = [];
        workingList = [];

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

        tabClick(val) {
            const num = Number(val.name) - 1;
            const status: (any) =  this.tabs[num].status;// eslint-disable-line
            status ? this.passBtn = status : this.passBtn = ''
        }

        initData() {
            PKG_API.PKG_TAG_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.$store.state.packaging.auditDetailDetail.orderNo
            }).then(({ data }) => {
                if (data.data !== null) {
                    this.passBtn = data.data.readyTagStatus;
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
            })
        }

        pass() {
            if (this.$refs.dataEntry.activeName === '6' || this.$refs.dataEntry.activeName === '7') {
                return false
            }
            if (this.tabs[Number(this.$refs.dataEntry.activeName) - 1].status !== 'D') {
                return false
            }
            this.ReText = '';
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
