<template>
    <div class="header_main">
        <el-card class="searchCard searchCards">
            <el-form :model="formHeader" size="small" :inline="true" label-width="70px" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" class="width150px">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in factory" :key="index" :value="item.deptId" :label="item.deptName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料编码：">
                    <el-select v-model="formHeader.materialCode" filterable style="width: 230px;">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.MATERIAL_CODE + ` ${item.MATERIAL_NAME}`" :value="item.MATERIAL_CODE" />
                    </el-select>
                </el-form-item>
                <el-form-item label="大类属性：">
                    <el-select v-model="formHeader.type" filterable style="width: 230px;">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.value" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('ste:mid:list')" type="primary" size="small" @click="GetList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="JBS物料对应大类列表" :name="'mid'" :pack-up="false" style=" margin-top: 5px; margin-bottom: 0; background: #fff;">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button v-if="isAuth('ste:mid:save')" type="primary" size="small" @click="AddInfo()">
                        新增
                    </el-button>
                    <el-button v-if="isAuth('ste:mid:delete')" type="danger" size="small" @click="DeleteInfo()">
                        批量删除
                    </el-button>
                </div>
            </template>
            <el-table :data="dataList" class="newTable" :height="mainClientHeight - 48 - 25 - 34" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%;" @row-dblclick="EditInfo" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="factoryName" label="工厂" :show-overflow-tooltip="true" />
                <el-table-column label="物料编码" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}
                        {{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="大类属性" :show-overflow-tooltip="true" />
                <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
            </el-table>
        </mds-card>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisibleAdd" width="400px" custom-class="dialog__class">
            <div slot="title">
                新增
            </div>
            <el-form ref="Addstar" :model="formAdd" :inline="true" size="small" :rules="Addrulestar" label-width="85px">
                <el-form-item label="工厂：">
                    &nbsp;{{ formAdd.factoryName }}
                </el-form-item>
                <el-form-item label="物料：" prop="materialCode">
                    <el-select v-model="formAdd.materialCode" filterable style="width: 230px;">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.MATERIAL_CODE + ` ${item.MATERIAL_NAME}`" :value="item.MATERIAL_CODE" />
                    </el-select>
                </el-form-item>
                <el-form-item label="大类属性：" prop="type">
                    <el-select v-model="formAdd.type" filterable style="width: 230px;">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.value" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="formAdd.remark" style="width: 230px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisibleAdd = false">取 消</el-button>
                <el-button type="primary" size="small" @click="AddSave('Addstar')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
export default {
    name: 'Index',
    data() {
        return {
            formHeader: {
                factory: '',
                materialCode: '',
                type: ''
            },
            factory: [],
            factoryName: '',
            materialList: [],
            typeList: [],
            dataList: [],
            dialogVisibleAdd: false,
            formAdd: {
                remark: ''
            },
            Addrulestar: {
                factory: [{ required: true, message: '请选择工厂', trigger: 'blur' }],
                materialCode: [{ required: true, message: '请选择物料', trigger: 'blur' }],
                type: [{ required: true, message: '请选择大类', trigger: 'blur' }]
            },
            postUrl: '',
            multipleSelection: []
        };
    },
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            }
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.GetMaterialCodeList(n);
        }
    },
    mounted() {
        this.Getdeptcode();
        this.GetTypeList();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.materialList = [];
            this.dataList = [];
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取物料
        GetMaterialCodeList(id) {
            if (id) {
                this.$http(`${BASICDATA_API.JBS_MATERIAL_LIST}`, 'POST', { factory: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.materialList = data.materialList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 大类
        GetTypeList() {
            this.$http(`${BASICDATA_API.JBS_GETTYPE_LIST}`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.typeList = data.jbsGetType;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 查询
        GetList() {
            if (!this.formHeader.factory) {
                this.$warningToast('请选择工厂');
                return false;
            }
            this.$http(`${BASICDATA_API.JBS_REPROT_LIST}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        AddInfo() {
            this.formAdd = {
                id: '',
                factory: this.formHeader.factory,
                factoryName: this.factory.find(item => item.deptId === this.formHeader.factory).deptName,
                materialCode: '',
                type: '',
                remark: ''
            };
            this.dialogVisibleAdd = true;
        },
        AddSave(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.formAdd.materialName = this.materialList.find(item => item.MATERIAL_CODE === this.formAdd.materialCode)['MATERIAL_NAME'];
                    let msgText = '保存成功';
                    if (this.formAdd.id !== '') {
                        this.postUrl = BASICDATA_API.JBS_DATA_UPDATE;
                    } else {
                        this.postUrl = BASICDATA_API.JBS_DATA_INSERT;
                        msgText = '提交成功';
                    }
                    this.$http(this.postUrl, 'POST', this.formAdd).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successToast(msgText);
                            this.dialogVisibleAdd = false;
                            this.$refs[formName].resetFields();
                            this.GetList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        EditInfo(row) {
            this.formAdd = row;
            this.formAdd.factoryName = this.factory.find(item => item.deptId === row.factory).deptName;
            this.dialogVisibleAdd = true;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        DeleteInfo() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请勾选数据');
                return false;
            }
            this.$confirm('确认要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${BASICDATA_API.JBS_DATA_DEL}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$successToast('删除成功');
                        this.GetList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        }
    }
};
</script>

<style scoped lang="scss">
.dialog__class {
    border-radius: 6px !important;
    .el-dialog__header {
        height: 59px;
        color: #fff;
        font-size: 20px;
        background: rgba(24, 144, 255, 1);
        border-radius: 6px 6px 0 0;
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
}
</style>
