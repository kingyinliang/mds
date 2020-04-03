<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :queryAuth="false"
            :showOperationColumn="true"
            :operationColumnWidth="70"
            :showSelectColumn="true"
            :listInterface="listInterface"
            :queryFormData="queryFormData"
            :column="column"
            returnColumnType="iotListInfo"
            :exportOption="exportOption"
        >
            <template slot="mds-button-middle">
                <div style=" float: right; width: 220px;">
                    <el-upload class="upload-demo" style=" float: left; width: 56px;" :action="uploadApi" :showFileList="false" :headers="myHeaders" :beforeUpload="beforeUp" :onSuccess="importSuccess" :onError="improtError">
                        <el-button size="small" type="primary">
                            导入
                        </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" @click="exportData()">
                        导出
                    </el-button>
                    <el-button type="danger" size="small" @click="remove">
                        批量删除
                    </el-button>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="primary" round size="mini" @click="editRow(scope.row)">
                    编辑
                </el-button>
            </template>
        </query-table>
        <el-dialog :visible.sync="DialogTableVisible" :closeOnClickModal="false" width="500px" customClass="dialog__class">
            <div slot="title">
                编辑
            </div>
            <el-form ref="form" size="small" labelWidth="100px" :model="form">
                <el-form-item label="工厂编码：">
                    <el-input v-model="form.factory" />
                </el-form-item>
                <el-form-item label="工厂名称：">
                    <el-input v-model="form.factoryName" />
                </el-form-item>
                <el-form-item label="车间编码：">
                    <el-input v-model="form.workShop" />
                </el-form-item>
                <el-form-item label="车间名称：">
                    <el-input v-model="form.workShopName" />
                </el-form-item>
                <el-form-item label="终端编码：">
                    <el-input v-model="form.plcCode" />
                </el-form-item>
                <el-form-item label="终端名称：">
                    <el-input v-model="form.plcName" />
                </el-form-item>
                <el-form-item label="产线编码：">
                    <el-input v-model="form.productionLineCode" />
                </el-form-item>
                <el-form-item label="产线名称：">
                    <el-input v-model="form.productionLineName" />
                </el-form-item>
                <el-form-item label="工序编码：">
                    <el-input v-model="form.processesCode" />
                </el-form-item>
                <el-form-item label="工序名称：">
                    <el-input v-model="form.processesName" />
                </el-form-item>
                <el-form-item label="设备编码：">
                    <el-input v-model="form.deviceCode" />
                </el-form-item>
                <el-form-item label="设备名称：">
                    <el-input v-model="form.deviceName" />
                </el-form-item>
                <el-form-item label="参数类型：">
                    <el-input v-model="form.parameterTypeCode" />
                </el-form-item>
                <el-form-item label="参数类型描述：">
                    <el-input v-model="form.parameterTypeName" />
                </el-form-item>
                <el-form-item label="参数编码：">
                    <el-input v-model="form.parameterCode" />
                </el-form-item>
                <el-form-item label="参数名称：">
                    <el-input v-model="form.parameterName" />
                </el-form-item>
                <el-form-item label="换算公式：">
                    <el-input v-model="form.formula" />
                </el-form-item>
                <el-form-item label="上限值：">
                    <el-input v-model="form.upLimit" />
                </el-form-item>
                <el-form-item label="下限值：">
                    <el-input v-model="form.lowerLimit" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="form.remark" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="DialogTableVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="saveRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import { Loading } from 'element-ui';
import { SYSTEMSETUP_API } from '@/api/api';
import { DeepClone } from '@/net/validate.js';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            myHeaders: { Authorization: Vue.cookie.get('token') },
            DialogTableVisible: false,
            showSelectColumn: true,
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsMore: () => {
                        return this.$http(`${SYSTEMSETUP_API.IOTHEADSEARCHLIST_API}`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'factory.workShop.parameterCode',
                        label: ['FACTORY_NAME'],
                        value: 'FACTORY'
                    }
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    resVal: {
                        resData: 'workShop',
                        label: ['WORK_SHOP_NAME'],
                        value: 'WORK_SHOP'
                    }
                },
                {
                    type: 'select',
                    label: '参数名称',
                    prop: 'parameterCode',
                    filterable: true,
                    resVal: {
                        resData: 'parameterCode',
                        label: ['PARAMETER_NAME'],
                        value: 'PARAMETER_CODE'
                    }
                }
            ],
            listInterface: params => {
                return this.$http(`${SYSTEMSETUP_API.IOTDATALIST_API}`, 'POST', params);
            },
            column: [
                {
                    prop: 'factory',
                    label: '工厂编码',
                    width: '80'
                },
                {
                    prop: 'factoryName',
                    label: '工厂名称',
                    width: '120'
                },
                {
                    prop: 'workShop',
                    label: '车间编码',
                    width: '80'
                },
                {
                    prop: 'workShopName',
                    label: '车间名称',
                    width: '100'
                },
                {
                    prop: 'plcCode',
                    label: '终端编码',
                    width: '80'
                },
                {
                    prop: 'plcName',
                    label: '终端名称',
                    width: '100'
                },
                {
                    prop: 'productionLineCode',
                    label: '产线编码',
                    width: '80'
                },
                {
                    prop: 'productionLineName',
                    label: '产线名称',
                    width: '100'
                },
                {
                    prop: 'processesCode',
                    label: '工序编码',
                    width: '80'
                },
                {
                    prop: 'processesName',
                    label: '工序名称',
                    width: '100'
                },
                {
                    prop: 'deviceCode',
                    label: '设备编码',
                    width: '80'
                },
                {
                    prop: 'deviceName',
                    label: '设备名称',
                    width: '100'
                },
                {
                    prop: 'parameterTypeCode',
                    label: '参数类型',
                    width: '100'
                },
                {
                    prop: 'parameterTypeName',
                    label: '参数类型描述',
                    width: '130'
                },
                {
                    prop: 'parameterCode',
                    label: '参数编码',
                    width: '100'
                },
                {
                    prop: 'parameterName',
                    label: '参数名称',
                    width: '100'
                },
                {
                    prop: 'formula',
                    label: '换算公式',
                    width: '100'
                },
                {
                    prop: 'upLimit',
                    label: '上限值',
                    width: '100'
                },
                {
                    prop: 'lowerLimit',
                    label: '下限值',
                    width: 100
                },
                {
                    prop: 'remark',
                    label: '备注',
                    width: '100'
                }
            ],
            form: {},
            exportOption: {
                auth: '',
                exportInterface: SYSTEMSETUP_API.IOTDATALISTEXPORT_API,
                text: 'IOT换算'
            },
            uploadApi: `${SYSTEMSETUP_API.IOTDATALISTIMPORT_API}`
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.getHeaderSearchList();
    },
    methods: {
        // 头部搜索条件拉取
        getHeaderSearchList() {
            this.$http(`${SYSTEMSETUP_API.IOTHEADSEARCHLIST_API}`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code !== 0) {
                    this.$$warningTost(data.msg);
                }
            });
        },
        // 编辑
        editRow(row) {
            this.DialogTableVisible = true;
            this.form = DeepClone(row);
        },
        // 保存
        saveRow() {
            this.$http(`${SYSTEMSETUP_API.IOTDATAUPDATE_API}`, 'POST', this.form).then(({ data }) => {
                if (data.code === 0) {
                    this.$success_SHINHO('保存成功');
                    this.DialogTableVisible = false;
                    this.$refs.queryTable.GetDataList(true);
                } else {
                    this.$warningTost(data.msg);
                }
            });
        },
        // 删除
        remove() {
            if (this.$refs.queryTable.multipleSelection.length > 0) {
                this.$confirm('正在执行删除操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(`${SYSTEMSETUP_API.IOTDATADEL_API}`, 'POST', this.$refs.queryTable.multipleSelection).then(({ data }) => {
                        if (data.code === 0) {
                            this.$success_SHINHO('删除成功');
                            this.$refs.queryTable.GetDataList(true);
                        } else {
                            this.$error_SHINHO(data.msg);
                        }
                    });
                });
            } else {
                this.$warningTost('请选择数据');
            }
        },
        // 导出
        exportData() {
            this.$refs.queryTable.FormExportExcel();
        },
        beforeUp() {
            this.loading = Loading.service({
                lock: true,
                spinner: 'loadingGif',
                text: '加载中……',
                background: 'rgba(255, 255, 255, 0.7)'
            });
        },
        importSuccess(response) {
            if (response.code === 0) {
                this.$success_SHINHO('导入成功');
                this.$refs.queryTable.GetDataList(true);
            } else {
                this.loading.close();
                this.$warningTost('导入失败');
            }
        },
        improtError() {
            this.$warningTost('导入失败');
            this.loading.close();
        }
    }
};
</script>

<style scoped></style>
