<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            type="audit"
            :order-status-show="false"
            :head-show="false"
        >
            <template slot="headerCard">
                <mds-card title="申请基本信息" :name="'head'">
                    <el-form :inline="true" :model="formHeader" size="small" class="dataEntry-head-base__form" label-width="100px">
                        <el-row>
                            <em style="padding-left: 30px;" />
                            <span style="color: #f56c71; font-size: 12px; line-height: 32px;">*</span>
                            <em style="padding-left: 10px;" />
                            <el-form-item required>
                                <el-radio v-model="formHeader.openType" :disabled="!isRedact" label="SINGLE">
                                    本罐单调
                                </el-radio>
                                <el-radio v-model="formHeader.openType" :disabled="!isRedact" label="MANY">
                                    换罐混调
                                </el-radio>
                            </el-form-item>
                        </el-row>
                        <el-form-item label="生产车间：" required>
                            <el-select v-model="formHeader.workShop" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" clearable>
                                <el-option v-for="(item, index) in workShop" :key="index" :label="item.deptName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请物料：" required>
                            <el-tooltip class="item" effect="dark" :content="(formHeader.applyMaterialName || '') + ' ' + (formHeader.applyMaterialCode || '')" placement="top">
                                <el-select v-model="formHeader.applyMaterialCode" :disabled="!isRedact" filterable placeholder="请选择" style="width: 120px;" clearable @change="materialChange">
                                    <el-option v-for="(item, index) in material" :key="index" :label="item.useMaterialName+' ' + item.useMaterialCode" :value="item.useMaterialCode" />
                                </el-select>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="使用日期：" required>
                            <el-date-picker v-model="formHeader.useDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" size="small" :disabled="!isRedact" style="width: 120px;" />
                        </el-form-item>
                        <el-form-item label="申请数量：" required>
                            <el-input v-model="formHeader.applyAmount" :disabled="!isRedact" placeholder="手动输入" style="width: 120px;" />
                        </el-form-item>
                        <el-form-item label="调酱容器：">
                            <el-tooltip class="item" effect="dark" content="此字段为换罐混调时使用" placement="top">
                                <el-select v-model="formHeader.mixPotId" :disabled="!isRedact" placeholder="请选择" style="width: 120px;" clearable filterable @change="potChange">
                                    <el-option v-for="(item, index) in potArr" :key="index" :label="item.holderName" :value="item.id" />
                                </el-select>
                            </el-tooltip>
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
                                <el-input v-model="formHeader.remark" :disabled="!isRedact" placeholder="手动输入" style="width: 100%;" />
                            </div>
                        </el-row>
                    </el-form>
                </mds-card>
            </template>
            <template slot="contentBox">
                <mds-card title="申请反馈信息" :name="'bottom'">
                    <el-table header-row-class-name="tableHead" class="newTable" :data="tableData" border tooltip-effect="dark">
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
                                {{ scope.row.ferInStorage? scope.row.ferInStorage.changed : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="批次" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.ferInStorage? scope.row.ferInStorage.inStorageBatch : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="remark" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="确认人员" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="确认时间" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                    </el-table>
                </mds-card>
            </template>
            <template slot="custom_btn">
                <el-button v-if="formHeader.statusName === '已保存' || !formHeader.statusName" type="primary" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <el-button v-if="isRedact" type="primary" size="small" @click="saved()">
                    保存
                </el-button>
                <el-button v-if="formHeader.statusName === '已保存' || !formHeader.statusName" type="primary" size="small" @click="submit()">
                    提交
                </el-button>
                <el-button v-if="formHeader.statusName === '待处理'" type="primary" size="small" @click="withdraw()">
                    撤回
                </el-button>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { BASIC_API, COMMON_API, FER_API } from 'common/api/api';

    @Component
    export default class ApplyDetail extends Vue {
        isRedact = false
        formHeader: FormHeader = {}
        tableData = []
        workShop = []
        material = []
        potArr = []

        mounted() {
            this.init()
        }

        init() {
            this.isRedact = false
            if (this.$store.state.fer.applyForObj.id) {
                FER_API.FER_OPEN_POT_APPLY_DETAIL_API({
                    id: this.$store.state.fer.applyForObj.id
                }).then(({ data }) => {
                    this.formHeader = data.data
                    this.formHeader.applied = true
                })
                FER_API.FER_OPEN_POT_APPLY_DETAIL_TABLE_API({
                    openPotNo: this.$store.state.fer.applyForObj.openPotNo
                }).then(({ data }) => {
                    this.tableData = data.data
                })
            }
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '发酵'
            }).then(({ data }) => {
                this.workShop = data.data
            })
            BASIC_API.FERINFO_DROPDOWN_API({
                productProcess: 'MIX'
            }).then(({ data }) => {
                this.material = data.data
            })
            // COMMON_API.SEARCH_MATERIAL_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     materialType: 'ZHAL'
            // }).then(({ data }) => {
            //     this.material = data.data
            // })
            COMMON_API.HOLDER_DROPDOWN_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: ['001', '028'],
                holderStatus: 'E'
            }).then(({ data }) => {
                this.potArr = data.data || [];
            })
        }

        materialChange() {
            const filterArr: (any) = this.material.filter(it => it['useMaterialCode'] === this.formHeader.applyMaterialCode);// eslint-disable-line
            this.formHeader.applyMaterialName = filterArr[0].useMaterialName
            this.formHeader.applyMaterialType = filterArr[0].useMaterialType
        }

        potChange() {
            const filterArr: (any) = this.potArr.filter(it => it['id'] === this.formHeader.mixPotId);// eslint-disable-line
            this.formHeader.mixPotNo = filterArr[0].holderNo
            this.formHeader.mixPotName = filterArr[0].holderName
        }

        saved() {
            if (!this.formHeader.openType && !this.formHeader.workShop && !this.formHeader.applyMaterialCode && !this.formHeader.useDate && !this.formHeader.applyAmount) {
                this.$warningToast('请填写必填项')
                return false
            }
            this.formHeader.applied = true
            FER_API.FER_OPEN_POT_APPLY_DETAIL_SAVE_API(this.formHeader).then(({ data }) => {
                this.$successToast('保存成功')
                if (!this.$store.state.fer.applyForObj.id) {
                    this.$store.state.fer.applyForObj = data.data
                }
                this.init()
            })
        }

        submit() {
            if (!this.formHeader.openType && !this.formHeader.workShop && !this.formHeader.applyMaterialCode && !this.formHeader.useDate && !this.formHeader.applyAmount) {
                this.$warningToast('请填写必填项')
                return false
            }
            this.formHeader.applied = true
            FER_API.FER_OPEN_POT_APPLY_DETAIL_SUBMIT_API(this.formHeader).then(({ data }) => {
                this.$successToast('提交成功')
                if (!this.$store.state.fer.applyForObj.id) {
                    this.$store.state.fer.applyForObj = data.data
                }
                this.init()
            })
        }

        withdraw() {
            this.$confirm('确认撤回, 是否继续?', '撤回', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                FER_API.FER_OPEN_POT_APPLY_REVOCATION_API({
                    id: this.formHeader.id
                }).then(() => {
                    this.$successToast('撤回成功!');
                    this.init()
                })
            })
        }
    }
    interface FormHeader{
        id?: string;
        workShop?: string;
        applied?: boolean;
        openPotNo?: string;
        status?: string;
        statusName?: string;
        openType?: string;
        applyMaterialCode?: string;
        applyMaterialName?: string;
        applyMaterialType?: string;
        applyMaterialTypeName?: string;
        mixPotId?: string;
        mixPotName?: string;
        mixPotNo?: string;
        useDate?: string;
        applyAmount?: string;
    }
</script>

<style scoped>

</style>
