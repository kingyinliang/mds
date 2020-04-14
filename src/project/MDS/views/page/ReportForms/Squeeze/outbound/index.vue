<template>
    <el-row>
        <el-col>
            <div class="header_main">
                <el-card class="newCard">
                    <el-row type="flex">
                        <el-col>
                            <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                                <el-form-item label="生产工厂：">
                                    <el-select v-model="params.factoryId" class="selectwpx" style="width: 140px;" @change="changeOptions('factory')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产车间：">
                                    <el-select v-model="params.workshopId" class="selectwpx" style="width: 140px;" @change="changeOptions('workshop')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="布浆线：">
                                    <el-select v-model="params.productlineId" class="selectwpx" style="width: 140px;" @change="changeOptions('productline')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in productlineList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="发酵罐：">
                                    <el-select v-model="params.fermentPotNo" class="selectwpx" style="width: 140px;" @change="changeOptions('fermentPot')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in fermentPotList" :key="index" :label="item.holderName" :value="item.holderId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产日期：">
                                    <el-date-picker v-model="params.startDate" type="date" value-format="yyyy-MM-dd" style="width: 140px;" />
                                    -
                                    <el-date-picker v-model="params.endDate" type="date" value-format="yyyy-MM-dd" style="width: 140px;" />
                                </el-form-item>
                                <el-form-item class="floatr">
                                    <el-button v-if="isQueryAuth()" type="primary" size="small" @click="getCompleteData()">
                                        查询
                                    </el-button>
                                    <el-button v-if="isExcelAuth()" type="primary" size="small" @click="exportExcel()">
                                        导出
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-card>
                <el-row v-show="searched" style="margin-top: 5px;">
                    <div style="min-height: 320px;">
                        <el-table border header-row-class-name="tableHead" :data="dataList">
                            <el-table-column label="工厂" width="180" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.factoryName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="车间" :show-overflow-tooltip="true" width="130">
                                <template slot-scope="scope">
                                    {{ scope.row.workShopName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="布浆线" :show-overflow-tooltip="true" width="130">
                                <template slot-scope="scope">
                                    {{ scope.row.productLineName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="生产日期" width="100">
                                <template slot-scope="scope">
                                    {{ scope.row.created.substring(0, 10) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="发酵罐" width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.fermentPotName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="发酵罐剩余量" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.remainAmount }}
                                </template>
                            </el-table-column>
                            <el-table-column label="起始数（方）" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.startAmount }}
                                </template>
                            </el-table-column>
                            <el-table-column label="终止数（方）" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.endAmount }}
                                </template>
                            </el-table-column>
                            <el-table-column label="打料数（方）" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.amount }}
                                </template>
                            </el-table-column>
                            <el-table-column label="暂存罐剩余量" width="120">
                                <template slot-scope="scope">
                                    {{ scope.row.storageAmount }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row style=" margin-top: 10px; font-size: 14px; line-height: 30px;" />
                    </div>
                    <el-row>
                        <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </el-row>
                </el-row>
            </div>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { BASICDATA_API, REP_API, SQU_API } from '@/api/api';
import { exportFile, dateFormat } from '@/net/validate';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
    components: {}
})
export default class Index extends Vue {
    params = {
        factoryId: '',
        factoryName: '',
        workshopId: '',
        workshopName: '',
        productlineId: '',
        productlineName: '',
        fermentPotNo: '',
        fermentPotName: '',
        startDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        endDate: dateFormat(new Date(), 'yyyy-MM-dd')
    };

    factoryList = [];
    workshopList = [];
    productlineList = [];
    fermentPotList = [];
    dataList = [];
    searched = false;
    currPage = 1;
    pageSize = 10;
    totalCount = 0;
    plantList = {};
    mounted() {
        this.getFactory();
        this.getWorkshop(this.params.factoryId);
        this.getProductLine(this.params.workshopId);
        this.getFermentPot(this.params.factoryId);
    }

    // button 权限
    isQueryAuth() {
        return Vue.prototype.isAuth('report:formh:prsMaterialList');
    }

    isExcelAuth() {
        return Vue.prototype.isAuth('report:formh:exportPrsMaterialList');
    }

    // 切换表头选项
    changeOptions(flag: string) {
        if (flag === 'factory') {
            const item = this.factoryList.find(ele => ele['deptId'] === this.params.factoryId);
            this.params.factoryName = item ? item['deptName'] : '';
        } else if (flag === 'workshop') {
            const item = this.workshopList.find(ele => ele['deptId'] === this.params.workshopId);
            this.params.workshopName = item ? item['deptName'] : '';
        } else if (flag === 'productline') {
            const item = this.productlineList.find(ele => ele['deptId'] === this.params.productlineId);
            this.params.productlineName = item ? item['deptName'] : '';
        } else if (flag === 'fermentPot') {
            const item = this.fermentPotList.find(ele => ele['holderId'] === this.params.fermentPotNo);
            this.params.fermentPotName = item ? item['holderName'] : '';
        }
    }

    // 获取工厂
    getFactory() {
        this.factoryList = [];
        Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.factoryList = res.data.typeList;
                if (!this.params.factoryId) {
                    this.params.factoryId = res.data.typeList[0].deptId;
                    this.params.factoryName = res.data.typeList[0].deptName;
                }
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    // 根据工厂获车间
    getWorkshop(fid: string) {
        this.workshopList = [];
        if (fid) {
            Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: fid, deptName: '压榨' }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.workshopList = res.data.typeList;
                    if (!this.params.workshopId && res.data.typeList.length > 0) {
                        this.params.workshopId = res.data.typeList[0].deptId;
                        this.params.workshopName = res.data.typeList[0].deptName;
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        }
    }

    // 布浆线
    getProductLine(wid: string) {
        this.productlineList = [];
        if (wid) {
            Vue.prototype.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: wid, deptType: 'proLine' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.productlineList = data.childList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        }
    }

    // 发酵罐
    getFermentPot(fid: string) {
        this.fermentPotList = [];
        if (fid) {
            Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_POT_LIST_API}`, 'POST', { factory: fid }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.fermentPotList = res.data.num;
                    // if (!this.params.factoryId && res.data.num.length > 0) {
                    //   this.params.workshopId = res.data.num[0].holderId
                    // }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        }
    }

    exportExcel() {
        this.plantList = {
            factory: this.params.factoryId,
            workshop: this.params.workshopId,
            productLine: this.params.productlineId,
            fermentPotNo: this.params.fermentPotNo,
            commitDateOne: this.params.startDate,
            commitDateTwo: this.params.endDate
        };
        exportFile(`${REP_API.APPLY_MATERIAL_EXPECT_API}`, '压榨领用报表', this);
    }

    getCompleteData() {
        this.searched = true;
        const params = {
            factory: this.params.factoryId,
            workshop: this.params.workshopId,
            productLine: this.params.productlineId,
            fermentPotNo: this.params.fermentPotNo,
            commitDateOne: this.params.startDate,
            commitDateTwo: this.params.endDate,
            currPage: String(this.currPage),
            pageSize: String(this.pageSize)
        };
        this.getDataList(params);
    }

    getDataList(params) {
        this.dataList = [];
        Vue.prototype
            .$http(`${REP_API.APPLY_MATERIAL_LIST_API}`, 'POST', params)
            .then(res => {
                if (res.data.code === 0) {
                    this.dataList = res.data.page.list;
                    this.totalCount = res.data.page.totalCount;
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    // 改变每页条数
    handleSizeChange(val: number) {
        this.pageSize = val;
        const params = {
            factory: this.params.factoryId,
            workshop: this.params.workshopId,
            productLine: this.params.productlineId,
            fermentPotNo: this.params.fermentPotNo,
            commitDateOne: this.params.startDate,
            commitDateTwo: this.params.endDate,
            currPage: String(this.currPage),
            pageSize: String(this.pageSize)
        };
        this.getDataList(params);
    }

    // 跳转页数
    handleCurrentChange(val: number) {
        this.currPage = val;
        const params = {
            factory: this.params.factoryId,
            workshop: this.params.workshopId,
            productLine: this.params.productlineId,
            fermentPotNo: this.params.fermentPotNo,
            commitDateOne: this.params.startDate,
            commitDateTwo: this.params.endDate,
            currPage: String(this.currPage),
            pageSize: String(this.pageSize)
        };
        this.getDataList(params);
    }

    @Watch('params', { deep: true })
    onChangeValue() {
        this.searched = false;
        this.currPage = 1;
        this.pageSize = 10;
        this.totalCount = 0;
    }

    @Watch('params.factoryId')
    onChangeFactory(newVal: string) {
        this.params.workshopId = '';
        this.params.workshopName = '';
        this.params.fermentPotNo = '';
        this.params.fermentPotName = '';
        this.getWorkshop(newVal);
        this.getFermentPot(newVal);
    }

    @Watch('params.workshopId')
    onChangeWorkshop(newVal: string) {
        this.params.productlineId = '';
        this.params.productlineName = '';
        this.getProductLine(newVal);
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/_common.scss";
</style>
<style lang="scss" scoped>
// TODO
.box-item {
    box-sizing: border-box;
    height: 220px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 2px;
    .box-item-top {
        height: 178px;
        padding: 10px;
        padding-bottom: 0;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        .box-item-title {
            display: flex;
            flex: 1;
            justify-content: space-between;
            height: 34px;
            .box-item-title-name {
                display: flex;
                flex: 1;
                :first-child {
                    width: 30px;
                    height: 30px;
                    color: #fff;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 30px;
                    text-align: center;
                    background: #ffbf00;
                    border-radius: 15px;
                }
                :nth-child(2) {
                    margin-top: 4px;
                    margin-left: 5px;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 22px;
                }
            }
            .box-item-title-state {
                flex: 1;
                margin-top: 4px;
                color: rgba(0, 0, 0, 0.65);
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                text-align: right;
                &::before {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    margin-right: 10px;
                    margin-bottom: 2px;
                    background: rgba(126, 211, 33, 1);
                    content: "";
                }
            }
            .box-item-title-state-nopass {
                flex: 1;
                margin-top: 4px;
                color: red;
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                text-align: right;
                &::before {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    margin-right: 10px;
                    margin-bottom: 2px;
                    background: red;
                    content: "";
                }
            }
        }
        .box-item-container {
            display: flex;
            flex: 1;
            justify-content: space-between;
            height: 129px;
            .box-item-container-left {
                display: flex;
                justify-content: center;
                width: 130px;
                padding-top: 10px;
                .box-item-container-img {
                    width: 94px;
                    height: 86px;
                    background: url("~@/assets/img/fajiaoguan.png");
                }
            }
            .box-item-container-right {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin-left: 10px;
                .box-item-container-item {
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                    .name {
                        width: 60px;
                        color: rgba(0, 0, 0, 0.45);
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 20px;
                    }
                    .detail {
                        flex: 1;
                        overflow: hidden;
                        color: rgba(0, 0, 0, 0.65);
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 17px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
    .box-item-bottom {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        height: 40px;
        background: rgba(247, 249, 250, 1);
        border-radius: 0 0 2px 2px;
        .box-item-bottom-item {
            flex: 1;
            color: rgba(0, 0, 0, 0.65);
            font-weight: 500;
            font-size: 12px;
            line-height: 40px;
            text-align: center;
            &:hover {
                color: #fff;
                background: #1890ff;
                cursor: pointer;
            }
        }
        .box-item-bottom-split {
            width: 1px;
            height: 16px;
            margin-top: 12px;
            background: rgba(232, 232, 232, 1);
        }
    }
}
.rowButton {
    button {
        margin: 0 3px !important;
    }
}
.box-card {
    .pro-line {
        border-bottom: 1px solid #dcdfe6;
    }
    .pro-line p {
        color: red;
        font-size: 16px;
        letter-spacing: 0.1em;
    }
    b {
        float: left;
        font-size: 16px;
        line-height: 32px;
    }
    .item {
        display: flex;
        margin-top: 20px;
        img {
            float: left;
            width: 220px;
            height: 220px;
            margin-right: 20px;
            border: 1px solid #dcdfe6;
            border-radius: 6px;
        }
        .itemForm {
            flex: 1;
            p {
                color: #8a979e;
            }
        }
        .margb20px {
            margin-bottom: 10px;
        }
    }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
</style>
