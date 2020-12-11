<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            type="audit"
            :order-status-show="false"
            :head-show="false"
            :tabs="tabs"
        >
            <template slot="headerCard">
                <mds-card title="申请基本信息" :name="'head'">
                    <el-form :inline="true" :model="formHeader" size="small" class="dataEntry-head-base__form" label-width="100px">
                        <el-row>
                            <em style="padding-left: 40px;" />
                            <el-form-item required>
                                <el-radio v-model="formHeader.openType" disabled label="SINGLE">
                                    本罐单调
                                </el-radio>
                                <el-radio v-model="formHeader.openType" disabled label="MANY">
                                    换罐混调
                                </el-radio>
                            </el-form-item>
                        </el-row>
                        <el-form-item label="生产车间：">
                            <p>{{ formHeader.workShopName }}</p>
                        </el-form-item>
                        <el-form-item label="申请物料：">
                            <p>{{ formHeader.applyMaterialName + ' ' + formHeader.applyMaterialCode }}</p>
                        </el-form-item>
                        <el-form-item label="使用日期：">
                            <p>{{ formHeader.useDate }}</p>
                        </el-form-item>
                        <el-form-item label="申请数量：">
                            <p>{{ formHeader.applyAmount }}</p>
                        </el-form-item>
                        <el-form-item label="调酱容器：">
                            <p>{{ formHeader.mixPotName }}</p>
                        </el-form-item>
                        <el-form-item label="开罐单号：">
                            <p>{{ formHeader.openPotNo }}</p>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <p>{{ formHeader.statusName }}</p>
                        </el-form-item>
                        <el-form-item label="操作人：">
                            <p>{{ formHeader.changer }}</p>
                        </el-form-item>
                        <el-form-item label="操作时间：">
                            <p>{{ formHeader.changed }}</p>
                        </el-form-item>
                        <el-row style="display: flex;">
                            <label class="el-form-item__label" style="width: 100px;">备注：</label>
                            <div style="flex: 1;">
                                <p style="width: 100%;">
                                    {{ formHeader.remark }}
                                </p>
                            </div>
                        </el-row>
                    </el-form>
                    <div class="box-card-title clearfix">
                        <h3> <em class="title-icon" style="background: #487bff;" />开罐列表</h3>
                        <el-form :model="searchForm" size="small" :inline="true" label-position="left" label-width="70px" class="sole_row">
                            <el-form-item label="生产车间：">
                                <el-select v-model="searchForm.workShop" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" clearable @change="getOpenPotList">
                                    <el-option v-for="(item, index) in workShop" :key="index" :label="item.deptName" :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="容器号：">
                                <el-select v-model="searchForm.holderId" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" clearable @change="getOpenPotList">
                                    <el-option v-for="(item, index) in potArr" :key="index" :label="item.holderName" :value="item.holderNo" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="物料：">
                                <el-select v-model="searchForm.material" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" filterable clearable @change="getOpenPotList">
                                    <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table :data="openPotList" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" :selectable="checkboxT" width="50" />
                        <el-table-column type="index" label="序号" width="50px" />
                        <el-table-column label="状态" prop="openFlagName" min-width="50" :show-overflow-tooltip="true" />
                        <el-table-column label="车间" prop="workShopName" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="容器号" prop="holderName" min-width="80" :show-overflow-tooltip="true" />
                        <el-table-column label="使用说明" prop="explain" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferOpenFermentor.explain }}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单类型" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferOrder.orderType }}
                            </template>
                        </el-table-column>
                        <el-table-column label="发酵天数/天" prop="fermentDays" min-width="120" :show-overflow-tooltip="true" />
                        <el-table-column label="物料" prop="productMaterialName" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferOrder.productMaterialName + ' ' + scope.row.ferOrder.productMaterialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="熟酱状态" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferOrder.matureFlagName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="数量（KG）" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferOrder.amount }}
                            </template>
                        </el-table-column>
                        <el-table-column label="入库日期" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferInStorage.changed }}
                            </template>
                        </el-table-column>
                        <el-table-column label="批次" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferInStorage.inStorageBatch }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-pagination :current-page="searchForm.current" :page-sizes="[10, 20, 50]" :page-size="searchForm.size" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </el-row>
                </mds-card>
            </template>
            <template slot="1">
                <el-table :data="deployMaterial" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
                    <el-table-column label="添加物料" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.material" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" filterable clearable @change="getOpenPotList">
                                <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="计划添加数量" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.applyAmount" :disabled="!isRedact" placeholder="手动输入" style="width: 120px;" />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.material" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" filterable clearable @change="getOpenPotList">
                                <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.applyAmount" :disabled="!isRedact" placeholder="手动输入" style="width: 120px;" />
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="2">
                <el-table :data="sauce" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
                    <el-table-column label="添加物料" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.material" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" filterable clearable @change="getOpenPotList">
                                <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="计划添加数量" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.applyAmount" :disabled="!isRedact" placeholder="手动输入" style="width: 120px;" />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.material" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" filterable clearable @change="getOpenPotList">
                                <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.applyAmount" :disabled="!isRedact" placeholder="手动输入" style="width: 120px;" />
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="custom_btn">
                <el-button type="primary" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <el-button v-if="isRedact" type="primary" size="small" @click="saved()">
                    保存
                </el-button>
                <el-button v-if="isRedact" type="primary" size="small" @click="submit()">
                    推送
                </el-button>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';

    @Component
    export default class OpenPotDedail extends Vue {
        isRedact = false
        formHeader = {}

        searchForm = {
            workShop: '',
            material: '',
            holderId: '',
            current: 1,
            size: 10,
            total: 0
        }

        tabs = [
            {
                label: '调配物料'
            },
            {
                label: '超期酱'
            }
        ]

        workShop = []
        material = []
        potArr = []
        openPotList: PotObj[] = []
        multipleSelection: PotObj[] = []
        deployMaterial = []
        sauce = []

        mounted() {
            this.init()
        }

        init() {
            FER_API.FER_OPEN_POT_APPLY_DETAIL_API({
                id: this.$store.state.fer.openPotObj.id
            }).then(({ data }) => {
                this.formHeader = data.data
            })
            this.getOpenPotList()
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '发酵'
            }).then(({ data }) => {
                this.workShop = data.data
            })
            COMMON_API.SEARCH_MATERIAL_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                materialType: 'ZHAL'
            }).then(({ data }) => {
                this.material = data.data
            })
            COMMON_API.HOLDER_DROPDOWN_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: ['001', '028']
            }).then(({ data }) => {
                this.potArr = data.data || [];
            })
        }

        getOpenPotList() {
            FER_API.FER_OPEN_POT_DETAIL_LIST_API(this.searchForm).then(({ data }) => {
                this.openPotList = data.data
            })
        }

        getDeployMaterialList() {
            FER_API.FER_OPEN_POT_DETAIL_DEPLOY_LIST_API({
                openPotNo: ''
            }).then(({ data }) => {
                this.deployMaterial = data.data
            })
        }

        getSauceList() {
            FER_API.FER_OPEN_POT_DETAIL_SAUCE_LIST_API({
                openPotNo: ''
            }).then(({ data }) => {
                this.sauce = data.data
            })
        }

        checkboxT(row) {
            console.log(row);
            if (!this.isRedact) {
                return 0;
            }
            return 1;
        }

        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.searchForm.size = val;
            this.getOpenPotList();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.searchForm.current = val;
            this.getOpenPotList();
        }
    }
    interface PotObj{
        id?: string;
    }
</script>

<style lang="scss" scoped>
.sole_row {
    float: right;
}
</style>
