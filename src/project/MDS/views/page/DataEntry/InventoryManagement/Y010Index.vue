<template>
    <div class="header_main">
        <el-card class="queryHead">
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="auto" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="plantList.factoryIDValue" class="w300" placeholder="请选择" @change="changeSearch">
                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="库位：" @change="changeSearch">
                    <el-select v-model="plantList.location" class="w200" clearable placeholder="请选择" :disabled="plantList.factoryIDValue === ''">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in locationList" :key="sole" :label="sole" :value="sole" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button v-if="isAuth('alcohol:getAlcoholInfo')" type="primary" size="small" :disabled="(plantList.factoryIDValue === '')" @click="getList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row v-if="isMainAreaShow" :gutter="30" class="cardList">
            <el-col v-for="(item, index) in dataList" :key="index" :span="12">
                <el-card class="card-item">
                    <div slot="header" style="overflow: hidden; line-height: 31px;">
                        <span style="float: left;">{{ item.holderName }}</span>
                        <span class="card-item_detail" style="float: left; margin-left: 10px;" @click="goTargetDetail(item)">详情</span>
                        <el-button type="primary" size="small" :disabled="(plantList.factoryIDValue === '')" style="float: right;" @click="deptReceive(item)">
                            部门领用
                        </el-button>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div class="card-item-color-lump" style="background: #ffbf00;">
                                <span class="card-item-color-lump_icon iconfont factory-chuguan1" />
                                <div class="card-item-color-lump__img">
                                    <div class="card-item-color-lump__img__box">
                                        <div
                                            class="card-item-color-lump__img__box__bg"
                                            :style="{
                                                height: '90%',
                                            }"
                                        />
                                    </div>
                                    <img src="@/assets/img/ui2.0/pot.png" alt="">
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="card-item-color-lump">
                                <span class="card-item-color-lump_icon iconfont factory-zongliangguanli" />
                                <p class="card-item-color-lump_text">
                                    <span>{{ item.sumAmount }}</span>{{ item.unit }}
                                </p>
                                <p class="card-item-color-lump_text">
                                    库存总量
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="card-item-color-lump_text">
                        <p class="card-item-color-lump_text__title">
                            <em class="card-item-color-lump_text__icon" />
                            <span>库存明细</span>
                        </p>
                        <el-table :data="item.details" header-row-class-name="card-item-color-lump_text__table__head" class="card-item-color-lump_text__table" height="165">
                            <el-table-column width="auto">
                                <template slot="header">
                                    <em class="iconfont factory-pici" style="margin-right: 5px;" />物料
                                </template>
                                <template slot-scope="scope">
                                    {{ scope.row.materialName }} {{ scope.row.materialCode }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="batch" width="auto">
                                <template slot="header">
                                    <em class="iconfont factory-pici" style="margin-right: 5px;" />批次
                                </template>
                            </el-table-column>
                            <el-table-column prop="currentQuantity" width="auto" header-align="left">
                                <template slot="header">
                                    <em class="iconfont factory-shuliang" style=" margin-right: 5px; font-size: 18px;" />数量
                                </template>
                                <template slot-scope="scope">
                                    {{ scope.row.currentQuantity }} {{ scope.row.unit }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :close-on-click-modal="false" :visible.sync="isShowDeptReceive" width="900px" custom-class="dialog__class bg_dialog">
            <div slot="title" class="title">
                <span>部门领用</span>
            </div>
            <el-row>
                <el-col :span="12" style="line-height: 33px;">
                    物料： {{ receiveRow.materialName }} {{ receiveRow.materialCode }} 当前库存总量：{{ receiveRow.sumAmount }} {{ receiveRow.unit }}
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary" size="small" @click="addRecord">
                        新增
                    </el-button>
                </el-col>
            </el-row>
            <el-table header-row-class-name="" :data="receiveList" border tooltip-effect="dark" class="newTable" style="margin-top: 10px;">
                <el-table-column :show-overflow-tooltip="true" width="120">
                    <template slot="header">
                        <em class="reqI">*</em> 领用中心
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.productCode" value-key="productCode" placeholder="请选择" size="small" @change="changeCost($event, scope.row)">
                            <el-option v-for="(item, index) in costList" :key="index" :label="item.costCenterName + ' ' + item.costCenter" :value="item.costCenter" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" width="120">
                    <template slot="header">
                        <em class="reqI">*</em> 批次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.batch" value-key="productCode" placeholder="请选择" size="small" @change="changeBatch($event, scope.row)">
                            <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="库存量" :show-overflow-tooltip="true" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.currentQuantity }}
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" width="120">
                    <template slot="header">
                        <em class="reqI">*</em> 领用量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.useAmount" type="number" size="small" placeholder="手工录入" @input="changeProductWeight(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" width="120">
                    <template slot="header">
                        领用人
                    </template>
                    <template slot-scope="scope">
                        <div class="required" style="line-height: 32px;">
                            <span style="cursor: pointer;" @click="selectUser(scope.row)">
                                <em v-for="(item, index) in scope.row.useMan" :key="index">{{ item }}，</em>
                                <em>点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true">
                    <template slot="header">
                        用途
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.useRemark" type="number" size="small" placeholder="手工录入" @input="changeProductWeight(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" @click="delList(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="savedorSumbitData('saved')">
                    保存
                </el-button>
                <el-button type="primary" size="small" @click="savedorSumbitData('submit')">
                    提交
                </el-button>
            </div>
        </el-dialog>
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" :org-tree="OrgTree" :arr-list="arrList" @changeUser="changeUser" />
    </div>
</template>

<script>
import { BASICDATA_API, INVENTORY_API } from '@/api/api';
import LoanedPersonnel from '@/views/components/LoanedPersonnel';
export default {
    name: 'Y010Index',
    components: {
        LoanedPersonnel
    },
    data() {
        return {
            factoryList: [],
            locationList: ['7104'],
            plantList: {
                factoryIDValue: '',
                factoryName: '',
                location: '',
                workshopIDValue: '',
                workshopName: '',
                holderId: '',
                holderName: ''
            },
            dataList: [],
            oriAPIData: [],
            isShowDeptReceive: false,
            receiveRow: {
                materialName: '',
                materialCode: '',
                sumAmount: '',
                unit: ''
            },
            receiveList: [],
            costList: [],
            batchList: [],
            loanedPersonnelStatus: false,
            OrgTree: [],
            arrList: [],
            row: {}
        };
    },
    computed: {
        isMainAreaShow: function() {
            return this.dataList.length !== 0;
        },
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        }
    },
    mounted() {
        this.getFactory();
    },
    methods: {
        // 获取工厂
        getFactory() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(({ data }) => {
                this.factoryList = data.typeList;
                this.plantList.factoryIDValue = this.factoryList[0]['deptId'];
            });
        },
        // 获取列表
        getList() {
            this.dataList = [];
            if (!this.plantList.factoryIDValue) {
                this.$warningToast('请选择工厂');
                return;
            }
            this.$http(`${INVENTORY_API.Y010_LIST_API}`, `POST`, {
                factory: this.plantList.factoryIDValue,
                location: this.plantList.location
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.getTree(this.plantList.factoryIDValue);
                    if (data.info.length !== 0) {
                        this.dataList = data.info;
                        this.receiveList = [];
                    } else {
                        this.$infoToast('暂无数据');
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 部门领用
        deptReceive(item) {
            this.receiveRow = item;
            this.getCostCenterList();
            this.getBatchList();
            this.isShowDeptReceive = true;
        },
        // 新增
        addRecord() {
            this.receiveList.push({
                factory: this.receiveRow['factory'],
                location: this.receiveRow['location'],
                holderId: this.receiveRow['holderId'],
                unit: this.receiveRow['unit'],
                materialCode: this.receiveRow['materialCode'],
                materialName: this.receiveRow['materialName'],
                costCenter: '',
                costCenterName: '',
                deptId: '',
                deptName: '',
                batch: '',
                useAmount: '',
                useMan: [],
                useRemark: '',
                currentQuantity: ''
            })
        },
        // 领用中心
        getCostCenterList() {
            this.$http(`${INVENTORY_API.Y010_LIST_COSTCENTER_LIST_API}`, `POST`, {}, false, false, false).then(({ data }) => {
                this.costList = data.info;

            });
        },
        // 批次
        getBatchList() {
            this.$http(`${INVENTORY_API.Y010_LIST_BATCH_LIST_API}`, `POST`, {}, false, false, false).then(({ data }) => {
                this.batchList = data.info;
            });
        },
        changeCost(val, row) {
            const costSole = this.costList.find(item => (item.costCenter === val));
            row['costCenterName'] = costSole['costCenterName'];
            row['costCenter'] = costSole['costCenter'];
            row['deptId'] = costSole['deptId'];
            row['deptName'] = costSole['deptName'];
        },
        changeBatch(val, row) {
            const batchSole = this.batchList.find(item => (item.batch === val));
            row['currentQuantity'] = batchSole['currentQuantity'];
        },
        // 获取组织结构树
        getTree(factory) {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', { flag: factory }, false, false, false).then(({ data }) => {
                // this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({data}) => {
                if (data.code === 0) {
                    this.OrgTree = data.deptList;
                    this.arrList = [this.OrgTree[0].children[0].deptId];
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 选择人员 正式借调
        selectUser(row) {
            this.row = row;
            this.loanedPersonnelStatus = true;
            this.$nextTick(() => {
                this.$refs.loanedPersonnel.init(row.useMan);
            });
        },
        // 员工确认
        changeUser(userId) {
            this.row.useMan = userId;
            if (this.att) {
                this.SetAtt();
            }
            this.loanedPersonnelStatus = false;
        },
        // 删除
        delList(item) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.receiveList.splice(this.receiveList.indexOf(item), 1);
            });
        },
        savedorSumbitData(state) {
            if (this.receiveList.length === 0) {
                this.$infoToast('请录入数据');
                return false;
            }
            let url = '';
            for (const item of this.receiveList) {
                if (!item.productCode || !item.batch || !item.useAmount) {
                    this.$infoToast('请填写必填项');
                    return false;
                }
            }
            if (state === 'saved') {
                url = INVENTORY_API.Y010_SAVE_API;
            } else {
                url = INVENTORY_API.Y010_SUBMIT_API;
            }
            this.$http(`${url}`, 'POST', this.receiveList).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getList(true);
                } else {
                    this.$errorToast(data.msg);
                }
                this.isShowDeptReceive = false;
            });
        },
        changeSearch() {
            this.dataList = [];
            this.receiveList = [];
        },
        // 去详请
        goTargetDetail(item) {
            this.$store.state.common.YO10Inventory = {
                factoryId: this.plantList.factoryIDValue,
                holderName: item.holderName,
                unit: item.unit,
                holderId: item.holderId,
                location: item.location,
                factoryName: item.factoryName,
                workShopName: item.workShopName,
                materialCode: item.materialCode,
                materialName: item.materialName,
                sumAmount: item.sumAmount
            }
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'MDS-views-page-DataEntry-InventoryManagement-Y010Detail');
            setTimeout(() => {
                this.$router.push({
                    name: 'MDS-views-page-DataEntry-InventoryManagement-Y010Detail'
                });
            }, 100);
        }
    }
};
</script>

<style lang="scss"></style>
