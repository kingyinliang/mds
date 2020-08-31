<template>
    <el-row>
        <div class="header_main">
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col>
                        <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                            <el-form-item label="生产工厂：">
                                <el-select v-model="plantList.factory" placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产车间：">
                                <el-select v-model="plantList.workshop" placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="考勤类型：">
                                <el-select v-model="plantList.kqlx" placeholder="请选择" size="small">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(iteam, index) in ARtype" :key="index" :label="iteam.value" :value="iteam.code" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产日期：">
                                <el-date-picker v-model="plantList.productDate" type="month" placeholder="选择月份" value-format="yyyy-MM" style="width: 199px;" />
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('report:form:listAttM')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('report:form:exportAttM')" type="primary" size="small" @click="ExportExcel(true)">
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
                    <el-table-column prop="factoryName" label="工厂" :show-overflow-tooltip="true" width="90" />
                    <el-table-column prop="workShopName" label="车间" :show-overflow-tooltip="true" width="95" />
                    <el-table-column prop="deptIdName" label="班组" :show-overflow-tooltip="true" width="70" />
                    <el-table-column prop="kqdlName" label="考勤大类" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="kqlxName" label="考勤类型" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="userId" label="人员" :show-overflow-tooltip="true" />
                    <div v-if="dataList.length > 0">
                        <el-table-column v-for="(item, index) in dataList[0].listMonth.length" :key="item" :label="month + '月' + (index + 1).toString() + '日'">
                            <el-table-column prop="pieceTime" label="计时时数" :show-overflow-tooltip="true" width="80">
                                <template slot-scope="scope">
                                    {{ scope.row.listMonth[index].timedTime }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="timedTime" label="计件时数" :show-overflow-tooltip="true" width="80">
                                <template slot-scope="scope">
                                    {{ scope.row.listMonth[index].pieceTime }}
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </div>
                    <el-table-column label="统计">
                        <el-table-column prop="allTime" label="出勤总时数" :show-overflow-tooltip="true" width="95" />
                        <el-table-column prop="allDay" label="出勤总天数" :show-overflow-tooltip="true" width="95" />
                    </el-table-column>
                </el-table>
                <el-row>
                    <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
    </el-row>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API, REP_API } from '@/api/api';
import { exportFile, headanimation } from '@/net/validate';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            month: '',
            lodingS: false,
            ARtype: [],
            factory: [],
            workshop: [],
            dataList: [],
            plantList: {
                kqlx: '',
                productDate: '',
                factory: '',
                workshop: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            }
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n) {
            this.Getdeptbyid(n);
            this.GetARtype(n);
        }
    },
    mounted() {
        this.GetARtype();
        this.Getdeptcode();
        headanimation(this.$);
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.plantList.factory && data.typeList.length > 0) {
                        this.plantList.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workshop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workshop && data.typeList.length > 0) {
                            this.plantList.workshop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        /* eslint-disable no-shadow */
        // 获取考勤类型
        GetARtype() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'other_time'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.ARtype = data.dicList;
                    this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                        type: 'normal_time'
                    }).then(({ data }) => {
                        if (data.code === 0) {
                            this.ARtype = this.ARtype.concat(data.dicList);
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        /* eslint-enable no-shadow */
        GetList(st) {
            if (!this.plantList.productDate) {
                this.$notify.error({ title: '错误', message: '请选择月份' });
                return false;
            }
            this.lodingS = true;
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${REP_API.REPATTMLIST_API}`, 'POST', this.plantList).then(({ data }) => {
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
                    this.$errorToast(data.msg);
                }
                this.lodingS = false;
            });
        },
        ExportExcel() {
            exportFile(`${REP_API.REPATTMOUTPUT_API}`, '计时考勤报表', this);
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
