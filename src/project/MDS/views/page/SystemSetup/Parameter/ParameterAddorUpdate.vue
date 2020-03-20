<template>
    <el-dialog :title="type ? (id ? '修改类型' : '新增类型') : id ? '修改参数' : '新增参数'" :closeOnClickModal="false" :visible.sync="visible">
        <div style="height: 330px; overflow: auto;">
            <el-form ref="dataForm" :model="dataForm" :rules="dataForm" labelWidth="125px" @keyup.enter.native="dataFormSubmit()">
                <el-form-item label="工厂：">
                    <span v-if="!type">{{ dataForm.factoryName }}</span>
                    <el-select v-if="type" v-model="dataForm.factory" @change="changeFactory">
                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="参数类型编码：">
                    <span v-if="!type">{{ dataForm.type }}</span>
                    <el-input v-if="type" v-model.trim="dataForm.type" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="参数类型名称：">
                    <span v-if="!type">{{ dataForm.name }}</span>
                    <el-input v-if="type" v-model.trim="dataForm.name" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="参数编码：">
                    <el-input v-model.trim="dataForm.code" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="参数名称：">
                    <el-input v-model.trim="dataForm.value" placeholder="手动输入" />
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { SYSTEMSETUP_API, BASICDATA_API } from '@/api/api';

export default {
    name: 'ParameterAddorUpdate',
    components: {},
    props: {
        factoryList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            id: false,
            dataForm: {
                // 工厂ID
                factory: '',
                // 工厂Name
                factoryName: '',
                type: '',
                name: '',
                code: '',
                value: ''
            },
            visible: false,
            type: true,
            submitType: true
        };
    },
    computed: {},
    mounted() {
        // this.getFactoryList()
    },
    methods: {
        init(str, id, adds) {
            if (str === 'type') {
                this.type = true;
            } else {
                this.type = false;
            }
            if (id) {
                this.id = id;
                this.dataForm = id;
            } else {
                this.id = false;
                this.dataForm = {};
            }
            if (adds) {
                this.dataForm = adds;
            }
            this.visible = true;
        },
        dataFormSubmit() {
            if (this.submitType) {
                this.submitType = false;
                this.$http(`${this.id ? SYSTEMSETUP_API.PARAMETERUPDATE_API : SYSTEMSETUP_API.PARAMETERADD_API}`, 'POST', this.dataForm).then(({ data }) => {
                    if (data.code === 0) {
                        this.dataForm = {};
                        this.$success_SHINHO('操作成功');
                        this.submitType = true;
                        this.visible = false;
                        this.$emit('refreshDataList');
                    } else {
                        this.submitType = true;
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 获取工厂
        getFactoryList() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.factoryList = res.data.typeList;
                    // if (!this.plantList.factoryid) {
                    //   this.plantList.factoryid = res.data.typeList[0].deptId
                    // }
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            });
        },
        changeFactory(value) {
            const factory = this.factoryList.find(item => item.deptId === value);
            if (factory) {
                this.dataForm.deptName = factory.deptName;
            }
        }
    }
};
</script>

<style scoped></style>
