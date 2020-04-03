<template>
    <div class="header_main">
        <el-card class="searchCard searchCards">
            <el-row>
                <el-col>
                    <el-form :model="formHeader" :inline="true" size="small" labelWidth="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="formHeader.factory" placeholder="请选择" class="width150px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.workShop" palceholder="请选择" class="width150px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="罐号：">
                            <el-select v-model="formHeader.holderId" palceholder="请选择" class="width150px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in holderList" :key="index" :value="item.holderId" :label="item.holderName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="日期：">
                            <el-date-picker v-model="formHeader.allocateDate" type="date" format="yyyy-MM-dd" valueFormat="yyyy-MM-dd" placeholder="请选择" style="width: 140px;" />
                        </el-form-item>
                        <el-form-item label="单号：">
                            <el-input v-model="formHeader.orderNo" style="width: 150px;" />
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-select v-model="formHeader.status" palceholder="请选择" class="width150px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in statusList" :key="index" :value="item" :label="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单号：">
                            <el-input v-model="formHeader.orderId" style="width: 150px;" />
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('ste:allocate:allocateListTp')" type="primary" size="small" @click="GetList(true)">
                                查询
                            </el-button>
                            <el-button v-if="isAuth('ste:allocate:allocateCreateTp')" type="primary" size="small" @click="CreateOrder()">
                                生成
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div class="toggleSearchBottom">
                <i class="el-icon-caret-top" />
            </div>
        </el-card>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs secondcard" type="border-card" style=" overflow: hidden; border-radius: 15px;" @tab-click="handleClick">
            <el-tab-pane name="BL">
                <span slot="label" class="spanview">
                    <el-button>调配列表</el-button>
                </span>
                <el-table :data="dataList" border headerRowClassName="tableHead" style="margin-top: 10px;" @row-dblclick="GetInfo" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" :selectable="CheckBoxInit" fixed="left" />
                    <el-table-column label="状态" prop="status" width="95" />
                    <el-table-column label="调配单号" prop="orderNo" width="130" />
                    <el-table-column label="生产车间" prop="workShopName" width="100" />
                    <el-table-column label="调配单日期" prop="allocateDate" width="110" />
                    <el-table-column label="杀菌物料" width="190" :showOverflowTooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}{{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="计划BL原汁总量" prop="planAmount" />
                    <el-table-column label="BL原汁总量" prop="blAmount" />
                    <el-table-column label="单位" prop="unit" width="50" />
                    <el-table-column label="调配罐号" width="130" prop="holderName" :showOverflowTooltip="true" />
                    <el-table-column label="调配日期" width="110" prop="allocateTime" />
                    <el-table-column label="备注" prop="remark" width="100" :showOverflowTooltip="true" />
                    <el-table-column label="创建人员" prop="creator" width="150" />
                    <el-table-column label="创建时间" prop="created" width="170" />
                    <el-table-column label="调配人员" prop="changer" width="150" />
                    <el-table-column label="调配时间" prop="changed" width="170" />
                    <el-table-column width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="GoInfo(scope.row)">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="LY">
                <span slot="label" class="spanview">
                    <el-button>分配列表</el-button>
                </span>
                <el-table :data="dataList" border headerRowClassName="tableHead" style="margin-top: 10px;" @row-dblclick="GetInfo" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" :selectable="CheckBoxInit" fixed="left" />
                    <el-table-column label="分配单号" prop="orderNo" width="130" />
                    <el-table-column label="生产车间" prop="workShopName" width="100" />
                    <el-table-column label="分配单日期" prop="allocateDate" width="110" />
                    <el-table-column label="杀菌物料" width="190" :showOverflowTooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}{{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="原汁总量" prop="planAmount" />
                    <el-table-column label="单位" prop="unit" width="50" />
                    <el-table-column label="分配日期" width="110" prop="allocateTime" />
                    <el-table-column label="备注" prop="remark" width="100" :showOverflowTooltip="true" />
                    <el-table-column label="创建人员" prop="creator" width="150" />
                    <el-table-column label="创建时间" prop="created" width="170" />
                    <el-table-column label="分配人员" prop="changer" width="150" />
                    <el-table-column label="分配时间" prop="changed" width="170" />
                    <el-table-column width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="GoInfo(scope.row)">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-pagination :currentPage="pages.currPage" :pageSizes="[10, 20, 50]" :pageSize="pages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pages.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-tabs>
        <div class="secondcard" style="padding-top: 0;">
            <div class="tableCard">
                <div class="toggleSearchTop" style=" position: relative; margin-bottom: 8px; background-color: white; border-radius: 5px;">
                    <i class="el-icon-caret-bottom" />
                </div>
            </div>
            <el-card>
                <el-row>
                    <el-col style="font-weight: 600;">
                        调配订单信息
                    </el-col>
                </el-row>
                <el-table :data="orderInfoList" border headerRowClassName="tableHead" style="margin-top: 10px;">
                    <el-table-column label="订单号" prop="orderNo" width="120" />
                    <el-table-column label="物料" :showOverflowTooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单数量" prop="planOutput" width="80" />
                    <el-table-column label="订单单位" prop="outputUnit" width="80" />
                    <el-table-column label="订单开始日期" prop="productDate" />
                    <el-table-column label="订单结束日期" />
                    <el-table-column label="生产调度员" prop="dispatchMan" />
                    <el-table-column label="订单备注" prop="remark" :showOverflowTooltip="true" />
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script>
import { headanimation } from '@/net/validate';
import { BASICDATA_API, STERILIZED_API } from '@/api/api';
export default {
    name: 'WatiDeploymentList',
    data() {
        return {
            activeName: 'BL',
            formHeader: {
                factory: '',
                workShop: '',
                holderId: '',
                orderId: '',
                orderNo: '',
                type: 'BL'
            },
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            factory: [],
            workshop: [],
            holderList: [],
            dataListAll: [],
            dataList: [],
            multipleSelection: [],
            orderInfoList: [],
            statusList: ['已保存', '已生成', '已调配', '已提交', '审核通过', '审核不通过']
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        },
        Sterilized: {
            get() {
                return this.$store.state.common.Sterilized;
            },
            set(val) {
                this.$store.commit('common/updateSterilized', val);
            }
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.Getdeptbyid(n);
            this.GetHolderList(n);
        }
    },
    mounted() {
        headanimation(this.$);
        this.Getdeptcode();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.workshop = [];
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.formHeader.workShop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id,
                    deptName: '杀菌'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length > 0) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        } else {
                            this.formHeader.workShop = '';
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 获取罐
        GetHolderList(id) {
            this.$http(`${STERILIZED_API.JUICEDEPLOYMENTHOLDER}`, 'POST', {
                factory: id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.holderList = data.holderList;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        GetList() {
            if (this.formHeader.factory === '') {
                this.$warningTost('请选择工厂');
                return false;
            }
            this.$http(`${STERILIZED_API.JUICEDEPLOYMENTLISTTP}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.dataListAll = data.orderInfo;
                    this.pages.currPage = 1;
                    this.dataList = this.GetPagesList();
                    this.pages.totalCount = this.dataListAll.length;
                    this.orderInfoList = [];
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 复选框初始状态
        CheckBoxInit(row) {
            if (row.status === '已保存') {
                return 1;
            }
                return 0;

        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.pages.pageSize = val;
            this.dataList = this.GetPagesList();
        },
        handleCurrentChange(val) {
            this.pages.currPage = val;
            this.dataList = this.GetPagesList();
        },
        GetPagesList() {
            return this.dataListAll.slice((this.pages.currPage - 1) * this.pages.pageSize, Number((this.pages.currPage - 1) * this.pages.pageSize) + Number(this.pages.pageSize));
        },
        GetInfo(row) {
            this.$http(`${STERILIZED_API.DODEPLOYMENTALLOCATELIST}`, 'POST', {
                orderNo: row.id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.orderInfoList = data.allocateInfo.orderInfo;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        GoInfo(row) {
            this.Sterilized = {
                orderNoList: [],
                orderNo: row.id,
                type: this.formHeader.type
            };
            this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Sterilized-WaitDeploymentList-doDeployment');
            setTimeout(() => {
                this.$router.push({
                    name: `DataEntry-Sterilized-WaitDeploymentList-doDeployment`
                });
            }, 100);
        },
        CreateOrder() {
            if (this.multipleSelection.length === 0) {
                this.$warningTost('请勾选数据');
                return false;
            }
            this.$confirm('确认生成调配单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${STERILIZED_API.JUICEDEPLOYMENTCREATETP}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '生成成功',
                            type: 'success'
                        });
                        this.GetList();
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            });
        },
        handleClick(tab) {
            this.formHeader.type = tab.name;
            this.GetList(true);
            // this.formHeader.currPage = 1
            // this.GetList(true)
        }
    }
};
</script>
