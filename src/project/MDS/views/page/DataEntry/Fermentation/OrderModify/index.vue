<template>
    <div>
        <div class="header_main">
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col>
                        <el-form :model="form" size="small" :inline="true" labelPosition="right" labelWidth="70px" class="multi_row">
                            <el-form-item label="生产工厂：">
                                <el-select v-model="form.factory" placeholder="请选择" class="width160px">
                                    <el-option value="">
                                        请选择
                                    </el-option>
                                    <el-option v-for="(item, index) in factory" :key="index" :value="item.deptId" :label="item.deptName" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产车间：">
                                <el-select v-model="form.workShop" placeholder="请选择" class="width160px">
                                    <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="罐号：">
                                <el-select v-model="form.holderId" class="selectwpx" filterable style="width: 140px;">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="sole in potList" :key="sole.holderId" :label="sole.holderName" :value="sole.holderId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产物料：">
                                <el-select v-model="form.materialCode" class="selectwpx" filterable style="width: 140px;">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="sole in materialList" :key="sole.materialCode" :label="sole.materialCode + ' ' + sole.materialName" :value="sole.materialCode" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="订单日期：">
                                <el-date-picker v-model="form.startDate" type="date" valueFormat="yyyy-MM-dd" style="width: 140px;" />
                                -
                                <el-date-picker v-model="form.endDate" type="date" valueFormat="yyyy-MM-dd" style="width: 140px;" />
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('fer:judge:isSapList')" type="primary" size="small" @click="GetList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('report:form:exportWorkshopWHoursM')" type="primary" size="small" @click="ExportExcel(true)">
                                    导出
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
                <div class="toggleSearchTop" style=" position: relative; margin-bottom: 8px; background-color: white; border-radius: 5px;">
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-tabs id="DaatTtabs" ref="multipleTable" v-model="activeName" class="NewDaatTtabs" type="border-card" style=" overflow: hidden; border-radius: 15px;" @tab-click="handleClick">
                    <el-tab-pane name="0" label="未修改">
                        <el-row>
                            <el-col>
                                <el-button v-if="isAuth('fer:judge:isSapUpdate')" type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="ModifyOrder()">
                                    订单修改
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-table ref="multipleTables" headerRowClassName="tableHead" :data="dataList" border tooltipEffect="dark" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" />
                                <el-table-column label="罐号" width="55" prop="holderNo" />
                                <el-table-column label="订单号" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.orderNo }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="开始日期" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.startDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="结束日期">
                                    <template slot-scope="scope">
                                        {{ scope.row.orderEndDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定时发酵天数" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.judgeDays }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定前">
                                    <template slot-scope="scope">
                                        {{ scope.row.oldCategory }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定后">
                                    <template slot-scope="scope">
                                        {{ scope.row.halfName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="发酵成熟天数" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferDays }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="修改后结束日期" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.endDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="接口返回" width="100px" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.sapContent }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定时间" width="100px" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.changed }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定人" width="100px" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.changer }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane name="1" label="已修改">
                        <el-row>
                            <el-table headerRowClassName="tableHead" :data="dataList" border tooltipEffect="dark">
                                <el-table-column label="罐号" width="55" prop="holderNo" />
                                <el-table-column label="订单号" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.orderNo }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="开始日期" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.startDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="结束日期">
                                    <template slot-scope="scope">
                                        {{ scope.row.orderEndDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定时发酵天数" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.judgeDays }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定前">
                                    <template slot-scope="scope">
                                        {{ scope.row.oldCategory }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定后">
                                    <template slot-scope="scope">
                                        {{ scope.row.halfName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="发酵成熟天数">
                                    <template slot-scope="scope">
                                        {{ scope.row.ferDays }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="修改后结束日期" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.endDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="接口返回" width="100px" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.sapContent }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定时间" width="100px" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.changed }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="判定人" width="100px" :showOverflowTooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.changer }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </el-tab-pane>
                    <el-pagination :currentPage="form.currPage" :pageSizes="[10, 20, 50]" :pageSize="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="form.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
// import { dateFormat } from '@/net/validate'
import { exportFile } from '@/net/validate';
import { BASICDATA_API, FERMENTATION_API } from '@/api/api';
export default {
    name: 'CategroyJudgement',
    data() {
        return {
            form: {
                factory: '',
                workShop: '',
                holderId: '',
                materialCode: '',
                startDate: '',
                endDate: '',
                isSap: '0',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            plantList: {},
            factory: '',
            workshop: '',
            activeName: '0',
            materialList: [],
            potList: [],
            dataList: [],
            multipleSelection: []
        };
    },
    watch: {
        'form.factory'(n) {
            this.GetWorkshopList(n);
            this.GetMaterialList(n);
        },
        'form.workShop'(n) {
            this.GetPotList(n);
        },
        dataList() {
            this.$nextTick(() => {
                this.dataList.forEach((ele) => {
                    if (ele.judgeDays !== null && Number(ele.judgeDays) <= 130) {
                        this.$refs.multipleTables.toggleRowSelection(ele);
                    }
                });
            });
        }
    },
    mounted() {
        this.GetFactoryList();
    },
    methods: {
        // 获取工厂
        GetFactoryList() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.form.factory) {
                        this.form.factory = this.factory[0].deptId;
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        GetWorkshopList(id) {
            if (id) {
                this.form.workShop = '';
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '发酵' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length > 0) {
                            this.workshop = data.typeList;
                            this.form.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 导出
        ExportExcel() {
            if (!this.form.factory) {
                this.$warningTost('请选择工厂');
                return false;
            }
            if (!this.form.workShop) {
                this.$warningTost('请选择车间');
                return false;
            }
            this.plantList = this.form;
            exportFile(`${FERMENTATION_API.ORDER_MODIFY_EXPORT_API}`, '订单修改', this);
        },
        // 罐号
        GetPotList(id) {
            this.form.holderId = '';
            if (id) {
                this.$http(`${BASICDATA_API.BASEHOLDERLIST_API}`, 'POST', { factory: this.form.factory, workShop: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.potList = data.holderList;
                    } else {
                        this.error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 物料
        GetMaterialList(id) {
            this.form.materialCode = '';
            if (id) {
                this.$http(`${BASICDATA_API.BASEMATERIALIST_API}`, 'POST', { factory: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.materialList = data.materialList;
                    } else {
                        this.error_SHINHO(data.msg);
                    }
                });
            }
        },
        GetList(st) {
            if (st) {
                this.form.currPage = 1;
            }
            this.form.isSap = this.activeName;
            this.$http(`${FERMENTATION_API.ORDER_MODIFY_LIST_API}`, 'POST', this.form).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.isSapList.list;
                    this.form.currPage = data.isSapList.currPage;
                    this.form.pageSize = data.isSapList.pageSize;
                    this.form.totalCount = data.isSapList.totalCount;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        handleClick(value) {
            this.activeName = value.name;
            this.GetList(true);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        ModifyOrder() {
            if (this.multipleSelection.length === 0) {
                this.$warningTost('请先勾选数据');
                return false;
            }
            this.$http(`${FERMENTATION_API.ORDER_MODIFY_CHANGE_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                if (data.code === 0) {
                    if (data.dataType.error > 0) {
                        this.$error_SHINHO(data.dataType.error + '个失败，' + data.dataType.succ + '个成功');
                    } else {
                        this.$success_SHINHO('修改成功');
                    }
                    this.GetList(true);
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.form.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.form.currPage = val;
            this.GetList();
        }
    }
};
</script>
