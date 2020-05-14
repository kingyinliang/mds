<template>
    <el-dialog :title="targetID ? '编辑库位信息' : '新增库位'" :close-on-click-modal="false" :visible.sync="isDialogShow" class="locationdialog1" @close="closeDialog()">
        <div style="width: 400px; margin: auto;">
            <el-form ref="addLo" :model="formatDate" :rules="dataRule" size="small" label-width="110px" @keyup.enter.native="dataFormSubmit()" @submit.native.prevent>
                <el-form-item label="车间：" prop="deptId">
                    <el-select v-model="formatDate.deptId">
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in workShop" :key="index" :label="item.deptName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料类型：" prop="materialTypeCode">
                    <el-select v-model="formatDate.materialTypeCode">
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.dictCode + ' ' + item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料编码：">
                    <el-input v-model="formatDate.materialCode" placeholder="手工录入" maxlength="10" />
                </el-form-item>
                <el-form-item label="库位：" prop="storageLocation">
                    <el-input v-model="formatDate.storageLocation" placeholder="手工录入" />
                </el-form-item>
                <el-form-item label="是否样品库：">
                    <el-select v-model="formatDate.sampleFlag" placeholder="请选择">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发料/入库：" prop="materialUse">
                    <el-select v-model="formatDate.materialUse" placeholder="请选择">
                        <el-option label="发料" value="F" />
                        <el-option label="入库" value="R" />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogShow = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { COMMON_API } from 'common/api/api';
export default {
    name: 'LocationAdd',
    components: {},
    props: {
        workShop: {
            type: Array,
            default: () => []
        },
        materialList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            isDialogShow: false,
            targetID: '',
            formatDate: {
                deptId: '',
                materialType: '',
                materialCode: '',
                materialTypeCode: '',
                materialTypeName: '',
                materialUse: '',
                sampleFlag: '0',
                storageLocation: ''
            },
            dataRule: {
                deptId: [{ required: true, message: '车间不能为空', trigger: 'blur' }],
                materialTypeCode: [{ required: true, message: '物料类型不能为空', trigger: 'blur' }],
                storageLocation: [{ required: true, message: '库位不能为空', trigger: 'blur' }, { max: 4, message: '长度不超过4个字符', trigger: 'blur' }],
                materialUse: [{ required: true, message: '发料/入库不能为空', trigger: 'blur' }]
            }
        };
    },
    computed: {},
    watch: {
    },
    mounted() {
        // this.getdeptcode();
    },
    methods: {
        init(data) {
            if (data) {
                this.targetID = data.id;
                this.formatDate = JSON.parse(JSON.stringify(data));
                this.formatDate.sampleFlag = String(data.sampleFlag);
            } else {
                this.targetID = '';
                this.formatDate = {
                    deptId: '',
                    materialType: '',
                    materialCode: '',
                    materialTypeCode: '',
                    materialTypeName: '',
                    materialUse: '',
                    sampleFlag: '0',
                    storageLocation: ''
                };
            }
            this.isDialogShow = true;
        },
        // 保存
        dataFormSubmit() {
            this.$refs.addLo.validate(valid => {
                if (valid) {
                    if (this.targetID) {
                        COMMON_API.STORAGE_UPDATE_API({
                            id: this.targetID,
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptId: this.formatDate.deptId,
                            materialCode: this.formatDate.materialCode,
                            materialTypeCode: this.formatDate.materialTypeCode,
                            materialTypeName: this.materialList.find(item => item.dictCode === this.formatDate.materialTypeCode).dictValue,
                            materialUse: this.formatDate.materialUse,
                            sampleFlag: this.formatDate.sampleFlag,
                            storageLocation: this.formatDate.storageLocation
                    }).then(({ data }) => {
                            this.isDialogShow = false;
                            this.$successToast(data.msg);
                            this.$emit('refreshDataList');
                        })
                    } else {
                        COMMON_API.STORAGE_INSERT_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                deptId: this.formatDate.deptId,
                                materialCode: this.formatDate.materialCode,
                                materialTypeCode: this.formatDate.materialTypeCode,
                                materialTypeName: this.materialList.find(item => item.dictCode === this.formatDate.materialTypeCode).dictValue,
                                materialUse: this.formatDate.materialUse,
                                sampleFlag: this.formatDate.sampleFlag,
                                storageLocation: this.formatDate.storageLocation
                        }).then(({ data }) => {
                                this.isDialogShow = false;
                                this.$successToast(data.msg);
                                this.$emit('refreshDataList');
                        });
                }
                }
            });
        },
        closeDialog() {
            this.isDialogShow = false;
            this.$refs.addLo.resetFields();
        }
    }
};
</script>

<style lang="scss">
.locationdialog1 {
    .el-select,
    input {
        width: 100% !important;
    }
    .el-dialog {
        min-width: 450px;
    }
}
</style>
<style scoped></style>
