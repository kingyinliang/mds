<template>
    <el-row>
        <div class="header_main">
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col>
                        <linkage :plantList="plantList" :lablewidth="true" :isPackaging="true" />
                    </el-col>
                </el-row>
                <el-row>
                    <el-form :model="plantList" size="small" :inline="true" labelPosition="right" labelWidth="70px" class="multi_row">
                        <el-form-item label="订单号：">
                            <el-input v-model="plantList.orderNo" style="width: 200px;" placeholder="请输入" />
                        </el-form-item>
                        <el-form-item label="品项：">
                            <el-select v-model="plantList.material" filterable placeholder="请选择">
                                <el-option label="请选择" value="" />
                                <el-option v-for="item in SerchSapList" :key="item.sapCode + ' ' + item.itemName" :label="item.sapCode + ' ' + item.itemName" :value="item.sapCode + ' ' + item.itemName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：" style="width: 400px;" class="dateinput">
                            <el-row>
                                <el-col :span="12">
                                    <el-date-picker v-model="plantList.commitDateOne" placeholder="选择日期" valueFormat="yyyy-MM-dd" style="width: 135px;" />
                                    <span>-</span>
                                </el-col>
                                <el-col :span="12">
                                    <el-date-picker v-model="plantList.commitDateTwo" placeholder="选择日期" valueFormat="yyyy-MM-dd" style="width: 135px;" />
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('report:formh:collectList')" type="primary" size="small" @click="GetList(true)">
                                查询
                            </el-button>
                            <el-button v-if="isAuth('report:formh:exportCollect')" type="primary" size="small" @click="ExportExcel(true)">
                                导出
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <div class="toggleSearchBottom">
                    <i class="el-icon-caret-top" />
                </div>
            </el-card>
        </div>
        <div class="main">
            <el-card class="tableCard">
                <div class="toggleSearchTop">
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-table :data="dataList" border tooltipEffect="dark" headerRowClassName="tableHead" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column prop="productDate" label="生产日期" :showOverflowTooltip="true" width="100" />
                    <el-table-column prop="factoryName" label="工厂" :showOverflowTooltip="true" width="90" />
                    <el-table-column prop="workShopName" label="车间" :showOverflowTooltip="true" width="95" />
                    <el-table-column prop="productLineName" label="产线" :showOverflowTooltip="true" width="70" />
                    <el-table-column prop="orderNo" label="生产订单号" :showOverflowTooltip="true" width="120" />
                    <el-table-column prop="orderNo" label="品项" :showOverflowTooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="planOutput" label="计划产量" :showOverflowTooltip="true" width="80" />
                    <el-table-column prop="outPutUnit" label="单位" :showOverflowTooltip="true" width="40" />
                    <el-table-column prop="realOutPut" label="实际产量" :showOverflowTooltip="true" width="80" />
                    <el-table-column prop="realOutPutUnit" label="单位" :showOverflowTooltip="true" width="40" />
                    <el-table-column prop="allBad" label="不良品数" :showOverflowTooltip="true" width="80" />
                    <el-table-column prop="badUnit" label="单位" :showOverflowTooltip="true" width="40" />
                    <el-table-column prop="allSample" label="样品" :showOverflowTooltip="true" width="60" />
                    <el-table-column prop="sampleUnit" label="单位" :showOverflowTooltip="true" width="40" />
                    <el-table-column prop="allNum" label="实际作业人数" :showOverflowTooltip="true" width="70" />
                    <el-table-column prop="allTime" label="实际投入时间" :showOverflowTooltip="true" width="70" />
                    <el-table-column prop="shift" label="交接班" :showOverflowTooltip="true" width="60" />
                    <el-table-column prop="meeting" label="班前会" :showOverflowTooltip="true" width="60" />
                    <el-table-column prop="prepared" label="生产前的准备" :showOverflowTooltip="true" width="70" />
                    <el-table-column prop="dinnerTime" label="用餐时间" :showOverflowTooltip="true" width="60" />
                    <el-table-column prop="clear" label="生产后清理时间" :showOverflowTooltip="true" width="78" />
                    <el-table-column prop="changeTime" label="切换时间" :showOverflowTooltip="true" width="60" />
                </el-table>
                <el-row>
                    <el-pagination :currentPage="plantList.currPage" :pageSizes="[10, 20, 50]" :pageSize="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
    </el-row>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
import { exportFile, headanimation } from '@/net/validate';
export default {
    name: 'Index',
    components: {
        Linkage: resolve => {
            require(['@/views/page/ReportForms/common/Linkage'], resolve);
        }
    },
    data() {
        return {
            lodingS: false,
            SerchSapList: [],
            dataList: [],
            plantList: {
                orderNo: '',
                commitDateOne: '',
                commitDateTwo: '',
                material: '',
                productDate: '',
                factory: '',
                workshop: '',
                productline: '',
                currPage: '1',
                pageSize: '10',
                totalCount: 0
            }
        };
    },
    computed: {},
    mounted() {
        this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', { params: '' }, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                this.SerchSapList = data.list;
            } else {
                this.$error_SHINHO(data.msg);
            }
        });
        headanimation(this.$);
    },
    methods: {
        GetList(st) {
            this.lodingS = true;
            if (st) {
                this.plantList.currPage = '1';
            }
            if (this.plantList.material !== '') {
                this.plantList.materialCode = this.plantList.material.substring(0, this.plantList.material.indexOf(' '));
                this.plantList.materialName = this.plantList.material.substring(this.plantList.material.indexOf(' ') + 1);
            } else {
                this.plantList.materialCode = '';
                this.plantList.materialName = '';
            }
            this.$http(`${REP_API.REPOUTPUTLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.page.list;
                    this.plantList.currPage = JSON.stringify(data.page.currPage);
                    this.plantList.pageSize = JSON.stringify(data.page.pageSize);
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$error_SHINHO(data.msg);
                }
                this.lodingS = false;
            });
        },
        ExportExcel() {
            const that = this;
            exportFile(`${REP_API.REPYIELDOUTPUT_API}`, '产量汇总报表', that);
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.plantList.pageSize = JSON.stringify(val);
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.plantList.currPage = JSON.stringify(val);
            this.GetList();
        }
    }
};
</script>

<style scoped></style>
