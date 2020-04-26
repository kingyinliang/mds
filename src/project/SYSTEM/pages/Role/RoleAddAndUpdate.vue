<template>
    <el-dialog :title="roleStyle==='modify' ? '修改角色信息' : '新增角色'" :close-on-click-modal="false" :visible.sync="isDaologShow">
        <el-form ref="dataForm" :model="dataForm" label-width="100px" :rules="checkRules">
            <el-form-item label="角色名称：" prop="roleName">
                <el-input v-model="dataForm.roleName" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="角色编码：" prop="roleCode">
                <el-input v-model="dataForm.roleCode" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="描述：" prop="roleDescribe">
                <el-input v-model="dataForm.roleDescribe" placeholder="手动输入" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="resetDataForm('dataForm')">取消</el-button>
            <el-button type="primary" @click="roleStyle==='add'?addDataForm('dataForm'):editDataForm('dataForm')">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    export default {
        name: 'RoleaddAndUpdate',
        data() {
            return {
                roleStyle: '',
                isDaologShow: false,
                dataForm: {
                    roleID: '',
                    roleName: '',
                    roleCode: '',
                    roleDescribe: ''
                },
                checkRules: {
                    roleName: [
                        { required: true, message: '角色名称', trigger: 'blur' },
                        { max: 20, message: '长度在 20 个字符内', trigger: 'blur' }
                    ],
                    roleCode: [
                        { required: true, message: '角色编码', trigger: 'blur' },
                        { max: 10, message: '长度在 10 个字符内', trigger: 'blur' }
                    ],
                    roleDescribe: [
                    ]
                }
            };
        },
        methods: {
            init(styleInfo) {
                this.roleStyle = styleInfo.roleStyle;
                this.dataForm = {
                    roleID: styleInfo.roleInfo.id ? styleInfo.roleInfo.id : '',
                    roleName: styleInfo.roleInfo.roleName ? styleInfo.roleInfo.roleName : '',
                    roleCode: styleInfo.roleInfo.roleCode ? styleInfo.roleInfo.roleCode : '',
                    roleDescribe: styleInfo.roleInfo.remark ? styleInfo.roleInfo.remark : ''
                }
                this.isDaologShow = true;
            },
            // 新增提交
            addDataForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            COMMON_API.ROLE_INSERT_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                roleCode: this.dataForm.roleCode,
                                roleName: this.dataForm.roleName,
                                remark: this.dataForm.roleDescribe
                            }).then(({ data }) => {
                                if (data.code === 200) {
                                    this.$successToast('操作成功');
                                    this.isDaologShow = false;
                                    this.$emit('refreshDataList');
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            }).catch(() => {
                                //
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
            },
            // 编辑提交
            editDataForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            COMMON_API.ROLE_UPDATE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                id: this.dataForm.roleID,
                                roleCode: this.dataForm.roleCode,
                                roleName: this.dataForm.roleName,
                                remark: this.dataForm.roleDescribe
                            }).then(({ data }) => {
                                if (data.code === 200) {
                                    this.$successToast('操作成功');
                                    this.isDaologShow = false;
                                    this.$emit('refreshDataList');
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            }).catch(() => {
                                //
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
            },
            // 重置
            resetDataForm(formName) {
                this.isDaologShow = false
                this.$refs[formName].resetFields();
            }
        }
    };
</script>

<style scoped></style>
