<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" :title="dataForm.id? '修改' : '新增'" width="420px">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" size="small">
            <el-form-item label="物料：" prop="productMaterial">
                <el-select v-model="dataForm.productMaterial" filterable remote clearable placeholder="请输入物料" :remote-method="remoteMethod" :loading="loading" style="width: 220px;" @clear="serchSapList = []">
                    <el-option v-for="(item, index) in serchSapList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="标准保温时间下限：" prop="warmTimeLower">
                <el-input v-model.trim="dataForm.warmTimeLower" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="标准保温时间上限：" prop="warmTimeFloor">
                <el-input v-model.trim="dataForm.warmTimeFloor" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="标准保温温度下限：" prop="warmTempLower">
                <el-input v-model.trim="dataForm.warmTempLower" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="标准保温温度上限：" prop="warmTempFloor">
                <el-input v-model.trim="dataForm.warmTempFloor" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="有效开始日期：" prop="startDate">
                <el-date-picker v-model="dataForm.startDate" type="date" style="width: 220px;" value-format="yyyy-MM-dd" clearable />
            </el-form-item>
            <el-form-item label="有效结束日期：" prop="endDate">
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
    import { COMMON_API, BASIC_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    @Component
    export default class CraftAddOrUpdate extends Vue {

        $refs: {
            dataForm: HTMLFormElement;
        };

        serchSapList: SapObj[] = [];
        loading = false;
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

        remoteMethod(query) {
            if (query !== '' && query.length > 1) {
                this.loading = true;
                COMMON_API.ALLMATERIAL_API({
                    materialTypes: ['ZHAL'],
                    material: query
                }).then(({ data }) => {
                    this.loading = false;
                    this.serchSapList = data.data
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.serchSapList = [];
            }
        }

        init(data) {
            if (data) {
                this.dataForm = JSON.parse(JSON.stringify(data));
                this.remoteMethod(this.dataForm.productMaterial);
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

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    let net;
                    if (this.dataForm.id) {
                        net = BASIC_API.CRAFT_UPDATE_API
                    } else {
                        net = BASIC_API.CRAFT_ADD_API
                    }
                    const filterArr: (any) = this.serchSapList.filter(it => it.materialCode === this.dataForm.productMaterial);// eslint-disable-line
                    if (!filterArr.length) {
                        this.$warningToast('没有此物料信息');
                        return false
                    }
                    this.dataForm.productMaterialName = filterArr[0].materialName;
                    net(this.dataForm).then(({ data }) => {
                        this.visible = false;
                        this.$successToast(data.msg);
                        this.$emit('refreshDataList');
                    });
                }
            })
        }
    }
    interface SapObj {
        materialCode?: string;
        materialName?: string;
    }
</script>

<style scoped>

</style>
