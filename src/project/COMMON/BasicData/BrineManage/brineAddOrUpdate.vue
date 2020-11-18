<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" :title="dataForm.id? '修改' : '新增'" width="880px">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :inline="true" label-width="90px" size="small">
            <el-form-item label="虚拟物料：" prop="productMaterial">
                <el-select v-model="dataForm.holderNo" placeholder="请选择" filterable style="width: 180px;" clearable>
                    <el-option v-for="(sole, index) in virtualList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="基本数量：" prop="warmTimeLower">
                <el-input v-model.trim="dataForm.warmTimeLower" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="单位：" prop="warmTimeFloor">
                <el-select v-model="dataForm.useUnit" placeholder="请选择" size="small" style="width: 180px;" clearable filterable>
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
                    <el-select v-model="scope.row.holderNo" size="small" placeholder="请选择" filterable clearable>
                        <el-option v-for="(sole, index) in moduleList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="组件物料数量" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.warmTimeLower" size="small" clearable />
                </template>
            </el-table-column>
            <el-table-column label="单位" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.warmTimeLower" size="small" clearable />
                </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.warmTimeLower" size="small" clearable />
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
    import { dateFormat, getUserNameNumber } from 'utils/utils';

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
            productMaterial: '',
            productMaterialName: '',
            warmTimeLower: '',
            warmTimeFloor: '',
            warmTempLower: '',
            warmTempFloor: '',
            startDate: '',
            endDate: '',
            remark: '',
            changer: '',
            changed: ''
        };

        dataRule = {
            productMaterial: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
            warmTimeLower: [{ required: true, message: '标准保温时间下限', trigger: 'blur' }],
            warmTimeFloor: [{ required: true, message: '标准保温时间上限', trigger: 'blur' }],
            warmTempLower: [{ required: true, message: '标准保温温度下限', trigger: 'blur' }],
            warmTempFloor: [{ required: true, message: '标准保温温度上限', trigger: 'blur' }],
            startDate: [{ required: true, message: '有效开始日期', trigger: 'blur' }],
            endDate: [{ required: true, message: '有效结束日期', trigger: 'blur' }]
        };

        tableData = []


        init(data) {
            if (data) {
                this.dataForm = JSON.parse(JSON.stringify(data));
            } else {
                this.dataForm = {
                    id: '',
                    productMaterial: '',
                    productMaterialName: '',
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

        addTable() {
            this.tableData.push({})
        }

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
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
            })
        }
    }
</script>

<style scoped>

</style>
