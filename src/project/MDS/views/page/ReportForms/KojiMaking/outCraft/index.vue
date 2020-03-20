<template>
    <div class="header_main">
        <el-card class="out-craft-report-forms">
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
                <el-form-item label="生产曲房：">
                    <el-select v-model="plantList.houseId" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in room" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发酵罐：">
                    <el-select v-model="plantList.inPotNo" filterable style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in Pot" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="制曲日期：" class="dateinput">
                    <el-row style="width: 300px;">
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
                    <el-button v-if="isAuth('report:formh:kjmOutTechList')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('report:formh:exportkjmOutTechList')" type="primary" size="small" @click="ExportExcel(true)">
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 5px;">
            <el-table :data="dataList" border tooltipEffect="dark" headerRowClassName="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column label="工厂" width="170" prop="factoryName" :showOverflowTooltip="true" />
                <el-table-column label="车间" prop="workShopName" width="90" :showOverflowTooltip="true" />
                <el-table-column label="曲房" prop="houseName" width="90" :showOverflowTooltip="true" />
                <el-table-column label="发酵罐" prop="inPotName" width="90" :showOverflowTooltip="true" />
                <el-table-column label="制曲日期" prop="inKjmDate" width="100" :showOverflowTooltip="true" />
                <el-table-column label="出曲开始时间" prop="outStartTime" width="120" :showOverflowTooltip="true" />
                <el-table-column label="出曲结束时间" prop="outEndTime" width="120" :showOverflowTooltip="true" />
                <el-table-column label="盐水温度" prop="saltWaterTemp" :showOverflowTooltip="true" />
                <el-table-column label="盐水浓度" prop="saltWaterNd" :showOverflowTooltip="true" />
                <el-table-column label="出曲温度1" prop="outTempOne" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲混合料温度1" prop="blendTempOne" width="128" :showOverflowTooltip="true" />
                <el-table-column label="出曲风速1" prop="windSpeedOne" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲温度2" prop="outTempTwo" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲混合料温度2" prop="blendTempTwo" width="128" :showOverflowTooltip="true" />
                <el-table-column label="出曲风速2" prop="windSpeedTwo" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲温度3" prop="outTempThree" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲混合料温度3" prop="blendTempThree" width="128" :showOverflowTooltip="true" />
                <el-table-column label="出曲风速3" prop="windSpeedThree" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲温度4" prop="outTempFour" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲混合料温度4" prop="blendTempFour" width="128" :showOverflowTooltip="true" />
                <el-table-column label="出曲风速4" prop="windSpeedFour" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲温度5" prop="outTempFive" width="90" :showOverflowTooltip="true" />
                <el-table-column label="出曲混合料温度5" prop="blendTempFive" width="128" :showOverflowTooltip="true" />
                <el-table-column label="出曲风速5" prop="windSpeedFive" width="90" :showOverflowTooltip="true" />
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
                houseId: '',
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
            this.Getroom(n);
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
        // 获取曲房
        /* eslint-disable @typescript-eslint/camelcase */
        Getroom(id) {
            if (id) {
                this.$http(
                    `${BASICDATA_API.CONTAINERLIST_API}`,
                    `POST`,
                    {
                        currPage: 1,
                        holder_type: '005',
                        pageSize: 9999,
                        type: 'holder_type',
                        dept_id: id
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    if (data.code === 0) {
                        this.room = data.page.list;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        /* eslint-enable @typescript-eslint/camelcase */
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
            this.$http(`${REP_API.REPOUTCRAFT_API}`, 'POST', obj).then(({ data }) => {
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
            exportFile(`${REP_API.REPOUTCRAFTOUT_API}`, '出曲工艺报表', this);
        }
    }
};
</script>

<style>
.out-craft-report-forms .el-card__body {
    padding: 12px !important;
}
</style>
<style scoped></style>
