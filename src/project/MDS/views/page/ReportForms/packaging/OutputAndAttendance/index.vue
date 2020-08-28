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
                                <el-input v-model="plantList.orderNo" style="width: 200px;" placeholder="请输入" />
                            </el-form-item>
                            <el-form-item label="品项：">
                                <el-select v-model="plantList.material" filterable placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="item in serchSapList" :key="item.sapCode + '-' + item.itemId" :label="item.sapCode + ' ' + item.itemName" :value="item.sapCode + ' ' + item.itemName" />
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
                                <el-button v-if="isAuth('report:formh:dayCheckOnWorkList')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('report:formh:exportCheckOnWorkCollect')" type="primary" size="small" @click="ExportExcel(true)">
                                    导出
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <div class="toggleSearchBottom">
                    <em class="el-icon-caret-top" />
                </div>
            </el-card>
        </div>
        <div class="main">
            <el-card class="tableCard">
                <div class="toggleSearchTop">
                    <em class="el-icon-caret-bottom" />
                </div>
                <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="100" />
                    <el-table-column prop="factoryName" label="工厂" :show-overflow-tooltip="true" width="90" />
                    <el-table-column prop="workShopName" label="车间" :show-overflow-tooltip="true" width="95" />
                    <el-table-column prop="productLineName" label="产线" :show-overflow-tooltip="true" width="70" />
                    <el-table-column prop="orderNo" label="生产订单" :show-overflow-tooltip="true" width="120" />
                    <el-table-column label="生产物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="boxSpec" label="箱规格" :show-overflow-tooltip="true" width="65" />
                    <el-table-column prop="allPack" label="包材库" :show-overflow-tooltip="true" width="65" />
                    <el-table-column prop="packUnit" label="单位" :show-overflow-tooltip="true" width="50" />
                    <el-table-column prop="allltk" label="立体库" :show-overflow-tooltip="true" width="65" />
                    <el-table-column prop="ltkUnit" label="单位" :show-overflow-tooltip="true" width="50" />
                    <el-table-column prop="team" label="生产班组" :show-overflow-tooltip="true" width="78" />
                    <el-table-column prop="userType" label="人员属性" :show-overflow-tooltip="true" width="78" />
                    <el-table-column prop="userId" label="人员" :show-overflow-tooltip="true" width="120" />
                    <el-table-column prop="workTime" label="出勤时数（H）" :show-overflow-tooltip="true" width="120" />
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
            serchSapList: [],
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
        this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', { params: '' }, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                this.serchSapList = data.list;
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
            this.$http(`${REP_API.REPOUTPUTANDATTMLIST_API}`, 'POST', this.plantList).then(({ data }) => {
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
            exportFile(`${REP_API.REPOUTPUTANDATTMOUTPUT_API}`, '产量考勤报表导出', this);
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
