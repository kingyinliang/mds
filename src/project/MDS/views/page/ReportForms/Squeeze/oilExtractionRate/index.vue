<template>
    <el-row>
        <div class="header_main">
            <el-card class="searchCard" element-loading-text="加载中">
                <el-row>
                    <el-col>
                        <el-form :model="plantList" :inline="true" size="small" label-width="70px" class="multi_row">
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
                            <el-form-item label="发酵罐：">
                                <el-select v-model="plantList.childPotNo" filterable placeholder="请选择">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产日期：">
                                <el-date-picker v-model="plantList.startTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 199px;" />
                                -
                                <el-date-picker v-model="plantList.endTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 199px;" />
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('report:formPress:oilYieldList')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('report:formPress:exportoilYield')" type="primary" size="small" @click="ExportExcel(true)">
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
                <el-table border :data="pressList" header-row-class-name="tableHead">
                    <el-table-column label="工厂" prop="factoryName" :show-overflow-tooltip="true" width="230" />
                    <el-table-column label="车间" prop="workShop" :show-overflow-tooltip="true" />
                    <el-table-column label="生产日期" prop="productDate" :show-overflow-tooltip="true" />
                    <el-table-column label="出品率" prop="yield" :show-overflow-tooltip="true" />
                    <el-table-column label="发酵罐" prop="holderName" :show-overflow-tooltip="true" />
                    <el-table-column label="领用酱醪量" prop="childUsedAmount" :show-overflow-tooltip="true" />
                    <el-table-column label="原汁产量" prop="inPotAmount" :show-overflow-tooltip="true" />
                </el-table>
                <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
            potList: [],
            plantList: {
                factory: '',
                workShop: '',
                childPotNo: '',
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
            this.GetPot(n);
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
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workShop = '';
            this.plantList.childPotNo = '';
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
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 获取罐
        GetPot(id) {
            this.plantList.childPotNo = '';
            this.$http(`${BASICDATA_API.CONTAINER_LIST_API}`, 'POST', {
                factory: this.plantList.factory,
                workShop: id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.potList = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        GetList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${REP_API.SQUEEZEOILERLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.pressList = data.page.list;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
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
            exportFile(`${REP_API.REPSQUEEZEOILERLIST_API}`, '出油率报表数据导出', this);
        }
    }
};
</script>

<style scoped></style>
