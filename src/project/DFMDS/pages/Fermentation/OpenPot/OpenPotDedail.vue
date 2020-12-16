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
                        <el-row style="display: flex; margin-bottom: 10px;">
                            <label class="el-form-item__label" style="width: 100px; line-height: 32px;">备注：</label>
                            <div style="flex: 1;">
                                <p style="width: 100%; line-height: 32px;">
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
                                    <el-option v-for="(item, index) in workShop" :key="index" :label="item.split('&')[1]" :value="item.split('&')[0]" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="容器号：">
                                <el-select v-model="searchForm.holderId" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" clearable @change="getOpenPotList">
                                    <el-option v-for="(item, index) in potArr" :key="index" :label="item.split('&')[1]" :value="item.split('&')[0]" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="物料：">
                                <el-select v-model="searchForm.material" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" filterable clearable @change="getOpenPotList">
                                    <el-option v-for="(item, index) in material" :key="index" :label="item.split('&')[0] + ' ' + item.split('&')[1]" :value="item.split('&')[0]" />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table ref="multipleTable" :data="openPotList" height="400px" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark" @selection-change="handleSelectionChange" @row-dblclick="Dblckick">
                        <el-table-column type="selection" :selectable="checkboxT" width="50" />
                        <el-table-column type="index" label="序号" width="50px" />
                        <el-table-column label="状态" prop="openFlagName" min-width="50" :show-overflow-tooltip="true" />
                        <el-table-column label="车间" prop="workShopName" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="容器号" prop="holderName" min-width="80" :show-overflow-tooltip="true" />
                        <el-table-column label="使用说明" prop="explain" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-if="formHeader.openType === 'MANY'" v-model="scope.row.ferOpenFermentor.explain" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                            </template>
                        </el-table-column>
                        <el-table-column label="订单类型" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.ferOrder.orderType" :disabled="!(isRedact)" placeholder="请选择" size="small">
                                    <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                                </el-select>
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
                <el-button type="primary" size="small" :disabled="!(isRedact && mixSauceNo !== '')" style="float: right;" @click="addTable1()">
                    新增
                </el-button>
                <el-table :data="deployMaterial" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
                    <el-table-column label="添加物料" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.addMaterialCode" :disabled="!isRedact" size="small" placeholder="请选择" filterable clearable>
                                <el-option v-for="(item, index) in deployMaterialSelect" :key="index" :label="item.dictValue" :value="item.dictCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="计划添加数量" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.planAddAmount" size="small" :disabled="!isRedact" placeholder="手动输入" />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.unit" size="small" :disabled="!isRedact" placeholder="请选择" filterable clearable>
                                <el-option v-for="(item, index) in Unit" :key="index" :label="item.dictValue" :value="item.dictCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact" placeholder="手动输入" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="70">
                        <template slot-scope="scope">
                            <el-button :disabled="!(isRedact)" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="2">
                <el-button type="primary" size="small" :disabled="!(isRedact && mixSauceNo !== '')" style="float: right;" @click="addTable2()">
                    新增
                </el-button>
                <el-table :data="sauce" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
                    <el-table-column label="容器号" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.fermentorNo" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable @change="getOpenPotList">
                                <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="添加物料" prop="addMaterialCode" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.addMaterialCode" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable @change="getOpenPotList">
                                <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.unit" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable @change="getOpenPotList">
                                <el-option v-for="(item, index) in material" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="库存数量" prop="stockAmount" min-width="80" :show-overflow-tooltip="true" />
                    <el-table-column label="批次" prop="batch" min-width="80" :show-overflow-tooltip="true" />
                    <el-table-column label="计划添加数量" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.planAddAmount" :disabled="!isRedact" placeholder="手动输入" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!isRedact" placeholder="手动输入" size="small" />
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
        $refs: {
            multipleTable: HTMLFormElement;
        }

        isRedact = false
        formHeader: HeadObj = { openPotNo: '' }

        orderTypeList = []
        deployMaterialSelect = []
        Unit = []
        workShop: string[] = []
        material: string[] = []
        potArr: string[] = []

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

        openPotListSum: PotObj[] = []
        openPotList: PotObj[] = []
        multipleSelection: PotObj[] = []
        mixSauceNo = ''

        deployMaterial: ListObj[] = []
        sauce: ListObj[] = []

        mounted() {
            this.init()
        }

        // 初始化拿取表头数据和开罐列表
        init() {
            FER_API.FER_OPEN_POT_APPLY_DETAIL_API({
                id: this.$store.state.fer.openPotObj.id
            }).then(({ data }) => {
                this.formHeader = data.data
            })
            this.getSelect()
        }

        // 修改查询条件查询开罐列表
        getOpenPotList() {
            FER_API.FER_OPEN_POT_DETAIL_LIST_API(this.searchForm).then(({ data }) => {
                this.openPotList = data.data
            })
        }

        // 获取开罐列表组装下拉 调配物料下拉
        getSelect() {
            FER_API.FER_OPEN_POT_DETAIL_LIST_API(this.searchForm).then(({ data }) => {
                this.openPotListSum = data.data
                this.openPotList = this.openPotListSum.slice((this.searchForm.current - 1) * this.searchForm.size, (this.searchForm.current - 1) * this.searchForm.size + this.searchForm.size)
                this.searchForm.total = data.data.length

                const workShopArr: string[] = []
                const materialArr: string[] = []
                const potArrArr: string[] = []
                this.openPotList.forEach(item => {
                    item['workShop']? workShopArr.push(item['workShop'] + '&' + item['workShopName']) : ''// eslint-disable-line
                    item['ferOrder']['productMaterialCode']? materialArr.push(item['ferOrder']['productMaterialCode'] + '&' + item['ferOrder']['productMaterialName']) : ''// eslint-disable-line
                    item['holderId']? potArrArr.push(item['holderId'] + '&' + item['holderName']) : ''// eslint-disable-line
                })
                this.workShop = [...new Set(workShopArr)]
                this.material = [...new Set(materialArr)]
                this.potArr = [...new Set(potArrArr)]
            })
            COMMON_API.DICTQUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'FER_MIX_MAT_TYPE'
            }).then(({ data }) => {
                this.deployMaterialSelect = data.data
            })
            COMMON_API.DICTQUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'ORDER_TYPE'
            }).then(({ data }) => {
                this.orderTypeList = data.data
            })
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_UNIT'
            }).then(({ data }) => {
                this.Unit = data.data;
            });
        }

        // 开罐列表双击
        Dblckick(row) {
            if (!this.isRedact) {
                return
            }
            if (!this.multipleSelection.find(item => item.id === row.id)) {
                this.$refs.multipleTable.toggleRowSelection(row)
            }
            if (this.formHeader.openType === 'SINGLE') {
                if (row.ferOpenFermentor.mixSauceNo) {
                    this.mixSauceNo = row.ferOpenFermentor.mixSauceNo
                    this.getDeployMaterialList(row)
                    this.getSauceList(row)
                } else {
                    const hang = this.openPotListSum.findIndex(item => item.id === row.id)
                    row.ferOpenFermentor.mixSauceNo = this.formHeader.openPotNo + hang
                    this.mixSauceNo = row.ferOpenFermentor.mixSauceNo
                    this.deployMaterial = row.ferMaterialList = []
                    this.sauce = row.ferOverdueMaterialList = []
                }
            } else if (this.formHeader.openType === 'MANY') {
                this.mixSauceNo = this.formHeader.openPotNo + '01'
            }
        }

        // 获取调配物料接口
        getDeployMaterialList(row) {
            if (row.ferMaterialList.length) {
                this.deployMaterial = row.ferMaterialList
            } else {
                FER_API.FER_OPEN_POT_DETAIL_DEPLOY_LIST_API({
                    openPotNo: this.formHeader.openPotNo,
                    fermentorId: row.id
                }).then(({ data }) => {
                    this.deployMaterial = row.ferMaterialList = data.data
                })
            }
        }

        // 获取超期酱
        getSauceList(row) {
            if (row.ferOverdueMaterialList.length) {
                this.sauce = row.ferOverdueMaterialList
            } else {
                FER_API.FER_OPEN_POT_DETAIL_SAUCE_LIST_API({
                    openPotNo: this.formHeader.openPotNo,
                    fermentorId: row.id
                }).then(({ data }) => {
                    this.sauce = row.ferOverdueMaterialList = data.data
                })
            }
        }

        // 调配物料新增
        addTable1() {
            this.deployMaterial.push({
                id: '',
                mixSauceNo: this.mixSauceNo,
                openPotNo: this.formHeader.openPotNo
            })
        }

        // 超期酱新增
        addTable2() {
            this.sauce.push({
                id: '',
                mixSauceNo: this.mixSauceNo,
                openPotNo: this.formHeader.openPotNo
            })
        }

        // 删除
        del(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
            });
        }

        // 开罐列表复选框
        checkboxT() {
            if (!this.isRedact) {
                return 0;
            }
            return 1;
        }

        // 开罐列表选择数据
        handleSelectionChange(val) {
            if (val.length > this.multipleSelection.length) {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item);
                });
                this.Dblckick(val[val.length - 1])
            } else {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item);
                });
            }

        }

        saved() {
            const savedData: SavedDataObj = this.formHeader
            const openFermentorList: PotObj[] = []
            if (this.formHeader.openType === 'MANY') {
                this.multipleSelection.forEach(item => {
                    item.ferOpenFermentor.mixSauceNo = this.mixSauceNo
                    openFermentorList.push({
                        ferFermentor: item,
                        ferOpenFermentor: {},
                        ferMaterialList: item.ferMaterialList,
                        ferOverdueMaterialList: item.ferOverdueMaterialList,
                        fermentorId: item.id,
                        id: this.formHeader.ferOpenFermentorList?.find(it => it.fermentorId === item.id)?.id || '',
                        mixSauceNo: item.ferOpenFermentor.mixSauceNo
                    })
                })
            } else {
                this.multipleSelection.forEach(item => {
                    openFermentorList.push({
                        ferFermentor: item,
                        ferOpenFermentor: {},
                        ferMaterialList: item.ferMaterialList,
                        ferOverdueMaterialList: item.ferOverdueMaterialList,
                        fermentorId: item.id,
                        id: this.formHeader.ferOpenFermentorList?.find(it => it.fermentorId === item.id)?.id || '',
                        mixSauceNo: item.ferOpenFermentor.mixSauceNo
                    })
                })
            }
            savedData.openFermentorList = openFermentorList
            console.log(savedData);
            FER_API.FER_OPEN_POT_DETAIL_SAVE_API(savedData).then(() => {
                this.$successToast('保存成功')
            })
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.searchForm.size = val;
            this.openPotList = this.openPotListSum.slice((this.searchForm.current - 1) * this.searchForm.size, (this.searchForm.current - 1) * this.searchForm.size + this.searchForm.size)
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.searchForm.current = val;
            this.openPotList = this.openPotListSum.slice((this.searchForm.current - 1) * this.searchForm.size, (this.searchForm.current - 1) * this.searchForm.size + this.searchForm.size)
        }

    }
    interface SavedDataObj{
        openPotNo?: string;
        openFermentorList?: PotObj[];
    }
    interface HeadObj{
        openPotNo: string;
        openType?: string;
        ferOpenFermentorList?: PotObj[];
    }
    interface ListObj{
        id?: string;
        mixSauceNo?: string;
        openPotNo?: string;
    }
    interface Fobj{
        mixSauceNo?: string;
    }
    interface PotObj{
        id?: string;
        openPotNo?: string;
        fermentorId?: string;
        mixSauceNo?: string;
        ferFermentor?: PotObj;
        ferOpenFermentor: Fobj;
        ferMaterialList?: ListObj[];
        ferOverdueMaterialList?: ListObj[];
        materialRemoveIds?: string[];
    }
</script>

<style lang="scss" scoped>
.sole_row {
    float: right;
}
</style>
