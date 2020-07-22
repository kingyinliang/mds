<template>
    <div class="wrapper">
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
            <el-form ref="dataForm" :model="dataForm" label-width="100px" :rules="checkRules" style="max-height: 400px; overflow-y: auto;">
                <div class="form-item-group">
                    <el-form-item v-if="dialogTitle === '编辑数据集'" label="数据集编码：" prop="dataSetCode" style="margin-right: 30px;">
                        {{ dataForm.dataSetCode }}
                    </el-form-item>
                    <el-form-item label="数据集描述：" prop="dataSetDescribe">
                        <el-input v-model="dataForm.dataSetDescribe" placeholder="手动输入" clearable />
                    </el-form-item>
                    <el-form-item label="拥有人：" prop="dataSetOwner">
                        <el-select v-model="dataForm.dataSetOwner" placeholder="请选择">
                            <el-option
                                v-for="item in ownerList"
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
                        <el-checkbox v-for="item in permissionItemList.projectArray" :key="'projectArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="任务属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetTaskSelectAll" :indeterminate="isTaskIndeterminate" @change="handleCheckAllTaskChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.task" @change="handleCheckedTaskChange">
                        <el-checkbox v-for="item in permissionItemList.taskArray" :key="'taskArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="标准属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetStandardSelectAll" :indeterminate="isStandardIndeterminate" @change="handleCheckAllStandardChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.standard" @change="handleCheckedStandardChange">
                        <el-checkbox v-for="item in permissionItemList.standardArray" :key="'standardArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="配方属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetFormulaSelectAll" :indeterminate="isFormulaIndeterminate" @change="handleCheckAllFormulaChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.formula" @change="handleCheckedFormulaChange">
                        <el-checkbox v-for="item in permissionItemList.formulaArray" :key="'formulaArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="图纸属性：" prop="roleCode" style="border: 1px solid rgba(232, 232, 232, 1); border-radius: 4px;">
                    <el-checkbox v-model="dataForm.dataSetBlueprintSelectAll" :indeterminate="isBlueprintIndeterminate" @change="handleCheckAllBlueprintChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="dataForm.bluePrint" @change="handleCheckedBlueprintChange">
                        <el-checkbox v-for="item in permissionItemList.blueprintArray" :key="'blueprintArray'+item" :label="item">
                            {{ item }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="j_closeBtn" @click="closeDialog">
                    取消
                </el-button>
                <el-button type="primary" :disabled="dataForm.dataSetDescribe===''||dataForm.dataSetOwner===''" @click="submitDataForm">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { RDM_API } from 'common/api/api';
    // import { dateFormat, getUserNameNumber } from 'utils/utils';
    export default {
        name: 'RoleaddAndUpdate',
        props: {
            ownerList: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            permissionItemList: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        data() {
            return {
                dialogTitle: '',
                isDialogShow: false,
                isProjectIndeterminate: false,
                isTaskIndeterminate: false,
                isStandardIndeterminate: false,
                isFormulaIndeterminate: false,
                isBlueprintIndeterminate: false,
                // projectArray: this.permissionItemList.projectArray,
                // taskArray: this.permissionItemList.taskArray,
                // standardArray: this.permissionItemList.standardArray,
                // formulaArray: this.permissionItemList.formulaArray,
                // blueprintArray: this.permissionItemList.blueprintArray,
                dataForm: {
                    dataSetCode: '',
                    dataSetDescribe: '',
                    dataSetOwner: '',
                    dataSetProjectSelectAll: false,
                    dataSetTaskSelectAll: false,
                    dataSetStandardSelectAll: false,
                    dataSetFormulaSelectAll: false,
                    dataSetBlueprintSelectAll: false,
                    project: [],
                    task: [],
                    standard: [],
                    formula: [],
                    bluePrint: []
                },
                checkRules: {
                    dataSetDescribe: [
                        { required: true, message: '数据集描述', trigger: 'blur' }
                    ],
                    dataSetOwner: [
                        { required: true, message: '请选择拥有人', trigger: 'select' }
                    ]
                }
            };
        },
        methods: {
            init(obj, title) {
                console.log('this.permissionItemList')
                console.log(this.permissionItemList)
                console.log('obj')
                console.log(obj)
                if (title === '复制数据集') {
                    this.dialogTitle = title + '(' + obj.groupCode + ')';
                } else {
                    this.dialogTitle = title;
                }

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

                if (title === '新增数据集') {
                     // add
                this.isProjectIndeterminate = false
                this.isTaskIndeterminate = false
                this.isStandardIndeterminate = false
                this.isFormulaIndeterminate = false
                this.isBlueprintIndeterminate = false

                this.dataForm = {
                    dataSetCode: '',
                    dataSetDescribe: '',
                    dataSetOwner: '',
                    dataSetProjectSelectAll: false,
                    dataSetTaskSelectAll: false,
                    dataSetStandardSelectAll: false,
                    dataSetFormulaSelectAll: false,
                    dataSetBlueprintSelectAll: false,
                    project: [],
                    task: [],
                    standard: [],
                    formula: [],
                    bluePrint: []
                }

                } else {
                    //edit
                    RDM_API.PERMISSION_QUERY_ITEMLIST_API({
                        groupCode: obj.groupCode
                    }).then(({ data }) => {


                        if (title === '编辑数据集') {
                            this.dataForm.dataSetCode = obj.groupCode
                            this.dataForm.dataSetDescribe = obj.remark
                            this.dataForm.dataSetOwner = obj.realName + ' ' + obj.workNum
                        } else { // 复制
                            this.dataForm.dataSetCode = ''
                            this.dataForm.dataSetDescribe = obj.remark
                            this.dataForm.dataSetOwner = ''
                        }

                        this.dataForm.project = []
                        this.dataForm.task = []
                        this.dataForm.standard = []
                        this.dataForm.formula = []
                        this.dataForm.bluePrint = []
                        data.data.forEach(item => {
                            if (item.bizType === 'task') {
                                this.dataForm.task.push(item.permissionCode)
                            } else if (item.bizType === 'recipe') {
                                this.dataForm.formula.push(item.permissionCode)
                            } else if (item.bizType === 'project') {
                                this.dataForm.project.push(item.permissionCode)
                            } else if (item.bizType === 'productsAndStrands') {
                                this.dataForm.standard.push(item.permissionCode)
                            } else if (item.bizType === 'blueprint') {
                                this.dataForm.bluePrint.push(item.permissionCode)
                            }
                        })

                        if (this.dataForm.project.length === this.permissionItemList.projectArray.length) {
                            this.dataForm.dataSetProjectSelectAll = true
                        } else {
                            this.dataForm.dataSetProjectSelectAll = false
                        }
                        if (this.dataForm.task.length === this.permissionItemList.taskArray.length) {
                            this.dataForm.dataSetTaskSelectAll = true
                        } else {
                            this.dataForm.dataSetTaskSelectAll = false
                        }
                        if (this.dataForm.standard.length === this.permissionItemList.standardArray.length) {
                            this.dataForm.dataSetStandardSelectAll = true
                        } else {
                            this.dataForm.dataSetStandardSelectAll = false
                        }
                        if (this.dataForm.formula.length === this.permissionItemList.formulaArray.length) {
                            this.dataForm.dataSetFormulaSelectAll = true
                        } else {
                            this.dataForm.dataSetFormulaSelectAll = false
                        }
                        if (this.dataForm.bluePrint.length === this.permissionItemList.blueprintArray.length) {
                            this.dataForm.dataSetBlueprintSelectAll = true
                        } else {
                            this.dataForm.dataSetBlueprintSelectAll = false
                        }
                    })

                }

                // // 呼叫属性选项
                // RDM_API.PERMISSION_LIST_PERMISSIONCODE_API({
                // }).then(({ data }) => {
                //     console.log('333333')
                //     console.log(data)
                //     this.projectArray = data.data.project
                //     this.taskArray = data.data.task
                //     this.standardArray = data.data.productsAndStrands
                //     this.formulaArray = data.data.recipe
                //     this.blueprintArray = data.data.blueprint
                // })


            },
            submitDataForm() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        if (this.dialogTitle === '新增数据集') {
                            console.log('提交新增')
                            const tempOwner = this.dataForm.dataSetOwner.split(' ')

                            // 新增
                            RDM_API.PERMISSION_SAVE_API({
                                permissionItemList: {
                                    project: this.dataForm.project,
                                    task: this.dataForm.task,
                                    productsAndStrands: this.dataForm.standard,
                                    recipe: this.dataForm.formula,
                                    blueprint: this.dataForm.bluePrint
                                },
                                remark: this.dataForm.dataSetDescribe,
                                realName: tempOwner[0],
                                workNum: tempOwner[1]
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            }).catch(() => {
                                //
                            });
                        } else if (this.dialogTitle === '编辑数据集') {
                            console.log('提交修改')
                            // 修改
                            RDM_API.ROLE_INSERT_API({
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
                        } else {
                            console.log('提交复制')
                            const tempOwner = this.dataForm.dataSetOwner.split(' ')
                            // 复制
                            RDM_API.PERMISSION_SAVE_API({
                                permissionItemList: {
                                    project: this.dataForm.project,
                                    task: this.dataForm.task,
                                    productsAndStrands: this.dataForm.standard,
                                    recipe: this.dataForm.formula,
                                    blueprint: this.dataForm.bluePrint
                                },
                                remark: this.dataForm.dataSetDescribe,
                                realName: tempOwner[0],
                                workNum: tempOwner[1]
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
                this.dataForm.project = val ? this.permissionItemList.projectArray : [];
                this.isProjectIndeterminate = false;
            },
            handleCheckedProjectChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetProjectSelectAll = checkedCount === this.permissionItemList.projectArray.length;
                this.isProjectIndeterminate = checkedCount > 0 && checkedCount < this.permissionItemList.projectArray.length;
            },
            handleCheckAllTaskChange(val) {
                console.log(val)
                this.dataForm.task = val ? this.permissionItemList.taskArray : [];
                this.isTaskIndeterminate = false;
            },
            handleCheckedTaskChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetTaskSelectAll = checkedCount === this.permissionItemList.taskArray.length;
                this.isTaskIndeterminate = checkedCount > 0 && checkedCount < this.permissionItemList.taskArray.length;
            },
            handleCheckAllStandardChange(val) {
                console.log(val)
                this.dataForm.standard = val ? this.permissionItemList.standardArray : [];
                this.isStandardIndeterminate = false;
            },
            handleCheckedStandardChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetStandardSelectAll = checkedCount === this.permissionItemList.standardArray.length;
                this.isStandardIndeterminate = checkedCount > 0 && checkedCount < this.permissionItemList.standardArray.length;
            },
            handleCheckAllFormulaChange(val) {
                console.log(val)
                this.dataForm.formula = val ? this.permissionItemList.formulaArray : [];
                this.isFormulaIndeterminate = false;
            },
            handleCheckedFormulaChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetFormulaSelectAll = checkedCount === this.permissionItemList.formulaArray.length;
                this.isFormulaIndeterminate = checkedCount > 0 && checkedCount < this.permissionItemList.formulaArray.length;
            },
            handleCheckAllBlueprintChange(val) {
                console.log(val)
                this.dataForm.blueprint = val ? this.permissionItemList.blueprintArray : [];
                this.isBlueprintIndeterminate = false;
            },
            handleCheckedBlueprintChange(value) {
                const checkedCount = value.length;
                this.dataForm.dataSetBlueprintSelectAll = checkedCount === this.permissionItemList.blueprintArray.length;
                this.isBlueprintIndeterminate = checkedCount > 0 && checkedCount < this.permissionItemList.blueprintArray.length;
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
