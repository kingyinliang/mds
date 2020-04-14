<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row>
                <el-col style=" float: left; width: 1133px;">
                    <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="sole_row">
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
                        <el-form-item label="生产物料：">
                            <el-select v-model="formHeader.materialCode" palceholder="请选择" class="width150px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in materialList" :key="index" :value="item.materialCode" :label="item.materialCode + ' ' + item.materialName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.created" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 140px;" />
                        </el-form-item>
                        <el-form-item label="订单：" label-width="45px">
                            <el-input v-model="formHeader.pkgOrderNo" clearable placeholder="请选择" style="width: 140px;" />
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col style=" float: right; width: 127px;">
                    <el-button v-if="isAuth('ste:pkgOrder:orderList')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('ste:allocate:allocateOrderSave')" type="primary" size="small" @click="isRedact = !isRedact">
                        {{ isRedact === false? '编辑' : '取消' }}
                    </el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs secondcard" type="border-card" style=" overflow: hidden; border-radius: 15px;" @tab-click="handleClick">
            <el-tab-pane name="BL">
                <span slot="label" class="spanview">
                    <el-button>待调配</el-button>
                </span>
                <el-row>
                    <el-col style="text-align: right;">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="DoDeploy">
                            调配
                        </el-button>
                    </el-col>
                </el-row>
                <el-table :data="dataList" :row-key="getRowKeys" border header-row-class-name="tableHead" style="margin-top: 10px;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" :selectable="CheckBoxInit" />
                    <el-table-column label="订单号" prop="orderNo" width="120" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }} {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单数量" prop="planOutput" width="80" />
                    <el-table-column label="订单单位" prop="outputUnit" width="80" />
                    <el-table-column label="订单开始日期" prop="productDate" />
                    <!-- <el-table-column label="订单结束日期"></el-table-column> -->
                    <el-table-column label="生产调度员" prop="dispatchMan" />
                    <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="LY">
                <span slot="label" class="spanview">
                    <el-button>待分配</el-button>
                </span>
                <el-row>
                    <el-col style="text-align: right;">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="DoDeploy">
                            分配
                        </el-button>
                    </el-col>
                </el-row>
                <el-table :data="dataList" border header-row-class-name="tableHead" style="margin-top: 10px;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="35" :selectable="CheckBoxInit" />
                    <el-table-column label="订单号" prop="orderNo" width="120" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }} {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单数量" prop="planOutput" width="80" />
                    <el-table-column label="订单单位" prop="outputUnit" width="80" />
                    <el-table-column label="订单开始日期" prop="productDate" />
                    <el-table-column label="生产调度员" prop="dispatchMan" />
                    <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" />
                </el-table>
            </el-tab-pane>
            <el-pagination
                :current-page="formHeader.currPage"
                :page-sizes="[10, 20, 50]"
                :page-size="formHeader.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="formHeader.totalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-tabs>
    </div>
</template>

<script>
import { BASICDATA_API, STERILIZED_API } from '@/api/api';
export default {
    name: 'WatiDeploymentList',
    data() {
        return {
            activeName: 'BL',
            isRedact: false,
            formHeader: {
                factory: '',
                workShop: '',
                materialCode: '',
                created: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0,
                type: 'BL'
            },
            factory: [],
            workshop: [],
            materialList: [],
            multipleSelection: [],
            dataList: [],
            checkList: []
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
        },
        'formHeader.workShop'() {
            this.GetMaterialList();
        }
    },
    mounted() {
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
                    this.$errorTost(data.msg);
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
                        this.$errorTost(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 物料下拉
        GetMaterialList() {
            this.formHeader.materialCode = '';
            this.$http(`${STERILIZED_API.WAITDEPLOYMENTMATERIALISTAPI}`, 'POST', {
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.materialList = data.productsInfo;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        // 复选框初始状态
        CheckBoxInit() {
            if (this.isRedact === false) {
                return 0;
            }
                return 1;

        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.checkList = [];
            if (val) {
                val.forEach(row => {
                    if (row) {
                        this.checkList.push(row.orderNo);
                    }
                });
            }
        },
        GetList(st) {
            if (this.formHeader.factory === '') {
                this.$warningTost('请选择工厂');
                return false;
            }
            if (this.formHeader.workShop === '') {
                this.$warningTost('请选择车间');
                return false;
            }
            if (st) {
                this.formHeader.currPage = 1;
            }
            this.formHeader.type = this.activeName;
            this.$http(`${STERILIZED_API.WAITDEPLOYMENTLIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.orderInfo.list;
                    // this.dataList = data.orderInfo.list.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, Number((this.formHeader.currPage - 1) * this.formHeader.pageSize) + Number(this.formHeader.pageSize))
                    this.formHeader.totalCount = data.orderInfo.totalCount;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        // 调配
        DoDeploy() {
            if (this.multipleSelection.length === 0) {
                this.$warningTost('请勾选订单');
            } else {
                const materialCode = this.multipleSelection[0].materialCode;
                const dispatchMan = this.multipleSelection[0].dispatchMan;
                for (const item of this.multipleSelection) {
                    if (materialCode !== item.materialCode) {
                        this.$warningTost('物料冲突，请重新选择订单！');
                        return false;
                    }
                    if (this.multipleSelection.filter(subItem => subItem.orderNo.slice(0, 4) === this.multipleSelection[0].orderNo.slice(0, 4)).length !== this.multipleSelection.length) {
                        this.$warningTost('请选择相同的订单类型的订单！');
                        return false;
                    }
                    if (dispatchMan !== item.dispatchMan) {
                        this.$warningTost('调度人员冲突，请重新选择订单！');
                        return false;
                    }
                }
                let planOutputTotal = 0;
                this.checkList.map(item => {
                    planOutputTotal = planOutputTotal + this.dataList.find(items => item === items.orderNo)['planOutput'];
                });
                this.Sterilized = {
                    factory: this.factory.find(item => item.deptId === this.formHeader.factory)['deptName'],
                    workshop: this.workshop.find(item => item.deptId === this.formHeader.workShop)['deptName'],
                    factoryId: this.formHeader.factory,
                    workshopId: this.formHeader.workShop,
                    orderNoList: this.checkList,
                    orderNo: '',
                    planOutputTotal: planOutputTotal,
                    materialCode: materialCode,
                    materialName: this.multipleSelection[0].materialName,
                    type: this.activeName
                };
                // console.log(this.Sterilized);
                this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Sterilized-WaitDeploymentList-doDeployment');
                setTimeout(() => {
                    this.$router.push({
                        name: `DataEntry-Sterilized-WaitDeploymentList-doDeployment`
                    });
                }, 100);
            }
        },
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.GetList();
            // this.dataList = this.dataListAll.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, Number((this.formHeader.currPage - 1) * this.formHeader.pageSize) + Number(this.formHeader.pageSize))
        },
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.GetList();
            // this.dataList = this.dataListAll.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, Number((this.formHeader.currPage - 1) * this.formHeader.pageSize) + Number(this.formHeader.pageSize))
        },
        getRowKeys(row) {
            return row.orderNo;
        },
        handleClick(tab) {
            this.formHeader.type = tab.name;
            this.formHeader.currPage = 1;
            this.GetList(true);
        }
    }
};
</script>
