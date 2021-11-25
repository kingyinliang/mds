<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi_row">
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
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('ste:pkgOrder:orderList')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="推荐列表" name="dataList" :pack-up="false">
            <template slot="titleBtn">
                <el-button type="primary" style="float: right;" size="small" @click="DoDeploy">
                    备料
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
        <mds-card title="待备料报表" name="dataList" :pack-up="false">
            <el-table :data="dataList1" :row-key="getRowKeys" class="newTable" border header-row-class-name="tableHead" style="margin-top: 10px;">
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
    </div>
</template>

<script>
import { BASICDATA_API, STERILIZED_API } from '@/api/api';
export default {
    name: 'WatiDeploymentList',
    data() {
        return {
            formHeader: {
                factory: '',
                workShop: '',
                materialCode: '',
                created: '',
                pkgOrderNo: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            factory: [],
            workshop: [],
            materialList: [],
            dataList: [],
            dataList1: []
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
            this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENTLIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (st) {
                        this.dataList = data.data.recommendList;
                    }
                    this.dataList1 = data.data.optionalList.list;
                    this.formHeader.totalCount = data.data.optionalList.totalCount;
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
                ID: '',
                STATUS: '',
                FACTORY: this.formHeader.factory,
                FACTORYNAME: this.factory.find(item => item.deptId === this.formHeader.factory)['deptName'],
                WORK_SHOP: this.formHeader.workShop,
                WORK_SHOPNAME: this.workshop.find(item => item.deptId === this.formHeader.workShop)['deptName'],
                MATERIAL_NAME: materialName,
                MATERIAL_CODE: materialCode,
                orderNoList: checkList,
                planOutputTotal: planOutputTotal
            };
            this.mainTabs = this.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeployment');
            setTimeout(() => {
                this.$router.push({
                    name: `MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeployment`
                });
            }, 100);
        },
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.GetList();
        },
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.GetList();
        },
        getRowKeys(row) {
            return row.orderNo;
        }
    }
};
</script>
