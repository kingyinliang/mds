<template>
    <div>
        <mds-card :title="'包材领用'" :name="'materialP'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="currentDataTable" :row-class-name="rowDelFlag" :span-method="spanMethod" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode + scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="materialUnit" width="50" :show-overflow-tooltip="true" />
                <el-table-column label="需求用量" prop="needNum" width="80" :show-overflow-tooltip="true" />
                <el-table-column label="结算库存" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.endStocks = getEndStocks(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column label="初始库存" prop="startStocks" width="80" :show-overflow-tooltip="true" />
                <el-table-column label="订单领料" prop="receiveMaterial" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3') || scope.row.materialStatus === '3'" @click="SplitDate('currentDataTable', scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="实际用量" prop="realUseAmount" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>实际用量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realUseAmount" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="batch" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" maxlength="10" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="实际损耗" prop="realLoss" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realLoss" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="不合格数" prop="unqualified" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.unqualified" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="不良批次" prop="badBatch" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.badBatch" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="厂家" prop="manufactor" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.manufactor" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="changed" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.splitFlag === 'Y'" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delMaterial(scope.row, 'currentDataTable')">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'半成品领用'" :name="'materialS'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="materialS" :row-class-name="rowDelFlag" :span-method="spanTwoMethod" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode + scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="materialUnit" width="50" :show-overflow-tooltip="true" />
                <el-table-column label="需求用量" prop="needNum" width="80" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" @click="SplitDate('materialS', scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="使用锅序" min-width="140">
                    <template slot="header">
                        <span class="notNull">* </span>使用锅序
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sterilizeStorageNo" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="锅号" prop="sterilizePotNo" width="150" :show-overflow-tooltip="true" />
                <el-table-column label="实际用量" min-width="140">
                    <template slot="header">
                        <span class="notNull">* </span>实际用量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realUsed" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="开始使用时间" width="195">
                    <template slot="header">
                        <span class="notNull">* </span>开始使用时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startDate" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" size="small" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column label="用完时间" prop="batch" width="195">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.endDate" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" size="small" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="changed" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.splitFlag === 'Y'" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delMaterial(scope.row, 'materialS')">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="solerow">
                <div>
                    领用数合计：
                </div>
                <div class="input_bottom">
                    {{ materialCount }}
                </div>
            </el-row>
        </mds-card>
        <audit-log :table-data="MaterialAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber, accAdd } from 'utils/utils';
    import { PKG_API, AUDIT_API } from 'common/api/api';
    import _ from 'lodash';

    @Component({
        name: 'Material',
        components: {
        }
    })
    export default class Material extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        MaterialAudit = [];

        currentDataTable: MaterialMap[] = [];
        orgDataTable: MaterialMap[] = [];
        materialS: MaterialMap[] = [];
        orgMaterialS: MaterialMap[] = [];

        spanOneArr: number[] = [];
        spanTwoArr: number[] = [];

        ruleSubmit() {
            for (const item of this.currentDataTable.filter(it => it.delFlag !== 1)) {
                if (!item.realUseAmount) {
                    this.$warningToast('请填写包材领用必填项');
                    return false
                }
            }
            for (const item of this.materialS.filter(it => it.delFlag !== 1)) {
                if (!item.sterilizeStorageNo || !item.realUsed || !item.startDate) {
                    this.$warningToast('请填写半成品领用必填项');
                    return false
                }
            }
            return true
        }

        savedData() {
            const pkgPackingMaterial: PkgMaterialObj = {
                packingMaterialDelete: [],
                packingMaterialItemDelete: [],
                packingMaterialInsert: [],
                packingMaterialUpdate: []
            };
            const pkgSemiMaterial: PkgMaterialSObj = {
                materialCount: this.materialCount,
                pkgSemiMaterialDelete: [],
                pkgSemiMaterialItemDelete: [],
                pkgSemiMaterialInsert: [],
                pkgSemiMaterialUpdate: []
            };
            this.currentDataTable.forEach(item => {
                const filterArr1: (any) = pkgPackingMaterial.packingMaterialUpdate.filter(it => it.id === item.mainId);// eslint-disable-line
                const filterArr2: (any) = pkgPackingMaterial.packingMaterialInsert.filter(it => it.merge === item.merge);// eslint-disable-line
                if (item.materialStatus === '3') {
                    pkgPackingMaterial.packingMaterialDelete.push(item.mainId);
                } else if (item.delFlag === 1) {
                    if (item.id) {
                        pkgPackingMaterial.packingMaterialItemDelete.push(item.id)
                    }
                } else if (item.id) {
                    const orgObj = this.orgDataTable.filter(it => it.id === item.id)[0];
                    if (!_.isEqual(orgObj, item)) {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        if (filterArr1 && filterArr1[0]) {
                            filterArr1[0].item.push(item)
                        } else {
                            pkgPackingMaterial.packingMaterialUpdate.push({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                merge: item.merge,
                                mainId: item.mainId,
                                id: item.mainId,
                                checkStatus: item.checkStatus,
                                delFlag: item.delFlag,
                                endStocks: item.endStocks,
                                materialCode: item.materialCode,
                                materialName: item.materialName,
                                materialStatus: item.materialStatus,
                                materialUnit: item.materialUnit,
                                needNum: item.needNum,
                                orderId: item.orderId,
                                orderNo: item.orderNo,
                                posnr: item.posnr,
                                receiveMaterial: item.receiveMaterial,
                                startStocks: item.startStocks,
                                item: [item]
                            })
                        }
                    }
                } else if (filterArr2 && filterArr2[0]) {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    filterArr2[0].item.push(item)
                } else {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    pkgPackingMaterial.packingMaterialInsert.push({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        merge: item.merge,
                        mainId: item.mainId,
                        id: item.mainId,
                        checkStatus: item.checkStatus,
                        delFlag: item.delFlag,
                        endStocks: item.endStocks,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        materialStatus: item.materialStatus,
                        materialUnit: item.materialUnit,
                        needNum: item.needNum,
                        orderId: item.orderId,
                        orderNo: item.orderNo,
                        posnr: item.posnr,
                        receiveMaterial: item.receiveMaterial,
                        startStocks: item.startStocks,
                        item: [item]
                    })
                }
            });
            this.materialS.forEach(item => {
                const filterArr1: (any) = pkgSemiMaterial.pkgSemiMaterialUpdate.filter(it => it.id === item.mainId);// eslint-disable-line
                const filterArr2: (any) = pkgSemiMaterial.pkgSemiMaterialInsert.filter(it => it.merge === item.merge);// eslint-disable-line
                if (item.materialStatus === '3') {
                    pkgSemiMaterial.pkgSemiMaterialDelete.push(item.mainId);
                } else if (item.delFlag === 1) {
                    if (item.id) {
                        pkgSemiMaterial.pkgSemiMaterialItemDelete.push(item.id)
                    }
                } else if (item.id) {
                    const orgObj = this.orgMaterialS.filter(it => it.id === item.id)[0];
                    if (!_.isEqual(orgObj, item)) {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        if (filterArr1 && filterArr1[0]) {
                            filterArr1.item.push(item)
                        } else {
                            pkgSemiMaterial.pkgSemiMaterialUpdate.push({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                merge: item.merge,
                                mainId: item.mainId,
                                id: item.mainId,
                                checkStatus: item.checkStatus,
                                materialCode: item.materialCode,
                                materialName: item.materialName,
                                materialUnit: item.materialUnit,
                                needNum: item.needNum,
                                orderId: item.orderId,
                                orderNo: item.orderNo,
                                posnr: item.posnr,
                                item: [item]
                            })
                        }
                    }
                } else if (filterArr2 && filterArr2[0]) {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    filterArr2[0].item.push(item)
                } else {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    pkgSemiMaterial.pkgSemiMaterialInsert.push({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        merge: item.merge,
                        mainId: item.mainId,
                        id: item.mainId,
                        checkStatus: item.checkStatus,
                        delFlag: item.delFlag,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        materialUnit: item.materialUnit,
                        needNum: item.needNum,
                        orderId: item.orderId,
                        orderNo: item.orderNo,
                        posnr: item.posnr,
                        item: [item]
                    })
                }
            });
            return {
                pkgPackingMaterial,
                pkgSemiMaterial
            }
        }

        async init(formHeader) {
            PKG_API.PKG_MATERIAL_P_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo,
                orderStatus: formHeader.orderStatus,
                productLine: formHeader.productLine
            }).then(({ data }) => {
                this.processData(data.data, 'currentDataTable');
                this.merge(this.currentDataTable, 'currentDataTable');
                this.orgDataTable = JSON.parse(JSON.stringify(this.currentDataTable));
            });
            PKG_API.PKG_MATERIAL_S_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo,
                orderStatus: formHeader.orderStatus,
                productLine: formHeader.productLine
            }).then(({ data }) => {
                this.processData(data.data, 'materialS');
                this.merge(this.materialS, 'materialS');
                this.orgMaterialS = JSON.parse(JSON.stringify(this.materialS));
            })
            this.MaterialAudit = await this.getAudit(formHeader, 'MATERIAL');
        }

        async getAudit(formHeader, verifyType) {
            const a = await AUDIT_API.AUDIT_LOG_LIST_API({
                orderNo: formHeader.id,
                verifyType: verifyType
            })
            return a.data.data
        }

        // 处理数据
        processData(data, dataGroup) {
            const finalData: MaterialMap[] = []
            data.forEach((item, index) => {
                item.item.forEach((listitem) => {
                    const materialMap: MaterialMap = {
                        id: '',
                        merge: index,
                        mainId: item.id,
                        checkStatus: item.checkStatus,
                        orderId: item.orderId,
                        orderNo: item.orderNo,
                        posnr: item.posnr,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        materialStatus: item.materialStatus,
                        materialUnit: item.materialUnit,
                        needNum: item.needNum,
                        startStocks: item.startStocks,
                        endStocks: item.endStocks,
                        receiveMaterial: item.receiveMaterial,
                        changer: item.changer,
                        changed: item.changed
                    };
                    Object.assign(materialMap, listitem);
                    finalData.push(materialMap)
                })
            });
            this[dataGroup] = finalData
        }

        // 设置合并行
        merge(tableData, Data) {
            const spanOneArr: number[] = [];
            let concatOne = 0;
            tableData.forEach((item, index) => {
                if (index === 0) {
                    spanOneArr.push(1);
                } else if (item.merge === tableData[index - 1].merge) {
                    if (item.delFlag !== 1) {
                        spanOneArr[concatOne] += 1;
                    }
                    spanOneArr.push(0);
                } else {
                    spanOneArr.push(1);
                    concatOne = index;
                }
            });
            if (Data === 'currentDataTable') {
                this.spanOneArr = spanOneArr
            }
            if (Data === 'materialS') {
                this.spanTwoArr = spanOneArr
            }
        }

        // 合并行
        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 7) {
                return {
                    rowspan: this.spanOneArr[rowIndex],
                    colspan: this.spanOneArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        spanTwoMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 4) {
                return {
                    rowspan: this.spanTwoArr[rowIndex],
                    colspan: this.spanTwoArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        // 拆分
        SplitDate(str, row, index) {
            this[str].splice(index + this[str].filter(item => item.merge === row.merge).length, 0, {
                merge: row.merge,
                id: '',
                orderId: row.orderId,
                orderNo: row.orderNo,
                posnr: row.posnr,
                mainId: row.mainId,
                materialCode: row.materialCode,
                materialName: row.materialName,
                materialStatus: row.materialStatus,
                materialUnit: row.materialUnit,
                needNum: row.needNum,
                endStocks: row.endStocks,
                startStocks: row.startStocks,
                receiveMaterial: row.receiveMaterial,
                splitFlag: 'Y',
                delFlag: 0,
                sterilizePotNo: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber()
            });
            this.merge(this[str], str)
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            } else if (row.materialStatus === '3') {
                return 'disabled-row'
            } else if (row.materialStatus === '1' || row.materialStatus === '2') {
                return 'warning-row'
            }
            return '';
        }

        // 删除
        delMaterial(row, str) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
                this.merge(this[str], str)
            });
        }

        get getEndStocks() {
            return (row) => {
                const dataArr = this.currentDataTable.filter(it => it.merge === row.merge && it.delFlag !== 1);
                const num = dataArr.reduce((total, currentValue: MaterialMap) => {
                    return total + Number(currentValue.realUseAmount)
                }, 0);
                return Number(row.startStocks) + Number(row.receiveMaterial) - Number(num)
            }
        }

        get materialCount() {
            let scrapNum = 0;
            this.materialS.map((item: MaterialMap) => {
                if (item.delFlag !== 1) {
                    scrapNum = accAdd(scrapNum, Number(item.realUsed));
                }
            });
            return scrapNum;
        }
    }
interface MaterialMap{
    merge?: number;
    mainId: string;
    id: string;
    delFlag?: number;
    original?: boolean;
    orderId?: string;
    orderNo?: string;
    posnr?: string;
    factory?: string;
    checkStatus?: string;
    materialCode?: string;
    materialName?: string;
    materialStatus?: string;
    materialUnit?: string;
    needNum?: number;
    startStocks?: number;
    endStocks?: number;
    receiveMaterial?: string;
    realUseAmount?: string;
    sterilizeStorageNo?: string;
    realUsed?: string;
    startDate?: string;
    splitFlag?: string;
    changer?: string;
    changed?: string;
    item?: MaterialMap[];
}
interface PkgMaterialObj {
    packingMaterialDelete: string[];
    packingMaterialItemDelete: string[];
    packingMaterialInsert: MaterialMap[];
    packingMaterialUpdate: MaterialMap[];
}
interface PkgMaterialSObj {
    materialCount: number;
    pkgSemiMaterialDelete: string[];
    pkgSemiMaterialItemDelete: string[];
    pkgSemiMaterialInsert: MaterialMap[];
    pkgSemiMaterialUpdate: MaterialMap[];
}
</script>

<style lang="scss" scoped>
    .solerow {
        margin-top: 5px;
        line-height: 33px;
        div {
            float: left;
        }
        .input_bottom {
            margin-right: 50px;
        }
    }
</style>
