<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-07-21 13:57:11
 * @LastEditors: Telliex
 * @LastEditTime: 2020-07-23 14:31:01
-->

<template>
    <div class="header_main">
        <mds-card title="数据集" :name="'dataSet'" :pack-up="false" style="margin-bottom: 0; background: #fff;" class="view-area">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="controllableForm.owner" placeholder="所有人" size="small" clearable style="width: 180px; margin-right: 16px;" @clear="getItemsList" />
                    <el-button type="primary" size="small" :disabled="controllableForm.owner.trim()===''" @click="getItemsList(true,controllableForm.owner)">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" @click="addItem">
                        新增
                    </el-button>
                    <el-button v-if="false" type="primary" size="small" @click="exportData">
                        导出
                    </el-button>
                </div>
            </template>
            <el-table ref="targetInfoList" class="newTable" header-row-class-name="tableHead" :height="mainClientHeight - 62 - 47" :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center" fixed />
                <el-table-column prop="groupCode" label="数据集编码" :show-overflow-tooltip="true" min-width="200" />
                <el-table-column prop="remark" label="数据集描述" :show-overflow-tooltip="true" min-width="180" />
                <el-table-column prop="realName" label="拥有人" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.realName }} {{ scope.row.workNum }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建日期" :show-overflow-tooltip="true" width="160" />
                <el-table-column prop="modifiedTime" label="修改时间" width="160" />
                <el-table-column prop="changer" label="修改人" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.modifierName }} {{ scope.row.modifierId }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" class="role__btn" @click="editItem(scope.row)">
                            编辑
                        </el-button>
                        |
                        <el-button type="text" class="role__btn" @click="duplicationItem(scope.row)">
                            复制
                        </el-button>
                        |
                        <el-button type="text" class="role__btn" @click="removeItems(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <edit-data-set-item v-if="isEditDataSetItemShow" ref="editDataSetItem" :owner-list="ownerList" :permission-item-list="{projectArray:projectArray,taskArray:taskArray,standardArray:standardArray,formulaArray:formulaArray,blueprintArray:blueprintArray}" @refreshDataList="getItemsList(true)" />
    </div>
</template>

<script>
    import { COMMON_API, RDM_API } from 'common/api/api';
    // import { SYSTEMSETUP_API } from '@/api/api';
    import EditDataSetItem from './AddAndUpdateDataSetItem'

    export default {
        name: 'DataSetManages',
        components: {
            EditDataSetItem
        },
        data() {
            return {
                factoryID: sessionStorage.getItem('factory').id, // 工厂名称
                controllableForm: {
                    owner: ''
                },
                currPage: 1,
                pageSize: 10,
                totalCount: 1,
                targetInfoList: [],
                currentComponent: '',
                isEditDataSetItemShow: true,
                ownerList: [], // 拥有人清单
                searchString: '',
                projectArray: [],
                taskArray: [],
                standardArray: [],
                formulaArray: [],
                blueprintArray: []
            };
        },
        computed: {
            mainClientHeight() {
                return this.$store.state.common.mainClientHeight;
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

            // 呼叫属性选项
            RDM_API.PERMISSION_LIST_PERMISSIONCODE_API({
            }).then(({ data }) => {
                this.projectArray = data.data.project
                this.taskArray = data.data.task
                this.standardArray = data.data.productsAndStrands
                this.formulaArray = data.data.recipe
                this.blueprintArray = data.data.blueprint
            })


        },
        methods: {
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 获取数据集列表
            getItemsList(haveParas, who = '') {
                if (haveParas) {
                    this.currPage = 1;
                }
                RDM_API.PERMISSION_GROUP_QUERY_API({
                    current: this.currPage,
                    size: this.pageSize,
                    owner: who
                }).then(({ data }) => {
                    if (haveParas && data.data.records.length === 0) {
                        this.$infoToast('暂无任何内容');
                    }
                    this.targetInfoList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                });
            },

            // [BTN:新增] 新增数据集 item
            addItem(obj) {
                this.$nextTick(() => {
                    this.$refs.editDataSetItem.init(obj, '新增数据集');
                });
            },
            // [BTN:编辑] 编辑数据集 item
            editItem(obj) {
                console.log(obj)
                this.$nextTick(() => {
                    this.$refs.editDataSetItem.init(obj, '编辑数据集');
                });
            },
            // [BTN:复制]:复制数据集 item
            duplicationItem(obj) {
                this.$nextTick(() => {
                    this.$refs.editDataSetItem.init(obj, '复制数据集');
                });
            },
            // [BTN:删除]:删除数据集 item
            removeItems(item) {
                this.$confirm('确认删除该数据集, 是否继续?', '删除数据集', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        console.log(item)
                        RDM_API.PERMISSION_REMOVE_API({ groupId: item.id }).then(() => {
                            this.$successToast('删除成功');
                            this.getItemsList();
                        }).catch(() => {
                            //
                        });
                    })
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getItemsList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.currPage = val;
                this.getItemsList();
            },
            // 导出
            exportData() {
                // export to do
            }
        }
    };
</script>


<style lang="scss" scoped>
.dataSetBox .el-button + .el-button {
    margin-left: 0;
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
