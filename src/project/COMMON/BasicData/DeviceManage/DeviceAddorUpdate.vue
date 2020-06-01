<template>
    <el-dialog :title="form.deviceId ? '修改设备信息' : '新增设备'" :close-on-click-modal="false" :visible.sync="visible">
        <div>
            <el-form :model="form" size="small" label-width="110px" class="devicedialog" @keyup.enter.native="submitForm()">
                <el-form-item label="设备编号：">
                    <el-input v-model="form.deviceNo" placeholder="手工录入" />
                </el-form-item>
                <el-form-item label="设备描述：">
                    <el-input v-model="form.deviceName" placeholder="手工录入" />
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button size="small" type="primary" @click="submitForm">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';

    @Component({
        components: {
        }
    })
    export default class DeviceAddorUpdate extends Vue {
        visible = false
        form: FormObj = {
            factory: '',
            id: '',
            deptId: '',
            deviceName: '',
            deviceNo: ''
        }

        init(deptId, row) {
            console.log(row);
            this.visible = true;
            this.form = {};
            if (row) {
                this.form = row;
            }
            this.form.deptId = deptId;
        }

        submitForm() {
            this.form.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            let http;
            this.form.id ? http = COMMON_API.DEVICEUPDATA_API : http = COMMON_API.DEVICEADD_API;
            http(this.form).then(({ data }) => {
                if (data.code === 200) {
                    this.$successToast('操作成功');
                    this.visible = false;
                    this.$emit('refreshDataList');
                }
            });
        }
    }
    interface FormObj {
        factory?: string;
        id?: string;
        deptId?: string;
        deviceName?: string;
        deviceNo?: string;
    }
</script>

<style scoped>

</style>
