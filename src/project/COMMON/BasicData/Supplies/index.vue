<template>
    <div class="header_main">
        <mds-card title="物料列表" :name="'sup'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <template slot="titleBtn">
                <el-row style="float: right;">
                    <el-form :inline="true" :model="controllableForm" size="small" label-width="68px" class="topforms2" @submit.native.prevent>
                        <el-form-item>
                            <el-input v-model="controllableForm.param" placeholder="物料" suffix-icon="el-icon-search" clearable @clear="getItemsList" @blur="controllableForm.param===''?getItemsList():false" />
                        </el-form-item>
                        <el-form-item style="height: 32px;">
                            <el-button v-if="isAuth('materialQuery')" type="primary" size="small" :disabled="controllableForm.param.trim()===''" @click="getItemsList(true)">
                                查询
                            </el-button>
                            <el-button v-if="isAuth('materialSync')" type="primary" size="small" @click="syncData">
                                同步
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </template>
            <el-table ref="targetInfoList" class="newTable" header-row-class-name="tableHead" :height="mainClientHeight - 70 - 47" :data="targetInfoList" border tooltip-effect="dark" style="width: 100%;" size="small">
                <el-table-column :show-overflow-tooltip="true" label="物料" min-width="200">
                    <template slot-scope="scope">
                        <el-button style="padding: 0;" type="text" @click="showDetail(scope.row.id)">
                            {{ scope.row.materialCode }} {{ scope.row.materialName }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="物料类型" min-width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialTypeCode }}
                        {{ scope.row.materialTypeName }}
                    </template>
                </el-table-column>
                <el-table-column prop="basicUnit" label="基本单位" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="productUnit" label="生产单位" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="syncDate" label="同步日期" min-width="100" />
            </el-table>
            <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
        <supplies-detail v-if="isDialogShow" ref="suppliesDetail" />
    </div>
</template>

<script>
import { COMMON_API } from 'common/api/api';
import SuppliesDetail from './SuppliesDetail';
// import { Loading } from 'element-ui';
export default {
    name: 'SuppliesManage',
    components: {
        SuppliesDetail
    },
    data() {
        return {
            // loading: {},
            isDialogShow: false,
            sapTime: {},
            controllableForm: {
                param: ''
            },
            currPage: 1,
            pageSize: 10,
            totalCount: 0,
            targetInfoList: []
        };
    },
    computed: {
        mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }
    },
    mounted() {
        this.getItemsList();
    },
    methods: {
        // 物料列表
        getItemsList(haveParas) {
            if (haveParas) {
                this.currPage = 1;
            }
            COMMON_API.METERIAL_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                // materialCodeList: [],
                materialNameOrCode: this.controllableForm.param,
                current: this.currPage,
                size: this.pageSize
            }).then(({ data }) => {
                if (haveParas && data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
                this.targetInfoList = data.data.records;
                this.pageSize = data.data.size;
                this.totalCount = data.data.total;
                this.currPage = data.data.current;
            });
        },
        // 详情弹窗
        showDetail(id) {
            this.isDialogShow = true;
            this.$nextTick(() => {
                this.$refs.suppliesDetail.init(id);
            });
        },
        syncData() {
            COMMON_API.METERIAL_SYNC_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(() => {
                    this.getItemsList()
            });
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

<style lang="scss" scoped></style>
<style lang="scss">
.topforms2 {
    input {
        width: 210px !important;
    }
}
</style>
