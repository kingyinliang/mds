<template>
    <div class="header_main">
        <el-card class="wheat-flour-report-forms">
            <el-form :inline="true" :model="plantList" size="small" label-width="70px" class="multi_row">
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
                <el-form-item label="炒麦机：">
                    <el-select v-model="plantList.deviceId" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in Machine" :key="sole.deviceId" :label="sole.deviceName" :value="sole.deviceId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 150px;" />
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="plantList.commitDateOne" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 135px;" />
                    -
                    <el-date-picker v-model="plantList.commitDateTwo" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 135px;" />
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('report:kjmORwht:checkRecordList')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('report:kjmORwht:expectCheckRecord')" type="primary" size="small" @click="ExportExcel(true)">
                        导出
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 5px;">
            <el-table :data="dataList" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column label="工厂" width="150" prop="factoryName" :show-overflow-tooltip="true" />
                <el-table-column label="车间" prop="workShopName" width="100" :show-overflow-tooltip="true" />
                <el-table-column label="生产订单" prop="orderNo" width="120" :show-overflow-tooltip="true" />
                <el-table-column label="生产日期" width="110" prop="productDate" />
                <el-table-column label="炒麦机" prop="deviceName" width="90" :show-overflow-tooltip="true" />
                <el-table-column label="检测时间" prop="checkTime" width="120" :show-overflow-tooltip="true" />
                <el-table-column label="焦糊率" prop="cokingRate" width="65" :show-overflow-tooltip="true" />
                <el-table-column label="膨胀率" prop="expandRate" width="65" :show-overflow-tooltip="true" />
                <el-table-column label="粉碎度" prop="piecesRate" width="65" :show-overflow-tooltip="true" />
                <el-table-column label="检测人员" prop="changer" width="140" :show-overflow-tooltip="true" />
                <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
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
    name: 'Index',
    components: {},
    data() {
        return {
            plantList: {
                factory: '',
                workShop: '',
                deviceId: '',
                orderNo: '',
                commitDateOne: '',
                commitDateTwo: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            dataList: [],
            factory: '',
            workshop: '',
            Machine: []
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n) {
            this.Getdeptbyid(n);
        },
        'plantList.workShop'(n) {
            this.GetMachine(n);
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
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '炒麦' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workShop && data.typeList.length > 0) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            }
        },
        // 炒麦机
        GetMachine(productLine) {
            this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
                param: '炒麦机',
                deptId: productLine,
                currPage: '1',
                pageSize: '50'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Machine = data.list.list;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        GetList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${REP_API.REPCHECKRECORDLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorTost(data.msg);
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
            exportFile(`${REP_API.REPEXPECTCHECKRECORD_API}`, '麦粉检测报表', this);
        }
    }
};
</script>

<style>
.wheat-flour-report-forms .el-card__body {
    padding: 12px !important;
}
</style>
<style scoped></style>
