<template>
    <div style="width: 100%; height: 100%;">
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
                <el-form ref="ruleForm2" :model="ruleForm2" status-icon :rules="rules2" label-width="100px" class="loginForm_ui2" @keyup.enter.native="submitForm('ruleForm2')">
                    <p class="login_title1">
                        欢迎使用
                    </p>
                    <p class="login_title2">
                        MDS制造管理系统
                    </p>
                    <el-form-item prop="user">
                        <el-input v-model="ruleForm2.user" auto-complete="off" placeholder="账户/工号">
                            <i slot="prefix" class="iconfont factory-zhanghaodenglu" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input v-model="ruleForm2.pass" type="password" auto-complete="off" placeholder="密码">
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
        <!--修改密码-->
        <el-dialog :close-on-click-modal="false" width="500px" title="修改密码" :visible.sync="visible">
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
        <el-dialog :show-close="false" :visible.sync="factoryVisible" class="selectFa">
            <div class="factoryBox">
                <div v-for="(item, index) in factory" :key="index" class="factoryItem">
                    <div class="itemBox">
                        <div class="item-title">
                            <p class="item-title-p">
                                {{ item.deptName }}
                            </p>
                            <!--<el-switch-->
                            <!--v-model="item.value"-->
                            <!--style="float: right;"-->
                            <!--active-color="#8BC34A"-->
                            <!--inactive-color="#dcdfe6"-->
                            <!--@click="setOther(index)"-->
                            <!--/>-->
                        </div>
                        <div @click="goFa(item)">
                            <img v-if="item.deptCode === '8888'" src="./assets/img/factory8.png" alt="">
                            <img v-else :src="'../static/img/factory'+ index + '.png'" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { COMMON_API } from 'common/api/api';
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
            factoryVisible: false,
            factory: [],
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
    mounted() {
        const canvas = new LoginAnimation(this.$);
        canvas.init();
    },
    methods: {
        goDataViews() {
            window.location.href = '/MDS.html#/DataEcharts/KojiMaking-DataScreening-index'
        },
        goFa(item) {
            sessionStorage.setItem('vuex', '');
            if (item.deptCode === '6010' || item.deptCode === '7100' || item.deptCode === '7101') {
                sessionStorage.setItem('factory', JSON.stringify(item || ''));
                window.location.href = '/MDS.html'
            } else if (item.deptCode === '8888') {
                sessionStorage.setItem('factory', JSON.stringify(item || ''));
                window.location.href = '/SYSTEM.html'
            } else {
                sessionStorage.setItem('factory', JSON.stringify(item || ''));
                window.location.href = '/DFMDS.html'
            }
        },
        setOther(Num) {
            this.factory.forEach((item, index) => {
                if (Num !== index) {
                    item.value = false
                } else {
                    item.value = !item.value
                }
            })
        },
        play() {
            this.curr++;
            if (this.curr >= this.videoList.length) this.curr = 0;
            this.$refs.videos.load();
            this.$refs.videos.play();
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    COMMON_API.UPPASS_API(this.dataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successToast('操作成功');
                            this.visible = false;
                            if (this.factory.length > 1) {
                                this.factoryVisible = true
                            } else if (this.factory.length === 1) {
                                this.goFa(this.factory[0])
                            }
                        }
                    });
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    COMMON_API.LOGIN_API({
                        userName: this.ruleForm2.user,
                        password: this.ruleForm2.pass
                    }).then(({ data }) => {
                        if (data.code === 200) {
                            this.$cookie.set('token', data.data.token);
                            sessionStorage.setItem('userId', data.data.uid || '');
                            sessionStorage.setItem('userFactory', JSON.stringify(data.data.userFactory || '[]'));
                            sessionStorage.setItem('userName', data.data.userName || '');
                            sessionStorage.setItem('realName', data.data.realName || '');
                            if (data.data.firstFlag === '1') {
                                this.visible = true;
                                this.factory = data.data.userFactory
                            } else {
                                this.selectFactory(data.data)
                            }
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        selectFactory(data) {
            this.factory = data.userFactory
            if (data.userFactory.length > 1) {
                this.factoryVisible = true
            } else if (data.userFactory.length === 1) {
                this.goFa(data.userFactory[0])
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style lang="scss">
.selectFa {
    background: url("./assets/img/LoginToastBg.png") no-repeat;
    background-size: 100% 100%;
    .el-dialog {
        width: 100%;
        background: none;
        box-shadow: none;
        .el-dialog__header {
            background: none;
        }
        .el-dialog__body {
            display: flex;
            justify-content: center;
        }
    }
    .factoryBox {
        width: 1168px;
        margin: auto;
    }
    .factoryItem {
        display: inline-block;
        padding: 5px;
        .itemBox {
            box-sizing: content-box !important;
            width: 250px;
            padding: 16px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.09);
            cursor: pointer;
            img {
                display: block;
                width: 150px;
                height: 103px;
                margin: auto;
            }
            .item-title {
                margin: 0 0 30px 0;
                font-weight: bold;
                font-size: 16px;
                .item-title-p {
                    width: 250px;
                    margin: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
.bg1 {
    position: absolute;
    width: 200px;
    transform: rotateY(35deg);
    transform-style: preserve-3d;
}

video {
    object-fit: fill;
}

.loginForm {
    position: fixed;
    top: 200px;
    right: 105px;
    z-index: 999;
    width: 320px;
    height: 254px;

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
        position: absolute;
        right: 0;
        bottom: -22px;
        float: right;
        padding: 0;
        color: white;
        font-size: 12px;
    }
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

    .el-col {
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
        margin-bottom: 10px;
        font-size: 22px;
        line-height: 26px;
    }

    .login_title2 {
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

    .el-form-item__content {
        margin-left: 0 !important;
    }

    .el-input__prefix {
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
