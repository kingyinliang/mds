<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row>
                <el-col>
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
                                <el-option v-for="(item, index) in materialList" :key="index" :value="item.materialCode" :label="item.materialName + ' ' + item.materialCode" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.created" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 140px;" />
                        </el-form-item>
                        <el-form-item label="订单：" label-width="45px">
                            <el-input v-model="formHeader.pkgOrderNo" clearable placeholder="请选择" style="width: 140px;" />
                        </el-form-item>
                        <el-form-item style="float: right;">
                            <el-button v-if="isAuth('ste:pkgOrder:orderList')" type="primary" size="small" @click="GetList(true)">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!-- <el-col style=" float: right; width: 127px;">
                    <el-button v-if="isAuth('ste:pkgOrder:orderList')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                </el-col> -->
            </el-row>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" style=" overflow: hidden; border-radius: 15px;" @tab-click="handleClick">
            <el-tab-pane name="BL">
                <span slot="label" class="spanview">
                    <el-button>待调配</el-button>
                </span>
                <mds-card title="推荐列表" name="dataList" :pack-up="false">
                    <template slot="titleBtn">
                        <el-button type="primary" style="float: right;" size="small" @click="DoDeploy">
                            调配
                        </el-button>
                    </template>
                    <el-table :data="dataList" class="newTable" border header-row-class-name="tableHead" style="margin-top: 10px;">
                        <el-table-column label="订单号" prop="orderNo" min-width="120" />
                        <el-table-column label="物料" :show-overflow-tooltip="true" min-width="220">
                            <template slot-scope="scope">
                                {{ scope.row.materialName }} {{ scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单数量" prop="planOutput" min-width="80" />
                        <el-table-column label="订单单位" prop="outputUnit" min-width="80" />
                        <el-table-column label="订单开始日期" prop="productDate" min-width="160" />
                        <!-- <el-table-column label="订单结束日期"></el-table-column> -->
                        <el-table-column label="生产调度员" prop="dispatchMan" min-width="160" />
                        <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" min-width="160" />
                        <el-table-column label="操作" min-width="80">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" size="mini" @click="operationRow(scope.row, 'del')">
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </mds-card>
                <mds-card title="待调配报表" name="dataList" :pack-up="false">
                    <el-table :data="dataList1" :row-key="getRowKeys" class="newTable" border header-row-class-name="tableHead" style="margin-top: 10px;" @selection-change="handleSelectionChange">
                        <el-table-column label="订单号" prop="orderNo" min-width="120" />
                        <el-table-column label="物料" :show-overflow-tooltip="true" min-width="220">
                            <template slot-scope="scope">
                                {{ scope.row.materialName }} {{ scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单数量" prop="planOutput" min-width="80" />
                        <el-table-column label="订单单位" prop="outputUnit" min-width="80" />
                        <el-table-column label="订单开始日期" prop="productDate" min-width="160" />
                        <!-- <el-table-column label="订单结束日期"></el-table-column> -->
                        <el-table-column label="生产调度员" prop="dispatchMan" min-width="160" />
                        <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" min-width="160" />
                        <el-table-column label="操作" min-width="80">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" size="mini" @click="operationRow(scope.row, 'add')">
                                    选中
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        :current-page="formHeader.currPage"
                        :page-sizes="[10, 20, 50]"
                        :page-size="formHeader.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="formHeader.totalCount"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </mds-card>
            </el-tab-pane>
            <el-tab-pane name="LY">
                <span slot="label" class="spanview">
                    <el-button>待分配</el-button>
                </span>
                <mds-card title="推荐列表" name="dataList" :pack-up="false">
                    <template slot="titleBtn">
                        <el-button type="primary" style="float: right;" size="small" @click="DoDeploy">
                            分配
                        </el-button>
                    </template>
                    <el-table :data="dataList" class="newTable" border header-row-class-name="tableHead" style="margin-top: 10px;">
                        <el-table-column label="订单号" prop="orderNo" min-width="120" />
                        <el-table-column label="物料" :show-overflow-tooltip="true" min-width="220">
                            <template slot-scope="scope">
                                {{ scope.row.materialName }} {{ scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单数量" prop="planOutput" min-width="80" />
                        <el-table-column label="订单单位" prop="outputUnit" min-width="80" />
                        <el-table-column label="订单开始日期" prop="productDate" min-width="160" />
                        <!-- <el-table-column label="订单结束日期"></el-table-column> -->
                        <el-table-column label="生产调度员" prop="dispatchMan" min-width="160" />
                        <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" min-width="160" />
                        <el-table-column label="操作" min-width="80">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" size="mini" @click="operationRow(scope.row, 'del')">
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </mds-card>
                <mds-card title="待分配报表" name="dataList" :pack-up="false">
                    <template slot="titleBtn">
                        <el-button type="primary" size="small" style="float: right;" :disabled="!isRedact" @click="DoDeploy">
                            分配
                        </el-button>
                    </template>
                    <el-table :data="dataList1" border header-row-class-name="tableHead" class="newTable" style="margin-top: 10px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" :selectable="CheckBoxInit" />
                        <el-table-column label="订单号" prop="orderNo" min-width="120" />
                        <el-table-column label="物料" :show-overflow-tooltip="true" min-width="220">
                            <template slot-scope="scope">
                                {{ scope.row.materialName }} {{ scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单数量" prop="planOutput" min-width="80" />
                        <el-table-column label="订单单位" prop="outputUnit" min-width="80" />
                        <el-table-column label="订单开始日期" prop="productDate" min-width="160" />
                        <el-table-column label="生产调度员" prop="dispatchMan" min-width="90" />
                        <el-table-column label="订单备注" prop="remark" min-width="160" :show-overflow-tooltip="true" />
                        <el-table-column label="操作" min-width="80">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" size="mini" @click="operationRow(scope.row, 'add')">
                                    选中
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        :current-page="formHeader.currPage"
                        :page-sizes="[10, 20, 50]"
                        :page-size="formHeader.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="formHeader.totalCount"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </mds-card>
            </el-tab-pane>
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
            dataList1: [],
            checkList: [],
            checkList1: []
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
                    this.$errorToast(data.msg);
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
                        this.$errorToast(data.msg);
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
                    this.$errorToast(data.msg);
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
        // 查询
        GetList(st) {
            if (this.formHeader.factory === '') {
                this.$warningToast('请选择工厂');
                return false;
            }
            if (this.formHeader.workShop === '') {
                this.$warningToast('请选择车间');
                return false;
            }
            if (st) {
                this.formHeader.currPage = 1;
            }
            this.formHeader.excludeOrders = []
            this.formHeader.type = this.activeName;
            this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENTLIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (st) {
                        this.dataList = data.data.recommendList;
                    }
                    this.dataList1 = data.data.optionalList.list;
                    this.formHeader.totalCount = data.data.optionalList.totalCount;
                    // this.dataList = data.orderInfo.list.slice((this.formHeader.currPage - 1) * this.formHeader.pageSize, Number((this.formHeader.currPage - 1) * this.formHeader.pageSize) + Number(this.formHeader.pageSize))
                    // this.formHeader.totalCount = data.orderInfo.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 选中 移除
        operationRow(row, st) {
            if (st === 'add') {
                if (this.dataList.length && (row.materialCode !== this.dataList[0].materialCode || row.productDate !== this.dataList[0].productDate || row.workShop !== this.dataList[0].workShop)) {
                    this.$warningToast('请选择同一个物料、同一个生产日期、同一个车间下的订单');
                    return
                }
                this.dataList.push(row)
                this.dataList1 = this.dataList1.filter(it => it.orderNo !== row.orderNo)
            } else if (st === 'del') {
                this.dataList1.push(row)
                this.dataList = this.dataList.filter(it => it.orderNo !== row.orderNo)
            }
            const arr = this.dataList.map(it => {
                return it.orderNo
            })
            console.log(arr)
            this.formHeader.excludeOrders = arr
            this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENT_API}`, 'POST', this.formHeader).then(({ data }) => {
                console.log(data)
            })
        },
        // 调配
        DoDeploy() {
            if (this.dataList.length === 0) {
                this.$warningToast('无推荐列表');
                return
            }
            const checkList = this.dataList.map(it => it.orderNo)
            const planOutputTotal = this.dataList.reduce((prev, next) => prev + next.planOutput, 0)
            const materialCode = this.dataList[0].materialCode || ''
            const materialName = this.dataList[0].materialName || ''
            this.Sterilized = {
                factory: this.factory.find(item => item.deptId === this.formHeader.factory)['deptName'],
                workshop: this.workshop.find(item => item.deptId === this.formHeader.workShop)['deptName'],
                factoryId: this.formHeader.factory,
                workshopId: this.formHeader.workShop,
                orderNoList: checkList,
                orderNo: '',
                planOutputTotal: planOutputTotal,
                materialCode: materialCode,
                materialName: materialName,
                type: this.activeName,
                isRedact: true
            };
            this.mainTabs = this.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeployment');
            setTimeout(() => {
                this.$router.push({
                    name: `MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeployment`
                });
            }, 100);
            // if (this.multipleSelection.length === 0) {
            //     this.$warningToast('请勾选订单');
            // } else {
            //     const materialCode = this.multipleSelection[0].materialCode;
            //     const dispatchMan = this.multipleSelection[0].dispatchMan;
            //     for (const item of this.multipleSelection) {
            //         if (materialCode !== item.materialCode) {
            //             this.$warningToast('物料冲突，请重新选择订单！');
            //             return false;
            //         }
            //         if (this.multipleSelection.filter(subItem => subItem.orderNo.slice(0, 4) === this.multipleSelection[0].orderNo.slice(0, 4)).length !== this.multipleSelection.length) {
            //             this.$warningToast('请选择相同的订单类型的订单！');
            //             return false;
            //         }
            //         if (dispatchMan !== item.dispatchMan) {
            //             this.$warningToast('调度人员冲突，请重新选择订单！');
            //             return false;
            //         }
            //     }
            //     let planOutputTotal = 0;
            //     this.checkList.map(item => {
            //         planOutputTotal = planOutputTotal + this.dataList.find(items => item === items.orderNo)['planOutput'];
            //     });
            //     this.Sterilized = {
            //         factory: this.factory.find(item => item.deptId === this.formHeader.factory)['deptName'],
            //         workshop: this.workshop.find(item => item.deptId === this.formHeader.workShop)['deptName'],
            //         factoryId: this.formHeader.factory,
            //         workshopId: this.formHeader.workShop,
            //         orderNoList: this.checkList,
            //         orderNo: '',
            //         planOutputTotal: planOutputTotal,
            //         materialCode: materialCode,
            //         materialName: this.multipleSelection[0].materialName,
            //         type: this.activeName,
            //         isRedact: true
            //     };
            //     // console.log(this.Sterilized);
            //     this.mainTabs = this.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeployment');
            //     setTimeout(() => {
            //         this.$router.push({
            //             name: `MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeployment`
            //         });
            //     }, 100);
            // }
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
