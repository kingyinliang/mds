<template>
    <div class="header_main">
        <div>
            <el-card class="searchCard" style="margin-bottom: 5px;">
                <el-form :model="plantList" :inline="true" size="small" label-width="70px" class="multi_row clearfix" style="font-size: 0;">
                    <el-form-item label="生产工厂：">
                        <el-select v-model="plantList.factory" style="width: 170px;">
                            <el-option label="请选择" value="" />
                            <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="月份：">
                        <el-date-picker v-model="plantList.productDate" type="month" placeholder="请选择" value-format="yyyy-MM" style="width: 170px;" />
                    </el-form-item>
                    <el-form-item class="floatr">
                        <el-button v-if="isAuth('report:fromEs:chuipingDaily')" type="primary" size="small" @click="GetDataList(true)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('report:fromEs:expectChuipingDaily')" type="primary" size="small" @click="FormExportExcel(true)">
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-tabs v-model="activeName" type="border-card" style="margin-top: 5px;">
                <el-tab-pane name="0" label="吹瓶一车间">
                    <el-table :data="dataList" height="400" border header-row-class-name="tableHead">
                        <el-table-column label="名称" prop="theDate" />
                        <el-table-column label="瓶胚领用/个">
                            <el-table-column label="普利思" prop="plsRec" />
                            <el-table-column label="西蒙西" prop="xmxRec" />
                            <el-table-column label="尧邦" prop="ybRec" />
                        </el-table-column>
                        <el-table-column label="耗用瓶胚数量/个" prop="allRec" width="140" />
                        <el-table-column label="PET瓶产出/个">
                            <el-table-column label="普利思" prop="plsOutput" />
                            <el-table-column label="西蒙西" prop="xmxOutput" />
                            <el-table-column label="尧邦" prop="ybOutput" />
                        </el-table-column>
                        <el-table-column label="损耗数量/个" prop="loss" />
                        <el-table-column label="良品率" prop="productRate" />
                        <el-table-column label="包装领用/个" prop="pkgOutput" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="1" label="吹瓶二车间">
                    <el-table :data="dataList2" height="400" border header-row-class-name="tableHead">
                        <el-table-column label="名称" prop="theDate" />
                        <el-table-column label="瓶胚领用/个">
                            <el-table-column label="普利思" prop="plsRec" />
                            <el-table-column label="西蒙西" prop="xmxRec" />
                            <el-table-column label="尧邦" prop="ybRec" />
                        </el-table-column>
                        <el-table-column label="耗用瓶胚数量/个" prop="allRec" width="140" />
                        <el-table-column label="PET瓶产出/个">
                            <el-table-column label="普利思" prop="plsOutput" />
                            <el-table-column label="西蒙西" prop="xmxOutput" />
                            <el-table-column label="尧邦" prop="ybOutput" />
                        </el-table-column>
                        <el-table-column label="损耗数量/个" prop="loss" />
                        <el-table-column label="良品率" prop="productRate" />
                        <el-table-column label="包装领用/个" prop="pkgOutput" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { dateFormat, exportFile } from '@/net/validate';
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'QueryTable',
    components: {},
    data() {
        return {
            plantList: {
                factory: '',
                productDate: dateFormat(new Date(), 'yyyy-MM')
            },
            factory: '',
            activeName: '0',
            dataList: [],
            dataList2: []
        };
    },
    computed: {},
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
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取数据
        GetDataList() {
            if (this.plantList.factory === '') {
                this.$warningToast('请选择工厂');
                return false;
            }
            if (!this.plantList.productDate) {
                this.$warningToast('请选择日期');
                return false;
            }
            this.$http(`${REP_API.BOTTLE_LIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.list1;
                    this.dataList2 = data.list2;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 导出
        FormExportExcel() {
            exportFile(`${REP_API.BOTTLE_REPORT_API}`, '吹瓶日报表', this);
        }
    }
};
</script>

<style scoped></style>
