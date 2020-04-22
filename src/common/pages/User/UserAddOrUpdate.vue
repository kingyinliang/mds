<template>
    <div>
        <el-dialog :title="userID==='' ? '修改人员信息' : '新增人员'" :close-on-click-modal="false" :visible.sync="visible">
            <div>
                <el-form ref="dataForm" :model="dataForm" status-icon :rules="checkRules" size="small" label-width="100px" @keyup.enter.native="submitDataform()">
                    <el-form-item label="所属部门：">
                        <span v-if="userID===''" style="margin-right: 10px;">{{ dataForm.deptName }}</span>
                        <span v-if="userID!==''" style="margin-right: 10px;">{{ deptName }}</span>
                        <el-button v-if="userID===''" type="text" size="small" @click="updateOrg">
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
                <el-button type="primary" size="small" @click="submitDataform">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择组织架构" :close-on-click-modal="false" :visible.sync="visible1">
            <p style="margin-bottom: 10px;">
                右击组织架构选择该部门
            </p>
            <el-tree :data="orgTree" node-key="deptId" :expand-on-click-node="false" @node-contextmenu="setDepartment" />
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
            userID: '',
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
            checkRules: {
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
        init(deptID, deptName, id) {
            this.deptID = deptID;
            this.deptName = deptName;
            if (id) {
                this.userID = id;
                COMMON_API.USER_INSERT_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.dataForm = data.user;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.userID = '';
                this.dataForm = {};
            }
            this.visible = true;
        },
        updateOrg() {
            this.visible1 = true;
        },
        setDepartment(event, data) {
            this.dataForm.deptId = data.deptId;
            this.dataForm.deptName = data.deptName;
            this.visible1 = false;
        },
        // 表单提交
        submitDataform() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.type) {
                        this.type = false;
                        if (this.dataForm.workNum || this.dataForm.workNumTemp) {
                            if (this.userID) {
                                // 修改
                                COMMON_API.USER_UPDATE_API(this.dataForm).then(({ data }) => {
                                    if (data.code === 200) {
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
                                this.dataForm.deptId = this.deptID;
                                COMMON_API.USER_INSERT_API(this.dataForm).then(({ data }) => {
                                    if (data.code === 200) {
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
