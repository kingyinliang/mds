<template>
    <div style="width: 100%; height: 100%;">
        <!--修改密码-->
        <el-dialog :close-on-click-modal="false" width="500px" :title="`修改密码 (${realName} ${userName})`" :visible.sync="visible">
            <div>
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" @keyup.enter.native="dataFormSubmit()">
                    <el-form-item label="原密码：" prop="password">
                        <el-input v-model="dataForm.password" placeholder="请输入原始密码" minlength="8" maxlength="12" type="password" />
                    </el-form-item>
                    <el-form-item label="新密码：" prop="newPassword">
                        <el-input v-model="dataForm.newPassword" placeholder="请输入新密码（8~12位数字大小写字母组合）" minlength="8" maxlength="12" type="password" />
                    </el-form-item>
                    <el-form-item label="确认新密码：" prop="conPassword">
                        <el-input v-model="dataForm.conPassword" placeholder="请再次输入新密码（8~12位数字大小写字母组合）" minlength="8" maxlength="12" type="password" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-edit-outline" @click="dataFormSubmit">修改密码</el-button>
            </span>
        </el-dialog>
        <!--选择工厂-->
        <select-factory v-show="factoryVisible" ref="selectfactory" />
    </div>
</template>

<script>
import { COMMON_API } from 'common/api/api';
import SelectFactory from 'src/layout/main/SelectFactory';
import SSOLogin from 'utils/SSOLogin';
export default {
    name: 'Login',
    components: {
        SelectFactory
    },
    data() {
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请再次输入密码'));
            } else if (value !== this.dataForm.newPassword) {
                return callback(new Error('两次输入密码不一致!'));
            }
                return callback();

        };
        const checkValidatePass = (rule, value, callback) => {
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,12}$/.test(value) || !value) {
                return callback();
            }
                return callback(new Error('8-12位数字大小写字母组合'));

        };
        return {
            userName: '',
            realName: '',
            // 修改密码校验
            dataRule: {
                password: [
                    { required: true, message: '原密码必填', trigger: 'blur' },
                    {
                        min: 8,
                        max: 12,
                        message: '长度在 8 到 12 个字符',
                        trigger: 'blur'
                    }
                ],
                newPassword: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    // { min: 8, max: 12, message: '长度在 8 到 12 个字符', trigger: 'blur' },
                    { validator: checkValidatePass, trigger: 'blur' }
                ],
                conPassword: [
                    {
                        validator: validatePass2,
                        trigger: 'blur',
                        min: 8,
                        max: 12
                    }
                ]
            },
            visible: false,
            factoryVisible: false,
            factory: [],
            // 修改密码数据
            dataForm: {
                password: '',
                newPassword: '',
                conPassword: ''
            }
        };
    },
    created() {
        SSOLogin.getUserInfo().then(({ data }) => {
            this.loginSuccess(data.data)
        })
    },
    methods: {
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    COMMON_API.UPPASS_API(this.dataForm).then(() => {
                        this.$successToast('密码修改成功');
                        this.dataForm = {
                            password: '',
                            newPassword: '',
                            conPassword: ''
                        }
                        this.visible = false;
                        if (sessionStorage.getItem('defaultFactory')) {
                            const dfFa = this.factory.filter(item => item.deptCode === sessionStorage.getItem('defaultFactory'))[0]
                            this.$refs.selectfactory.goFa(dfFa)
                        } else if (this.factory.length > 1) {
                            this.factoryVisible = true;
                            this.$nextTick(() => {
                                this.$refs['selectfactory'].init();
                            });
                        } else if (this.factory.length === 1) {
                            this.$refs.selectfactory.goFa(this.factory[0])
                        } else if (this.factory.length === 0) {
                            this.$errorToast('未分配工厂，无法进入系统，请联系管理员');
                        }
                    });
                }
            });
        },
        loginSuccess(data) {
            sessionStorage.setItem('userId', data.uid || '');
            sessionStorage.setItem('userFactory', JSON.stringify(data.userFactory || '[]'));
            sessionStorage.setItem('userName', data.userName || '');
            sessionStorage.setItem('realName', data.realName || '');
            sessionStorage.setItem('loginUserId', data.id || '');
            sessionStorage.setItem('gender', data.sex || 'M');
            sessionStorage.setItem('deptId', data.deptId || '');
            sessionStorage.setItem('staff-post', data.post || '');
            sessionStorage.setItem('staff-location', data.deptName || '');
            sessionStorage.setItem('defaultFactory', data.defaultFactory || '');
            this.userName = data.userName
            this.realName = data.realName
            if (data.firstFlag === 'Y') {
                this.visible = true;
                this.factory = data.userFactory
                this.dataForm.id = data.id
                this.dataForm.workNum = data.userName
            } else if (data.defaultFactory && data.userFactory.filter(item => item.deptCode === data.defaultFactory).length) {
                const dfFa = data.userFactory.filter(item => item.deptCode === data.defaultFactory)[0]
                this.$refs.selectfactory.goFa(dfFa)
            } else {
                this.selectFactory(data)
            }
        },
        selectFactory(data) {
            this.factory = data.userFactory
            if (data.userFactory.length > 1) {
                this.factoryVisible = true;
                this.$nextTick(() => {
                    this.$refs['selectfactory'].init();
                });
            } else if (data.userFactory.length === 1) {
                this.$refs.selectfactory.goFa(data.userFactory[0])
            } else if (data.userFactory.length === 0) {
                this.$errorToast('未分配工厂，无法进入系统，请联系管理员');
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style lang="scss" scoped>
.selectFa {
    background: url("./assets/img/LoginToastBg.png") no-repeat;
    background-size: 100% 100%;
}
.loginFormBg {
    position: fixed;
    top: 165px;
    right: 65px;
    width: 405px;
    height: 321px;
    background-color: rgba(60, 60, 60, 0.6);
    border-radius: 10px;
    box-shadow: 0 5px 19px 1px rgba(214, 221, 237, 0.45);
}

.login_box {
    width: 100%;
    height: 100%;

    ::v-deep .el-col {/* stylelint-disable-line */
        height: 100%;
        overflow: hidden;
    }

    .login_icon {
        width: 300px;
        margin-top: 20px;
        margin-bottom: 84px;
        margin-left: 20px;
    }

    .canvas_box {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #070f6e 0%, #141bb7 51%, #1582ff 100%);

        &_main {
            width: 100%;

            canvas {
                width: 100%;
                height: 100%;
            }
        }
    }
}

.loginForm_ui2 {
    width: 300px;
    margin: auto;
    padding-top: 20px;

    p {
        color: #333;
    }

    .login_title1 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 22px;
        line-height: 26px;
    }

    .login_title2 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 28px;
        line-height: 40px;
    }

    .loginBtn {
        width: 100%;
        margin-top: 20px;
    }

    label {
        color: white !important;
    }

    input {
        background: #fff !important;
    }

    ::v-deep .el-form-item__content {/* stylelint-disable-line */
        margin-left: 0 !important;
    }

    ::v-deep .el-input__prefix {/* stylelint-disable-line */
        margin-left: 6px;
    }

    .reset {
        position: absolute;
        right: 0;
        bottom: -22px;
        float: right;
        padding: 0;
        color: #487bff;
        font-size: 12px;
    }
}

@media (min-width: 1600px) {
    .loginForm_ui2 {
        width: 360px;
        padding-top: 60px;

        .login_title1 {
            font-weight: bold;
            font-size: 26px;
        }

        .login_title2 {
            font-weight: bold;
            font-size: 32px;
        }

        .loginBtn {
            margin-top: 40px;
        }
    }
}
</style>
