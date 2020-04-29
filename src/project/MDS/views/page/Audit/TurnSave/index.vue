<template>
    <div class="header_main">
        <el-card class="searchCard  newCard" style="margin-bottom: 5px;">
            <el-form :inline="true" size="small" :model="formHeader" label-width="70px" class="topform multi_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="容器类型：" label-width="70px">
                    <el-select v-model="formHeader.holderTypes" multiple filterable placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option label="发酵罐" value="001" />
                        <el-option label="原汁罐" value="013" />
                        <el-option label="JBS罐" value="016" />
                    </el-select>
                </el-form-item>
                <el-form-item label="容器号：" label-width="70px">
                    <el-select v-model="formHeader.holderNo" filterable placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in potList" :key="index" :label="item.HOLDER_NAME" :value="item.HOLDER_NO" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产物料：" label-width="70px">
                    <el-select v-model="formHeader.materialCode" filterable placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.MATERIAL_NAME" :value="item.MATERIAL_CODE" />
                    </el-select>
                </el-form-item>
                <div class="floatr">
                    <el-button v-if="isAuth('juice:pot:juiceExamine')" type="primary" size="small" @click="getDataList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('juice:pot:juiceExamineExport')" type="primary" size="small" @click="exportExcel(true)">
                        导出
                    </el-button>
                </div>
            </el-form>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">转储</span>
                <el-table
                    ref="table1"
                    header-row-class-name="tableHead"
                    :data="DataList.slice((formHeader.currPage - 1) * formHeader.pageSize, formHeader.currPage * formHeader.pageSize)"
                    border
                    tooltip-effect="dark"
                    style="width: 100%; margin-bottom: 20px;"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" :selectable="checkboxT" width="50" />
                    <el-table-column prop="holderName" label="领用罐号" width="100" :show-overflow-tooltip="true" />
                    <el-table-column
                        prop="verifyMan"
                        label="物料"
                        width="150"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope" width="120">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="receiveType" label="类别" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="receiveBatch" label="批次" width="150" :show-overflow-tooltip="true" />
                    <el-table-column prop="receiveAmount" label="领用量" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="unit" label="单位" width="50" :show-overflow-tooltip="true" />
                    <el-table-column prop="inHolderType" label="打入罐类别" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="inHolderName" label="打入罐号" width="100" :show-overflow-tooltip="true" />
                    <el-table-column
                        prop="verifyMan"
                        label="物料"
                        width="150"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope" width="120">
                            {{ scope.row.inMaterialCode + ' ' + scope.row.inMaterialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="inType" label="打入类别" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="inBatch" label="打入批次" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="creator" label="操作人" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="created" label="操作时间" width="100" :show-overflow-tooltip="true" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="formHeader.currPage" :page-sizes="[10, 20, 50]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">返工</span>
                <el-table
                    ref="table1"
                    header-row-class-name="tableHead"
                    :data="DataList.slice((formHeader.currPage - 1) * formHeader.pageSize, formHeader.currPage * formHeader.pageSize)"
                    border
                    tooltip-effect="dark"
                    style="width: 100%; margin-bottom: 20px;"
                    @selection-change="handleSelectionChange1"
                >
                    <el-table-column type="selection" :selectable="checkboxT" width="50" />
                    <el-table-column prop="moveType" label="移动类型" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="holderName" label="领用罐号" width="100" :show-overflow-tooltip="true" />
                    <el-table-column
                        prop="verifyMan"
                        label="物料"
                        width="150"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope" width="120">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类别" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="batch" label="批次" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="amount" label="领用量" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="unit" label="单位" width="50" :show-overflow-tooltip="true" />
                    <el-table-column prop="inHolderType" label="打入罐类别" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="inHolderName" label="打入罐号" width="100" :show-overflow-tooltip="true" />
                    <el-table-column
                        prop="verifyMan"
                        label="物料"
                        width="150"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="scope" width="120">
                            {{ scope.row.inMaterialCode + ' ' + scope.row.inMaterialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="操作人" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="created" label="操作时间" width="100" :show-overflow-tooltip="true" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="formHeader.currPage" :page-sizes="[10, 20, 50]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getFactory, getWorkshop, exportFile } from '@/net/validate';
import { AUDIT_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            activeName: '1',
            formHeader: {
                factory: '',
                workShop: '',
                holderType: '',
                holderTypes: [],
                holderNo: '',
                materialCode: '',
                orderNo: '',
                listType: 'dump',
                currPage: 1,
                pageSize: 10,
                totalCount: 1
            },
            factory: [],
            workshop: [],
            potList: [],
            materialList: [],
            multipleSelection: [],
            multipleSelection1: [],
            DataList: []
        };
    },
    computed: {},
    watch: {
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            getWorkshop(this, n, '原汁');
        },
        'formHeader.holderTypes'(n) {
            this.getPostLost(n);
        },
        activeName() {
            this.getDataList(true);
        }
    },
    mounted() {
        getFactory(this);
        this.getPostLost();
    },
    methods: {
        getPostLost(paras = []) {
            let obj = {};
            if (paras.length) {
                obj = {
                    holderType: paras
                };
            }
            this.$http(`${AUDIT_API.JUICT_POT_LIST}`, 'POST', obj, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.potList = data.materialPotList.pot;
                    this.materialList = data.materialPotList.material;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        getDataList(st) {
            if (st) {
                this.formHeader.currPage = 1;
            }
            if (this.activeName === '1') {
                this.formHeader.listType = 'dump';
            } else if (this.activeName === '2') {
                this.formHeader.listType = 'add';
            }
            if (this.formHeader.holderTypes.length === 0) {
                this.formHeader.holderType = '';
            } else {
                this.formHeader.holderType = this.formHeader.holderTypes;
            }
            this.$http(`${AUDIT_API.AUDIT_TURNSAVE_LIST}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.multipleSelection = [];
                    this.multipleSelection1 = [];
                    this.DataList = data.juiceExamine;
                    this.formHeader.totalCount = data.juiceExamine.length;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 没使用到的 function 需确认
        // TurnSave() {
        //     if (this.multipleSelection1.length > 0) {
        //         this.$warningToast('返工内容无法转储，请点击返工！');
        //     }
        // },
        // Rework() {
        //     if (this.multipleSelection.length > 0) {
        //         this.$warningToast('转储内容无法返工，请点击转储！');
        //     }
        // },
        exportExcel() {
            if (this.formHeader.holderTypes.length === 0) {
                this.formHeader.holderType = '';
            } else {
                this.formHeader.holderType = this.formHeader.holderTypes;
            }
            if (this.activeName === '1') {
                this.formHeader.listType = 'dump';
            } else if (this.activeName === '2') {
                this.formHeader.listType = 'add';
            }
            if (this.formHeader.listType === 'add') {
                exportFile(`${AUDIT_API.AUDIT_DUMP_EXPORT}`, '原汁生管转储审核导出', this);
            } else {
                exportFile(`${AUDIT_API.AUDIT_ADD_EXPORT}`, '原汁生管添加审核导出', this);
            }
        },
        // 审核通过禁用
        checkboxT(row) {
            if ((row.status === 'checked' && row.interfaceReturnStatus === '1') || row.status === 'noPass') {
                return 0;
            }
                return 1;

        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        // 表格选中
        handleSelectionChange1(val) {
            this.multipleSelection1 = [];
            val.forEach((item) => {
                this.multipleSelection1.push(item);
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.multipleSelection = [];
            this.multipleSelection1 = [];
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.multipleSelection = [];
            this.multipleSelection1 = [];
        }
    }
};
</script>

<style scoped></style>
