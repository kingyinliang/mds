<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" :title="dataForm.id? '修改' : '新增'" width="880px">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :inline="true" label-width="90px" size="small">
            <el-form-item label="虚拟物料：" prop="virtualMaterialCode">
                <el-select v-model="dataForm.virtualMaterialCode" placeholder="请选择" filterable style="width: 180px;" clearable>
                    <el-option v-for="(sole, index) in virtualList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="基本数量：" prop="baseAmount">
                <el-input v-model.trim="dataForm.baseAmount" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="单位：" prop="unit">
                <el-select v-model="dataForm.unit" placeholder="请选择" size="small" style="width: 180px;" clearable filterable>
                    <el-option v-for="(iteam, index) in unit" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                </el-select>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" style="float: right;" @click="addTable">
            新增
        </el-button>
        <el-table header-row-class-name="tableHead" class="newTable" :data="tableData" border tooltip-effect="dark">
            <el-table-column type="index" />
            <el-table-column label="组件物料" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.useMaterialCode" size="small" placeholder="请选择" filterable clearable @change="setUse(scope.row)">
                        <el-option v-for="(sole, index) in moduleList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="组件物料数量" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.useAmount" size="small" clearable />
                </template>
            </el-table-column>
            <el-table-column label="单位" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.unit" size="small" clearable />
                </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" size="small" clearable />
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { BASIC_API } from 'common/api/api';

    @Component
    export default class CraftAddOrUpdate extends Vue {
        @Prop({ type: Array, default: [] }) virtualList;
        @Prop({ type: Array, default: [] }) moduleList;
        @Prop({ type: Array, default: [] }) unit;

        $refs: {
            dataForm: HTMLFormElement;
        };

        visible = false;
        dataForm = {
            id: '',
            virtualMaterialCode: '',
            baseAmount: '',
            unit: '',
            tableData: [{
                useMaterialCode: '',
                useMaterialName: '',
                useMaterialType: '',
                useAmount: '',
                unit: '',
                remark: ''
            }]
        };

        dataRule = {
            virtualMaterialCode: [{ required: true, message: '虚拟物料不能为空', trigger: 'blur' }],
            baseAmount: [{ required: true, message: '基本数量不能为空', trigger: 'blur' }],
            unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
        };

        tableData: Brine[] = [
            {
                id: '',
                virtualMaterialCode: '',
                baseAmount: '',
                virtualunit: '',
                useMaterialCode: '',
                useMaterialName: '',
                useMaterialType: '',
                useAmount: '',
                unit: '',
                remark: ''
            }
        ]


        init(data) {
            if (data) {
                this.dataForm = JSON.parse(JSON.stringify(data));
            } else {
                this.dataForm = {
                    id: '',
                    virtualMaterialCode: '',
                    baseAmount: '',
                    unit: '',
                    tableData: []
                }
            }
            this.visible = true;
        }

        setUse(row) {
            const filterArr1: (any) = this.moduleList.filter(it => it.materialCode === row.useMaterialCode);// eslint-disable-line
            row.useMaterialName = filterArr1[0].materialName;
            row.useMaterialType = filterArr1[0].materialTypeCode;
        }

        addTable() {
            this.tableData.push({})
        }

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    BASIC_API.BRINE_SAVE_API(this.dataForm).then(({ data }) => {
                        this.visible = false;
                        this.$successToast(data.msg);
                        this.$emit('refreshDataList');
                    });
                }
            })
        }
    }
    interface Brine {
        id?: string;
        virtualMaterialCode?: string;
        baseAmount?: string;
        virtualunit?: string;
        useMaterialCode?: string;
        useMaterialName?: string;
        useMaterialType?: string;
        useAmount?: string;
        unit?: string;
        remark?: string;
    }
</script>

<style scoped>

</style>
