<template>
    <div class="wrapper">
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
            <el-form ref="dataForm" :model="dataForm" label-width="100px" :rules="checkRules" style="max-height: 400px; overflow-y: auto;">
                <div class="form-item-group">
                    <el-form-item label="数据集编码：" prop="dataSetCode" style="margin-right: 30px;">
                        {{ dataForm.dataSetCode }}
                    </el-form-item>
                    <el-form-item label="数据集描述：" prop="dataSetDescribe">
                        <el-input v-model="dataForm.dataSetDescribe" placeholder="手动输入" clearable />
                    </el-form-item>
                    <el-form-item label="拥有人：" prop="dataSetOwner">
                        <el-select v-model="dataForm.dataSetOwner" placeholder="请选择">
                            <el-option
                                v-for="item in 5"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="项目属性：" prop="dataSetProject" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetProjectSelectAll" :indeterminate="isProjectIndeterminate" @change="handleCheckAllProjectChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.project" @change="handleCheckedProjectChange">
                        <el-checkbox v-for="item in projectArray" :key="'projectArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="任务属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetTaskSelectAll" :indeterminate="isTaskIndeterminate" @change="handleCheckAllTaskChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.task" @change="handleCheckedTaskChange">
                        <el-checkbox v-for="item in taskArray" :key="'taskArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="标准属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetStandardSelectAll" :indeterminate="isStandardIndeterminate" @change="handleCheckAllStandardChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.standard" @change="handleCheckedStandardChange">
                        <el-checkbox v-for="item in standardArray" :key="'standardArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="配方属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetFormulaSelectAll" :indeterminate="isFormulaIndeterminate" @change="handleCheckAllFormulaChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.formula" @change="handleCheckedFormulaChange">
                        <el-checkbox v-for="item in formulaArray" :key="'formulaArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="图纸属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetBlueprintSelectAll" :indeterminate="isBlueprintIndeterminate" @change="handleCheckAllBlueprintChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.bluePrint" @change="handleCheckedBlueprintChange">
                        <el-checkbox v-for="item in blueprintArray" :key="'blueprintArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="j_closeBtn" @click="closeDialog">
                    取消
                </el-button>
                <el-button type="primary" @click="submitDataForm">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    export default {
        name: 'RoleaddAndUpdate',
        data() {
            return {
                dialogTitle: '',
                isDialogShow: false,
                isProjectIndeterminate: true,
                isTaskIndeterminate: true,
                isStandardIndeterminate: true,
                isFormulaIndeterminate: true,
                isBlueprintIndeterminate: true,
                projectArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                taskArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                standardArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                formulaArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                blueprintArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                dataForm: {
                    dataSetCode: 'A0234',
                    dataSetDescribe: 'nothing',
                    dataSetOwner: 'Telliex',
                    dataSetProjectSelectAll: false,
                    dataSetTaskSelectAll: false,
                    dataSetStandardSelectAll: false,
                    dataSetFormulaSelectAll: false,
                    dataSetBlueprintSelectAll: false,
                    project: [1, 3, 5],
                    task: [1, 3, 5],
                    standard: [2, 5, 8],
                    formula: [4, 5, 6, 7],
                    bluePrint: [2, 9]
                },
                checkRules: {
                    dataSetDescribe: [
                        { required: true, message: '角色名称', trigger: 'blur' }
                    ],
                    dataSetOwner: [
                        { required: true, message: '角色编码', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            init(obj, title) {
                this.dialogTitle = title;
                // if (obj) {
                //     this.dialogTitle = obj.id;
                //     this.dataForm.roleID = obj.id;
                //     this.dataForm.roleName = obj.roleName;
                //     this.dataForm.roleCode = obj.roleCode;
                //     this.dataForm.roleDescribe = obj.remark;
                // } else {
                //     this.dialogTitle = '';
                //     this.dataForm = {};
                // }
                this.isDialogShow = true;
            },
            submitDataForm() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        if (this.dialogTitle) {
                            // 修改
                            COMMON_API.ROLE_UPDATE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                id: this.dataForm.roleID,
                                roleCode: this.dataForm.roleCode,
                                roleName: this.dataForm.roleName,
                                remark: this.dataForm.roleDescribe
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            }).catch(() => {
                                //
                            });
                        } else {
                            // 新增
                            COMMON_API.ROLE_INSERT_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                roleCode: this.dataForm.roleCode,
                                roleName: this.dataForm.roleName,
                                remark: this.dataForm.roleDescribe
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            }).catch(() => {
                                //
                            });
                        }
                    }
                });
            },
            // 重置
            closeDialog() {
                document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
                this.$refs.dataForm.resetFields();
                this.isDialogShow = false
            },
            handleCheckAllProjectChange(val) {
                console.log(val)
                this.dataForm.project = val ? this.projectArray : [];
                this.isProjectIndeterminate = false;
            },
            handleCheckedProjectChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetProjectSelectAll = checkedCount === this.projectArray.length;
                this.isProjectIndeterminate = checkedCount > 0 && checkedCount < this.projectArray.length;
            },
            handleCheckAllTaskChange(val) {
                console.log(val)
                this.dataForm.task = val ? this.taskArray : [];
                this.isTaskIndeterminate = false;
            },
            handleCheckedTaskChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetTaskSelectAll = checkedCount === this.taskArray.length;
                this.isTaskIndeterminate = checkedCount > 0 && checkedCount < this.taskArray.length;
            },
            handleCheckAllStandardChange(val) {
                console.log(val)
                this.dataForm.standard = val ? this.standardArray : [];
                this.isStandardIndeterminate = false;
            },
            handleCheckedStandardChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetStandardSelectAll = checkedCount === this.standardArray.length;
                this.isStandardIndeterminate = checkedCount > 0 && checkedCount < this.standardArray.length;
            },
            handleCheckAllFormulaChange(val) {
                console.log(val)
                this.dataForm.formula = val ? this.formulaArray : [];
                this.isFormulaIndeterminate = false;
            },
            handleCheckedFormulaChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetFormulaSelectAll = checkedCount === this.formulaArray.length;
                this.isFormulaIndeterminate = checkedCount > 0 && checkedCount < this.formulaArray.length;
            },
            handleCheckAllBlueprintChange(val) {
                console.log(val)
                this.dataForm.blueprint = val ? this.blueprintArray : [];
                this.isBlueprintIndeterminate = false;
            },
            handleCheckedBlueprintChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetBlueprintSelectAll = checkedCount === this.blueprintArray.length;
                this.isBlueprintIndeterminate = checkedCount > 0 && checkedCount < this.blueprintArray.length;
            }
        }
    };
</script>
<style lang="css" scoped>
.wrapper >>> .el-dialog {
    width: 70%;
}
</style>
<style lang="scss" scoped>
.form-item-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .el-form-item {
        margin-right: 10px;
    }
}
</style>
