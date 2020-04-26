<template>
    <div>
        <el-dialog :title="targetID ? '修改人员信息' : '新增人员'" :close-on-click-modal="false" :visible.sync="isDialogShow">
            <el-form ref="dataForm" :model="dataForm" status-icon :rules="checkRules" size="small" label-width="100px">
                <el-form-item label="所属部门：">
                    <span v-if="targetID" style="margin-right: 10px;">{{ dataForm.deptName }}</span>
                    <span v-if="!targetID" style="margin-right: 10px;">{{ deptName }}</span>
                    <el-button v-if="targetID" type="text" size="small" @click="updateOrg">
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
                <el-form-item label="用户名：" prop="userName">
                    <el-input v-model="dataForm.userName" placeholder="手动输入" auto-complete="off" />
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
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="submitDataForm">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择组织架构" :close-on-click-modal="false" :visible.sync="isOrgTreeShow">
            <p style="margin-bottom: 10px;">
                右击组织架构选择该部门
            </p>
            <el-tree :data="orgTree" node-key="id" :expand-on-click-node="false" :props="{label:'deptName',children:'children'}" @node-contextmenu="setDepartment" />
        </el-dialog>
    </div>
</template>

<script>
import { COMMON_API } from 'common/api/api';
export default {
    name: 'UserAddOrUpdate',
    components: {},
    props: {
        orgTree: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            deptId: '',
            deptName: '',
            targetID: '',
            isDialogShow: false,
            isOrgTreeShow: false,
            dataForm: {
                userName: '',
                realName: '',
                workNum: '',
                workNumTemp: '',
                post: '',
                email: '',
                mobile: ''
            },
            checkRules: {
                realName: [
                    {
                        required: true,
                        message: '人员姓名不能为空',
                        trigger: 'blur'
                    }
                ],
                userName: [
                    {
                        required: true,
                        message: '用户名不能为空',
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
        closeDialog() {
            this.isDialogShow = false;
            this.$refs.dataForm.resetFields();
        },
        // init
        init(deptID, deptName, id) {
            this.deptID = deptID;
            this.deptName = deptName;
            if (id) {
                this.targetID = id;
                COMMON_API.USER_BATCH_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    ids: [this.targetID]
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.dataForm = data.data[0];
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.targetID = '';
                this.dataForm = {};
            }
            this.isDialogShow = true;
        },
        updateOrg() {
            this.isOrgTreeShow = true;
        },
        setDepartment(event, data) {
            this.dataForm.deptId = data.deptId;
            this.dataForm.deptName = data.deptName;
            this.isOrgTreeShow = false;
        },
        // 表单提交
        submitDataForm() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                        if (this.dataForm.workNum || this.dataForm.workNumTemp) {
                            if (this.targetID) {
                                // 修改
                                COMMON_API.USER_UPDATE_API(this.dataForm).then(({ data }) => {
                                    if (data.code === 200) {
                                        this.$successToast('操作成功');
                                        this.isDialogShow = false;
                                        this.$emit('refreshDataList');
                                    } else {
                                        this.$errorToast(data.msg);
                                    }
                                });
                            } else {
                                // 新增
                                this.dataForm.deptId = this.deptID;
                                COMMON_API.USER_INSERT_API({
                                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                    deptId: this.dataForm.deptId,
                                    userName: this.dataForm.userName,
                                    realName: this.dataForm.realName,
                                    workNum: this.dataForm.workNum,
                                    tempFlag: this.dataForm.workNumTemp,
                                    post: this.dataForm.post,
                                    email: this.dataForm.email,
                                    phone: this.dataForm.mobile
                                }).then(({ data }) => {
                                    if (data.code === 200) {
                                        this.$successToast('操作成功');
                                        this.isDialogShow = false;
                                        this.$emit('refreshDataList');
                                    } else {
                                        this.$errorToast(data.msg);
                                    }
                                });
                            }
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: '人员工号和虚拟工号必须添加一个'
                            });
                        }
                }
            });
        }
    }
};
</script>

<style scoped></style>
