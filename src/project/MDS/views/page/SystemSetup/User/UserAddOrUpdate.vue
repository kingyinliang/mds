<template>
    <div>
        <el-dialog :title="userId ? '修改人员信息' : '新增人员'" :close-on-click-modal="false" :visible.sync="visible">
            <div>
                <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" size="small" label-width="100px" @keyup.enter.native="dataFormSubmit()">
                    <el-form-item label="所属部门：">
                        <span v-if="userId" style="margin-right: 10px;">{{ dataForm.deptName }}</span>
                        <span v-if="!userId" style="margin-right: 10px;">{{ deptName }}</span>
                        <el-button v-if="userId" type="text" size="small" @click="UpdateOrg">
                            请选择
                        </el-button>
                    </el-form-item>
                    <el-form-item label="人员工号：">
                        <el-input v-model="dataForm.workNum" placeholder="手动输入" />
                    </el-form-item>
                    <el-form-item label="虚拟工号：">
                        <el-input v-model="dataForm.workNumTemp" placeholder="手动输入" />
                    </el-form-item>
                    <el-form-item label="人员姓名：" prop="realName">
                        <el-input v-model="dataForm.realName" placeholder="手动输入" auto-complete="off" />
                    </el-form-item>
                    <el-form-item label="职务：">
                        <el-input v-model="dataForm.post" placeholder="手动输入" />
                    </el-form-item>
                    <el-form-item label="邮箱：">
                        <el-input v-model="dataForm.email" placeholder="手动输入" />
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <el-input v-model="dataForm.mobile" placeholder="手动输入" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="dataFormSubmit">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择组织架构" :close-on-click-modal="false" :visible.sync="visible1">
            <p style="margin-bottom: 10px;">
                右击组织架构选择该部门
            </p>
            <el-tree :data="orgTree" node-key="deptId" :expand-on-click-node="false" @node-contextmenu="SetDept" />
        </el-dialog>
    </div>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'UserAddOrUpdate',
    components: {},
    props: {
        orgTree: {
            type: Object,
            default: () => {
            //    obj
            }
        }
    },
    data() {
        return {
            deptId: '',
            deptName: '',
            userId: '',
            visible: false,
            visible1: false,
            dataForm: {
                name: '',
                realName: '',
                workNum: '',
                workNumTemp: '',
                post: '',
                email: '',
                mobile: ''
            },
            type: true,
            dataRule: {
                realName: [
                    {
                        required: true,
                        message: '人员姓名不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        // init
        init(deptId, deptName, id) {
            this.deptId = deptId;
            this.deptName = deptName;
            if (id) {
                this.userId = id;
                this.$http(`${SYSTEMSETUP_API.USERDETAIL_API}/${id}`, 'GET').then(({ data }) => {
                    if (data.code === 0) {
                        this.dataForm = data.user;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.userId = '';
                this.dataForm = {};
            }
            this.visible = true;
        },
        UpdateOrg() {
            this.visible1 = true;
        },
        SetDept(event, data) {
            this.dataForm.deptId = data.deptId;
            this.dataForm.deptName = data.deptName;
            this.visible1 = false;
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.type) {
                        this.type = false;
                        if (this.dataForm.workNum || this.dataForm.workNumTemp) {
                            if (this.userId) {
                                // 修改
                                this.$http(`${SYSTEMSETUP_API.USERUPDATE_API}`, 'POST', this.dataForm).then(({ data }) => {
                                    if (data.code === 0) {
                                        this.$successToast('操作成功');
                                        this.type = true;
                                        this.visible = false;
                                        this.$emit('refreshDataList');
                                    } else {
                                        this.type = true;
                                        this.$errorToast(data.msg);
                                    }
                                });
                            } else {
                                // 新增
                                this.dataForm.deptId = this.deptId;
                                this.$http(`${SYSTEMSETUP_API.USERADD_API}`, 'POST', this.dataForm).then(({ data }) => {
                                    if (data.code === 0) {
                                        this.$successToast('操作成功');
                                        this.type = true;
                                        this.visible = false;
                                        this.$emit('refreshDataList');
                                    } else {
                                        this.type = true;
                                        this.$errorToast(data.msg);
                                    }
                                });
                            }
                        } else {
                            this.type = true;
                            this.$notify.error({
                                title: '错误',
                                message: '人员工号和虚拟工号必须添加一个'
                            });
                        }
                    }
                }
            });
        }
    }
};
</script>

<style scoped></style>
