<template>
    <div class="header_main">
        <el-card>
            <el-row class="search-card">
                <el-col>
                    <el-form :model="plantList" :inline="true" size="small" labelWidth="70px" class="multi_row">
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
                        <el-form-item label="制曲日期：">
                            <el-date-picker v-model="plantList.commitDateOne" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期" style="width: 150px;" />
                            -
                            <el-date-picker v-model="plantList.commitDateTwo" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期" style="width: 150px;" />
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('report:kjmORwht:techExceptionList')" type="primary" size="small" @click="GetList">
                                查询
                            </el-button>
                            <el-button v-if="isAuth('report:kjmORwht:expectTechException')" type="primary" size="small" @click="ExportExcel(true)">
                                导出
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 5px;">
            <el-table :data="dataList" border tooltipEffect="dark" headerRowClassName="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column label="生产工厂" width="150" prop="factoryName" :showOverflowTooltip="true" />
                <el-table-column label="生产车间" width="110" prop="workShopName" />
                <el-table-column label="曲房" width="110" prop="houseNoName" />
                <el-table-column label="发酵罐" width="110" prop="inPotNoName" />
                <el-table-column label="制曲日期" width="110" prop="inKjmDate" />
                <el-table-column label="煮豆异常" width="100" prop="cookingException" :showOverflowTooltip="true" />
                <el-table-column label="连续蒸煮异常" width="120" prop="continuousCookingException" :showOverflowTooltip="true" />
                <el-table-column label="混合入曲异常" width="120" prop="blendException" :showOverflowTooltip="true" />
                <el-table-column label="看曲异常" width="100" prop="guardException" :showOverflowTooltip="true" />
                <el-table-column label="出曲异常" width="100" prop="outException" :showOverflowTooltip="true" />
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
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workShop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workShop = data.typeList;
                        if (!this.plantList.workShop && data.typeList.length > 0) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
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
                        this.$error_SHINHO(data.msg);
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
            this.$http(`${REP_API.REPOUTCRARTERROR_API}`, 'POST', this.plantList).then(({ data }) => {
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
            exportFile(`${REP_API.REPOUTCRARTERROREXPORT_API}`, '工艺异常报表', this);
        }
    }
};
</script>

<style lang="scss" scoped>
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
        background-color: #1890ff;
        color: #fff;
    }
    .el-button--primary:first-child {
        background-color: #1890ff;
        color: #fff;
        border-color: #1890ff;
    }
}
</style>
