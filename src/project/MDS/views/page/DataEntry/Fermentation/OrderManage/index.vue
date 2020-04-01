<template>
    <div>
        <div class="header_main">
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col>
                        <el-form :model="params" size="small" :inline="true" labelPosition="right" labelWidth="70px" class="multi_row">
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
                            <el-form-item label="罐号：">
                                <el-select v-model="params.potId" class="selectwpx" filterable style="width: 140px;" @change="changeOptions('pot')">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="sole in potList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="物料：">
                                <el-select v-model="params.materialCode" class="selectwpx" filterable style="width: 140px;" @change="changeOptions('material')">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="sole in materialList" :key="sole.materialCode" :label="sole.materialCode + ' ' + sole.materialName" :value="sole.materialCode" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="订单日期：">
                                <el-date-picker v-model="params.startDate" type="date" valueFormat="yyyy-MM-dd" style="width: 140px;" />
                                -
                                <el-date-picker v-model="params.endDate" type="date" valueFormat="yyyy-MM-dd" style="width: 140px;" />
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('fer:order:list')" type="primary" size="small" style="float: right;" @click="getOrderList()">
                                    查询
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
            <div class="tableCard">
                <div class="toggleSearchTop" style="background-color: white; margin-bottom: 8px; position: relative; border-radius: 5px;">
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs" type="border-card" style="border-radius: 15px; overflow: hidden;">
                    <el-tab-pane name="1">
                        <span slot="label" class="spanview">
                            <el-button>未申请</el-button>
                        </span>
                        <el-row>
                            <el-col>
                                <el-button v-if="isAuth('fer:order:applyFerOrder')" type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="applyOrder()">
                                    申请订单
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-table headerRowClassName="tableHead" :data="dataList" border tooltipEffect="dark" @selection-change="handleChange">
                                <el-table-column type="selection" width="55" />
                                <el-table-column type="index" label="序号" width="55" />
                                <el-table-column label="容器" :showOverflowTooltip="true" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.holdName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="物料" :showOverflowTooltip="true" width="140">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferMaterialCode + ' ' + scope.row.ferMaterialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单量" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferUnit }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单类型" width="120">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.ferOrderType" placeholder="请选择" size="mini" style="width: 100px;">
                                            <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.value" :value="item.code" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="版本" width="120">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.proVersion" placeholder="请选择" size="mini" style="width: 100px;">
                                            <el-option v-for="(item, index) in versionsList" :key="index" :label="item.value" :value="item.code" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="开始日期" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.startDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="结束日期" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.endDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="制曲工单" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmOrderNo }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="制曲物料" :showOverflowTooltip="true" width="140">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmMaterialCode + ' ' + scope.row.kjmMaterialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="数量" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmUnit }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="批次" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.batch }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                        <el-row>
                            <el-pagination :currentPage="currPage" :pageSizes="[10, 20, 50]" :pageSize="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane name="2">
                        <span slot="label" class="spanview">
                            <el-button>已申请</el-button>
                        </span>
                        <el-row>
                            <el-table headerRowClassName="tableHead" :data="applyedList" border tooltipEffect="dark">
                                <el-table-column type="index" label="序号" width="55" />
                                <el-table-column label="订单号" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferOrderNo }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="容器" :showOverflowTooltip="true" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.holdName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="物料" :showOverflowTooltip="true" width="140">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferMaterialCode + ' ' + scope.row.ferMaterialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单量" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferUnit }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单类型" width="120">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.ferOrderType" placeholder="请选择" size="mini" style="width: 100px;" :disabled="true">
                                            <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.value" :value="item.code" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="版本" width="120">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.proVersion" placeholder="请选择" size="mini" style="width: 100px;" :disabled="true">
                                            <el-option v-for="(item, index) in versionsList" :key="index" :label="item.value" :value="item.code" />
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="开始日期" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.startDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="结束日期" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.endDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="制曲工单" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmOrderNo }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="制曲物料" :showOverflowTooltip="true" width="140">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmMaterialCode + ' ' + scope.row.kjmMaterialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="数量" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.kjmUnit }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="批次" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.batch }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="申请人员" width="140">
                                    <template slot-scope="scope">
                                        {{ scope.row.applyUser }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="申请时间" width="160">
                                    <template slot-scope="scope">
                                        {{ scope.row.applyDate }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                        <el-row>
                            <el-pagination :currentPage="applyCurrPage" :pageSizes="[10, 20, 50]" :pageSize="applyPageSize" layout="total, sizes, prev, pager, next, jumper" :total="applyTotalCount" @size-change="handleApplySizeChange" @current-change="handleApplyCurrentChange" />
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { BASICDATA_API, FERMENTATION_API, SYSTEMSETUP_API, REP_API } from '@/api/api';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { headanimation } from '@/net/validate';
@Component({
    components: {}
})
export default class Index extends Vue {
    // 将common中的参数复制一份到本地
    // NEESTODO
    /* eslint-disable no-invalid-this */
    params = JSON.parse(JSON.stringify(this.$store.state.common.FerOrderManage));
    factoryList = [];
    orderTypeList = [];
    versionsList = [];
    workshopList = [];
    potList = [];
    materialList = [];
    dataList = [];
    currPage = 0;
    pageSize = 10;
    totalCount = 0;
    applyedList = [];
    applyCurrPage = 0;
    applyPageSize = 10;
    applyTotalCount = 0;
    selectedList = [];
    ExportTime = 0;
    activeName = '1';
    searched = false;
    lodingS;
    mounted() {
        headanimation(Vue.prototype.$);
        // const now = dateFormat(new Date(), 'yyyy-MM-dd')
        // this.params.startDate = now
        // this.params.endDate = now
        this.getFactory();
        this.getWorkshop(this.params.factoryId);
        this.getDictList(this.params.factoryId);
        this.getMaterialList(this.params.factoryId);
        this.getFermentPot(this.params.factoryId, this.params.workshopId);
        this.getVersionList(this.params.workshopId);
    }

    get mainTabs() {
        return this.$store.state.common.mainTabs;
    }

    set mainTabs(val) {
        this.$store.commit('common/updateMainTabs', val);
    }

    changeOptions(flag: string) {
        if (flag === 'factory') {
            const item: any = this.factoryList.find((ele: any) => ele.deptId === this.params.factoryId);// eslint-disable-line
            this.params.factoryName = item ? item.deptName : '';
        } else if (flag === 'workshop') {
            const item: any = this.workshopList.find((ele: any) => ele.deptId === this.params.workshopId);// eslint-disable-line
            this.params.workshopName = item ? item.deptName : '';
        } else if (flag === 'pot') {
            const item: any = this.potList.find((ele: any) => ele.holderId === this.params.potId);// eslint-disable-line
            this.params.potName = item ? item.holderName : '';
        } else if (flag === 'material') {
            const item: any = this.materialList.find((ele: any) => ele.materialCode === this.params.materialCode);// eslint-disable-line
            this.params.materialName = item ? item.materialName : '';
        }
    }

    getDictList(factory) {
        if (factory) {
            const params = { types: ['order_type'], factory };
            Vue.prototype
                .$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.orderTypeList = data.dicList[0].prolist;
                    } else {
                        this.$notify.error({ title: '错误', message: data.msg });
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        }
    }

    getVersionList(workShopId) {
        if (workShopId) {
            const params = { types: ['fjpro_version'], workShopId };
            Vue.prototype
                .$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params, false, false, false)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.versionsList = data.dicList[0].prolist;
                    } else {
                        Vue.prototype.$warningTost(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        }
    }

    // 改变每页条数
    handleSizeChange(val: number) {
        this.pageSize = val;
        this.currPage = 1;
        this.retrieveDataList();
    }

    handleApplySizeChange(val: number) {
        this.applyPageSize = val;
        this.applyCurrPage = 1;
        this.retrieveApplyedList();
    }

    // 跳转页数
    handleCurrentChange(val: number) {
        this.currPage = val;
        this.retrieveDataList();
    }

    // 跳转页数
    handleApplyCurrentChange(val: number) {
        this.applyCurrPage = val;
        this.retrieveApplyedList();
    }

    // 获取工厂
    getFactory() {
        this.factoryList = [];
        Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.factoryList = res.data.typeList;
                if (!this.params.factoryId) {
                    this.params.factoryId = res.data.typeList[0].deptId;
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
            Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: fid, deptName: '发酵' }, false, false, false).then(res => {
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

    // 发酵罐
    getFermentPot(fid: string, wid: string) {
        this.potList = [];
        if (fid && wid) {
            Vue.prototype.$http(`${BASICDATA_API.BASEHOLDERLIST_API}`, 'POST', { factory: fid, workShop: wid }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.potList = res.data.holderList;
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

    getMaterialList(fid: string) {
        this.materialList = [];
        if (fid) {
            Vue.prototype.$http(`${BASICDATA_API.BASEMATERIALIST_API}`, 'POST', { factory: fid }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.materialList = res.data.materialList;
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

    setStore(params) {
        this.$store.commit('common/updateFerOrderManage', params);
    }

    getOrderList() {
        if (this.params.factoryId === '') {
            Vue.prototype.$warningTost('请选择工厂');
            return;
        }
        if (this.params.workshopId === '') {
            this.$notify.error({ title: '错误', message: '请选择车间' });
            return;
        }
        // if (this.params.potId === '') {
        //   this.$message.error('请选择罐号')
        //   return
        // }
        // if (this.params.materialCode === '') {
        //   this.$message.error('请选择物料')
        //   return
        // }
        // if (this.params.startDate === '') {
        //   this.$message.error('请选择开始日期')
        //   return
        // }
        // if (this.params.endDate === '') {
        //   this.$message.error('请选择结束日期')
        //   return
        // }
        this.searched = true;
        // 保存选项值到common store
        this.setStore(this.params);
        this.retrieveDataList();
        this.retrieveApplyedList();
    }

    retrieveDataList() {
        const queryParams = {
            factory: this.params.factoryId,
            workShop: this.params.workshopId,
            startDateFrom: this.params.startDate,
            startDateTo: this.params.endDate,
            holderId: this.params.potId,
            kjmMaterialCode: this.params.materialCode,
            turnFlag: '0',
            currPage: String(this.currPage),
            pageSize: String(this.pageSize)
        };
        this.dataList = [];
        Vue.prototype.$http(`${FERMENTATION_API.ORDER_LIST_API}`, `POST`, queryParams).then(res => {
            if (res.data.code === 0) {
                this.dataList = res.data.orderPage.list;
                this.totalCount = res.data.orderPage.totalCount;
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    retrieveApplyedList() {
        const queryParams = {
            factory: this.params.factoryId,
            workShop: this.params.workshopId,
            startDateFrom: this.params.startDate,
            startDateTo: this.params.endDate,
            holderId: this.params.potId,
            kjmMaterialCode: this.params.materialCode,
            turnFlag: '1',
            currPage: String(this.applyCurrPage),
            pageSize: String(this.applyPageSize)
        };
        this.applyedList = [];
        Vue.prototype.$http(`${FERMENTATION_API.ORDER_LIST_API}`, `POST`, queryParams).then(res => {
            if (res.data.code === 0) {
                this.applyedList = res.data.orderPage.list;
                this.applyTotalCount = res.data.orderPage.totalCount;
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    // 多选
    handleChange(selections) {
        this.selectedList = selections;
    }

    applyOrder() {
        if (!this.selectedList || this.selectedList.length === 0) {
            Vue.prototype.$warningTost('请选择要申请的订单');
            return;
        }
        // for (let item of this.selectedList) {
        //   if (item.kjmAmount <= 0) {
        //     Vue.prototype.$warningTost(item.holdName + ' 订单量需大于0')
        //     return false
        //   }
        // }
        this.$confirm('确认申请订单，是否继续?', '申请确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // this.lodingS = true
            this.lodingS = this.$loading({
                lock: true,
                spinner: 'loadingGif',
                text: '加载中……',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            Vue.prototype.$http(`${FERMENTATION_API.ORDER_APPLY_API}`, `POST`, this.selectedList).then(res => {
                if (res.data.code === 0) {
                    // this.getOrderList()
                    this.ExportTime = window.setInterval(() => {
                        this.getStatus();
                    }, 4000);
                } else {
                    this.lodingS.close();
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        });
    }

    getStatus() {
        Vue.prototype
            .$http(`${REP_API.GETREPOUTFORWORKOUTPUT_API}`, 'GET', {
                asyncType: 'ASYNC_TYPE_FER_APPLY_ORDER'
            })
            .then(({ data }) => {
                if (data.code === 0) {
                    if (data.asyncRecord) {
                        if (data.asyncRecord.asyncStatus === '0') {
                            this.lodingS.close();
                            clearInterval(this.ExportTime);
                            this.$notify.error({
                                title: '错误',
                                message: data.asyncRecord.remark
                            });
                        } else if (data.asyncRecord.asyncStatus === '1') {
                            this.lodingS.close();
                            clearInterval(this.ExportTime);
                            this.getOrderList();
                            this.$notify({
                                title: '成功',
                                message: '申请成功',
                                type: 'success'
                            });
                        }
                    }
                } else {
                    this.lodingS.close();
                    clearInterval(this.ExportTime);
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            })
            .catch(() => {
                this.lodingS.close();
                clearInterval(this.ExportTime);
            });
    }

    @Watch('params', { deep: true })
    onChangeValue() {
        this.searched = false;
        this.selectedList = [];
        this.dataList = [];
        this.applyedList = [];
        this.currPage = 1;
        this.pageSize = 10;
        this.totalCount = 0;
        this.applyCurrPage = 1;
        this.applyPageSize = 10;
        this.applyTotalCount = 0;
    }

    @Watch('params.factoryId')
    onFactoryValue(newVal: string) {
        this.params.workshopId = '';
        this.params.workshopName = '';
        this.params.potId = '';
        this.params.potName = '';
        this.params.materialCode = '';
        this.params.materialName = '';
        this.getWorkshop(newVal);
        this.getDictList(newVal);
        this.getMaterialList(newVal);
        this.getFermentPot(newVal, this.params.workshopId);
    }

    @Watch('params.workshopId')
    onWorkshopValue(newVal: string) {
        this.params.potId = '';
        this.params.potName = '';
        this.getFermentPot(this.params.factoryId, newVal);
        this.getVersionList(newVal);
    }
}
</script>

<style lang="scss"></style>
