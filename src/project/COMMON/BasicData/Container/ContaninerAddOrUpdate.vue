<template>
    <el-dialog :title="containerID ? '修改容器' : '新增容器'" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
        <el-form ref="dataForm" :model="dataForm" :rules="checkRules" size="small" label-width="100px" @submit.native.prevent>
            <el-form-item label="容器类型：" prop="holderType">
                <el-select v-model="dataForm.holderType" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item, index) in containerTypeList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="容器号：" prop="holderNo">
                <el-input v-model="dataForm.holderNo" placeholder="手动输入" clearable />
            </el-form-item>
            <el-form-item label="容器描述：" prop="holderName">
                <el-input v-model="dataForm.holderName" placeholder="手动输入" clearable />
            </el-form-item>
            <el-form-item label="容器量：">
                <el-input v-model="dataForm.holderVolume" type="number" placeholder="手动输入" min="0" clearable />
            </el-form-item>
            <el-form-item label="批数：">
                <el-input v-model="dataForm.holderBatch" type="number" placeholder="手动输入" min="0" clearable />
            </el-form-item>
            <el-form-item v-show="holderStatusList.length!==0" label="容器状态：">
                <el-select v-model="dataForm.holderStatus" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item, index) in holderStatusList" :key="index" :value="item.dictCode" :label="item.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="物理区域：">
                <el-input v-model="dataForm.holderArea" placeholder="手动输入" clearable />
            </el-form-item>
            <el-form-item label="生产物料：">
                <!-- <el-input v-model="dataForm.material" placeholder="手动输入" clearable /> -->
                <el-select v-model="dataForm.material" multiple placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in materialList"
                        :key="item.materialCode"
                        :label="item.materialName"
                        :value="item.materialCode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="归属车间：" prop="workshop">
                <template v-if="workshopList.length===0">
                    请先建立车间
                </template>
                <template v-else>
                    <el-select v-model="dataForm.workshop" placeholder="请选择" style="width: 100%;">
                        <el-option v-for="(item, index) in workshopList" :key="index" :label="item.deptName" :value="item.id" />
                    </el-select>
                </template>
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

<script>
    import { COMMON_API } from 'common/api/api';
    export default {
        name: 'ContaninerAddOrUpdate',
        components: {},
        props: {
            containerTypeList: {
                type: Array,
                default: () => []
            },
            workshopList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                materialList: [],
                containerID: '',
                isDialogShow: false,
                dataForm: {
                    holderType: '',
                    holderNo: '',
                    holderName: '',
                    holderVolume: 0,
                    holderStatus: '',
                    holderBatch: '',
                    holderArea: '',
                    material: [],
                    workshop: ''
                },
                dataFormFromAdd: {
                    holderType: '',
                    holderNo: '',
                    holderName: '',
                    holderStatus: '',
                    holderVolume: 0,
                    holderBatch: '',
                    holderArea: '',
                    material: [],
                    workshop: ''
                },
                checkRules: {
                    holderType: [{ required: true, message: '容器类型不能为空', trigger: 'change' }],
                    holderNo: [{ required: true, message: '容器号不能为空', trigger: 'blur' }],
                    holderName: [{ required: true, message: '容器描述不能为空', trigger: 'blur' }],
                    workshop: [{ required: true, message: '归属车间不能为空', trigger: 'change' }]
                },
                holderStatusList: []
            };
        },
        computed: {},
        watch: {
        },
        mounted() {
            this.getContainerStatusList()
        },
        methods: {
            closeDialog() {
                document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
                this.$refs.dataForm.resetFields();
                this.isDialogShow = false;
            },
            init(obj) {
                if (obj) {
                    this.getContainerStatusList();
                    this.containerID = obj.id;
                    COMMON_API.HOLDER_ID_QUERY_API({
                        id: obj.id,
                        version: obj.version
                    }).then(({ data }) => {
                        const tempMaterial = []
                        data.data.material.forEach(item => {
                            tempMaterial.push(item.materialCode)
                        })


                        this.dataForm.id = data.data.id;
                        this.dataForm.holderId = data.data.holderId;
                        this.dataForm.holderType = data.data.holderType;
                        this.dataForm.holderNo = data.data.holderNo;
                        this.dataForm.holderName = data.data.holderName;
                        this.dataForm.holderVolume = data.data.holderVolume;
                        this.dataForm.holderBatch = data.data.holderBatch;
                        this.dataForm.holderStatus = data.data.holderStatus;
                        this.dataForm.holderArea = data.data.holderArea;
                        this.dataForm.material = tempMaterial;
                        this.dataForm.workshop = data.data.deptId;
                        this.dataForm.version = data.data.version;
                        this.isDialogShow = true;
                    });


                } else {
                    this.dataForm = Object.assign({}, this.dataFormFromAdd);
                    this.containerID = 0;
                    this.isDialogShow = true;
                }

                // COMMON_API.DICTQUERY_API({
                //     dictType: 'COMMON_MATERIAL_TYPE'
                // }).then(({ data }) => {
                //     console.log('2222222')
                //     console.log(data)
                //     this.materialList = data.data
                // });

                COMMON_API.SEARCH_MATERIAL_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    materialType: 'ZHAL'
                }).then(({ data }) => {
                    this.materialList = data.data
                    console.log('77777')
                    console.log(data)
                });


            },
            getContainerStatusList() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_HOLDER_STATUS'
                }).then(({ data }) => {
                    this.holderStatusList = data.data;
                });
            },
            submitDataForm() {
                this.$refs.dataForm.validate(valid => {
                    const tempMaterial = [];
                    this.materialList.forEach(item => {
                        this.dataForm.material.forEach(element => {
                            if (item.materialCode === element) {
                                tempMaterial.push({ materialCode: element, materialName: item.materialName })
                            }
                        })
                    })

                    if (valid) {
                        if (this.containerID) { // 修改
                            COMMON_API.HOLDER_UPDATE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                holderType: this.dataForm.holderType,
                                holderNo: this.dataForm.holderNo,
                                holderName: this.dataForm.holderName,
                                holderVolume: this.dataForm.holderVolume,
                                holderBatch: this.dataForm.holderBatch,
                                holderStatus: this.dataForm.holderStatus,
                                holderArea: this.dataForm.holderArea,
                                material: tempMaterial,
                                deptId: this.dataForm.workshop,
                                id: this.containerID,
                                version: this.dataForm.version
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            });
                        } else {
                            COMMON_API.HOLDER_INSERT_API({ // 新增
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                holderType: this.dataForm.holderType,
                                holderNo: this.dataForm.holderNo,
                                holderName: this.dataForm.holderName,
                                holderVolume: this.dataForm.holderVolume,
                                holderBatch: this.dataForm.holderBatch,
                                holderStatus: this.dataForm.holderStatus,
                                material: tempMaterial,
                                holderArea: this.dataForm.holderArea,
                                deptId: this.dataForm.workshop
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style scoped></style>
