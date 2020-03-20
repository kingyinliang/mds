<template>
    <el-dialog :title="machineTimeData.deviceName" width="400px" customClass="dialog__class" :closeOnClickModal="false" :visible.sync="visible">
        <div slot="title">
            {{ machineTimeData.deviceName }}
        </div>
        <el-form :model="machineTimeData" size="small" labelWidth="125px">
            <el-form-item v-if="machineTimeData.openTime" label="开始时间：">
                <el-date-picker v-model="machineTimeData.openTime" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" />
            </el-form-item>
            <el-form-item v-if="machineTimeData.openTime" label="开始人：">
                <span>{{ machineTimeData.openMan }}</span>
            </el-form-item>
            <el-form-item v-if="machineTimeData.closeTime" label="结束时间：">
                <el-date-picker v-model="machineTimeData.closeTime" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" />
            </el-form-item>
            <el-form-item v-if="machineTimeData.closeTime" label="结束人：">
                <span>{{ machineTimeData.closeMan }}</span>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">
                取消
            </el-button>
            <el-button type="primary" @click="updateMachineTime()">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'MachineUpdate',
    components: {},
    data() {
        return {
            visible: false,
            machineTimeData: {}
        };
    },
    computed: {},
    methods: {
        init(row) {
            this.visible = true;
            this.machineTimeData = Object.assign({}, row);
        },
        updateMachineTime() {
            this.visible = false;
            const obj = Object.assign({}, this.machineTimeData);
            this.$emit('updateRow', obj);
        }
    }
};
</script>

<style scoped></style>
