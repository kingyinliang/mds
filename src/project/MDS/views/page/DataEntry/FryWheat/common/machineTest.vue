<template>
    <el-dialog :visible.sync="visible" width="850px" custom-class="dialog__class" :close-on-click-modal="false">
        <div slot="title">
            {{ machineName }}检测
        </div>
        <el-button type="primary" size="small" style="float: right; margin-bottom: 15px;" @click="AddMachineTest">
            新增
        </el-button>
        <el-table class="newTable" :data="machineTest" header-row-class-name="tableHead" :row-class-name="RowDelFlag" border tooltip-effect="dark">
            <el-table-column label="检测时间" width="160">
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.checkTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="选择" size="small" />
                </template>
            </el-table-column>
            <el-table-column width="120">
                <template slot="header">
                    <i class="reqI">*</i> 焦糊率（%）
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.cokingRate" size="small" />
                </template>
            </el-table-column>
            <el-table-column width="120">
                <template slot="header">
                    <i class="reqI">*</i> 膨胀率
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.expandRate" size="small" />
                </template>
            </el-table-column>
            <el-table-column width="120">
                <template slot="header">
                    <i class="reqI">*</i> 粉碎度
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.piecesRate" size="small" />
                </template>
            </el-table-column>
            <el-table-column label="检测人员" width="120" prop="changer" />
            <el-table-column label="备注">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" size="small" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="70" fixed="right">
                <template slot-scope="scope">
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" @click="dellist(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button type="primary" size="small" @click="updateMachineTest">
                保存
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { WHT_API } from '@/api/api';
import { getNewDate } from '@/net/validate';
export default {
    name: 'MachineTest',
    components: {},
    data() {
        return {
            visible: false,
            machineId: '',
            machineName: '',
            orderId: '',
            machineTest: []
        };
    },
    computed: {},
    methods: {
        /* eslint-disable @typescript-eslint/camelcase */
        init(machine, orderId) {
            this.visible = true;
            this.machineId = machine.deviceId;
            this.machineName = machine.deviceName;
            this.orderId = orderId;
            this.$http(`${WHT_API.MACHINETESTLIST_API}`, 'POST', {
                device_id: this.machineId,
                order_id: this.orderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.machineTest = data.record;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        // /* eslint-enable @typescript-eslint/camelcase) */
        AddMachineTest() {
            this.machineTest.push({
                id: '',
                checkTime: `${getNewDate()} ${new Date().getHours()}:${new Date().getMinutes()}:00`,
                cokingRate: '',
                expandRate: '',
                piecesRate: '',
                remark: '',
                orderId: this.orderId,
                deviceId: this.machineId,
                changer: this.$store.state.user.realName + '(' + this.$store.state.user.name + ')',
                delFlag: '0'
            });
        },
        // 删除
        dellist(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            }).catch(() => {
                // this.$infoTost('已取消删除');
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        // 校验
        Machinerul() {
            let ty = true;
            this.machineTest.forEach((item) => {
                if (!item.cokingRate || !item.expandRate || !item.piecesRate) {
                    ty = false;
                    this.$warningTost('必填项未填');
                    return false;
                }
            });
            return ty;
        },
        updateMachineTest() {
            if (!this.Machinerul()) {
                return false;
            }
            this.$http(`${WHT_API.MACHINETESTUPDATE_API}`, 'POST', this.machineTest).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                    this.visible = false;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        }
    }
};
</script>

<style scoped></style>
