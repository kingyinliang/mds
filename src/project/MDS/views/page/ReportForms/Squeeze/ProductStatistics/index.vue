<template>
    <div class="header_main">
        <el-card class="reportForms">
            <el-form :inline="true" :model="plantList" size="small" labelWidth="70px" class="topform multi_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="plantList.factory" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="plantList.workShop" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in workshop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发酵罐：">
                    <el-select v-model="plantList.childPotNo" filterable style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in Pot" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="plantList.commitDateOne" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期" style="width: 135px;" />
                    -
                    <el-date-picker v-model="plantList.commitDateTwo" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期" style="width: 135px;" />
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('report:res:proSta')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('report:res:expectProSta')" type="primary" size="small" @click="ExportExcel(true)">
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 5px;">
            <el-table :data="dataList" border tooltipEffect="dark" headerRowClassName="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column prop="factoryName" label="工厂" :showOverflowTooltip="true" width="90" />
                <el-table-column prop="workShopName" label="车间" :showOverflowTooltip="true" width="95" />
                <el-table-column prop="productDate" label="生产日期" :showOverflowTooltip="true" width="100" />
                <el-table-column prop="useMaterial" label="领用物料" :showOverflowTooltip="true" width="150" />
                <el-table-column prop="useAmount" label="领用量" :showOverflowTooltip="true" width="70" />
                <el-table-column prop="material" label="生产物料" :showOverflowTooltip="true" width="150" />
                <el-table-column prop="inPotAmount" label="入库量" :showOverflowTooltip="true" width="70" />
                <el-table-column prop="oneCage" label="1#笼数" :showOverflowTooltip="true" width="70" />
                <el-table-column prop="twoCage" label="2#笼数" :showOverflowTooltip="true" width="70" />
                <el-table-column prop="threeCage" label="3#笼数" :showOverflowTooltip="true" width="70" />
                <el-table-column prop="fourCage" label="4#笼数" :showOverflowTooltip="true" width="70" />
                <el-table-column prop="boardNum" label="酱渣板数" :showOverflowTooltip="true" width="90" />
                <el-table-column prop="spiral" label="出油率" :showOverflowTooltip="true" width="70" />
                <el-table-column prop="fermentationTankName" label="发酵罐" :showOverflowTooltip="true" width="100" />
                <el-table-column prop="originalTankName" label="原汁罐" :showOverflowTooltip="true" width="100" />
            </el-table>
            <el-row>
                <el-pagination :currentPage="plantList.currPage" :pageSizes="[10, 20, 50]" :pageSize="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
import { exportFile } from '@/net/validate';
import { Getdeptcode, Getdeptbyid } from '@/assets/js/util';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            factory: [],
            workshop: [],
            Pot: [],
            plantList: {
                factory: '',
                workShop: '',
                childPotNo: '',
                commitDateOne: '',
                commitDateTwo: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            dataList: []
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n, o) {
            Getdeptbyid(this, n, '压榨');
        },
        'plantList.workShop'(n, o) {
            this.GetPot(n);
        }
    },
    mounted() {
        Getdeptcode(this);
    },
    methods: {
        GetList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${REP_API.PROSTA_LIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 导出
        ExportExcel() {
            const that = this;
            exportFile(`${REP_API.PROSTA_EXPECT_API}`, '生产品项统计报表', that);
        },
        GetPot(id) {
            if (id) {
                const workShopName = this.workshop.find(item => item.deptId === id).deptName;
                this.$http(
                    `${BASICDATA_API.CONTAINERLIST_API}`,
                    `POST`,
                    {
                        currPage: 1,
                        holder_type: '001',
                        pageSize: 9999,
                        type: 'holder_type',
                        workShopName: workShopName,
                        dept_id: id
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    if (data.code === 0) {
                        this.Pot = data.page.list;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
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
