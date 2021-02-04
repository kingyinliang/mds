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
                            <el-select v-model="formHeader.mixPotId" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" clearable filterable @change="potChange">
                                <el-option v-for="(item, index) in mixSaucePotArr" :key="index" :label="item.holderName" :value="item.id" />
                            </el-select>
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
                                <el-select v-model="searchForm.holderId" filterable :disabled="!isRedact" placeholder="请选择" style="width: 120px;" clearable @change="getOpenPotList">
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
                    <el-table
                        ref="multipleTable"
                        :data="openPotList"
                        :header-cell-class-name="tableHeaderClass"
                        row-key="id"
                        header-row-class-name="tableHead"
                        class="newTable"
                        border
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        @row-dblclick="Dblckick"
                    >
                        <el-table-column type="selection" fixed :reserve-selection="true" :selectable="checkboxT" width="50" />
                        <el-table-column type="index" :index="index => index + 1 + (Number(searchForm.current) - 1) * (Number(searchForm.size))" label="序号" width="50px" />
                        <el-table-column label="状态" prop="openFlagName" min-width="80" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.openFlagName === '否'? '未开罐' : '已开罐' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="车间" prop="workShopName" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="容器号" prop="holderName" min-width="120" :show-overflow-tooltip="true" />
                        <el-table-column label="使用说明" prop="explain" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.description" :disabled="!isRedact || scope.row.mixSauceStatus === 'M' || scope.row.mixSauceStatus === 'S'" size="mini" style="width: 100%;" />
                            </template>
                        </el-table-column>
                        <el-table-column label="订单类型" prop="orderTypeName" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="发酵天数/天" prop="fermentDays" min-width="120" :show-overflow-tooltip="true" />
                        <el-table-column label="物料" prop="productMaterialName" min-width="180" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.productMaterialName + ' ' + scope.row.productMaterialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="熟酱状态" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.matureFlagName === '否'? '未成熟' : '已成熟' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="数量（KG）" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferOrder.amount }}
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="unit" min-width="50" :show-overflow-tooltip="true" />
                        <el-table-column label="入库日期" prop="inStorageDate" min-width="120" :show-overflow-tooltip="true" />
                        <el-table-column label="批次" prop="inStorageBatch" min-width="120" :show-overflow-tooltip="true" />
                        <el-table-column label="实验备注" prop="explain" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.experiment" :disabled="!isRedact || scope.row.mixSauceStatus === 'M' || scope.row.mixSauceStatus === 'S'" size="mini" style="width: 100%;" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="explain" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" :disabled="!isRedact || scope.row.mixSauceStatus === 'M' || scope.row.mixSauceStatus === 'S'" size="mini" style="width: 100%;" />
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
                <el-table :data="deployMaterial" :row-class-name="rowDelFlag" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
                    <el-table-column label="添加物料" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.addMaterialCode" :disabled="!isRedact" size="small" placeholder="请选择" filterable clearable style="width: 100%;" @change="getName(scope.row)">
                                <el-option v-for="(item, index) in deployMaterialSelect" :key="index" :label="item.dictValue" :value="item.dictCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="计划添加数量" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.planAddAmount" size="small" :disabled="!isRedact" placeholder="手动输入" style="width: 100%;" />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.unit" size="small" :disabled="!isRedact" placeholder="请选择" filterable clearable style="width: 100%;">
                                <el-option v-for="(item, index) in Unit" :key="index" :label="item.dictValue" :value="item.dictCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact" placeholder="手动输入" style="width: 100%;" />
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
                <el-table :data="sauce" :row-class-name="rowDelFlag" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
                    <el-table-column label="容器号" prop="openFlagName" min-width="150" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.fermentorNo" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable style="width: 100%;" @change="fermentorNoChange(scope.row)">
                                <el-option v-for="(item, index) in holderArr" :key="index" :label="item.holderName" :value="item.holderId" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="添加物料" prop="addMaterialCode" min-width="150" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.addMaterialCode" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable style="width: 100%;" @change="materialChange(scope.row)">
                                <el-option v-for="(item, index) in (holderArr.filter(it => it.holderId === scope.row.fermentorNo).length > 0 ? holderArr.filter(it => it.holderId === scope.row.fermentorNo)[0].ferInStorageList : [])" :key="index" :label="item.productMaterialName +' ' + item.productMaterialCode" :value="item.productMaterialCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.unit }}
                        </template>
                    </el-table-column>
                    <el-table-column label="库存数量" prop="stockAmount" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="批次" prop="batch" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="计划添加数量" prop="openFlagName" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.planAddAmount" :disabled="!isRedact" placeholder="手动输入" size="small" style="width: 100%;" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!isRedact" placeholder="手动输入" size="small" style="width: 100%;" />
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
            <template slot="custom_btn">
                <el-button type="primary" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <el-button v-if="isRedact" type="primary" size="small" @click="saved()">
                    保存
                </el-button>
                <el-button v-if="isRedact" type="primary" size="small" @click="push()">
                    推送
                </el-button>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    import _ from 'lodash';

    @Component
    export default class OpenPotDedail extends Vue {
        $refs: {
            multipleTable: HTMLFormElement;
        }

        isRedact = false
        noChange = false
        formHeader: HeadObj = { ferOpenFermentorList: [], openPotNo: '' }

        deployMaterialSelect: ListObj[] = []
        Unit = []
        workShop: string[] = []
        material: string[] = []
        potArr: string[] = []
        mixSaucePotArr = []

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
        orgOpenPotListSum: PotObj[] = []
        openPotList: PotObj[] = []
        multipleSelection: PotObj[] = []

        mixSauceNo = ''
        fermentorId = ''

        deployMaterial: ListObj[] = []
        sauce: ListObj[] = []
        orgDeployMaterial: ListObj[] = []
        orgSauce: ListObj[] = []
        holderArr: PotObj[] = []

        mounted() {
            this.init()
        }

        potChange() {
            const filterArr: (any) = this.mixSaucePotArr.filter(it => it['id'] === this.formHeader.mixPotId);// eslint-disable-line
            this.formHeader.mixPotNo = filterArr[0].holderNo
            this.formHeader.mixPotName = filterArr[0].holderName
        }

        // 过滤数据
        filterData(data) {
            let tmp = JSON.parse(JSON.stringify(data));
            tmp.sort((a, b) => {
                return (b['openFermentorId'] ? 1 : 0) - (a['openFermentorId'] ? 1 : 0)
            })
            if (this.searchForm.workShop) {
                tmp = tmp.filter(item => item.workShop === this.searchForm.workShop)
            }
            if (this.searchForm.holderId) {
                tmp = tmp.filter(item => item.holderId === this.searchForm.holderId)
            }
            if (this.searchForm.material) {
                tmp = tmp.filter(item => item.ferOrder.productMaterialCode === this.searchForm.material)
            }
            this.searchForm.total = tmp.length
            tmp = tmp.slice((this.searchForm.current - 1) * this.searchForm.size, (this.searchForm.current - 1) * this.searchForm.size + this.searchForm.size)

            console.log(this.openPotListSum);
            return tmp
        }

        // 反选中
        initMultiple() {
            setTimeout(() => {
                this.openPotListSum.forEach(row => {
                    if (row.openFermentorId) {
                        this.noChange = true
                        const item = this.openPotList.find(it => it.id === row.id)
                        this.$refs.multipleTable.toggleRowSelection(item, true)
                    }
                })
                this.noChange = false
            }, 500)
        }

        // 初始化拿取表头数据和开罐列表
        init() {
            this.isRedact = false
            this.multipleSelection = []
            this.$refs.multipleTable.clearSelection()
            this.deployMaterial = []
            this.sauce = []
            this.mixSauceNo = ''
            this.fermentorId = ''
            this.searchForm.current = 1
            FER_API.FER_OPEN_POT_APPLY_DETAIL_API({
                id: this.$store.state.fer.openPotObj.id
            }).then(({ data }) => {
                this.formHeader = data.data
            })
            this.getSelect()
        }

        // 修改查询条件查询开罐列表
        getOpenPotList() {
            this.searchForm.current = 1
            this.openPotList = this.filterData(this.openPotListSum)
            this.initMultiple()
        }

        // 获取开罐列表组装下拉 调配物料下拉
        getSelect() {
            FER_API.FER_OPEN_POT_DETAIL_LIST_API({
                openPotNo: this.$store.state.fer.openPotObj.openPotNo
            }).then(({ data }) => {
                this.openPotListSum = JSON.parse(JSON.stringify(data.data));
                this.orgOpenPotListSum = JSON.parse(JSON.stringify(data.data));
                this.openPotList = this.filterData(this.openPotListSum)
                this.searchForm.total = data.data.length
                this.initMultiple()

                const workShopArr: string[] = []
                const materialArr: string[] = []
                const potArrArr: string[] = []
                this.openPotListSum.forEach(item => {
                    item['workShop']? workShopArr.push(item['workShop'] + '&' + item['workShopName']) : ''// eslint-disable-line
                    item['ferOrder']['productMaterialCode']? materialArr.push(item['ferOrder']['productMaterialCode'] + '&' + item['ferOrder']['productMaterialName']) : ''// eslint-disable-line
                    item['holderId']? potArrArr.push(item['holderId'] + '&' + item['holderName']) : ''// eslint-disable-line
                })
                this.workShop = [...new Set(workShopArr)]
                this.material = [...new Set(materialArr)]
                this.potArr = [...new Set(potArrArr)]
            })
            COMMON_API.HOLDER_DROPDOWN_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: ['001', '028'],
                holderStatus: 'E'
            }).then(({ data }) => {
                this.mixSaucePotArr = data.data || [];
            })
            FER_API.FER_OPEN_POT_DETAIL_HOLDER_LIST_API({}).then(({ data }) => {
                this.holderArr = data.data
            })
            COMMON_API.DICTQUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'COMMON_MATERIAL_ALLO'
            }).then(({ data }) => {
                this.deployMaterialSelect = data.data
            })
            COMMON_API.DICTQUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
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
            } else if (this.formHeader.openType === 'SINGLE') {
                if (row.mixSauceNo) {
                    this.mixSauceNo = row.mixSauceNo
                    this.fermentorId = row.id
                    this.getDeployMaterialList(row)
                    this.getSauceList(row)
                } else {
                    const hang = this.openPotListSum.findIndex(item => item.id === row.id)
                    console.log(this.openPotListSum);
                    console.log(hang);
                    row.mixSauceNo = this.formHeader.openPotNo + hang
                    this.mixSauceNo = row.mixSauceNo
                    this.fermentorId = row.id
                    this.deployMaterial = row.ferMaterialList = []
                    this.sauce = row.ferOverdueMaterialList = []
                }
            } else if (this.formHeader.openType === 'MANY') {
                this.mixSauceNo = this.formHeader.openPotNo + '01'
                row.mixSauceNo = this.mixSauceNo
                this.getDeployMaterialList(row)
                this.getSauceList(row)
            }
        }

        // 获取调配物料接口
        getDeployMaterialList(row) {
            let params;
            if (this.formHeader.openType === 'MANY' && this.deployMaterial.length) {
                return
            } else if (this.formHeader.openType === 'MANY') {
                params = {
                    openPotNo: this.formHeader.openPotNo,
                    mixSauceNo: row.mixSauceNo
                }
            } else if (row.ferMaterialList?.length && this.formHeader.openType === 'SINGLE') {
                this.deployMaterial = row.ferMaterialList;
                return;
            } else if (this.formHeader.openType === 'SINGLE') {
                params = {
                    openPotNo: this.formHeader.openPotNo,
                    mixSauceNo: row.mixSauceNo
                }
            }
            FER_API.FER_OPEN_POT_DETAIL_DEPLOY_LIST_API(params).then(({ data }) => {
                if (this.formHeader.openType === 'MANY') {
                    this.deployMaterial = JSON.parse(JSON.stringify(data.data));
                    this.orgDeployMaterial = JSON.parse(JSON.stringify(data.data));
                } else {
                    this.deployMaterial = row.ferMaterialList = data.data
                    this.orgOpenPotListSum[this.orgOpenPotListSum.findIndex(it => it.id === row.id)].ferMaterialList = JSON.parse(JSON.stringify(data.data));
                }
            })
        }

        // 获取超期酱
        getSauceList(row) {
            let params;
            if (this.formHeader.openType === 'MANY' && this.sauce.length) {
                return
            } else if (this.formHeader.openType === 'MANY') {
                params = {
                    openPotNo: this.formHeader.openPotNo,
                    mixSauceNo: row.mixSauceNo
                }
            } else if (row.ferOverdueMaterialList?.length && this.formHeader.openType === 'SINGLE') {
                this.sauce = row.ferOverdueMaterialList;
                return;
            } else if (this.formHeader.openType === 'SINGLE') {
                params = {
                    openPotNo: this.formHeader.openPotNo,
                    mixSauceNo: row.mixSauceNo
                }
            }
            FER_API.FER_OPEN_POT_DETAIL_SAUCE_LIST_API(params).then(({ data }) => {
                if (this.formHeader.openType === 'MANY') {
                    this.sauce = JSON.parse(JSON.stringify(data.data));
                    this.orgSauce = JSON.parse(JSON.stringify(data.data));
                } else {
                    this.sauce = row.ferOverdueMaterialList = data.data
                    this.orgOpenPotListSum[this.orgOpenPotListSum.findIndex(it => it.id === row.id)].ferOverdueMaterialList = JSON.parse(JSON.stringify(data.data));
                }
            })
        }

        // 调配物料新增
        addTable1() {
            this.deployMaterial.push({
                id: '',
                remark: '',
                mixSauceNo: this.mixSauceNo,
                fermentorId: this.fermentorId,
                openPotNo: this.formHeader.openPotNo
            })
        }

        // 超期酱新增
        addTable2() {
            this.sauce.push({
                id: '',
                remark: '',
                mixSauceNo: this.mixSauceNo,
                fermentorId: this.fermentorId,
                openPotNo: this.formHeader.openPotNo
            })
        }

        getName(row) {
            const filterArr: (any) = this.deployMaterialSelect.filter(item => item.dictCode === row.addMaterialCode)// eslint-disable-line
            row.addMaterialName = filterArr[0].dictValue
        }

        // 超期酱修改容器号
        fermentorNoChange(row) {
            row.addMaterialCode = ''
            row.unit = ''
            row.stockAmount = ''
            row.batch = ''
        }

        materialChange(row) {
            const filterArr1: (any) = this.holderArr.filter(item => item.holderId === row.fermentorNo)// eslint-disable-line
            const filterArr: (any) = filterArr1[0].ferInStorageList.filter(item => item.productMaterialCode === row.addMaterialCode)// eslint-disable-line
            row.unit = filterArr[0].unit
            row.stockAmount = filterArr[0].currentStock
            row.batch = filterArr[0].inStorageBatch
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

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        // 开罐列表复选框
        checkboxT(row) {
            if (!this.isRedact) {
                return 0;
            }
            if (row.mixSauceStatus === 'M' || row.mixSauceStatus === 'S') {
                return 0;
            }
            return 1;
        }

        // 去掉全选
        tableHeaderClass(row) {
            if (row.columnIndex === 0) {
                return 'disableSelect'
            }
        }

        // 开罐列表选择数据
        handleSelectionChange(val) {
            if (val.length > this.multipleSelection.length) {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item);
                });
                if (!this.noChange) {
                    this.Dblckick(val[val.length - 1])
                }
            } else {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item);
                });
            }
            console.log(val);
        }

        dataEntry(data, orgData, delArr, insertArr) {
            data.forEach(item => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        delArr.push(item.id);
                    }
                } else if (item.id) {
                    const orgObj = orgData.filter(it => it.id === item.id)[0];
                    if (!_.isEqual(orgObj, item)) {
                        insertArr.push(item)
                    }
                } else {
                    insertArr.push(item)
                }
            })
        }

        setOpenFermentorList(openFermentorList, item) {
            openFermentorList.push({
                id: item.openFermentorId || '',
                mixSauceNo: item.mixSauceNo,
                cycle: item.cycle,
                fermentDays: item.fermentDays,
                description: item.description,
                experiment: item.experiment,
                fermentorId: item.id,
                remark: item.remark
            })
        }

        // 保存推送数据处理
        pushOrSaved() {
            const openFermentorRemoveIds: string[] = [] // 要删除的开罐物料id集合
            const materialRemoveIds: string[] = [] // 删除的物料id(物料调配、超期酱)
            const ferMaterialList = [] // 调调配物料
            const ferOverdueMaterialList = [] // 超期酱
            const openFermentorList: PotObj[] = [] // 开罐罐信息

            // 要删除的开罐物料id集合
            this.openPotListSum.forEach(item => {
                if (item.openFermentorId) {
                    if (!this.multipleSelection.find(it => it.openFermentorId === item.openFermentorId)) {
                        openFermentorRemoveIds.push(item.openFermentorId)
                    }
                }
            })

            if (this.formHeader.openType === 'MANY') {
                this.dataEntry(this.deployMaterial, this.orgDeployMaterial, materialRemoveIds, ferMaterialList)
                this.dataEntry(this.sauce, this.orgSauce, materialRemoveIds, ferOverdueMaterialList)
            }

            this.multipleSelection.forEach(item => {
                // 单罐单调(调配物料、超期酱)
                if (this.formHeader.openType !== 'MANY') {
                    if (item.ferMaterialList) {
                        const org1 = this.orgOpenPotListSum[this.orgOpenPotListSum.findIndex(it => it.id === item.id)].ferMaterialList || []
                        this.dataEntry(item.ferMaterialList, org1, materialRemoveIds, ferMaterialList)
                    }
                    if (item.ferOverdueMaterialList) {
                        const org2 = this.orgOpenPotListSum[this.orgOpenPotListSum.findIndex(it => it.id === item.id)].ferOverdueMaterialList || []
                        this.dataEntry(item.ferOverdueMaterialList, org2, materialRemoveIds, ferOverdueMaterialList)
                    }
                }
                // openFermentorList
                if (!item.openFermentorId) {
                    this.setOpenFermentorList(openFermentorList, item)
                } else if (this.formHeader.openType === 'MANY') {
                    // 多罐混调 比对
                    const orgObj = this.orgOpenPotListSum.filter(it => it.id === item.id)[0];
                    if (!_.isEqual(orgObj, item)) {
                        this.setOpenFermentorList(openFermentorList, item)
                    }
                } else if (this.formHeader.openType !== 'MANY') {
                    // 单罐 比对
                    const orgObj = this.orgOpenPotListSum.filter(it => it.id === item.id)[0];
                    if (orgObj.remark !== item.remark || orgObj.experiment !== item.experiment || orgObj.description !== item.description) {
                        this.setOpenFermentorList(openFermentorList, item)
                    }
                }
            })

            return {
                ...this.formHeader,
                applied: false,
                openFermentorRemoveIds,
                materialRemoveIds,
                ferMaterialList,
                ferOverdueMaterialList,
                openFermentorList
            }
            /**
             * {
             *     ferMaterialList: '调配物料',
             *     ferOverdueMaterialList: '超期酱',
             *     materialRemoveIds: '删除的物料id(物料调配、超期酱)',
             *     openFermentorRemoveIds: '要删除的开罐物料id集合(共用)',
             *     openFermentorList: '开罐罐信息以及开罐物料信息(共用)',
             * }
             * **/
        }

        // 保存
        saved() {
            const savedData = this.pushOrSaved()
            console.log(savedData);
            FER_API.FER_OPEN_POT_DETAIL_SAVE_API(savedData).then(() => {
                this.$successToast('保存成功')
                this.init()
            })
        }

        // 推送
        push() {
            const savedData = this.pushOrSaved()
            console.log(savedData);
            FER_API.FER_OPEN_POT_DETAIL_PUSH_API(savedData).then(() => {
                this.$successToast('推送成功')
                this.init()
            })
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.searchForm.size = val;
            this.openPotList = this.filterData(this.openPotListSum)
            this.initMultiple()
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.searchForm.current = val;
            this.openPotList = this.filterData(this.openPotListSum)
            this.initMultiple()
        }

    }
    interface SavedDataObj{
        openFermentorRemoveIds?: string[];
        materialRemoveIds?: string[];
        openPotNo?: string;
        openFermentorList?: PotObj[];
        ferMaterialList?: ListObj[];
        ferOverdueMaterialList?: ListObj[];
    }
    interface HeadObj{
        openPotNo: string;
        mixPotNo?: string;
        mixPotName?: string;
        mixPotId?: string;
        openType?: string;
        ferOpenFermentorList: PotObj[];
    }
    interface ListObj{
        id?: string;
        remark?: string;
        mixSauceNo?: string;
        dictCode?: string;
        fermentorId?: string;
        openPotNo?: string;
    }
    interface PotObj{
        id: string;
        cycle?: string;
        holderId?: string;
        openPotNo?: string;
        openMaterialId?: string;
        openFermentorId?: string;
        fermentorId?: string;
        description?: string;
        experiment?: string;
        remark?: string;
        mixSauceNo?: string;
        ferOpenMaterialSaveDto?: PotObj;
        ferMaterialList?: ListObj[];
        ferOverdueMaterialList?: ListObj[];
        materialRemoveIds?: string[];
    }
</script>

<style lang="scss" scoped>
.sole_row {
    float: right;
}
.el-table ::v-deep .disableSelect .cell .el-checkbox__inner {/* stylelint-disable-line */
    position: relative;
    display: none;
}
</style>
