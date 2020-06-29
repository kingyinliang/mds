<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" :title="dataForm.id? '修改' : '新增'">
        <el-form :model="dataForm" label-width="140px" size="small">
            <el-form-item label="标准保温时间下限：">
                <el-date-picker v-model="dataForm.warmTimeLower" type="date" style="width: 220px;" value-format="yyyy-MM-dd" clearable />
            </el-form-item>
            <el-form-item label="标准保温时间上限：">
                <el-date-picker v-model="dataForm.warmTimeFloor" type="date" style="width: 220px;" value-format="yyyy-MM-dd" clearable />
            </el-form-item>
            <el-form-item label="标准保温温度下限：">
                <el-date-picker v-model="dataForm.warmTempLower" type="date" style="width: 220px;" value-format="yyyy-MM-dd" clearable />
            </el-form-item>
            <el-form-item label="标准保温温度上限：">
                <el-date-picker v-model="dataForm.warmTempFloor" type="date" style="width: 220px;" value-format="yyyy-MM-dd" clearable />
            </el-form-item>
            <el-form-item label="有效开始日期：">
                <el-date-picker v-model="dataForm.startDate" type="date" style="width: 220px;" value-format="yyyy-MM-dd" clearable />
            </el-form-item>
            <el-form-item label="有效结束日期：">
                <el-date-picker v-model="dataForm.endDate" type="date" style="width: 220px;" value-format="yyyy-MM-dd" clearable />
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model.trim="dataForm.remark" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="操作人：">
                {{ dataForm.changer }}
            </el-form-item>
            <el-form-item label="操作时间：">
                {{ dataForm.changed }}
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { BASIC_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    @Component
    export default class CraftAddOrUpdate extends Vue {
        visible = false;
        dataForm = {
            id: '',
            warmTimeLower: '',
            warmTimeFloor: '',
            warmTempLower: '',
            warmTempFloor: '',
            startDate: '',
            endDate: '',
            remark: '',
            changer: '',
            changed: ''
        }

        init(data) {
            if (data) {
                this.dataForm = data
            } else {
                this.dataForm = {
                    id: '',
                    warmTimeLower: '',
                    warmTimeFloor: '',
                    warmTempLower: '',
                    warmTempFloor: '',
                    startDate: '',
                    endDate: '',
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            }
            this.visible = true;
        }

        dataFormSubmit() {
            let net;
            if (this.dataForm.id) {
                net = BASIC_API.CRAFT_UPDATE_API
            } else {
                net = BASIC_API.CRAFT_ADD_API
            }
            net(this.dataForm).then(({ data }) => {
                this.visible = false;
                this.$successToast(data.msg);
                this.$emit('refreshDataList');
            });
        }
    }
</script>

<style scoped>

</style>
