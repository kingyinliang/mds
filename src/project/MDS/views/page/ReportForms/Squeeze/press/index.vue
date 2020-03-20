<template>
    <el-row>
        <div class="header_main">
            <el-card class="searchCard" elementLoadingText="加载中">
                <el-row>
                    <el-col>
                        <el-form :model="plantList" :inline="true" size="small" labelWidth="70px" class="multi_row">
                            <el-form-item label="生产工厂：">
                                <el-select v-model="plantList.factory" placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产车间：">
                                <el-select v-model="plantList.workShop" placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="布浆线：">
                                <el-select v-model="plantList.productLine" placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产日期：">
                                <el-date-picker v-model="plantList.startTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" valueFormat="yyyy-MM-dd" style="width: 199px;" />
                                -
                                <el-date-picker v-model="plantList.endTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" valueFormat="yyyy-MM-dd" style="width: 199px;" />
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('report:formPress:pressList')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('report:formPress:exportPress')" type="primary" size="small" @click="ExportExcel(true)">
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
                <el-table border :data="pressList" headerRowClassName="tableHead">
                    <el-table-column label="工厂" prop="factoryName" :showOverflowTooltip="true" />
                    <el-table-column label="车间" prop="workShop" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="生产日期" prop="created" :showOverflowTooltip="true" width="180" />
                    <el-table-column label="布浆线" prop="pulpName" :showOverflowTooltip="true" width="80" />
                    <el-table-column label="气垫车号" prop="hovercraftName" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="布号" prop="clothNo" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="自重自淋时间" prop="selfDrenchTime" :showOverflowTooltip="true" width="110" />
                    <el-table-column label="布浆量(方)" prop="pulpAmount" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="压榨一东碎布数" prop="destoryNumEast" :showOverflowTooltip="true" width="130" />
                    <el-table-column label="压榨一西碎布数" prop="destoryNumWest" :showOverflowTooltip="true" width="130" />
                    <el-table-column label="压榨二碎布数" prop="destoryNum" :showOverflowTooltip="true" width="110" />
                    <el-table-column label="发酵罐1" prop="potOne" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="发酵罐2" prop="potTwo" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="布浆张数" prop="pulpNum" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="布浆开始时间" prop="pulpStartDate" :showOverflowTooltip="true" width="180" />
                    <el-table-column label="布浆结束时间" prop="pulpEndDate" :showOverflowTooltip="true" width="180" />
                    <el-table-column label="布浆时间" prop="pulpTime" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="自淋时间" prop="drenchTime" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="预压机号" prop="deviceName" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="预压开始时间" prop="prePressStart" :showOverflowTooltip="true" width="180" />
                    <el-table-column label="预压结束时间" prop="prePressEnd" :showOverflowTooltip="true" width="180" />
                    <el-table-column label="预压时间" prop="prePressTime" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="终压机号" prop="endDeviceName" :showOverflowTooltip="true" width="100" />
                    <el-table-column label="终压开始时间" prop="pressStart" :showOverflowTooltip="true" width="180" />
                    <el-table-column label="终压结束时间" prop="pressEnd" :showOverflowTooltip="true" width="190" />
                    <el-table-column label="酱醪品质" prop="sauceClass" :showOverflowTooltip="true" width="100" />
                </el-table>
                <el-pagination :currentPage="plantList.currPage" :pageSizes="[10, 20, 50]" :pageSize="100" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-card>
        </div>
    </el-row>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
import { headanimation, dateFormat, exportFile } from '@/net/validate';
export default {
    name: 'Press',
    data() {
        return {
            lodingS: false,
            factory: [],
            workshop: [],
            productline: [],
            plantList: {
                factory: '',
                workShop: '',
                productLine: '',
                startTime: dateFormat(new Date(), 'yyyy-MM-dd'),
                endTime: dateFormat(new Date(), 'yyyy-MM-dd'),
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            pressList: []
        };
    },
    watch: {
        'plantList.factory'(n) {
            this.Getdeptbyid(n);
        },
        'plantList.workShop'(n) {
            this.GetParentline(n);
        }
    },
    mounted() {
        headanimation(this.$);
        this.Getdeptcode();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.plantList.factory && data.typeList.length > 0) {
                        this.plantList.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workShop = '';
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id,
                    deptName: '压榨'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workShop && data.typeList.length > 0) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 获取产线
        GetParentline(id) {
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', {
                    parentId: id,
                    deptType: 'proLine'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            } else {
                this.productline = [];
            }
        },
        GetList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${REP_API.SQUEEZEPRESSLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.pressList = data.page.list;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        handleSizeChange(val) {
            this.plantList.pageSize = val;
            this.GetList();
        },
        handleCurrentChange(val) {
            this.plantList.currPage = val;
            this.GetList();
        },
        ExportExcel() {
            exportFile(`${REP_API.REPSQUEEZEPRESS_API}`, '压榨报表数据导出', this);
        }
    }
};
</script>

<style scoped></style>
