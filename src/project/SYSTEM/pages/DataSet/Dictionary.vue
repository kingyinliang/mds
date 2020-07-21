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
                        <el-input v-model="scope.row.dictionaryCode" size="small" placeholder="输入属性编码" :disabled="!scope.row.isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="dictionaryOwner" label="属性归属人" width="160">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.dictionaryOwner" placeholder="请选择" size="small" :disabled="!scope.row.isRedact">
                            <el-option
                                v-for="item in 10"
                                :key="item.dictCode"
                                :label="item.dictValue"
                                :value="item.dictCode"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="dictionaryDescrible" label="数据集描述" :show-overflow-tooltip="true" min-width="500">
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="scope.row.propertyList" :disabled="!scope.row.isRedact">
                            <el-checkbox label="项目属性" />
                            <el-checkbox label="任务属性" />
                            <el-checkbox label="配方属性" />
                            <el-checkbox label="图纸属性" />
                            <el-checkbox label="产品&标准" />
                        </el-checkbox-group>
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
    // import { COMMON_API } from 'common/api/api';
    // import { SYSTEMSETUP_API } from '@/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

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
                currPage: 1,
                pageSize: 10,
                totalCount: 1,
                targetInfoList: [
                    {
                        dictionaryCode: 'A1234',
                        dictionaryDescrible: 'teacher',
                        dictionaryOwner: '邱建又(18060163)',
                        propertyList: [],
                        created: '2020-01-01 18:30',
                        changed: '2020-05-01 18:30',
                        changer: '邱建又(18060163)',
                        isRedact: false
                    }
                ],
                currentComponent: '',
                isEditDataSetItemShow: true
            };
        },
        computed: {
            mainClientHeight() {
                return this.$store.state.common.mainClientHeight;
            },
            canSave() {
                return typeof this.targetInfoList.find(item => item.isRedact === true) !== 'undefined'
            }
        },
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

                // COMMON_API.ROLE_QUERY_API({
                //     factory: this.factoryID,
                //     current: JSON.stringify(this.currPage),
                //     size: JSON.stringify(this.pageSize),
                //     roleName: searchWord.trim()
                // }).then(({ data }) => {
                //     if (haveParas && data.data.records.length === 0) {
                //         this.$infoToast('暂无任何内容');
                //     }
                //     // this.controllableForm.owner = '';
                //     this.targetInfoList = data.data.records;
                //     this.currPage = data.data.current;
                //     this.pageSize = data.data.size;
                //     this.totalCount = data.data.total;
                // });

                // 加入 isRedact 參數
            },

            // [BTN:新增] 新增数据集 item
            addItem() {
                this.targetInfoList.unshift({
                        dictionaryCode: '',
                        dictionaryDescrible: '',
                        dictionaryOwner: '',
                        propertyList: [],
                        created: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                        changed: '',
                        changer: getUserNameNumber(),
                        isRedact: true
                    })
            },
            // [BTN:编辑] 编辑数据集 item
            editItem(obj) {
                console.log(obj)
                obj.isRedact = true
                obj.changed = dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
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
            saveDictionaryModify() {
                this.targetInfoList.forEach(item => { item.isRedact = false })
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
