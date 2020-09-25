<template>
    <div class="header_main">
        <mds-card
            title="apk管理"
            :name="'apk'"
            :pack-up="false"
            style="margin-bottom: 0; background: white;"
        >
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" size="small" @keyup.enter.native="dataFormSubmit()">
                <el-form-item label="上传apk：" prop="url">
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
                </el-form-item>
                <el-form-item label="版本号：" prop="version">
                    <el-input v-model="dataForm.version" placeholder="请输入版本号：" style="width: 400px;" />
                </el-form-item>
                <el-form-item label="更新内容：" prop="version">
                    <el-input v-model="dataForm.version" type="textarea" :rows="7" placeholder="请输入更新内容：" style="width: 400px;" />
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
    FILE_API = '';
    dataForm = {
        url: '',
        version: ''
    };

    dataRule = {
        url: [
            {
                required: true,
                message: '上传apk',
                trigger: 'blur'
            }
        ],
        version: [
            {
                required: true,
                message: '版本号不能为空',
                trigger: 'blur'
            }
        ]
    };

    httpRequest(options) {
        COMMON_API.UPLOADFILE_API({
            name: options.file.name
        }).then(({ data }) => {
            if (data.code === 200) {
                this.FILE_API = data.data.url
                axios.put(data.data.url, options.file).then(res => {
                    if (res.status === 200) {
                        options.onSuccess(data.data.key);
                    }
                })
            }
        });
    }

    addfile(key) {
        this.dataForm.url = key;
    }

    dataFormSubmit() {
        console.log(this.dataForm);
    }
}

</script>
<style lang="scss" scoped>
</style>
