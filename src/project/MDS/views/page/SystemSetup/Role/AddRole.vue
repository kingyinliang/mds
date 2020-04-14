<template>
    <el-dialog :title="roleId ? '修改角色信息' : '新增角色'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" :rules="dataRules" :model="dataForm" label-width="100px" :hide-required-asterisk="false" @keyup.enter.native="dataFormSubmit('dataForm')">
            <el-form-item label="角色名称：" prop="roleName">
                <el-input v-model="dataForm.roleName" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="描述：" prop="roleCode">
                <el-input v-model="dataForm.roleCode" placeholder="手动输入" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false; dataFormReset('dataForm')">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('dataForm')">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'AddRole',
    components: {},
    data() {
        return {
            roleId: '',
            visible: false,
            dataForm: {
                roleId: '',
                roleName: '',
                roleCode: ''
            },
            type: true,
            dataRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleCode: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        init(id) {
            if (id) {
                this.roleId = id.roleId;
                this.dataForm.roleId = id.roleId;
                this.dataForm.roleName = id.roleName;
                this.dataForm.roleCode = id.roleCode;
            } else {
                this.roleId = '';
                this.dataForm = {};
            }
            this.visible = true;
        },
        // 提交
        dataFormSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http(`${this.roleId ? SYSTEMSETUP_API.ROLEUPDATE_API : SYSTEMSETUP_API.ROLEADD_API}`, 'POST', this.dataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successTost('操作成功');
                            this.visible = false;
                            this.$emit('refreshDataList');
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        dataFormReset(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped></style>
