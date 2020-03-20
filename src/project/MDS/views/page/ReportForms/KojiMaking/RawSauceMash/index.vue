<template>
    <div class="header_main">
        <el-card class="raw-souce-mash-report-forms">
            <el-form :inline="true" :model="plantList" size="small" labelWidth="70px" class="multi_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="plantList.factory" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="plantList.workshop" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in workshop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发酵罐：">
                    <el-select v-model="plantList.inPotNo" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in Pot" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产订单：">
                    <el-input v-model="plantList.orderNo" placeholder="订单号" />
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="plantList.commitDateOne" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期" style="width: 135px;" />
                    -
                    <el-date-picker v-model="plantList.commitDateTwo" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期" style="width: 135px;" />
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('report:formh:kjmSauceList')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('report:formh:kjmSauceList')" type="primary" size="small" @click="ExportExcel(true)">
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 5px;">
            <el-table :data="dataList" border tooltipEffect="dark" headerRowClassName="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column label="生产日期" width="100" prop="productDate" :showOverflowTooltip="true" />
                <el-table-column label="工厂" width="170" prop="factoryName" :showOverflowTooltip="true" />
                <el-table-column label="车间" prop="workShopName" width="100" :showOverflowTooltip="true" />
                <el-table-column label="生产订单" prop="orderNo" width="120" :showOverflowTooltip="true" />
                <el-table-column label="品项" prop="material" width="150" :showOverflowTooltip="true" />
                <el-table-column label="发酵罐" prop="holderName" width="100" :showOverflowTooltip="true" />
                <el-table-column label="发酵罐容量" prop="holderHold" width="95" :showOverflowTooltip="true" />
                <el-table-column label="计划产量" prop="planOutput" :showOverflowTooltip="true" />
                <el-table-column label="实际产量" prop="realOutput" :showOverflowTooltip="true" />
                <el-table-column label="投罐日期" prop="canningDate" width="100" :showOverflowTooltip="true" />
                <el-table-column label="满罐日期" prop="canfulDate" width="100" :showOverflowTooltip="true" />
                <el-table-column label="180天成熟期" prop="oheDate" width="110" :showOverflowTooltip="true" />
                <el-table-column label="130天成熟期" prop="ohtDate" width="110" :showOverflowTooltip="true" />
                <el-table-column label="日期" prop="nowDate" width="100" :showOverflowTooltip="true" />
                <el-table-column label="发酵天数" prop="fDate" />
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
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            plantList: {
                factory: '',
                workshop: '',
                inPotNo: '',
                commitDateOne: '',
                commitDateTwo: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            dataList: [],
            factory: '',
            workshop: '',
            room: [],
            Pot: []
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n) {
            this.Getdeptbyid(n);
        },
        'plantList.workshop'(n) {
            this.GetPot(n);
        }
    },
    mounted() {
        this.Getdeptcode();
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
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workshop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '制曲' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workshop && data.typeList.length > 0) {
                            this.plantList.workshop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        /* eslint-disable @typescript-eslint/camelcase */
        GetPot(id) {
            if (id) {
                let workShopName = '';
                this.workshop.forEach((item) => {
                    if (id === item.deptId) {
                        workShopName = item.deptName;
                    }
                });
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
        /* eslint-enable @typescript-eslint/camelcase */
        GetList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            const obj = JSON.parse(JSON.stringify(this.plantList));
            obj.currPage = String(obj.currPage);
            obj.pageSize = String(obj.pageSize);
            obj.totalCount = String(obj.totalCount);
            this.$http(`${REP_API.REPRAW_API}`, 'POST', obj).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$error_SHINHO(data.msg);
                }
                this.lodingS = false;
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
        },
        // 导出
        ExportExcel() {
            exportFile(`${REP_API.REPRAWOUT_API}`, '生酱醪统计报表', this);
        }
    }
};
</script>

<style>
.raw-souce-mash-report-forms .el-card__body {
    padding: 12px !important;
}
</style>
<style scoped></style>
