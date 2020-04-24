<template>
    <el-row>
        <div class="header_main">
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col>
                        <linkage :plant-list="plantList" :lablewidth="true" :is-packaging="true" />
                        <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                            <el-form-item label="班组：">
                                <el-select v-model="plantList.teamId" filterable placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(iteam, index) in Team" :key="index" :label="iteam.deptName" :value="iteam.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="订单号：">
                                <el-input v-model="plantList.orderNo" style="width: 200px;" />
                            </el-form-item>
                            <el-form-item label="品项：">
                                <el-select v-model="plantList.material" filterable placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="item in SerchSapList" :key="item.sapCode + '-' + item.itemName" :label="item.sapCode + ' ' + item.itemName" :value="item.sapCode + ' ' + item.itemName" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产日期：" class="dateinput">
                                <el-row>
                                    <el-col :span="12">
                                        <el-date-picker v-model="plantList.commitDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px;" />
                                        <span>-</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-date-picker v-model="plantList.commitDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 135px;" />
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('report:formh:totalHoursList')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('report:formh:exportTotalHours')" type="primary" size="small" @click="ExportExcel(true)">
                                    导出
                                </el-button>
                            </el-form-item>
                        </el-form>
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
                <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead">
                    <el-table-column prop="productDate" label="生产日期" width="100" />
                    <el-table-column prop="factoryName" label="工厂" width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="workShopName" label="车间" width="110" />
                    <el-table-column prop="productLineName" label="产线" width="120" />
                    <el-table-column prop="orderNo" label="生产订单号" width="140" />
                    <el-table-column prop="materialName" label="生产品项" width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="batch" label="生产批次" width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="className" label="班次" width="50" />
                    <el-table-column prop="team" label="班组" width="80" />
                    <el-table-column prop="realOutPut" label="产量" width="80" />
                    <el-table-column prop="realOutPutUnit" label="单位" width="50" />
                    <el-table-column prop="allSample" label="样品" width="50" />
                    <el-table-column prop="sampleUnit" label="单位" width="50" />
                    <el-table-column prop="workTime" label="人工工时（H）" width="80" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
            Team: [],
            dataList: [],
            plantList: {
                teamId: '',
                material: '',
                commitDateOne: '',
                commitDateTwo: '',
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
    watch: {
        'plantList.factory'(n) {
            this.GetTeam(n);
        }
    },
    mounted() {
        this.$http(`${BASICDATA_API.FINDSAP_TWO_API}`, 'POST', {}, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                this.SerchSapList = data.list;
            } else {
                this.$errorToast(data.msg);
            }
        });

        headanimation(this.$);
    },
    methods: {
        // 获取班组
        GetTeam() {
            this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                factory: this.plantList.factory
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Team = data.teamList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        GetList(st) {
            this.lodingS = true;
            if (st) {
                this.plantList.currPage = 1;
            }
            if (this.plantList.material !== '') {
                this.plantList.materialCode = this.plantList.material.substring(0, this.plantList.material.indexOf(' '));
                this.plantList.materialName = this.plantList.material.substring(this.plantList.material.indexOf(' ') + 1);
            } else {
                this.plantList.materialCode = '';
                this.plantList.materialName = '';
            }
            this.$http(`${REP_API.REPOUTPUTMANHOUR_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.lodingS = false;
            });
        },
        ExportExcel() {
            exportFile(`${REP_API.REPOUTPUTMANHOUREXPORT_API}`, '产量总工时报表数据导出', this);
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
