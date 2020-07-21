<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-07-21 13:57:11
 * @LastEditors: Telliex
 * @LastEditTime: 2020-07-21 16:30:09
-->

<template>
    <div class="header_main">
        <mds-card title="数据集" :name="'dataSet'" :pack-up="false" style="margin-bottom: 0; background: #fff;" class="view-area">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="controllableForm.owner" placeholder="所有人" size="small" clearable style="width: 180px; margin-right: 16px;" @clear="getItemsList" />
                    <el-button type="primary" size="small" :disabled="controllableForm.owner.trim()===''" @click="getItemsList">
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
                <el-table-column prop="dataSetCode" label="数据集编码" :show-overflow-tooltip="true" min-width="200" />
                <el-table-column prop="dataSetDescrible" label="数据集描述" :show-overflow-tooltip="true" min-width="180" />
                <el-table-column prop="dataSetOwner" label="拥有人" width="160" />
                <el-table-column prop="created" label="创建日期" :show-overflow-tooltip="true" width="160" />
                <el-table-column prop="changed" label="修改时间" width="160" />
                <el-table-column prop="changer" label="操作人" width="160" />
                <el-table-column label="操作" width="140" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" class="role__btn" @click="editItem(scope.row)">
                            编辑
                        </el-button>
                        |
                        <el-button type="text" class="role__btn" @click="duplicationItem(scope.row.id)">
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
        <edit-data-set-item v-if="isEditDataSetItemShow" ref="editDataSetItem" />
    </div>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
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
                targetInfoList: [
                    {
                        dataSetCode: 'A1234',
                        dataSetDescrible: 'teacher',
                        dataSetOwner: '邱建又(18060163)',
                        created: '2020-01-01 18:30',
                        changed: '2020-05-01 18:30',
                        changer: '邱建又(18060163)'
                    }
                ],
                currentComponent: '',
                isEditDataSetItemShow: true
            };
        },
        computed: {
            mainClientHeight() {
                return this.$store.state.common.mainClientHeight;
            }
        },

        /**
         * @description: 简单说明
         * @param1: 参数名 {参数类型} 描述信息
         * @param2: 参数名 {参数类型} 描述信息
         * @param3: 参数名 {参数类型} 描述信息
         * @return: {返回类型} 描述信息
         * @example: 示例代码
         */
        mounted() {
            this.getItemsList();
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
                COMMON_API.PERMISSION_GROUP_QUERY_API({
                }).then(({ data }) => {
                    console.log('1111111')
                    console.log(data)
                    // if (haveParas && data.data.records.length === 0) {
                    //     this.$infoToast('暂无任何内容');
                    // }
                    // // this.controllableForm.owner = '';
                    // this.targetInfoList = data.data.records;
                    // this.currPage = data.data.current;
                    // this.pageSize = data.data.size;
                    // this.totalCount = data.data.total;
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
                    this.$refs.editDataSetItem.init(obj, '新增数据集(复制 A1111)');
                });
            },
            // [BTN:删除]:删除数据集 item
            removeItems() {
                this.$confirm('确认删除该数据集, 是否继续?', '删除数据集', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        // COMMON_API.ROLE_REMOVE_API({ id: id }).then(() => {
                        //     this.getItemsList();
                        // }).catch(() => {
                        //     //
                        // });
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
