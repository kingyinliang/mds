<template>
    <div>
        <mds-card v-if="steCookingConsumeFlag === '1'" title="煮料锅/混合罐领用" name="table">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataRowCookingConsume()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="steCookingConsume" :row-class-name="rowDelFlag" border tooltip-effect="dark">
                <el-table-column :index="index => getIndexMethod(index, steCookingConsume)" type="index" label="序号" width="50px" fixed />
                <el-table-column min-width="140px">
                    <template slot="header">
                        <span class="notNull">* </span>煮料锅/混合罐号
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.potNo" placeholder="请选择" size="small" clearable filterable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @change="getCookingNum(scope.row, scope.$index)">
                            <el-option v-for="(item, optIndex) in holderList" :key="optIndex" :label="item.holderName" :value="item.holderNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="160">
                    <template slot="header">
                        <span class="notNull">* </span>配置日期
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.configDate" type="date" value-format="yyyy-MM-dd" format="yyyy.MM.dd" placeholder="选择" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" style="width: 130px;" @change="getCookingNum(scope.row, scope.$index)" />
                    </template>
                </el-table-column>
                <el-table-column min-width="100px">
                    <template slot="header">
                        <span class="notNull">* </span>煮料锅序
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.cookingNum" placeholder="请选择" size="small" clearable filterable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @change="cookingNumChange(scope.row, scope.$index)">
                            <el-option v-for="(item, optIndex) in scope.row.cookingNumArr" :key="optIndex" :label="'第'+item.potOrder+'锅'" :value="item.potOrder" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="cookingOrderNo" label="煮料锅单" min-width="100px" :show-overflow-tooltip="true" />
                <el-table-column prop="cookingMaterialCode" label="煮料锅生产物料" min-width="140px" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.cookingMaterialName }}
                        {{ scope.row.cookingMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="remainderPot" label="剩余锅数" min-width="100px" :show-overflow-tooltip="true" />
                <el-table-column min-width="100px">
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.consumeAmount" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column prop="remainderAmount" label="剩余库存" min-width="100px" :show-overflow-tooltip="true" />
                <el-table-column prop="unit" label="单位" min-width="50px" :show-overflow-tooltip="true" />
                <el-table-column min-width="200">
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="transferTank" label="转运罐号" min-width="100px" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.transferTank" placeholder="请选择" size="small" clearable filterable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                            <el-option v-for="(item, optIndex) in transferTank" :key="optIndex" :label="item.holderName" :value="item.holderNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @click="removeDataRow(scope.row, scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card title="辅料领用" name="table1" icon-bg="#ffbf00">
            <el-table header-row-class-name="tableHead" class="newTable" :data="steAccessoriesConsume" :span-method="spanMethod" :row-class-name="rowDelFlag" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="领用物料" min-width="160" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.useMaterialName + ' ' + scope.row.useMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="useUnit" label="单位" width="50" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="!(isRedact)" @click="SplitDate('steAccessoriesConsume', scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.useAmount" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <span class="notNull">* </span>领用批次
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.useBatch" maxlength="10" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column width="200">
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="称取盒编号">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.useBoxNo" placeholder="请选择" size="small" clearable filterable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                            <el-option v-for="(item, optIndex) in useBoxNo" :key="optIndex" :label="item.holderName" :value="item.holderNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="备注" min-width="100">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.splitFlag === 'Y'" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @click="removeDataRow(scope.row, scope.$index, 'steAccessoriesConsume')">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card title="增补料" name="table2" icon-bg="#5BD171">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataNewSteAccessoriesConsume()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="newSteAccessoriesConsume" :span-method="spanTwoMethod" :row-class-name="rowDelFlag" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="领用物料" width="140">
                    <template slot="header">
                        <span class="notNull">* </span>领用物料
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.useMaterialCode" placeholder="请选择" size="small" clearable filterable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @change="setZengbuliao(scope.row)">
                            <el-option v-for="(iteam, index) in ACMaterial" :key="index" :label="iteam.useMaterialName + ' ' + iteam.useMaterial" :value="iteam.useMaterial" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="useUnit" label="单位" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.useUnit" placeholder="请选择" size="small" clearable filterable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                            <el-option v-for="(iteam, index) in Unit" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="!(isRedact)" @click="SplitDate('newSteAccessoriesConsume', scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.useAmount" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用批次
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.useBatch" size="small" maxlength="10" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @click="removeDataRow(scope.row, scope.$index, 'newSteAccessoriesConsume')">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="acceAddAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API, STE_API, AUDIT_API } from 'common/api/api';
    import { dateFormat, dataEntryData } from 'utils/utils';

    @Component
    export default class AcceAdd extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        steCookingConsumeFlag = '1';
        acceAddAudit = [];
        spanOneArr = {};
        spanTwoArr = {};
        holderList = [];
        transferTank = [];
        useBoxNo = [];
        ACMaterial: ACM[] = [];
        materialList = [];
        Unit = [];
        formHeader: OrderData = {};
        steCookingConsume: CCObj[] = [];
        OrgSteCookingConsume: CCObj[] = [];
        steAccessoriesConsume: ACObj[] = [];
        OrgSteAccessoriesConsume: ACObj[] = [];
        newSteAccessoriesConsume: ACObj[] = [];
        OrgNewSteAccessoriesConsume: ACObj[] = [];

        ruleSubmit() {
            const steCookingConsume = this.steCookingConsume.filter(item => item.delFlag !== 1);
            const steAccessoriesConsume = this.steAccessoriesConsume.filter(item => item.delFlag !== 1);
            const newSteAccessoriesConsume = this.newSteAccessoriesConsume.filter(item => item.delFlag !== 1);
            for (const item of steCookingConsume) {
                if (!item.potNo || !item.configDate || !item.cookingNum || !item.addDate || !item.consumeAmount || item.consumeAmount === '0') {
                    this.$warningToast('请填写煮料锅/混合罐领用必填项');
                    return false
                }
            }
            for (const item of steAccessoriesConsume) {
                if (!item.useAmount || item.useAmount === '0') {
                    this.$warningToast('请填写辅料领用领用数量');
                    return false
                }
                if (!item.addDate || !item.useBatch) {
                    this.$warningToast('请填写辅料领用必填项');
                    return false
                }
                if (item.useBatch.length !== 10) {
                    this.$warningToast('请填写辅料领用10位批次');
                    return false
                }
            }
            for (const item of newSteAccessoriesConsume) {
                if (!item.useAmount || item.useAmount === '0') {
                    this.$warningToast('请填写增补料领用数量');
                    return false
                }
                if (!item.useMaterialCode || !item.addDate || !item.useBatch) {
                    this.$warningToast('请填写增补料必填项');
                    return false
                }
                if (item.useBatch.length !== 10) {
                    this.$warningToast('请填写增补料10位批次');
                    return false
                }
            }
            return true
        }

        savedData(formHeader) {
            const steCookingConsumeSaveDto = {
                delIds: [],
                insertData: [],
                updateData: []
            };
            const steAccessoriesConsumeSaveDto = {
                delIds: [],
                insertData: [],
                updateData: []
            };
            const newSteAccessoriesConsumeSaveDto = {
                delIds: [],
                insertData: [],
                updateData: []
            };

            dataEntryData(formHeader, this.steCookingConsume, this.OrgSteCookingConsume, steCookingConsumeSaveDto.delIds, steCookingConsumeSaveDto.insertData, steCookingConsumeSaveDto.updateData, (item) => {
                item.potOrderNo = formHeader.potOrderNo;
                item.potOrderId = formHeader.id;
            });
            dataEntryData(formHeader, this.steAccessoriesConsume, this.OrgSteAccessoriesConsume, steAccessoriesConsumeSaveDto.delIds, steAccessoriesConsumeSaveDto.insertData, steAccessoriesConsumeSaveDto.updateData, (item) => {
                item.useType = '1';
                item.potOrderNo = formHeader.potOrderNo;
                item.potOrderId = formHeader.id;
            });
            dataEntryData(formHeader, this.newSteAccessoriesConsume, this.OrgNewSteAccessoriesConsume, newSteAccessoriesConsumeSaveDto.delIds, newSteAccessoriesConsumeSaveDto.insertData, newSteAccessoriesConsumeSaveDto.updateData, (item) => {
                item.useType = '2';
                item.potOrderNo = formHeader.potOrderNo;
                item.potOrderId = formHeader.id;
            });
            return {
                potOrderNo: formHeader.potOrderNo,
                orderNo: formHeader.orderNo,
                steCookingConsumeSaveDto,
                steAccessoriesConsumeSaveDto,
                newSteAccessoriesConsumeSaveDto
            }
        }

        async init(formHeader) {
            this.formHeader = formHeader;
            this.getHolderList();
            this.getMaterial();
            STE_API.STE_ACCE_LIST_API({
                materialCode: formHeader.materialCode,
                orderNo: formHeader.orderNo,
                potOrderNo: formHeader.potOrderNo
            }).then(({ data }) => {
                this.steCookingConsumeFlag = data.data.steCookingConsumeFlag;
               this.newSteAccessoriesConsume = JSON.parse(JSON.stringify(data.data.newSteAccessoriesConsume));
               this.OrgNewSteAccessoriesConsume = JSON.parse(JSON.stringify(data.data.newSteAccessoriesConsume));
               this.steAccessoriesConsume = JSON.parse(JSON.stringify(data.data.steAccessoriesConsume));
               this.OrgSteAccessoriesConsume = JSON.parse(JSON.stringify(data.data.steAccessoriesConsume));
               this.steCookingConsume = JSON.parse(JSON.stringify(data.data.steCookingConsume));
               this.OrgSteCookingConsume = JSON.parse(JSON.stringify(data.data.steCookingConsume));
               this.merge(this.steAccessoriesConsume, 'steAccessoriesConsume');
               this.merge(this.newSteAccessoriesConsume, 'newSteAccessoriesConsume');
            })
            this.acceAddAudit = await this.getAudit(formHeader, ['ACCESSORIES', 'MATERIAL']);
        }

        async getAudit(formHeader, verifyType) {
            const a = await AUDIT_API.STE_AUDIT_LOG_API({
                orderNo: formHeader.orderNo,
                splitOrderNo: formHeader.potOrderNo,
                verifyType: verifyType
            })
            return a.data.data
        }

        // 煮料锅下拉触发
        getCookingNum(row, index) {
            STE_API.STE_COOKINGNO_LIST_API({
                workShop: this.formHeader.workShop,
                configStartDate: row.configDate,
                potNo: row.potNo
            }).then(({ data }) => {
                row.cookingNumArr = data.data;
                row.cookingId = '';
                row.cookingNum = '';
                row.cookingOrderNo = '';
                row.cookingMaterialCode = '';
                row.cookingMaterialName = '';
                row.remainderPot = '';
                row.remainderAmount = '';
                row.unit = '';
                this.$set(this.steCookingConsume, index, row)
            })
        }

        setZengbuliao(row) {
            const arr = this.ACMaterial.filter(item => item.useMaterial === row.useMaterialCode);
            row.useMaterialType = arr[0]['useMaterialType'];
            row.useMaterialName = arr[0]['useMaterialName'];
        }

        // 锅序下拉触发
        cookingNumChange(row, index) {
            const cookingNumObj = row.cookingNumArr.filter(it => it.potOrder === row.cookingNum)[0];
            row.cookingId = cookingNumObj.id;
            row.cookingOrderNo = cookingNumObj.cookingNo;
            row.cookingMaterialCode = cookingNumObj.productMaterial;
            row.cookingMaterialName = cookingNumObj.productMaterialName;
            row.remainderPot = cookingNumObj.configPotCount - cookingNumObj.usePotCount;
            row.remainderAmount = cookingNumObj.remainder;
            COMMON_API.DROPDOWN_UNIT_API({ materialCode: row.cookingMaterialCode }).then(({ data }) => {
                row.unit = data.data[0]['unit'];
                this.$set(this.steCookingConsume, index, row)
            });
            if (this.formHeader.materialCode !== row.cookingMaterialCode || this.formHeader.materialName !== row.cookingMaterialName) {
                this.$warningToast('请选择生产物料一致的煮料锅！')
            }
            this.$set(this.steCookingConsume, index, row)
        }

        // 获取   煮料锅/罐下拉  煮料锅/罐下拉 转运罐号下拉  称取盒编号下拉
        getHolderList() {
            COMMON_API.HOLDER_DROPDOWN_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: ['020']
            }).then(({ data }) => {
                this.holderList = data.data
            })
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_UNIT'
            }).then(({ data }) => {
                this.Unit = data.data;
            });
            COMMON_API.HOLDER_QUERY_API({
                deptId: this.formHeader.workShop,
                holderType: '022',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                this.transferTank = data.data.records
            })
            COMMON_API.HOLDER_QUERY_API({
                deptId: this.formHeader.workShop,
                holderType: '023',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                this.useBoxNo = data.data.records
            })
        }

        getMaterial() {
            STE_API.STE_ACCE_MATERIAL_LIST_API({ supplyFlag: 'Y', productMaterial: this.formHeader.materialCode }).then(({ data }) => {
                this.ACMaterial = data.data
            });
        }

        // 新增  - 煮料锅/混合罐领用
        addDataRowCookingConsume() {
            this.steCookingConsume.push({
                consumeAmount: '',
                potOrderNo: this.formHeader.potOrderNo,
                potOrderId: this.formHeader.potOrderId,
                configDate: dateFormat(new Date(), 'yyyy-MM-dd')
            })
        }

        addDataNewSteAccessoriesConsume() {
            this.newSteAccessoriesConsume.push({
                id: '',
                potOrderNo: this.formHeader.potOrderNo,
                potOrderId: this.formHeader.potOrderId,
                useMaterialCode: '',
                useMaterialName: '',
                useAmount: '',
                addDate: '',
                useUnit: '',
                splitFlag: 'N'
            })
            this.merge(this.newSteAccessoriesConsume, 'newSteAccessoriesConsume');
        }

        SplitDate(str, row, index) {
            if (!row.useMaterialCode) {
                return false
            }
            this[str].splice(index + this[str].filter(item => item.useMaterialCode === row.useMaterialCode).length, 0, {
                id: '',
                potOrderNo: this.formHeader.potOrderNo,
                potOrderId: this.formHeader.potOrderId,
                useMaterialCode: row.useMaterialCode,
                useMaterialName: row.useMaterialName,
                useMaterialType: row.useMaterialType,
                useBatch: '',
                useAmount: '',
                useUnit: row.useUnit,
                splitFlag: 'Y'
            })
            this.merge(this[str], str)
        }

        // 设置合并行
        merge(tableData, Data) {
            const spanOneArr: number[] = [];
            let concatOne = 0;
            // let rowIndex = 1;
            tableData.forEach((item, index) => {
                if (index === 0) {
                    // item.rowIndex = rowIndex
                    spanOneArr.push(1);
                } else if (item.useMaterialCode === tableData[index - 1].useMaterialCode && item.useMaterialCode) {
                    // item.rowIndex = rowIndex
                    if (item.delFlag !== 1) {
                        spanOneArr[concatOne] += 1;
                    }
                    spanOneArr.push(0);
                } else {
                    // rowIndex++;
                    // item.rowIndex = rowIndex
                    spanOneArr.push(1);
                    concatOne = index;
                }
            });
            if (Data === 'steAccessoriesConsume') {
                this.spanOneArr = spanOneArr
            }
            if (Data === 'newSteAccessoriesConsume') {
                this.spanTwoArr = spanOneArr
            }
        }

        // 合并行
        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 3) {
                return {
                    rowspan: this.spanOneArr[rowIndex],
                    colspan: this.spanOneArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        spanTwoMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 3) {
                return {
                    rowspan: this.spanTwoArr[rowIndex],
                    colspan: this.spanTwoArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        removeDataRow(row, index, str) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
                if (str) {
                    this.$set(this[str], index, row)
                } else {
                    this.$set(this.steCookingConsume, index, row)
                }

                this.merge(this[str], str)
            });
        }
    }
    interface ACM {
        useMaterial?: string;
    }
    interface OrderData {
        materialCode?: string;
        materialName?: string;
        workShop?: string;
        potOrderNo?: string;
        potOrderId?: string;
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
    }
    interface ACObj {
        id?: string;
        delFlag?: number;
        potOrderNo?: string;
        potOrderId?: string;
        useMaterialCode?: string;
        useMaterialName?: string;
        useAmount?: string;
        useBatch?: string;
        addDate?: string;
        useUnit?: string;
        splitFlag?: string;
    }
    interface CCObj {
        id?: string;
        delFlag?: number;
        potNo?: string;
        cookingNum?: string;
        addDate?: string;
        potOrderNo?: string;
        potOrderId?: string;
        configDate?: string;
        consumeAmount?: string;
        cookingOrderNo?: string;
        cookingMaterialCode?: string;
        cookingMaterialName?: string;
        remainderPot?: string;
        remainderAmount?: string;
        unit?: string;
    }
</script>

<style scoped>

</style>
