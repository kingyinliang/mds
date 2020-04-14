<template>
    <div class="header_main">
        <el-card>
            <el-row class="search-card">
                <el-col>
                    <el-form :model="plantList" :inline="true" size="small" label-width="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="plantList.factory">
                                <el-option label="请选择" value="" />
                                <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="plantList.workShop">
                                <el-option label="请选择" value="" />
                                <el-option v-for="sole in workShop" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="曲房：">
                            <el-select v-model="plantList.houseNoID" filterable>
                                <el-option label="请选择" value="" />
                                <el-option v-for="sole in houseList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发酵罐：">
                            <el-select v-model="plantList.inPotNoID" filterable>
                                <el-option label="请选择" value="" />
                                <el-option v-for="sole in inPotList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <el-input v-model="plantList.orderNo" size="small" class="width199px" />
                        </el-form-item>
                        <el-form-item label="制曲日期：" class="dateinput">
                            <el-row style="width: 300px;">
                                <el-col :span="12">
                                    <el-date-picker v-model="plantList.commitDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 130px;" />
                                    <span>-</span>
                                </el-col>
                                <el-col :span="12">
                                    <el-date-picker v-model="plantList.commitDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 130px;" />
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('report:kjmORwht:guardTechList')" type="primary" size="small" @click="GetList">
                                查询
                            </el-button>
                            <el-button v-if="isAuth('report:kjmORwht:expectGuardTech')" type="primary" size="small" @click="ExportExcel(true)">
                                导出
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 5px;">
            <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column label="工厂" width="120" prop="factoryName" :show-overflow-tooltip="true" />
                <el-table-column label="车间" prop="workShopName" width="100" />
                <el-table-column label="制曲日期" prop="inKjmDate" width="100" />
                <el-table-column label="曲房" prop="houseNoName" width="100" :show-overflow-tooltip="true" />
                <el-table-column label="发酵罐" prop="inPotNoName" width="100" :show-overflow-tooltip="true" />
                <el-table-column label="豆粕量" prop="pulpWeight" width="80" />
                <el-table-column label="豆粕批次" prop="beanBatch" width="110" />
                <el-table-column label="麦粉量" prop="wheatWeight" width="80" />
                <el-table-column label="麦粉批次" prop="whtBatch" width="80" />
                <el-table-column label="盐水量" prop="saltWaterWeight" width="80" />
                <el-table-column label="入曲开始时间" prop="inStartTime" width="165" />
                <el-table-column label="入曲结束时间" prop="inEndTime" width="165" />
                <el-table-column label="二翻加水量" prop="overWeight" width="95" />
                <el-table-column label="出曲加水量" prop="outWeight" width="95" />
                <el-table-column label="U">
                    <el-table-column label="一翻感官" prop="oneCodeU" />
                    <el-table-column label="二翻感官" prop="twoCodeU" />
                    <el-table-column label="出曲感官" prop="outCodeU" />
                </el-table-column>
                <el-table-column label="S">
                    <el-table-column label="一翻感官" prop="oneCodeS" />
                    <el-table-column label="二翻感官" prop="twoCodeS" />
                    <el-table-column label="出曲感官" prop="outCodeS" />
                </el-table-column>
                <el-table-column label="A">
                    <el-table-column label="一翻感官" prop="oneCodeA" />
                    <el-table-column label="二翻感官" prop="twoCodeA" />
                    <el-table-column label="出曲感官" prop="outCodeA" />
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
import { exportFile } from '@/net/validate';
export default {
    data() {
        return {
            plantList: {
                factory: '',
                workShop: '',
                houseNoID: '',
                inPotNoID: '',
                commitDateOne: '',
                commitDateTwo: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            factory: '',
            workShop: '',
            houseList: '',
            inPotList: '',
            dataList: []
        };
    },
    watch: {
        'plantList.factory'(n) {
            this.plantList.workShop = '';
            this.plantList.houseNoID = '';
            this.plantList.inPotNoID = '';
            this.Getdeptbyid(n);
        },
        'plantList.workShop'(n) {
            this.plantList.houseNoID = '';
            this.plantList.inPotNoID = '';
            this.GetinPotList(n);
            this.GethouseList(n);
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
                    this.$errorTost(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workShop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '制曲' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workShop = data.typeList;
                        if (!this.plantList.workShop && data.typeList.length > 0) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            }
        },
        // 获取发酵罐
        /* eslint-disable @typescript-eslint/camelcase */
        GetinPotList(id) {
            if (id) {
                const workShopName = this.workShop.find(item => item.deptId === id)['deptName'];
                this.$http(
                    `${BASICDATA_API.CONTAINERLIST_API}`,
                    'POST',
                    {
                        currPage: 1,
                        dept_id: id,
                        holder_type: '001',
                        pageSize: 9999,
                        type: 'holder_type',
                        workShopName: workShopName
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    if (data.code === 0) {
                        this.inPotList = data.page.list;
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            }
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 获取曲房
        /* eslint-disable @typescript-eslint/camelcase */
        GethouseList(id) {
            if (id) {
                const workShopName = this.workShop.find(item => item.deptId === id)['deptName'];
                this.$http(
                    `${BASICDATA_API.CONTAINERLIST_API}`,
                    'POST',
                    {
                        currPage: 1,
                        dept_id: id,
                        holder_type: '005',
                        pageSize: 9999,
                        type: 'holder_type',
                        workShopName: workShopName
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    if (data.code === 0) {
                        this.houseList = data.page.list;
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            }
        },
        /* eslint-enable @typescript-eslint/camelcase */
        GetList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${REP_API.REPOUTLOOKCRAFT_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorTost(data.msg);
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
            exportFile(`${REP_API.REPOUTLOOKCRAFTEXPORT_API}`, '看曲工艺报表', this);
        }
    }
};
</script>

<style lang="scss" scoped>
.el-table th > .cell {
    text-align: center;
}
.width199px {
    width: 199px;
}
.el-date-editor .el-range-input {
    width: 100px;
}
.el-range-editor--small .el-range-separator {
    padding-right: 20px;
}
.search-card {
    .el-button--primary,
    .el-button--primary:focus {
        color: #000;
        background-color: #fff;
        border-color: #d9d9d9;
    }
    .el-button--primary:hover {
        color: #fff;
        background-color: #1890ff;
    }
    .el-button--primary:first-child {
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
    }
}
</style>
