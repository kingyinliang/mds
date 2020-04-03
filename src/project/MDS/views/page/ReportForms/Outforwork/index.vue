<template>
    <el-row>
        <div class="header_main">
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col>
                        <linkage :plantList="plantList" />
                    </el-col>
                    <el-col style="width: 200px; margin-top: 42px; text-align: right;">
                        <el-button v-if="isAuth('report:form:listShopAttM')" type="primary" size="small" @click="GetList(true)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('report:form:exportShopAttM')" type="primary" size="small" @click="ExportExcel(true)">
                            导出
                        </el-button>
                    </el-col>
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
                    <el-table-column prop="factoryName" label="工厂" :showOverflowTooltip="true" width="90" />
                    <el-table-column prop="workShopName" label="车间" :showOverflowTooltip="true" width="95" />
                    <el-table-column prop="productLineName" label="产线" :showOverflowTooltip="true" width="70" />
                    <el-table-column prop="teamName" label="班组" :showOverflowTooltip="true" width="120" />
                    <el-table-column prop="userId" label="人员" :showOverflowTooltip="true" width="80" />
                    <template v-if="dataList.length > 0">
                        <el-table-column v-for="(item, index) in dataList[0].listMonth.length" :key="item" :label="month + '月' + (index + 1).toString() + '日'">
                            <el-table-column label="白班时数" :showOverflowTooltip="true" width="80">
                                <template slot-scope="scope">
                                    {{ scope.row.listMonth[index].dayTime }}
                                </template>
                            </el-table-column>
                            <el-table-column label="夜班时数" :showOverflowTooltip="true" width="80">
                                <template slot-scope="scope">
                                    {{ scope.row.listMonth[index].nightTime }}
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </template>
                    <el-table-column label="统计">
                        <el-table-column prop="dayAllDay" label="白班天数" :showOverflowTooltip="true" width="80" />
                        <el-table-column prop="nightAllDay" label="夜班天数" :showOverflowTooltip="true" width="80" />
                        <el-table-column prop="allTime" label="总计出勤数（H）" :showOverflowTooltip="true" width="80" />
                        <el-table-column prop="workAllDay" label="上班天数" :showOverflowTooltip="true" width="80" />
                        <el-table-column prop="offDutyAllDay" label="休班天数" :showOverflowTooltip="true" width="80" />
                    </el-table-column>
                </el-table>
                <el-row>
                    <el-pagination :currentPage="plantList.currPage" :pageSizes="[10, 20, 50]" :pageSize="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
    </el-row>
</template>

<script>
import { REP_API } from '@/api/api';
import { getNewDate, headanimation } from '@/net/validate';
export default {
    name: 'Index',
    components: {
        Linkage: resolve => {
            require(['@/views/page/ReportForms/common/Linkage'], resolve);
        }
    },
    data() {
        return {
            ExportTime: {},
            month: '',
            lodingS: false,
            Team: [],
            dataList: [],
            plantList: {
                deptId: '',
                productDate: '',
                factory: '',
                workshop: '',
                productline: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            }
        };
    },
    computed: {},
    mounted() {
        headanimation(this.$);
    },
    methods: {
        GetList(st) {
            if (!this.plantList.productDate) {
                this.$notify.error({ title: '错误', message: '请选择月份' });
                return false;
            }
            this.lodingS = true;
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${REP_API.REPATTM_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                    this.month =
                        this.plantList.productDate.substring(this.plantList.productDate.indexOf('-') + 1).split('')[0] === '0'
                            ? this.plantList.productDate.substring(this.plantList.productDate.indexOf('-') + 1).slice(1)
                            : this.plantList.productDate.substring(this.plantList.productDate.indexOf('-') + 1);
                } else {
                    this.$error_SHINHO(data.msg);
                }
                this.lodingS = false;
            });
        },
        ExportExcel() {
            if (!this.plantList.productDate) {
                this.$notify.error({ title: '错误', message: '请选择月份' });
                return false;
            }
            this.lodingS = true;
            this.$http(`${REP_API.REPOUTFORWORKOUTPUT_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.ExportTime = setInterval(() => {
                        this.GetExportExcel();
                    }, 4000);
                } else {
                    this.lodingS = false;
                    this.$error_SHINHO(data.msg);
                }
            });
            // let that = this
            // exportFile(`${REP_API.REPOUTFORWORKOUTPUT_API}`, '车间出勤汇总报表', that)
        },
        GetExportExcel() {
            this.$http(`${REP_API.GETREPOUTFORWORKOUTPUT_API}`, 'GET', {
                asyncType: 'ASYNC_TYPE_EXPORT_SHOP_ATTM'
            })
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.asyncRecord) {
                            if (data.asyncRecord.asyncStatus === '0') {
                                this.lodingS = false;
                                clearInterval(this.ExportTime);
                                this.$notify.error({
                                    title: '错误',
                                    message: '导出失败'
                                });
                            } else if (data.asyncRecord.asyncStatus === '1') {
                                this.lodingS = false;
                                clearInterval(this.ExportTime);
                                this.$notify({
                                    title: '成功',
                                    message: '导出成功',
                                    type: 'success'
                                });
                                const elink = document.createElement('a');
                                elink.download = `车间出勤汇总报表${getNewDate()}.xlsx`;
                                elink.style.display = 'none';
                                elink.href = data.asyncRecord.fileUrl;
                                document.body.appendChild(elink);
                                elink.click();
                                document.body.removeChild(elink);
                            }
                        }
                    } else {
                        this.lodingS = false;
                        clearInterval(this.ExportTime);
                        this.$error_SHINHO(data.msg);
                    }
                })
                .catch(() => {
                    this.lodingS = false;
                    clearInterval(this.ExportTime);
                });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.plantList.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.plantList.currPage = val;
            this.GetList();
        }
    }
};
</script>

<style scoped></style>
