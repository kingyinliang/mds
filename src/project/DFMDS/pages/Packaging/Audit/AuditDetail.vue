<template>
    <div class="header_main">
        <div class="dataEntry-head">
            <el-row class="dataEntry-head-base">
                <el-col :span="21">
                    <el-form :inline="true" :model="formHeader" label-width="75px" size="small" class="dataEntry-head-base__form">
                        <el-form-item label="生产车间：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产产线：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="订单产量：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="订单日期：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <p>123</p>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="3" style="margin-top: 16px;">
                    <i
                        class="dataEntry-head-title__status"
                        :class="{
                            noPass: orderStatus === 'noPass',
                            saved: orderStatus === 'saved',
                            submit: orderStatus === 'submit',
                            checked: orderStatus === 'checked',
                            '': orderStatus === '已同步',
                        }"
                    >
                        订单状态：{{ orderStatus === 'noPass' ? '审核不通过' : orderStatus === 'saved' ? '已保存' : orderStatus === 'submit' ? '已提交' : orderStatus === 'checked' ? '通过' : orderStatus === '已同步' ? '未录入' : orderStatus === 'toBeAudited' ? '待审核' : orderStatus }}
                    </i>
                </el-col>
            </el-row>
        </div>
        <div class="box-card" style=" margin-top: 10px; padding: 10px !important; background: white;">
            <mds-card title="产量与人力" :name="'outputworker'">
                <el-form :inline="true" :model="formHeader" label-width="75px" size="small" class="dataEntry-head-base__form">
                    <el-form-item label="订单产量：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="实际产量：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="紧急入库产量：" label-width="100px">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="差异数量：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="标准人力：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="作业人力：">
                        <p>123</p>
                    </el-form-item>
                </el-form>
            </mds-card>
            <mds-card title="生产效率" :name="'Productivity'">
                <el-row :gutter="10">
                    <el-col :span="12">
                        123
                    </el-col>
                    <el-col :span="12">
                        <el-table class="newTable" :data="dataList" header-row-class-name="tableHead" border tooltip-effect="dark">
                            <el-table-column prop="date" label="班次/标准" />
                            <el-table-column prop="date" label="标准" />
                            <el-table-column prop="date" label="白班" />
                            <el-table-column prop="date" label="夜班" />
                            <el-table-column prop="date" label="OEE" />
                        </el-table>
                    </el-col>
                </el-row>
            </mds-card>
            <mds-card title="设备运行情况" :name="'EquipmentOperation'">
                <template slot="titleBtn">
                    <el-row style="float: right;">
                        <el-form style="float: right;" :inline="true" :model="formHeader" label-width="90px" size="small" class="dataEntry-head-base__form">
                            <el-form-item label="开始时间：">
                                <p>123</p>
                            </el-form-item>
                            <el-form-item label="结束时间：">
                                <p>123</p>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </template>
                <el-table class="newTable" :data="dataList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column prop="date" label="序号" />
                    <el-table-column prop="date" label="班次" />
                    <el-table-column prop="date" label="停机类型" />
                    <el-table-column prop="date" label="停机方式" />
                    <el-table-column prop="date" label="异常情况" />
                    <el-table-column prop="date" label="时长" />
                    <el-table-column prop="date" label="单位" />
                    <el-table-column prop="date" label="次数" />
                </el-table>
                <el-form :inline="true" :model="formHeader" label-width="90px" size="small" class="dataEntry-head-base__form">
                    <el-form-item label="总运行时间：">
                        <p>123(H)</p>
                    </el-form-item>
                    <el-form-item label="总停线时间：">
                        <p>123(MIN)</p>
                    </el-form-item>
                </el-form>
            </mds-card>
            <mds-card title="生产领料差异" :name="'ProductionMaterialDifference'">
                <el-row :gutter="10">
                    <el-col :span="12">
                        123
                    </el-col>
                    <el-col :span="12">
                        <el-table class="newTable" :data="dataList" header-row-class-name="tableHead" border tooltip-effect="dark">
                            <el-table-column prop="date" label="领用物料" />
                            <el-table-column prop="date" label="单位" />
                            <el-table-column prop="date" label="领用数量" />
                            <el-table-column prop="date" label="实际用量" />
                            <el-table-column prop="date" label="实际损耗" />
                            <el-table-column prop="date" label="损耗率" />
                        </el-table>
                    </el-col>
                </el-row>
            </mds-card>
            <audit-log :table-data="readAudit" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
    name: 'ReadyTimes',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    }
})
export default class AuditDetail extends Vue {
    formHeader: object = {};
    orderStatus = '已同步';
    dataList: object[] = [];
    readAudit = [];
}
</script>
