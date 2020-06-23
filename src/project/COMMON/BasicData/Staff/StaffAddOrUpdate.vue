<template>
    <div>
        <el-dialog :title="targetID ? '修改人员信息' : '新增人员'" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
            <el-form ref="dataForm" :model="dataForm" status-icon :rules="checkRules" size="small" label-width="100px">
                <el-form-item label="所属部门：">
                    <span v-if="targetID" style="margin-right: 10px;">{{ dataForm.deptName }}</span>
                    <span v-if="!targetID" style="margin-right: 10px;">{{ deptName }}</span>
                    <el-button v-if="targetID" type="text" size="small" @click="updateOrg">
                        请选择
                    </el-button>
                </el-form-item>
                <el-form-item label="人员工号：" prop="workNum">
                    <el-input v-model="dataForm.workNum" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item label="人员姓名：" prop="realName">
                    <el-input v-model="dataForm.realName" placeholder="手动输入" auto-complete="off" clearable />
                </el-form-item>
                <el-form-item label="性别：">
                    <el-select v-model="dataForm.sex" placeholder="请选择" style="width: 100%;">
                        <el-option label="男" value="M" />
                        <el-option label="女" value="F" />
                    </el-select>
                </el-form-item>
                <el-form-item label="职务：">
                    <el-input v-model="dataForm.post" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="dataForm.email" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="dataForm.phone" placeholder="手动输入" clearable />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="j_closeBtn" @click="closeDialog">
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
        const checkWorkNum = (rule, value, callback) => {
            const patt = new RegExp('^[A-Z]');
            let tempStr = ''
            if (patt.test(this.dataForm.workNum.toUpperCase().substr(0, 1))) {
                tempStr = this.dataForm.workNum.toUpperCase().substr(1)
            } else {
                tempStr = this.dataForm.workNum.toUpperCase()
            }

            if (tempStr.length > 10) {
                return callback(new Error('请输入10个数字工号'));
            }
            callback();
        };

        return {
            deptID: '',
            deptName: '',
            targetID: '',
            isDialogShow: false,
            isOrgTreeShow: false,
            dataForm: {
                deptName: '',
                workNum: '',
                realName: '',
                userName: '',
                sex: '',
                post: '',
                email: '',
                phone: ''
            },
            checkRules: {
                workNum: [
                    {
                        required: true,
                        message: '工号不能为空',
                        trigger: 'blur'
                    },
                    { validator: checkWorkNum, trigger: 'blur' }
                ],
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
        closeDialog() {
            document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
            this.$refs.dataForm.resetFields();
            this.isDialogShow = false;
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
                    this.dataForm = data.data[0];
                    this.dataForm.deptName = deptName;
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
            this.dataForm.deptId = data.id;
            this.dataForm.deptName = data.deptName;
            this.isOrgTreeShow = false;
        },
        // 表单提交
        submitDataForm() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                        if (this.dataForm.workNum) {
                            if (this.targetID) {
                                // 修改
                                const patt = new RegExp('^[A-Z]');

                                if (patt.test(this.dataForm.workNum)) {
                                    this.dataForm.tempFlag = 'Y'
                                } else {
                                    this.dataForm.tempFlag = 'N'
                                }
                                COMMON_API.USER_UPDATE_API(this.dataForm).then(() => {
                                    this.$emit('refreshDataList');
                                    this.isDialogShow = false;
                                });
                            } else {
                                // 新增
                                this.dataForm.deptId = this.deptID;
                                this.dataForm.deptName = this.deptName;
                                const patt = new RegExp('^[A-Z]');

                                if (patt.test(this.dataForm.workNum)) {
                                        this.dataForm.tempFlag = 'Y'
                                    } else {
                                        this.dataForm.tempFlag = 'N'
                                    }


                                COMMON_API.USER_INSERT_API({
                                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                    deptId: this.dataForm.deptId,
                                    userName: this.dataForm.workNum,
                                    realName: this.dataForm.realName,
                                    workNum: this.dataForm.workNum.toUpperCase(),
                                    tempFlag: this.dataForm.tempFlag,
                                    sex: this.dataForm.sex,
                                    post: this.dataForm.post,
                                    email: this.dataForm.email,
                                    phone: this.dataForm.phone
                                }).then(() => {
                                    this.$emit('refreshDataList');
                                    this.isDialogShow = false;
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

<style scoped>
.el-form-item {
    margin-bottom: 20px !important;
}
</style>
