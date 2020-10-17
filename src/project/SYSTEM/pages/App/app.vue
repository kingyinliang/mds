<template>
    <div class="header_main">
        <mds-card
            title="apk管理"
            :name="'apk'"
            :pack-up="false"
            style="margin-bottom: 0; background: white;"
        >
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" size="small" style="width: 550px;">
                <el-form-item label="版本号：" prop="appVersion">
                    <el-input v-model="dataForm.appVersion" placeholder="请输入版本号：" style="width: 400px;" />
                </el-form-item>
                <el-form-item label="上传apk：" prop="appName">
                    <el-upload
                        class="upload-demo"
                        drag
                        :action="FILE_API"
                        multiple
                        :http-request="httpRequest"
                        :on-success="addfile"
                    >
                        <em class="el-icon-upload" />
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-progress v-if="uploadP !==0 " :percentage="uploadP" />
                </el-form-item>
                <el-form-item label="更新内容：" prop="versionInfo">
                    <el-input v-model="dataForm.versionInfo" type="textarea" :rows="7" placeholder="请输入更新内容：" style="width: 400px;" />
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="dataFormSubmit()">
                        确定
                    </el-button>
                </el-form-item>
            </el-form>
        </mds-card>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import axios from 'axios';

@Component
export default class AppPage extends Vue {
    $refs: {
        dataForm: HTMLFormElement;
    }

    FILE_API = '';
    uploadP = 0;
    dataForm = {
        appName: '',
        forceFlag: '1', // 强制升级 0:非强制，1：强制, 默认非强制 0
        appVersion: '',
        versionInfo: ''
    };

    dataRule = {
        appName: [
            {
                required: true,
                message: '上传apk',
                trigger: 'blur'
            }
        ],
        appVersion: [
            {
                required: true,
                message: '版本号不能为空',
                trigger: 'blur'
            }
        ],
        versionInfo: [
            {
                required: true,
                message: '更新内容不能为空',
                trigger: 'blur'
            }
        ]
    };

    httpRequest(options) {
        COMMON_API.UPLOADAPK_API({
            appVersion: process.env.VUE_APP_ENV + this.dataForm.appVersion
        }).then(({ data }) => {
            if (data.code === 200) {
                this.FILE_API = data.data.url
                axios.put(data.data.url, options.file, {
                    onUploadProgress: progressEvent => {
                        this.uploadP = (progressEvent.loaded / progressEvent.total * 100 | 0)
                    }
                }).then(res => {
                    if (res.status === 200) {
                        options.onSuccess(data.data.key);
                    }
                })
            }
        });
    }

    addfile(key) {
        this.dataForm.appName = key;
    }

    dataFormSubmit() {
        console.log(this.dataForm);
        this.$refs.dataForm.validate((valid) => {
            if (valid) {
                COMMON_API.APPSAVE_API(this.dataForm).then(({ data }) => {
                    if (data.code === 200) {
                        this.$successToast('操作成功');
                    }
                });
            }
        });
    }
}

</script>
<style lang="scss" scoped>
</style>
