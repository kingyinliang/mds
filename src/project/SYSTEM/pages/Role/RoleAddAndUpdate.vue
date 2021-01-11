<template>
    <el-dialog :title="targetID ? '修改角色信息' : '新增角色'" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
        <el-form ref="dataForm" :model="dataForm" label-width="100px" :rules="checkRules">
            <el-form-item label="角色名称：" prop="roleName">
                <el-input v-model="dataForm.roleName" placeholder="手动输入" clearable />
            </el-form-item>
            <el-form-item label="角色编码：" prop="roleCode">
                <el-input v-model="dataForm.roleCode" placeholder="手动输入" clearable />
            </el-form-item>
            <el-form-item label="描述：" prop="roleDescribe">
                <el-input v-model="dataForm.roleDescribe" placeholder="手动输入" clearable />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button class="j_closeBtn" @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="submitDataForm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    export default {
        name: 'RoleaddAndUpdate',
        data() {
            return {
                targetID: '',
                isDialogShow: false,
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
                        { max: 30, message: '长度在 30 个字符内', trigger: 'blur' }
                    ],
                    roleDescribe: [
                    ]
                }
            };
        },
        methods: {
            init(obj) {
                if (obj) {
                    this.targetID = obj.id;
                    this.dataForm.roleID = obj.id;
                    this.dataForm.roleName = obj.roleName;
                    this.dataForm.roleCode = obj.roleCode;
                    this.dataForm.roleDescribe = obj.remark;
                } else {
                    this.targetID = '';
                    this.dataForm = {};
                }
                this.isDialogShow = true;
            },
            submitDataForm() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        if (this.targetID) {
                            // 修改
                            COMMON_API.ROLE_UPDATE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                id: this.dataForm.roleID,
                                roleCode: this.dataForm.roleCode,
                                roleName: this.dataForm.roleName,
                                remark: this.dataForm.roleDescribe
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            }).catch(() => {
                                //
                            });
                        } else {
                            // 新增
                            COMMON_API.ROLE_INSERT_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                roleCode: this.dataForm.roleCode,
                                roleName: this.dataForm.roleName,
                                remark: this.dataForm.roleDescribe
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            }).catch(() => {
                                //
                            });
                        }
                    }
                });
            },
            // 重置
            closeDialog() {
                document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
                this.$refs.dataForm.resetFields();
                this.isDialogShow = false
            }
        }
    };
</script>

<style scoped></style>
