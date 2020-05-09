<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="clearfix">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="controllableForm" size="small" label-width="68px" class="topforms2" @keyup.enter.native="GetLocationList(true,'normal')" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="controllableForm.batch" placeholder="批次" suffix-icon="el-icon-search" clearable @clear="getItemsList" @blur="controllableForm.batch===''?getItemsList():false" />
                            </el-form-item>
                            <el-form-item>
                                <el-button :disabled="controllableForm.batch.trim()===''" type="primary" size="small" @click="getItemsList(true,'normal')">
                                    查询
                                </el-button>
                                <el-button type="primary" size="small" @click="isAdvanceSearchDailogShow = true">
                                    高级查询
                                </el-button>
                                <el-button type="primary" size="small" @click="syncData()">
                                    同步
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-row>
                    <el-table ref="table1" header-row-class-name="tableHead" :data="targetInfoList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column label="物料" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode }}
                                {{ scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="物料类型" :show-overflow-tooltip="true" width="130px">
                            <template slot-scope="scope">
                                {{ scope.row.materialTypeCode }}
                                {{ scope.row.materialTypeName }}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="工厂" :show-overflow-tooltip="true" prop="factoryName" /> -->
                        <el-table-column label="过账日期" :show-overflow-tooltip="true" prop="postingDate" width="100px" />
                        <el-table-column label="批次" :show-overflow-tooltip="true" prop="batch" width="120px" />
                        <el-table-column label="数量" :show-overflow-tooltip="true" prop="quantity" width="100px" />
                        <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit" width="60px" />
                        <el-table-column label="移动类型" :show-overflow-tooltip="true" prop="moveType" width="90px" />
                        <el-table-column label="库存" :show-overflow-tooltip="true" prop="quantity" width="80px" />
                        <el-table-column label="罐号" :show-overflow-tooltip="true" prop="holderName" width="60px" />
                        <el-table-column label="同步日期" :show-overflow-tooltip="true" prop="syncDate" width="100px" />
                    </el-table>
                </el-row>
                <el-row v-if="targetInfoList.length!==0">
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="isAdvanceSearchDailogShow" width="510px" custom-class="dialog__class" @close="closeDialog">
            <div slot="title">
                高级查询
            </div>
            <el-form :model="controllableForm" size="small" label-width="130px" class="locationdialog">
                <el-form-item label="批次：">
                    <el-input v-model="controllableForm.batch" style="width: 283px;" />
                </el-form-item>
                <el-form-item label="物料：">
                    <el-input v-model="controllableForm.materialCode" style="width: 283px;" />
                </el-form-item>
                <el-form-item label="罐号：">
                    <el-select v-model="controllableForm.holderNo" placeholder="请选择" filterable style="width: 283px;">
                        <el-option v-for="(sole, index) in guanList" :key="index" :value="sole.holderNo" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="过账日期：">
                    <el-date-picker v-model="controllableForm.commitDateOne" type="date" placeholder="选择日期" style="width: 135px;" />
                    -
                    <el-date-picker v-model="controllableForm.commitDateTwo" type="date" placeholder="选择日期" style="width: 135px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="getItemsList(true, 'advance')">确定</el-button>
            </span>
        </el-dialog>
    </el-col>
</template>

<script>
import { COMMON_API } from 'common/api/api';
// import { Loading } from 'element-ui';
export default {
    name: 'RawMaterial',
    components: {},
    data() {
        return {
            // loading: {},
            isAdvanceSearchDailogShow: false,
            controllableForm: {
                batch: '',
                materialCode: '',
                commitDateOne: '',
                commitDateTwo: '',
                holderNo: ''
            },
            targetInfoList: [],
            currPage: 1,
            pageSize: 10,
            totalCount: 0,
            guanList: []
        };
    },
    computed: {},
    mounted() {
        this.getItemsList();
        this.getHolderList();
    },
    methods: {
        closeDialog() {
            this.isAdvanceSearchDailogShow = false;
            this.controllableForm.materialCode = '';
            this.controllableForm.holderNo = '';
            this.controllableForm.commitDateOne = '';
            this.controllableForm.commitDateTwo = '';
        },
        // 获取库位列表
        getItemsList(haveParas, type = 'normal') {
            if (haveParas) {
                this.currPage = 1;
            }
            if (type === 'normal') {
                this.controllableForm.materialCode = '';
                this.controllableForm.commitDateOne = '';
                this.controllableForm.commitDateTwo = '';
            }
            COMMON_API.ROWMETERIAL_QUERY_API({
                batch: this.controllableForm.batch.trim(),
                materialCode: this.controllableForm.materialCode.trim(),
                commitDateOne: this.controllableForm.commitDateOne.trim(),
                commitDateTwo: this.controllableForm.commitDateTwo.trim(),
                current: this.currPage,
                size: this.pageSize,
                holderNo: this.controllableForm.holderNo
            }).then(({ data }) => {
                this.isAdvanceSearchDailogShow = false;
                this.targetInfoList = data.data.records;
                this.currPage = data.data.current;
                this.pageSize = data.data.size;
                this.totalCount = data.data.total;
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
        },
        // 数据同步
        syncData() {
            COMMON_API.ROWMETERIAL_SYNC_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            })
                .then(() => {
                    this.getItemsList()
                })
                .catch(() => {
                    //
                });
        },
        // 罐号
        getHolderList() {
            COMMON_API.HOLDER_DROPDOWN_API({
                factoryID: sessionStorage.getItem('factory').id, // 工厂名称
                size: 10
            }).then(({ data }) => {
                this.guanList = data.data;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.dialog__class {
    border-radius: 6px !important;
    .el-dialog__header {
        height: 59px;
        color: #fff;
        font-size: 20px;
        background: rgba(24, 144, 255, 1);
        border-radius: 6px 6px 0 0;
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
}
</style>
