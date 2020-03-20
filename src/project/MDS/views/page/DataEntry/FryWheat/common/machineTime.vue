<template>
    <el-dialog :title="machineTimeData.deviceName" width="400px" customClass="dialog__class" :closeOnClickModal="false" :visible.sync="visible">
        <div slot="title">
            {{ machineTimeData.deviceName }}
        </div>
        <el-form :model="machineTimeData" size="small" labelWidth="125px">
            <el-form-item v-if="status" label="开始时间：">
                <el-date-picker v-model="machineTimeData.startDate" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" />
            </el-form-item>
            <el-form-item v-if="!status" label="结束时间：">
                <el-date-picker v-model="machineTimeData.endDate" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" />
            </el-form-item>
            <el-form-item label="操作时间：">
                <span>{{ machineTimeData.changed }}</span>
            </el-form-item>
            <el-form-item label="操作人：">
                <span>{{ (machineTimeData.changer = `${realName}(${userName})`) }}</span>
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
import { getNewDate } from '@/net/validate';
export default {
    name: 'MachineTime',
    components: {},
    data() {
        return {
            visible: false,
            status: false,
            machine: '',
            machineTimeData: {
                startDate: '',
                endDate: '',
                changed: getNewDate(),
                changer: ''
            }
        };
    },
    computed: {
        userName: {
            get() {
                return this.$store.state.user.name;
            },
            set(val) {
                this.$store.commit('user/updateName', val);
            }
        },
        realName: {
            get() {
                return this.$store.state.user.realName;
            },
            set(val) {
                this.$store.commit('user/updateName', val);
            }
        }
    },
    methods: {
        init(me, str) {
            this.visible = true;
            this.machineTimeData = {
                deviceId: '',
                startDate: '',
                endDate: '',
                changed: getNewDate(),
                changer: ''
            };
            if (me) {
                this.machineTimeData.deviceId = me.deviceId;
                this.machineTimeData.deviceName = me.deviceName;
            }
            if (str) {
                this.status = str;
            }
        },
        updateMachineTime() {
            this.visible = false;
            this.$emit('changeMachineTime', this.machineTimeData);
        }
    }
};
</script>

<style scoped></style>
