<template>
    <el-dialog :title="CapacityId ? '修改产能信息' : '新增产能'" :close-on-click-modal="false" :visible.sync="visible">
        <div>
            <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
                <el-form-item label="物料：" prop="material">
                    <el-select v-if="!CapacityId" v-model="dataForm.material" filterable placeholder="请选择">
                        <el-option v-for="item in serchSapList" :key="item.sapCode + ' ' + item.itemName" :label="item.sapCode + ' ' + item.itemName" :value="item.sapCode + ' ' + item.itemName" />
                    </el-select>
                    <el-select v-else v-model="dataForm.material" filterable placeholder="请选择" disabled>
                        <el-option v-for="item in serchSapList" :key="item.sapCode + ' ' + item.itemName" :label="item.sapCode + ' ' + item.itemName" :value="item.sapCode + ' ' + item.itemName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标准产能：" prop="basicCapacity">
                    <el-input v-model="dataForm.basicCapacity" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="设计产能：" prop="designCapacity">
                    <el-input v-model="dataForm.designCapacity" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="有效产能：" prop="effecCapacity">
                    <el-input v-model="dataForm.effecCapacity" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="单位：" prop="basicCapacityUnit">
                    <el-select v-model="dataForm.basicCapacityUnit" filterable placeholder="请选择">
                        <el-option v-for="item in Unit" :key="item.code" :label="item.value" :value="item.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标配人力：" prop="standardOfMan">
                    <el-input v-model="dataForm.standardOfMan" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="有效开始日期：" prop="effecStartDate">
                    <el-date-picker v-model="dataForm.effecStartDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="有效结束日期：" prop="effecEndDate">
                    <el-date-picker v-model="dataForm.effecEndDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 100%;" />
                </el-form-item>
                <el-form-item v-if="CapacityId" label="维护人：">
                    <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
                </el-form-item>
                <el-form-item v-if="CapacityId" label="维护时间：">
                    <el-date-picker v-model="dataForm.changed" type="datetime" placeholder="请选择" disabled />
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'CapacityAddOrUpdate',
    components: {},
    props: {
        serchSapList: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            Unit: [],
            CapacityId: '',
            deptId: '',
            visible: false,
            dataForm: {
                material: '',
                standardOfMan: '',
                basicCapacity: 0,
                basicCapacityUnit: '',
                effecStartDate: '',
                effecEndDate: '2019-08-21 00:00:00',
                changer: '',
                changed: ''
            },
            dataRule: {
                material: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
                basicCapacity: [
                    {
                        required: true,
                        message: '标准产能不能为空',
                        trigger: 'blur'
                    }
                ],
                effecCapacity: [
                    {
                        required: true,
                        message: '有效产能不能为空',
                        trigger: 'blur'
                    }
                ],
                standardOfMan: [
                    {
                        required: true,
                        message: '标配人力不能为空',
                        trigger: 'blur'
                    }
                ],
                basicCapacityUnit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
                effecStartDate: [
                    {
                        required: true,
                        message: '有效开始日期不能为空',
                        trigger: 'blur'
                    }
                ],
                effecEndDate: [
                    {
                        required: true,
                        message: '有效结束日期不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {},
    mounted() {
        this.GetUnit();
    },
    methods: {
        // 获取单位下拉
        GetUnit() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'UNIT'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Unit = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        init(deptId, data) {
            this.deptId = deptId;
            if (data) {
                this.CapacityId = data.id;
                this.dataForm = JSON.parse(JSON.stringify(data));
                this.dataForm.material = data.materialName + ' ' + data.materialCode;
            } else {
                this.CapacityId = '';
                this.dataForm = {
                    effecEndDate: '9999-12-31'
                };
                this.dataForm.deptId = deptId;
            }
            this.visible = true;
        },
        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.dataForm.materialCode = this.dataForm.material.substring(this.dataForm.material.indexOf(' ') + 1);
                    this.dataForm.materialName = this.dataForm.material.substring(0, this.dataForm.material.indexOf(' '));
                    this.$http(`${BASICDATA_API.CAPAADDORUPDATE_API}`, 'POST', this.dataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successToast('操作成功');
                            this.visible = false;
                            this.$emit('refreshDataList');
                        } else {
                            this.submitType = true;
                            this.$errorToast(data.msg);
                        }
                    });
                }
            });
        }
    }
};
</script>

<style scoped>
.el-select {
    position: relative;
    display: block;
}
</style>
