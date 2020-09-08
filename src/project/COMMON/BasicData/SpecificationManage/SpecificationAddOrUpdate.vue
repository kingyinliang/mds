<template>
    <el-dialog :title="targetID ? '修改规格信息' : '新增规格'" :close-on-click-modal="false" :visible.sync="isDialogShow">
        <el-form ref="dataForm" :model="dataForm" status-icon :rules="checkRules" label-width="100px" size="small">
            <el-form-item label="物料：" prop="material">
                <el-select
                    v-model="dataForm.material"
                    filterable
                    remote
                    placeholder="请输入物料"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    :disabled="targetID !== ''"
                    style="width: 100%;"
                    @change="setBrand"
                >
                    <el-option v-for="(item, index) in serchSapList" :key="index" :label="item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName" :value="item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName" />
                </el-select>
            </el-form-item>
            <el-form-item label="品牌：" prop="brand">
                <el-input v-model="dataForm.brand" placeholder="请先选择物料" disabled />
            </el-form-item>
            <el-form-item label="大类：" prop="largeClass">
                <el-select v-model="dataForm.largeClass" filterable placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in largeClassList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="箱规格：" prop="boxSpec">
                <el-input v-model="dataForm.boxSpec" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="单位：" prop="boxSpecUnit">
                <el-select v-model="dataForm.boxSpecUnit" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in unitClassList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="瓶规格：" prop="bottleSpec">
                <el-input v-model="dataForm.bottleSpec" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="单位：">
                <el-select v-model="dataForm.bottleSpecUnit" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in unitClassList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="targetID" label="维护人：">
                <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button class="j_closeBtn" @click="closeDialog">
                取消
            </el-button>
            <el-button type="primary" @click="submitDataForm">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    @Component({
        name: 'SpecificationAddOrUpdate',
        components: {

        }
    })
    export default class WorkProcedureManage extends Vue {
        @Prop({ type: Array, default: () => { return [] } }) largeClassList: object[]
        @Prop({ type: Array, default: () => { return [] } }) unitClassList: object[]

        $refs: {
            dataForm: HTMLFormElement;
        }

        loading= false
        serchSapList: Options[]= []
        isDialogShow= false
        targetID= ''

        dataForm: CurrentFormData= {
            id: '',
            material: '',
            brand: '',
            largeClass: '',
            boxSpec: '',
            boxSpecUnit: '',
            bottleSpec: '',
            bottleSpecUnit: '',
            changer: '',
            version: 0,
            materialCode: '',
            materialName: ''
        }

        checkRules= {
            material: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
            brand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
            largeClass: [{ required: true, message: '大类不能为空', trigger: 'blur' }],
            boxSpec: [{ required: true, message: '箱规格不能为空', trigger: 'blur' }],
            boxSpecUnit: [{ required: true, message: '箱规格单位不能为空', trigger: 'blur' }],
            bottleSpec: [{ pattern: /^[1-9]\d*$/, message: '需为数字', trigger: 'blur' }]
        }


        remoteMethod(query) {
            if (query !== '' && query.length > 1) {
                this.loading = true;
                COMMON_API.ALLMATERIAL_API({
                    materialTypes: ['ZFER'],
                    material: query
                }).then(({ data }) => {
                    this.loading = false;
                    this.serchSapList = JSON.parse(JSON.stringify(data.data))
                }).catch(() => {
                    this.loading = false;
                })
            } else {
                this.serchSapList = [];
            }
        }

        closeDialog() {
            // document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
            this.$refs.dataForm.resetFields();
            this.isDialogShow = false;
        }

        // 设置品牌
        setBrand(val) {
            this.dataForm.materialName = val.split(' ')[1]
            this.dataForm.materialCode = val.split(' ')[0]
            const temp = this.serchSapList.find(item => item.materialCode === val.split(' ')[0]) as Options
            this.dataForm.brand = temp.kondm;
        }

        init(data) {
            if (data) {
                this.targetID = data.id;
                this.dataForm.id = data.id;
                this.dataForm.material = data.materialCode + ' ' + data.materialName + ' ' + data.brand;
                this.dataForm.brand = data.brand;
                this.dataForm.largeClass = data.largeClass;
                this.dataForm.boxSpec = data.boxSpec;
                this.dataForm.boxSpecUnit = data.boxSpecUnit;
                this.dataForm.bottleSpec = data.bottleSpec;
                this.dataForm.bottleSpecUnit = data.bottleSpecUnit;
                this.dataForm.changer = data.changer;
                this.dataForm.version = data.version;
                this.dataForm.materialCode = data.materialCode;
                this.dataForm.materialName = data.materialName;
            } else {
                this.targetID = '';
                this.dataForm = {
                    id: '',
                    material: '',
                    brand: '',
                    largeClass: '',
                    boxSpec: '',
                    boxSpecUnit: '',
                    bottleSpec: '',
                    bottleSpecUnit: '',
                    changer: '',
                    version: 0,
                    materialCode: '',
                    materialName: ''
                }
            }
            this.isDialogShow = true;
        }

        submitDataForm() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.targetID) { // 编辑
                        COMMON_API.SPECS_UPDATE_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            id: this.targetID,
                            brand: this.dataForm.brand,
                            largeClass: this.dataForm.largeClass,
                            boxSpec: this.dataForm.boxSpec,
                            boxSpecUnit: this.dataForm.boxSpecUnit,
                            bottleSpec: this.dataForm.bottleSpec,
                            bottleSpecUnit: this.dataForm.bottleSpecUnit,
                            materialName: this.dataForm.materialName,
                            materialCode: this.dataForm.materialCode,
                            version: this.dataForm.version
                        }).then(() => {
                            this.$emit('refreshDataList');
                            this.isDialogShow = false;
                        });
                    } else {
                        COMMON_API.SPECS_INSERT_API({ // 新增
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            brand: this.dataForm.brand,
                            largeClass: this.dataForm.largeClass,
                            boxSpec: this.dataForm.boxSpec,
                            boxSpecUnit: this.dataForm.boxSpecUnit,
                            bottleSpec: this.dataForm.bottleSpec,
                            bottleSpecUnit: this.dataForm.bottleSpecUnit,
                            materialName: this.dataForm.materialName,
                            materialCode: this.dataForm.materialCode
                        }).then(() => {
                            this.$emit('refreshDataList');
                            this.isDialogShow = false;
                        });
                    }
                }
            });
        }
    }

interface Options {
    basicUnit?: string;
    id?: string;
    kondm?: string;
    materialCode?: string;
    materialName?: string;
    materialTypeCode?: string;
    materialTypeName: string;
    productUnit?: string;
    ratio?: number;
    syncDate?: Date;
}


interface CurrentFormData{
    id?: string;
    material?: string;
    brand?: string;
    largeClass?: string;
    boxSpec?: string;
    boxSpecUnit?: string;
    bottleSpec?: string;
    bottleSpecUnit?: string;
    changer?: string;
    version?: number;
    materialCode?: string;
    materialName?: string;
}

</script>

<style scoped>
    .el-form-item--small.el-form-item {
        margin-bottom: 20px;
    }
</style>
