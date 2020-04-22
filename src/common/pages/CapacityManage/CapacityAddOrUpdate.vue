<template>
    <el-dialog :title="CapacityId ? '修改产能信息' : '新增产能'" :close-on-click-modal="false" :visible.sync="visible">
        <div>
            <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
                <el-form-item label="物料：" prop="material">
                    <el-select v-model="dataForm.materialCode" filterable placeholder="请选择" :disabled="CapacityId !== ''">
                        <el-option label="000" value="000" />
                        <el-option v-for="(item, index) in serchSapList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标准产能：" prop="basicCapacity">
                    <el-input type="number" v-model="dataForm.basicCapacity" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="设计产能：" prop="designCapacity">
                    <el-input v-model="dataForm.designCapacity" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="有效产能：" prop="effectiveCapacity">
                    <el-input v-model="dataForm.effectiveCapacity" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="单位：" prop="capacityUnit">
                    <el-select v-model="dataForm.capacityUnit" filterable placeholder="请选择">
                        <el-option v-for="item in Unit" :key="item.code" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标配人力：" prop="standardManpower">
                    <el-input v-model="dataForm.standardManpower" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="有效开始日期：" prop="startDate">
                    <el-date-picker v-model="dataForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="有效结束日期：" prop="endDate">
                    <el-date-picker v-model="dataForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择" style="width: 100%;" />
                </el-form-item>
                <el-form-item v-if="CapacityId" label="维护人：">
                    <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
                </el-form-item>
                <el-form-item v-if="CapacityId" label="维护时间：">
                    <el-date-picker v-model="dataForm.changed" type="datetime" placeholder="选择" disabled />
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
import { COMMON_API } from 'common/api/api';
export default {
    name: 'CapacityAddOrUpdate',
    components: {},
    props: {
        serchSapList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            Unit: [],
            CapacityId: '',
            deptId: '',
            visible: false,
            dataForm: {
                materialCode: '',
                standardManpower: '',
                basicCapacity: 0,
                capacityUnit: '',
                startDate: '',
                endDate: '2019-08-21',
                changer: '',
                changed: ''
            },
            dataRule: {
                materialCode: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
                basicCapacity: [
                    {
                        required: true,
                        message: '标准产能不能为空',
                        trigger: 'blur'
                    }
                ],
                effectiveCapacity: [
                    {
                        required: true,
                        message: '有效产能不能为空',
                        trigger: 'blur'
                    }
                ],
                standardManpower: [
                    {
                        required: true,
                        message: '标配人力不能为空',
                        trigger: 'blur'
                    }
                ],
                capacityUnit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
                startDate: [
                    {
                        required: true,
                        message: '有效开始日期不能为空',
                        trigger: 'blur'
                    }
                ],
                endDate: [
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
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_UNIT'
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.Unit = data.data;
                }
            });
        },
        init(deptId, data) {
            this.deptId = deptId;
            if (data) {
                this.CapacityId = data.id;
                this.dataForm = JSON.parse(JSON.stringify(data));
            } else {
                this.CapacityId = '';
                this.dataForm = {
                    endDate: '9999-12-31'
                };
                this.dataForm.deptId = deptId;
            }
            this.visible = true;
        },
        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.dataForm.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    this.dataForm.materialName = this.serchSapList.filter(item => item.materialCode === this.dataForm.materialCode)[0].materialName;
                    let http;
                    this.CapacityId ? http = COMMON_API.CAPACITYUPDATA_API : http = COMMON_API.CAPACITYADD_API;
                    http(this.dataForm).then(({ data }) => {
                        if (data.code === 200) {
                            this.$successToast('操作成功');
                            this.visible = false;
                            this.$emit('refreshDataList');
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
