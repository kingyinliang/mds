<template>
    <div>
        <el-row class="login_box">
            <el-col :span="16">
                <div class="canvas_box">
                    <div id="canvas_box_main" class="canvas_box_main">
                        <canvas id="loginAnimation" />
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <img src="@/assets/img/MDSlogo.png" alt="" class="login_icon">
                <el-form ref="ruleForm2" :model="ruleForm2" statusIcon :rules="rules2" labelWidth="100px" class="loginForm_ui2" @keyup.enter.native="submitForm('ruleForm2')">
                    <p class="login_title1">
                        欢迎使用
                    </p>
                    <p class="login_title2">
                        MDS制造管理系统
                    </p>
                    <el-form-item prop="user">
                        <el-input v-model="ruleForm2.user" autoComplete="off" placeholder="账户/工号">
                            <i slot="prefix" class="iconfont factory-zhanghaodenglu" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input v-model="ruleForm2.pass" type="password" autoComplete="off" placeholder="密码">
                            <i slot="prefix" class="iconfont factory-mima" />
                        </el-input>
                        <el-button type="text" class="reset" @click="resetForm('ruleForm2')">
                            <i class="iconfont factory-zhongzhi" style="font-size: 12px;" />重置
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="loginBtn" @click="submitForm('ruleForm2')">
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-dialog :closeOnClickModal="false" width="500px" title="修改密码" :visible.sync="visible">
            <div>
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" labelWidth="100px" @keyup.enter.native="dataFormSubmit()">
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
    </div>
</template>

<script>
import { MAIN_API } from '@/api/api';
import { LoginAnimation } from './loginCanvas';

export default {
    name: 'Login',
    components: {},
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入密码'));
            }
                return callback();

        };
        const validatePass1 = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入账号'));
            } else if (value.length !== 8) {
                return callback(new Error('长度为 8 个字符工号'));
            }
                return callback();

        };
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
            dataForm: {
                password: '',
                newPassword: '',
                conPassword: ''
            },
            ruleForm2: {
                user: '',
                pass: ''
            },
            curr: 0,
            videoList: [],
            rules2: {
                user: [{ validator: validatePass1, trigger: 'blur' }],
                pass: [
                    {
                        min: 8,
                        max: 12,
                        message: '长度在 8 到 12 个字符',
                        trigger: 'blur'
                    },
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        },
        Pkgfactoryid: {
            get() {
                return this.$store.state.common.Pkgfactoryid;
            },
            set(val) {
                this.$store.commit('common/updateFactoryid', val);
            }
        },
        PkgworkShop: {
            get() {
                return this.$store.state.common.PkgworkShop;
            },
            set(val) {
                this.$store.commit('common/updateWorkShop', val);
            }
        },
        PkgproductDate: {
            get() {
                return this.$store.state.common.PkgproductDate;
            },
            set(val) {
                this.$store.commit('common/updateProductDate', val);
            }
        },
        PkgorderNo: {
            get() {
                return this.$store.state.common.PkgorderNo;
            },
            set(val) {
                this.$store.commit('common/updateOrderNo', val);
            }
        }
    },
    mounted() {
        // var that = this
        // this.$refs.videos.addEventListener('ended', function () {
        //   that.play()
        // })
        const canvas = new LoginAnimation(this.$);
        canvas.init();
    },
    methods: {
        play() {
            this.curr++;
            if (this.curr >= this.videoList.length) this.curr = 0;
            this.$refs.videos.load();
            this.$refs.videos.play();
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http(`${MAIN_API.UPPASS_API}`, 'POST', this.dataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.$success_SHINHO('操作成功');
                            this.visible = false;
                            this.$router.push({ path: '/home' });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: data.msg
                            });
                        }
                    });
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$http(`${MAIN_API.LOGIN_API}`, 'POST', {
                        // this.$http(`http://localhost:3000/mds/login`, 'POST', {
                        username: this.ruleForm2.user,
                        password: this.ruleForm2.pass
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$cookie.set('token', res.data.Authorization);
                            this.mainTabs = [];
                            this.Pkgfactoryid = '';
                            this.PkgworkShop = '';
                            this.PkgproductDate = '';
                            this.PkgorderNo = '';
                            if (res.data.list[0].isFirst === '1') {
                                this.visible = true;
                            } else {
                                // window.sessionStorage.setItem('menuList', JSON.stringify(res.data.data.menuList))
                                this.$router.push({ path: '/home' });
                            }
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: res.data.msg
                            });
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style lang="scss">
.bg1 {
    width: 200px;
    position: absolute;
    transform-style: preserve-3d;
    transform: rotateY(35deg);
}
video {
    object-fit: fill;
}
.loginForm {
    width: 320px;
    height: 254px;
    position: fixed;
    top: 200px;
    right: 105px;
    z-index: 999;
    label {
        color: white !important;
    }
    input {
        background: #fff !important;
    }
    .el-form-item__content {
        margin-left: 0 !important;
    }
    .el-input__prefix {
        margin-left: 6px;
    }
    .reset {
        float: right;
        color: white;
        position: absolute;
        right: 0;
        bottom: -22px;
        padding: 0;
        font-size: 12px;
    }
}
.loginFormBg {
    border-radius: 10px;
    background-color: rgba(60, 60, 60, 0.6);
    box-shadow: 0 5px 19px 1px rgba(214, 221, 237, 0.45);
    width: 405px;
    height: 321px;
    position: fixed;
    top: 165px;
    right: 65px;
}
.login_box {
    width: 100%;
    height: 100%;
    .el-col {
        height: 100%;
        overflow: hidden;
    }
    .login_icon {
        margin-left: 20px;
        margin-top: 20px;
        width: 300px;
        margin-bottom: 84px;
    }
    .canvas_box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
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
    padding-top: 20px;
    width: 300px;
    margin: auto;
    p {
        color: #333;
    }
    .login_title1 {
        font-size: 22px;
        line-height: 26px;
        margin-bottom: 10px;
    }
    .login_title2 {
        font-size: 28px;
        line-height: 40px;
        margin-bottom: 15px;
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
    .el-form-item__content {
        margin-left: 0 !important;
    }
    .el-input__prefix {
        margin-left: 6px;
    }
    .reset {
        float: right;
        color: #487bff;
        position: absolute;
        right: 0;
        bottom: -22px;
        padding: 0;
        font-size: 12px;
    }
}

@media (min-width: 1600px) {
    .loginForm_ui2 {
        width: 360px;
        padding-top: 60px;
        .login_title1 {
            font-size: 26px;
            font-weight: bold;
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
