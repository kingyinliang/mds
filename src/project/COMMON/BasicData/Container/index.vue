<template>
    <div class="header_main">
        <mds-card title="容器管理列表" :name="'raw'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <div>
                <el-form :inline="true" :model="controllableForm" size="small" label-width="70px" class="multi_row" @submit.native.prevent>
                    <el-form-item label="归属车间：">
                        <el-select v-model="controllableForm.deptID" placeholder="请选择" clearable style="width: 120px;">
                            <el-option v-for="(item, index) in workshopList" :key="index" :label="item.deptName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="容器类型：">
                        <el-select v-model="controllableForm.holderType" placeholder="请选择" clearable style="width: 120px;">
                            <el-option v-for="(item, index) in containerTypeList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="容器号：">
                        <el-input v-model="controllableForm.holderNo" placeholder="手动输入" clearable style="width: 120px;" />
                    </el-form-item>
                    <el-form-item label="容器量：">
                        <el-input v-model="controllableForm.holderVolume" placeholder="手动输入" clearable style="width: 120px;" />
                    </el-form-item>
                    <el-form-item class="floatr" style="height: 32px;">
                        <el-button
                            type="primary"
                            size="small"
                            @click="getItemsList(true)"
                        >
                            查询
                        </el-button>
                        <el-button type="primary" size="small" @click="addOrUpdateItem()">
                            新增
                        </el-button>
                        <el-button type="danger" size="small" :disabled="targetInfoList.length===0" @click="removeItems()">
                            批量删除
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table ref="targetInfoList" class="newTable" :height="mainClientHeight - 52 - 39 - 47" header-row-class-name="tableHead" :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column v-if="targetInfoList.length!==0" type="selection" width="50" fixed />
                <el-table-column type="index" :index="indexMethod" label="序号" width="55" fixed />
                <el-table-column label="容器类型" :show-overflow-tooltip="true" width="100">
                    <template slot-scope="scope">
                        {{ containerTypeObject[scope.row.holderType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="holderNo" label="容器号" :show-overflow-tooltip="true" width="80" />
                <el-table-column prop="holderName" :show-overflow-tooltip="true" label="容器描述" />
                <el-table-column prop="holderVolume" label="容器量" :show-overflow-tooltip="true" width="80" />
                <el-table-column prop="holderBatch" label="批数" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">
                        {{ holderStatusObject[scope.row.holderStatus] }}
                    </template>
                </el-table-column>
                <el-table-column prop="holderArea" label="物理区域" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="归属车间" :show-overflow-tooltip="true" width="92">
                    <template slot-scope="scope">
                        {{ workshopaObject[scope.row.deptId] }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" header-align="left" align="left" width="65">
                    <template slot-scope="scope">
                        <el-button style="padding: 0;" type="text" @click="addOrUpdateItem(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
        <contaniner-add-or-update v-if="isDialogShow" ref="addOrUpdateItem" :workshop-list="workshopList" :container-type-list="containerTypeList" @refreshDataList="getItemsList" />
    </div>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    import ContaninerAddOrUpdate from './ContaninerAddOrUpdate';
    export default {
        name: 'ContainerManage',
        components: {
            ContaninerAddOrUpdate
        },
        data() {
            return {
                isDialogShow: false,
                controllableForm: {
                    deptID: '',
                    holderType: '',
                    holderNo: '',
                    holderHold: ''

                },
                currPage: 1,
                pageSize: 10,
                totalCount: 0,
                workshopList: [],
                workshopaObject: {},
                multipleSelection: [],
                multipleSelectionTemp: [],
                containerTypeList: [],
                containerTypeObject: {},
                targetInfoList: [],
                holderStatusObject: { E: '空', R: '投料', F: '发酵', U: '领用', C: '清洗' }
            };
        },
        computed: {
            mainClientHeight() {
                return this.$store.state.common.mainClientHeight;
            }
        },
        mounted() {
            // 获取车间下拉列表
            this.getWorkshopList();
            // 获取容器状态
            this.getContainerTypeList();
            // 获取容器清单
            this.getItemsList();
        },
        methods: {
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 获取容器列表
            getItemsList(haveParas) {
                if (haveParas) {
                    this.currPage = 1;
                }
                COMMON_API.HOLDER_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    current: this.currPage,
                    deptId: this.controllableForm.deptID,
                    size: this.pageSize,
                    holderType: this.controllableForm.holderType,
                    holderNo: this.controllableForm.holderNo,
                    holderVolume: this.controllableForm.holderVolume
                }).then(({ data }) => {
                    if (haveParas && data.data.records.length === 0) {
                        this.$infoToast('暂无任何内容');
                    }
                    this.multipleSelection = [];
                    this.targetInfoList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                });
            },
            // #获取归属车间
            getWorkshopList() {
                COMMON_API.ORG_QUERY_WORKSHOP_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptType: ['WORK_SHOP']
                }).then(({ data }) => {
                    this.workshopList = data.data;
                    this.workshopList.forEach(item => {
                        this.workshopaObject[item.id] = item.deptName;
                    })
                });
            },
            // 容器类型下拉
            getContainerTypeList() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_HOLDER_TYPE'
                }).then(({ data }) => {
                    this.containerTypeList = data.data;
                    this.containerTypeList.forEach(item => {
                        this.containerTypeObject[item.dictCode] = item.dictValue;
                    })
                });
            },
            // 表格选中
            handleSelectionChange(val) {
                this.multipleSelectionTemp = val;
            },
            // 编辑
            addOrUpdateItem(id) {
                this.isDialogShow = true;
                this.$nextTick(() => {
                    this.$refs.addOrUpdateItem.init(id);
                });
            },
            // 删除
            removeItems() {
                this.multipleSelection = [];
                this.multipleSelectionTemp.forEach(item => {
                    this.multipleSelection.push(item.id);
                });
                if (this.multipleSelection.length === 0) {
                    this.$warningToast('请选择要删除的容器');
                } else {
                    this.$confirm('确认删除容器, 是否继续?', '删除容器', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            COMMON_API.HOLDER_REMOVE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                ids: this.multipleSelection
                            }).then(() => {
                                this.multipleSelection = [];
                                this.getItemsList();
                            });
                        })
                        .catch();
                }
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
            }
        }
    };
</script>

<style scoped></style>
<style lang="scss">
    .main {
        h3 {
            margin-bottom: 10px;
            font-weight: 600;
            font-size: 16px;
            line-height: 38px;
        }
    }
    .topforms1 {
        input {
            width: 140px !important;
        }
    }
</style>
