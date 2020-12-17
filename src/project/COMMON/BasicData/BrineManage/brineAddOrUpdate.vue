<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" :title="dataForm.id? '修改' : '新增'" width="880px">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :inline="true" label-width="90px" size="small">
            <el-form-item label="虚拟物料：" prop="virtualMaterialCode">
                <el-select v-model="dataForm.virtualMaterialCode" placeholder="请选择" filterable style="width: 180px;" clearable @change="setVirtual">
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
        <el-table header-row-class-name="tableHead" class="newTable" :data="dataForm.ferBrineItemList" border tooltip-effect="dark">
            <el-table-column type="index" />
            <el-table-column label="组件物料" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">*</span>组件物料
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.useMaterialCode" size="small" placeholder="请选择" filterable clearable @change="setUse(scope.row)">
                        <el-option v-for="(sole, index) in moduleList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="组件物料数量" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">*</span>组件物料数量
                </template>
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.useAmount" size="small" clearable />
                </template>
            </el-table-column>
            <el-table-column label="单位" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">*</span>单位
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.unit" placeholder="请选择" size="small" clearable filterable>
                        <el-option v-for="(iteam, index) in unit" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-tooltip :disabled="scope.row.remark === ''" effect="dark" :content="scope.row.remark" placement="top">
                        <el-input v-model.trim="scope.row.remark" size="small" clearable />
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" header-align="left" align="left" width="70">
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.id" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.$index)">
                        删除
                    </el-button>
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
            virtualMaterialName: '',
            baseAmount: '',
            unit: '',
            ferBrineItemList: [{
                id: '',
                ferBrineManageId: '',
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
                this.dataForm = {
                    id: data.ferBrineManage.id,
                    virtualMaterialCode: data.ferBrineManage.virtualMaterialCode,
                    virtualMaterialName: data.ferBrineManage.virtualMaterialName,
                    baseAmount: data.ferBrineManage.baseAmount,
                    unit: data.ferBrineManage.unit,
                    ferBrineItemList: [{
                        id: data.id,
                        ferBrineManageId: data.ferBrineManageId,
                        useMaterialCode: data.useMaterialCode,
                        useMaterialName: data.useMaterialName,
                        useMaterialType: data.useMaterialType,
                        useAmount: data.useAmount,
                        unit: data.unit,
                        remark: data.remark
                    }]
                }
            } else {
                this.dataForm = {
                    id: '',
                    virtualMaterialCode: '',
                    virtualMaterialName: '',
                    baseAmount: '',
                    unit: '',
                    ferBrineItemList: []
                }
            }
            this.visible = true;
        }

        setUse(row) {
            const filterArr1: (any) = this.moduleList.filter(it => it.materialCode === row.useMaterialCode);// eslint-disable-line
            row.useMaterialName = filterArr1[0].materialName;
            row.useMaterialType = filterArr1[0].materialTypeCode;
        }

        setVirtual() {
            const filterArr1: (any) = this.virtualList.filter(it => it.materialCode === this.dataForm.virtualMaterialCode);// eslint-disable-line
            this.dataForm.virtualMaterialName = filterArr1[0].materialName;
        }

        addTable() {
            this.dataForm.ferBrineItemList.push({
                id: '',
                ferBrineManageId: '',
                useMaterialCode: '',
                useMaterialName: '',
                useMaterialType: '',
                useAmount: '',
                unit: '',
                remark: ''
            })
        }

        del(index) {
            this.dataForm.ferBrineItemList.splice(index, 1);
        }

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.dataForm.ferBrineItemList.length === 0) {
                        this.$warningToast('请填写组件物料');
                        return false
                    }
                    for (let i = 0; i < this.dataForm.ferBrineItemList.length; i++) {
                        if (!this.dataForm.ferBrineItemList[i].useMaterialCode || !this.dataForm.ferBrineItemList[i].useAmount || !this.dataForm.ferBrineItemList[i].unit) {
                            this.$warningToast('请填写必填项');
                            return false
                        }
                    }
                    BASIC_API.BRINE_SAVE_API(this.dataForm).then(({ data }) => {
                        this.visible = false;
                        this.$successToast(data.msg);
                        this.$emit('refreshDataList');
                    });
                }
            })
        }
    }
    interface ListObj {
        id?: string;
    }
    interface Brine {
        id?: string;
        virtualMaterialCode?: string;
        baseAmount?: string;
        virtualunit?: string;
        useMaterialCode?: string;
        useMaterialName?: string;
        useMaterialType?: string;
        ferBrineItemList?: ListObj[];
        useAmount?: string;
        unit?: string;
        remark?: string;
    }
</script>

<style scoped>

</style>
