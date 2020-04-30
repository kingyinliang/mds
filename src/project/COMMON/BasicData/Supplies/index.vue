<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="clearfix">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="controllableForm" size="small" label-width="68px" class="topforms2" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="controllableForm.param" placeholder="物料/物料类型" suffix-icon="el-icon-search" clearable @clear="getItemsList" @blur="controllableForm.param===''?getItemsList():false" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" :disabled="controllableForm.param.trim()===''" @click="getItemsList(true)">
                                    查询
                                </el-button>
                                <el-button type="primary" size="small" @click="syncData">
                                    同步
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-row>
                    <el-table ref="targetInfoList" header-row-class-name="tableHead" :data="targetInfoList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column :show-overflow-tooltip="true" label="物料">
                            <template slot-scope="scope">
                                <el-button style="padding: 0;" type="text" @click="showDetail(scope.row.id)">
                                    {{ scope.row.materialCode }} {{ scope.row.materialName }}
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column :show-overflow-tooltip="true" label="工厂" width="180" prop="factoryName" /> -->
                        <el-table-column :show-overflow-tooltip="true" label="物料类型" width="180">
                            <template slot-scope="scope">
                                {{ scope.row.materialTypeCode }}
                                {{ scope.row.materialTypeName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="basicUnit" label="基本单位" :show-overflow-tooltip="true" width="79" />
                        <el-table-column prop="productUnit" label="生产单位" :show-overflow-tooltip="true" width="79" />
                        <el-table-column prop="syncDate" label="同步日期" width="100" />
                    </el-table>
                </el-row>
                <el-row v-if="targetInfoList.length!==0">
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <supplies-detail v-if="isDialogShow" ref="suppliesDetail" />
    </el-col>
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
    computed: {},
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
                if (data.code === 200) {
                    console.log('data')
                    console.log(data)
                    this.targetInfoList = data.data.records;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                    this.currPage = data.data.current;
                } else {
                    this.$errorTost(data.msg);
                }
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
            // this.loading = Loading.service({
            //     lock: true,
            //     spinner: 'loadingGif',
            //     text: '加载中……',
            //     background: 'rgba(255, 255, 255, 0.7)'
            // });
            COMMON_API.METERIAL_SYNC_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.$successToast(data.msg);
                    this.getItemsList()

                } else {
                    // this.loading.close();
                    this.$errorToast(data.msg);
                }
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
