<template>
    <div class="header_main">
        <mds-card title="属性字典" :name="'dictionary'" :pack-up="false" style="margin-bottom: 0; background: #fff;" class="view-area">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-button v-if="false" type="primary" size="small" @click="exportData">
                        导出
                    </el-button>
                    <el-button type="primary" size="small" @click="addItem">
                        新增
                    </el-button>
                    <el-button type="primary" size="small" :disabled="!canSave" @click="saveDictionaryModify">
                        保存
                    </el-button>
                </div>
            </template>
            <el-table ref="targetInfoList" class="newTable" header-row-class-name="tableHead" :height="mainClientHeight - 62 - 47" :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center" fixed />
                <el-table-column prop="dictionaryCode" label="属性编码" :show-overflow-tooltip="true" min-width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.dictionaryCode" size="small" placeholder="请输入属性编码" :disabled="!scope.row.isRedact" @blur="checkInput(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="dictionaryOwner" label="属性归属人" width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.dictionaryOwner" placeholder="请选择" size="small" :disabled="!scope.row.isRedact" @change="checkSelected(scope.row)">
                            <el-option
                                v-for="item in ownerList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="propertyList" label="数据集描述" :show-overflow-tooltip="true" min-width="500">
                    <template slot-scope="scope">
                        <!-- <el-checkbox-group v-model="scope.row.propertyList" :disabled="!scope.row.isRedact"> -->
                        <el-checkbox v-model="scope.row.project" label="项目属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.task" label="任务属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.formula" label="配方属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.blueprint" label="图纸属性" :disabled="!scope.row.isRedact" />
                        <el-checkbox v-model="scope.row.standard" label="产品&标准" :disabled="!scope.row.isRedact" />
                        <!-- </el-checkbox-group> -->
                    </template>
                </el-table-column>
                <el-table-column prop="created" label="创建日期" :show-overflow-tooltip="true" width="160" />
                <el-table-column prop="changed" label="修改时间" width="160" />
                <el-table-column prop="changer" label="操作人" width="160" />
                <el-table-column label="操作" width="80" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" class="role__btn" :disabled="scope.row.isRedact" @click="editItem(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
    </div>
</template>

<script>
    import { COMMON_API, RDM_API } from 'common/api/api';
    // import { SYSTEMSETUP_API } from '@/api/api';
    import { dateFormat } from 'utils/utils';

    export default {
        name: 'DataSetManages',
        components: {
        },
        data() {
            return {
                factoryID: sessionStorage.getItem('factory').id, // 工厂名称
                controllableForm: {
                    owner: ''
                },
                ownerList: [],
                currPage: 1,
                pageSize: 10,
                totalCount: 1,
                targetInfoList: [],
                currentComponent: '',
                isEditDataSetItemShow: true,
                hasInputError: false,
                hasSelectError: false
            };
        },
        computed: {
            mainClientHeight() {
                return this.$store.state.common.mainClientHeight;
            },
            canSave() {
                return typeof this.targetInfoList.find(item => item.isRedact === true) !== 'undefined' && this.hasInputError === false && this.hasSelectError === false
            }
        },
        mounted() {
            this.getItemsList(true);
            // 呼叫拥有人清单
            COMMON_API.USER_ROLE_QUERY_API({
                factory: 'common',
                current: 1,
                size: 9999
            }).then(({ data }) => {
                this.ownerList = []
                data.data.records.forEach(item => {
                    this.ownerList.push({ value: item.realName + ' ' + item.workNum, label: item.realName + ' ' + item.workNum })
                })
            });
        },
        methods: {
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 获取角色列表
            getItemsList(haveParas) {
                if (haveParas) {
                    this.currPage = 1;
                }

                RDM_API.PERMISSION_QUERY_API({
                    current: this.currPage,
                    size: this.pageSize
                }).then(({ data }) => {
                    if (data.data.records.length === 0) {
                        this.$infoToast('暂无任何内容');
                    }
                    console.log('列表数据')
                    console.log(data)
                    // this.controllableForm.owner = '';
                    this.targetInfoList = []
                    data.data.records.forEach(item => {
                        this.targetInfoList.push(
                            {
                                id: item.id,
                                dictionaryCode: item.permissionCode,
                                dictionaryOwner: item.realName + ' ' + item.workNum,
                                propertyList: [],
                                created: item.createTime,
                                changed: item.modifiedTime,
                                changer: item.modifierName + ' ' + item.modifierId,
                                blueprint: item.blueprintPermission,
                                standard: item.productStandardPermission,
                                project: item.projectPermission,
                                formula: item.recipePermission,
                                task: item.taskPermission,
                                isRedact: false
                            }
                        )
                    })
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                });

            },
            checkInput(item) {
                if (this.targetInfoList.filter(element => element.dictionaryCode === item.dictionaryCode).length >= 2) {
                    this.$errorToast('编码重复');
                    this.hasInputError = true;
                } else {
                    this.hasInputError = false;
                }
            },
            checkSelected(item) {
                if (this.targetInfoList.filter(element => element.dictionaryOwner === item.dictionaryOwner).length >= 2) {
                    this.$errorToast('属性归属人重复');
                    this.hasSelectError = true;
                } else {
                    this.hasSelectError = false;
                }

            },

            // [BTN:新增] 新增数据集 item
            addItem() {
                this.targetInfoList.unshift({
                        id: '',
                        dictionaryCode: '',
                        dictionaryOwner: '',
                        propertyList: [],
                        created: dateFormat(new Date(), 'yyyy-MM-dd'),
                        changed: dateFormat(new Date(), 'yyyy-MM-dd'),
                        changer: sessionStorage.getItem('realName') + ' ' + sessionStorage.getItem('userName'),
                        blueprint: false,
                        standard: false,
                        project: false,
                        formula: false,
                        task: false,
                        isRedact: true
                    })
            },
            // [BTN:编辑] 编辑数据集 item
            editItem(obj) {
                console.log(obj)
                obj.isRedact = true
                obj.changed = dateFormat(new Date(), 'yyyy-MM-dd')
            },
            // [BTN:删除]:删除数据集 item
            // removeItems() {
            //     this.$confirm('确认删除该数据集, 是否继续?', '删除数据集', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     })
            //         .then(() => {
            //             // COMMON_API.ROLE_REMOVE_API({ id: id }).then(() => {
            //             //     this.getItemsList();
            //             // }).catch(() => {
            //             //     //
            //             // });
            //         })
            // },
            // 改变每页条数
            handleSizeChange(val) {
                if (this.canSave === false) {
                    this.pageSize = val;
                    this.getItemsList();
                } else {
                    this.$errorToast('请先保存');
                }

            },
            // 跳转页数
            handleCurrentChange(val) {
                if (this.canSave === false) {
                    this.currPage = val;
                    this.getItemsList();
                } else {
                    this.$errorToast('请先保存');
                }
            },
            saveDictionaryModify() {
                let hasEmpty = false
                this.targetInfoList.forEach(item => {
                    if (item.dictionaryCode === '' || item.dictionaryOwner === '') {
                        this.$errorToast('有漏填栏位');
                        hasEmpty = true
                    }
                })

                if (this.hasInputError === false && this.hasSelectError === false && hasEmpty === false) {
                    const temp = []

                    console.log('this.targetInfoList')
                    console.log(this.targetInfoList)
                    this.targetInfoList.forEach(item => {
                        const tempDictionaryOwner = item.dictionaryOwner.split(' ')
                        const tempChanger = item.changer.split(' ')
                        temp.push({
                            id: item.id,
                            permissionCode: item.dictionaryCode,
                            realName: tempDictionaryOwner[0],
                            workNum: tempDictionaryOwner[1],
                            projectPermission: item.project,
                            taskPermission: item.task,
                            recipePermission: item.formula,
                            blueprintPermission: item.blueprint,
                            productStandardPermission: item.standard,
                            createTime: item.created,
                            modifiedTime: item.changed,
                            modifierId: tempChanger[1] === 'null' ? null : tempChanger[1],
                            modifierName: tempChanger[0] === 'null' ? null : tempChanger[0]
                        })
                        item.isRedact = false
                    })

                    console.log('temp')
                    console.log(temp)
                    RDM_API.PERMISSION_SAVE_API(temp).then(({ data }) => {
                        this.$successToast('保存成功');
                        console.log('data')
                        console.log(data)
                    })
                }
            },
            // 导出
            exportData() {
                // export to do
            }
        }
    };
</script>


<style lang="scss" scoped>
.dictionaryBox .el-checkbox {
    margin-right: 10px;
}

.view-area {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .newTable {
        flex-grow: 1;
    }
}
</style>
