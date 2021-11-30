<template>
    <div class="header_main">
        <el-card class="searchCard searchCards">
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
                <el-form-item label="日期：">
                    <el-date-picker v-model="formHeader.allocateDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 150px;" />
                </el-form-item>
                <el-form-item label="单号：">
                    <el-input v-model="formHeader.allocateNo" style="width: 150px;" />
                </el-form-item>
                <el-form-item label="杀菌订单：">
                    <el-input v-model="formHeader.orderNo" style="width: 150px;" />
                </el-form-item>
                <el-form-item label="备料状态：">
                    <el-select v-model="formHeader.prepStatus" palceholder="请选择" class="width150px">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option label="待备料" value="PENDING" />
                        <el-option label="已保存" value="SAVED" />
                        <el-option label="已备料" value="PREPARED" />
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
                <el-form-item label="生成日期：">
                    <el-date-picker v-model="formHeader.productDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择" style="width: 150px;" />
                </el-form-item>
                <el-button type="primary" size="small" style="float: right;" @click="()=>{ pageTable1.currPage = 1; pageTable2.currPage = 1; GetList()}">
                    查询
                </el-button>
            </el-form>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" style="margin-top: 10px;">
            <el-tab-pane label="待备料" name="PENDING">
                <el-table :data="pendingList" border class="newTable" header-row-class-name="tableHead" style="margin-top: 10px;">
                    <el-table-column label="备料状态" prop="prepStatusName" :show-overflow-tooltip="true" width="80" />
                    <el-table-column label="单号" prop="orderNo" :show-overflow-tooltip="true" width="135" />
                    <el-table-column label="生产车间" prop="deptName" :show-overflow-tooltip="true" width="110" />
                    <el-table-column label="日期" prop="allocateDate" :show-overflow-tooltip="true" width="120" />
                    <el-table-column label="生产日期" prop="productDate" :show-overflow-tooltip="true" width="120" />
                    <el-table-column label="杀菌物料" :show-overflow-tooltip="true" min-width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}
                            {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建人员" prop="creator" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column label="创建时间" prop="created" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column label="操作人员" prop="changer" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column label="操作时间" prop="changed" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column width="50" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="GoInfo(scope.row)">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :current-page="pageTable1.currPage" :page-sizes="[10, 20, 50]" :page-size="pageTable1.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTable1.totalCount" @size-change="val => { pageTable1.pageSize = val; GetList()}" @current-change="val => { pageTable1.currPage = val; GetList()}" />
            </el-tab-pane>
            <el-tab-pane label="已备料" name="PREPARED">
                <el-table :data="preparedList" border class="newTable" header-row-class-name="tableHead" style="margin-top: 10px;">
                    <el-table-column label="备料状态" prop="prepStatusName" :show-overflow-tooltip="true" width="80" />
                    <el-table-column label="单号" prop="orderNo" :show-overflow-tooltip="true" width="135" />
                    <el-table-column label="生产车间" prop="deptName" :show-overflow-tooltip="true" width="110" />
                    <el-table-column label="日期" prop="allocateDate" :show-overflow-tooltip="true" width="120" />
                    <el-table-column label="生产日期" prop="productDate" :show-overflow-tooltip="true" width="120" />
                    <el-table-column label="杀菌物料" :show-overflow-tooltip="true" min-width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}
                            {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建人员" prop="creator" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column label="创建时间" prop="created" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column label="操作人员" prop="changer" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column label="操作时间" prop="changed" :show-overflow-tooltip="true" min-width="120" />
                    <el-table-column width="50" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="GoInfo(scope.row)">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :current-page="pageTable2.currPage" :page-sizes="[10, 20, 50]" :page-size="pageTable2.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTable2.totalCount" @size-change="val => { pageTable2.pageSize = val; GetList()}" @current-change="val => { pageTable2.currPage = val; GetList()}" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { BASICDATA_API, STERILIZED_API } from '@/api/api';
export default {
    name: 'Accessories',
    data() {
        return {
            activeName: 'PENDING',
            formHeader: {
                factory: '',
                workShop: '',
                allocateDate: '',
                allocateNo: '',
                orderNo: '',
                prepStatus: '',
                materialCode: '',
                productDate: ''
            },
            pageTable1: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            pageTable2: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            pendingList: [],
            preparedList: [],
            factoryName: '',
            factory: [],
            workshop: [],
            materialList: []
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
        GetList() {
            this.factoryName = this.factory.find(it => it.deptId === this.formHeader.factory).deptName
            this.$http(`${STERILIZED_API.PENDING_LIST}`, 'POST', { ...this.formHeader, ...this.pageTable1 }).then(({ data }) => {
                if (data.code === 0) {
                    this.pendingList = data.data.list
                    this.pageTable1.currPage = data.data.currPage
                    this.pageTable1.pageSize = data.data.pageSize
                    this.pageTable1.totalCount = data.data.totalCount
                } else {
                    this.$errorToast(data.msg);
                }
            })
            this.$http(`${STERILIZED_API.PREPARED_LIST}`, 'POST', { ...this.formHeader, ...this.pageTable2 }).then(({ data }) => {
                if (data.code === 0) {
                    this.preparedList = data.data.list
                    this.pageTable2.currPage = data.data.currPage
                    this.pageTable2.pageSize = data.data.pageSize
                    this.pageTable2.totalCount = data.data.totalCount
                } else {
                    this.$errorToast(data.msg);
                }
            })
        },
        // 去详情
        GoInfo(row) {
            this.$store.commit('common/updateAccessories', { factoryName: this.factoryName, ...row });
            this.$store.state.common.mainTabs = this.$store.state.common.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-Sterilized-accessories-detail');
            setTimeout(() => {
                this.$router.push({
                    name: `MDS-views-page-DataEntry-Sterilized-accessories-detail`
                });
            }, 100);
        }
    }
};
</script>

<style scoped>

</style>
