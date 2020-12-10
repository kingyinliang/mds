<template>
    <div>
        <mds-card :title="'包材领用'" :name="'materialP'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="currentDataTable" :row-class-name="rowDelFlag" :span-method="spanMethod" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="materialUnitName" width="50" :show-overflow-tooltip="true" />
                <el-table-column label="需求用量" prop="needNum" width="80" :show-overflow-tooltip="true" />
                <el-table-column label="订单领料" prop="receiveMaterial" width="80" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('pkgPdInsert')" type="text" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3') || scope.row.materialStatus === '3'" @click="SplitDate('currentDataTable', scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="batch" width="150">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.batch" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" filterable placeholder="请选择" size="small" clearable @change="batchChange(scope.row)">
                            <template v-for="(iteam, index) in scope.row.batchData">
                                <el-option v-if="iteam.useMaterialAmount !== '0.0000'" :key="index" :label="iteam.batch" :value="iteam.batch" />
                            </template>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="初始库存" prop="startStocks" width="80" :show-overflow-tooltip="true" />
                <el-table-column label="领用数量" prop="realUseAmount" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realUseAmount" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
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
                <el-table-column label="厂家" prop="manufactor" width="120" :show-overflow-tooltip="true" />
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
                        <el-button v-if="scope.row.splitFlag === 'Y' && isAuth('pkgPdDel')" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P' && scope.row.materialStatus !== '3')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delMaterial(scope.row, 'currentDataTable')">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card v-for="(item, index) in materialSArr" :key="index" :title="'灌装线' + (index + 1)" :name="'materialS' + index">
            <el-table ref="materialS" header-row-class-name="tableHead" class="newTable" max-height="267" :data="item.data" :row-class-name="rowDelFlag" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="materialUnit" width="50" :show-overflow-tooltip="true" />
                <el-table-column label="需求用量" prop="needNum" width="80" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('pkgPdInsert') && scope.row.splitFlag === 'N'" type="text" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P' && scope.row.materialStatus !== '3')" @click="SplitDateS(item, scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="使用锅序" min-width="140">
                    <template slot="header">
                        <span class="notNull">* </span>使用锅序
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sterilizeStorageNo" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="实际用量" min-width="140">
                    <template slot="header">
                        <span class="notNull">* </span>实际用量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realUsed" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="开始使用时间" width="195">
                    <template slot="header">
                        <span class="notNull">* </span>开始使用时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startDate" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P' && scope.row.materialStatus !== '3')" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" size="small" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column label="用完时间" prop="batch" width="195">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.endDate" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P' && scope.row.materialStatus !== '3')" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" size="small" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P' && scope.row.materialStatus !== '3')" size="small" placeholder="请输入" />
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
                        <el-button v-if="scope.row.splitFlag === 'Y'" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P' && scope.row.materialStatus !== '3')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delMaterial(scope.row, 'materialS', item.data)">
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
                    {{ materialCount(item.data) }}
                </div>
            </el-row>
        </mds-card>
        <audit-log :table-data="MaterialAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber, accAdd } from 'utils/utils';
    import { PKG_API, AUDIT_API, COMMON_API } from 'common/api/api';
    import _ from 'lodash';

    @Component({
        name: 'Material',
        components: {
        }
    })
    export default class Material extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: '' }) status: string;

        $refs: {
            materialS: HTMLFormElement;
        }

        MaterialAudit = [];
        formHeader: OrderData = {};
        batch = [];

        bottleLineNum = 0;

        materialSArr: MaterialArr[] = []
        orgMaterialS: MaterialArr[] = [];

        currentDataTable: MaterialMap[] = [];
        orgDataTable: MaterialMap[] = [];

        spanOneArr: number[] = [];

        ruleSaved(): boolean {
            for (const data of this.materialSArr) {
                const rule: string[] = []
                for (const item of data.data.filter(it => it.delFlag !== 1)) {
                    if (item.sterilizeStorageNo) {
                        rule.push(item.sterilizeStorageNo)
                    }
                }
                if ([...new Set(rule)].length !== data.data.filter(it => it.delFlag !== 1 && it.sterilizeStorageNo).length) {
                    this.$warningToast('锅序号重复 值重复，请修改后重新操作！');
                    return false
                }
            }
            return true
        }

        ruleSubmit(): boolean {
            for (const item of this.currentDataTable.filter(it => it.delFlag !== 1)) {
                if (!item.realUseAmount) {
                    this.$warningToast('请填写物料领用页签包材领用实际用量');
                    return false
                }
            }
            for (const data of this.materialSArr) {
                const rule: string[] = []
                for (const item of data.data.filter(it => it.delFlag !== 1)) {
                    if (!item.sterilizeStorageNo) {
                        this.$warningToast('请填写物料领用页签半成品领用使用锅序');
                        return false
                    }
                    if (!item.realUsed) {
                        this.$warningToast('请填写物料领用页签半成品领用实际用量');
                        return false
                    }
                    if (!item.startDate) {
                        this.$warningToast('请填写物料领用页签半成品领用开始使用时间');
                        return false
                    }
                    if (item.sterilizeStorageNo) {
                        rule.push(item.sterilizeStorageNo)
                    }
                }
                if ([...new Set(rule)].length !== data.data.filter(it => it.delFlag !== 1 && it.sterilizeStorageNo).length) {
                    this.$warningToast('锅序号重复 值重复，请修改后重新操作！');
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
                pkgSemiMaterialDelete: [],
                pkgSemiMaterialItemDelete: [],
                pkgSemiMaterialInsert: [],
                pkgSemiMaterialUpdate: []
            };
            this.currentDataTable.forEach(item => {
                const filterArr1: (any) = pkgPackingMaterial.packingMaterialUpdate.filter(it => it.id === item.mainId);// eslint-disable-line
                const filterArr2: (any) = pkgPackingMaterial.packingMaterialInsert.filter(it => it.merge === item.merge);// eslint-disable-line
                if (item.materialStatus === '3') {
                    if (pkgPackingMaterial.packingMaterialDelete.indexOf(item.mainId) === -1) {
                        pkgPackingMaterial.packingMaterialDelete.push(item.mainId);
                    }
                    if (item.id) {
                        pkgPackingMaterial.packingMaterialItemDelete.push(item.id)
                    }
                } else if (item.delFlag === 1) {
                    if (item.id) {
                        pkgPackingMaterial.packingMaterialItemDelete.push(item.id)
                    }
                } else if (item.id) {
                    const orgObj = this.orgDataTable.filter(it => it.id === item.id)[0];
                    if (!_.isEqual(orgObj, item)) {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
                        if (filterArr1 && filterArr1[0]) {
                            item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                            item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
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
                                materialType: item.materialType,
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
                    item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
                    filterArr2[0].item.push(item)
                } else {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
                    pkgPackingMaterial.packingMaterialInsert.push({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        merge: item.merge,
                        mainId: item.mainId,
                        id: item.mainId,
                        checkStatus: item.checkStatus,
                        delFlag: item.delFlag,
                        endStocks: item.endStocks,
                        materialType: item.materialType,
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
            this.materialSArr.forEach((data, index) => {
                data.data.forEach(item => {
                    const filterArr1: (any) = pkgSemiMaterial.pkgSemiMaterialUpdate.filter(it => it.id === item.mainId);// eslint-disable-line
                    const filterArr2: (any) = pkgSemiMaterial.pkgSemiMaterialInsert.filter(it => it.merge === item.merge && it.bottleLine === item.bottleLine);// eslint-disable-line
                    if (item.materialStatus === '3') {
                        pkgSemiMaterial.pkgSemiMaterialDelete.push(item.mainId);
                    } else if (item.delFlag === 1) {
                        if (item.id) {
                            pkgSemiMaterial.pkgSemiMaterialItemDelete.push(item.id)
                        }
                    } else if (item.id) {
                        const orgObj = this.orgMaterialS[index].data.filter(it => it.id === item.id)[0];
                        if (!_.isEqual(orgObj, item)) {
                            item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                            if (filterArr1 && filterArr1[0]) {
                                filterArr1[0].item.push(item)
                            } else {
                                pkgSemiMaterial.pkgSemiMaterialUpdate.push({
                                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                    merge: item.merge,
                                    mainId: item.mainId,
                                    id: item.mainId,
                                    checkStatus: item.checkStatus,
                                    bottleLine: item.bottleLine,
                                    materialType: item.materialType,
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
                            bottleLine: item.bottleLine,
                            materialType: item.materialType,
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
                })
            })
            return {
                pkgPackingMaterial,
                pkgSemiMaterial
            }
        }

        async init(formHeader) {
            this.formHeader = formHeader
            PKG_API.PKG_MATERIAL_P_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo,
                orderStatus: formHeader.orderStatus,
                productLine: formHeader.productLine
            }).then(({ data }) => {
                this.processData1(data.data, 'currentDataTable')
                // this.currentDataTable = this.processData(data.data, 'currentDataTable');
                // this.spanOneArr = this.merge(this.currentDataTable);
                // this.orgDataTable = JSON.parse(JSON.stringify(this.currentDataTable));
            });
            if (formHeader.orderStatus === 'T') {
                COMMON_API.ORGDETAIL_API({
                    id: formHeader.productLine
                }).then(({ data }) => {
                    this.bottleLineNum = Number(data.data.bottleLineNum)
                    this.getMaterialS(formHeader, true);
                })
            } else {
                this.getMaterialS(formHeader, false);
            }
            this.MaterialAudit = await this.getAudit(formHeader, 'MATERIAL');
        }

        getMaterialS(formHeader, tmp): void {
            PKG_API.PKG_MATERIAL_S_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo,
                orderStatus: formHeader.orderStatus,
                productLine: formHeader.productLine
            }).then(({ data }) => {
                this.materialSArr = []
                if (tmp) {
                    const list = this.processData(data.data, 'materialS');
                    const spanArr = this.merge(list)
                    for (let i = 0; i < this.bottleLineNum; i++) {
                        const tmpList = JSON.parse(JSON.stringify(list));
                        tmpList.forEach(it => {
                            it.bottleLine = String(i + 1)
                        })
                        this.materialSArr.push({
                            data: tmpList,
                            spanArr: spanArr
                        })
                    }
                } else {
                    const list = this.processData(data.data, 'materialS');
                    list.forEach(it => {
                        if (this.materialSArr[Number(it.bottleLine) - 1]) {
                            this.materialSArr[Number(it.bottleLine) - 1]['data'].push(it)
                        } else {
                            this.materialSArr[Number(it.bottleLine) - 1] = {
                                data: [it],
                                spanArr: []
                            }
                        }
                    })
                    this.materialSArr.forEach(it => {
                        it.spanArr = this.merge(it.data)
                    })
                }
                this.orgMaterialS = JSON.parse(JSON.stringify(this.materialSArr));
            })
        }

        async getAudit(formHeader, verifyType) {
            const a = await AUDIT_API.AUDIT_LOG_LIST_API({
                orderNo: formHeader.orderNo,
                verifyType: verifyType
            })
            return a.data.data
        }

        batchChange(row) {
            const filterArr: (any) = row.batchData.filter(it => it.batch === row.batch);// eslint-disable-line
            row.startStocks = filterArr[0].storageAmount
            row.manufactor = filterArr[0].manufactor
        }

        // 处理数据1
        async processData1(data, dataGroup) {
            const finalData: MaterialMap[] = []
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                const index = i
                item.item.forEach((listitem) => {
                    const materialMap: MaterialMap = {
                        id: '',
                        merge: index,
                        mainId: item.id,
                        batchData: item.batchData,
                        checkStatus: item.checkStatus,
                        orderId: item.orderId,
                        orderNo: item.orderNo,
                        posnr: item.posnr,
                        bottleLine: dataGroup === 'currentDataTable' ? '' : item.bottleLine,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        materialUnit: item.materialUnit,
                        materialUnitName: dataGroup === 'currentDataTable' ? item.materialUnitName : '',
                        needNum: item.needNum,
                        materialStatus: dataGroup === 'currentDataTable' ? item.materialStatus : '',
                        materialType: dataGroup === 'currentDataTable' ? item.materialType : '',
                        startStocks: dataGroup === 'currentDataTable' ? item.startStocks : '',
                        endStocks: dataGroup === 'currentDataTable' ? item.endStocks : '',
                        receiveMaterial: dataGroup === 'currentDataTable' ? item.receiveMaterial : '',
                        changer: item.changer,
                        changed: item.changed
                    };
                    Object.assign(materialMap, listitem);
                    materialMap.mainId = item.id;
                    finalData.push(materialMap)
                })
            }
            this.currentDataTable = JSON.parse(JSON.stringify(finalData));
            this.orgDataTable = JSON.parse(JSON.stringify(finalData));
            this.spanOneArr = this.merge(this.currentDataTable);
        }

        // 处理数据
        processData(data, dataGroup): MaterialMap[] {
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
                        bottleLine: dataGroup === 'currentDataTable' ? '' : item.bottleLine,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        materialUnit: item.materialUnit,
                        materialUnitName: dataGroup === 'currentDataTable' ? item.materialUnitName : '',
                        needNum: item.needNum,
                        materialStatus: dataGroup === 'currentDataTable' ? item.materialStatus : '',
                        materialType: dataGroup === 'currentDataTable' ? item.materialType : '',
                        startStocks: dataGroup === 'currentDataTable' ? item.startStocks : '',
                        endStocks: dataGroup === 'currentDataTable' ? item.endStocks : '',
                        receiveMaterial: dataGroup === 'currentDataTable' ? item.receiveMaterial : '',
                        changer: item.changer,
                        changed: item.changed
                    };
                    Object.assign(materialMap, listitem);
                    materialMap.mainId = item.id;
                    finalData.push(materialMap)
                })
            });
            return finalData
        }

        // 设置合并行
        merge(tableData): number[] {
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
            return spanOneArr
        }

        // 合并行
        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 5) {
                return {
                    rowspan: this.spanOneArr[rowIndex],
                    colspan: this.spanOneArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        spanTwoMethod(data, rowIndex, columnIndex) {
            if (columnIndex <= 4) {
                return {
                    rowspan: data.spanArr[rowIndex],
                    colspan: data.spanArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        // 拆分
        SplitDate(str, row, index) {
            this[str].splice(index + this[str].filter(item => item.merge === row.merge).length, 0, {
                batchArr: row.batchArr,
                merge: row.merge,
                id: '',
                batch: '',
                orderId: row.orderId,
                orderNo: row.orderNo,
                posnr: row.posnr,
                mainId: row.mainId,
                materialType: row.materialType,
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
                realUseAmount: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber()
            });
            this.spanOneArr = this.merge(this.currentDataTable);
        }

        SplitDateS(data, row, index) {
            let sterilizeStorageNo = ''
            const dataArr = data.data.filter(it => it.merge === row.merge && it.delFlag !== 1);
            if (dataArr.length) {
                sterilizeStorageNo = String(Number(dataArr[dataArr.length - 1].sterilizeStorageNo) + 1)
            }
            data.data.splice(index + data.data.filter(item => item.merge === row.merge).length, 0, {
                merge: row.merge,
                id: '',
                batch: '',
                orderId: row.orderId,
                orderNo: row.orderNo,
                posnr: row.posnr,
                mainId: row.mainId,
                bottleLine: row.bottleLine,
                materialType: row.materialType,
                materialCode: row.materialCode,
                materialName: row.materialName,
                materialStatus: row.materialStatus,
                materialUnit: row.materialUnit,
                needNum: row.needNum,
                endStocks: row.endStocks,
                startStocks: row.startStocks,
                receiveMaterial: row.receiveMaterial,
                startDate: dataArr[dataArr.length - 1].endDate || '',
                splitFlag: 'Y',
                delFlag: 0,
                realUsed: dataArr[dataArr.length - 1].realUsed || '',
                sterilizePotNo: '',
                sterilizeStorageNo: sterilizeStorageNo,
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber()
            });
            data.spanArr = this.merge(data.data);
            // this.$nextTick(() => {
            //     this.$refs.materialS.bodyWrapper.scrollTop = this.$refs.materialS.bodyWrapper.scrollHeight;
            // });
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
        delMaterial(row, str, data) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
                if (str === 'materialS') {
                    data.spanArr = this.merge(data)
                } else {
                    this.spanOneArr = this.merge(this.currentDataTable);
                }
            });
        }

        // get getEndStocks() {
        //     return (row) => {
        //         const dataArr = this.currentDataTable.filter(it => it.merge === row.merge && it.delFlag !== 1);
        //         const num = dataArr.reduce((total, currentValue: MaterialMap) => {
        //             return total + Number(currentValue.realUseAmount)
        //         }, 0);
        //         const realLossNum = dataArr.reduce((total, currentValue: MaterialMap) => {
        //             return total + (currentValue.realLoss ? Number(currentValue.realLoss) : 0)
        //         }, 0);
        //         const startStocksNum = dataArr.reduce((total, currentValue: MaterialMap) => {
        //             return total + (currentValue.startStocks ? Number(currentValue.startStocks) : 0)
        //         }, 0);
        //         const sumnum = Number(startStocksNum) - Number(num) - Number(realLossNum);
        //         dataArr.forEach(item => {
        //             item.endStocks = sumnum
        //         })
        //         return sumnum
        //     }
        // }

        materialCount(data) {
            let scrapNum = 0;
            data.map((item: MaterialMap) => {
                if (item.delFlag !== 1) {
                    scrapNum = accAdd(scrapNum, Number(item.realUsed));
                }
            });
            return scrapNum;
        }

    }
interface BatchArr{
    id?: string;
    useMaterialAmount?: string;
}
interface MaterialArr{
    data: MaterialMap[];
    spanArr: number[];
}
interface MaterialMap{
    merge?: number;
    batchData?: BatchArr[];
    mainId: string;
    id: string;
    delFlag?: number;
    original?: boolean;
    bottleLine?: string;
    orderId?: string;
    orderNo?: string;
    posnr?: string;
    factory?: string;
    realLoss?: string | number;
    checkStatus?: string;
    materialType?: string;
    materialCode?: string;
    materialName?: string;
    materialStatus?: string;
    materialUnit?: string;
    materialUnitName?: string;
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
    pkgSemiMaterialDelete: string[];
    pkgSemiMaterialItemDelete: string[];
    pkgSemiMaterialInsert: MaterialMap[];
    pkgSemiMaterialUpdate: MaterialMap[];
}
interface OrderData{
    factoryName?: string;
    changed?: string;
    countMan?: number;
    countOutput?: number;
    countOutputUnit?: string;
    dispatchMan?: string;
    exceptionDateCount?: number;
    factory?: string;
    factoryCode?: string;
    germs?: number;
    id?: string;
    materialCode?: string;
    materialName?: string;
    operator?: string;
    operatorDate?: string;
    orderEndDate?: string;
    orderId?: string;
    orderNo?: string;
    orderStartDate?: string;
    orderStatus?: string;
    orderStatusName?: string;
    orderType?: string;
    outputUnit?: string;
    planOutput?: number;
    productDate?: string;
    productLine?: string;
    productLineName?: string;
    realInAmount?: number;
    realOutput?: number;
    version?: number;
    workShop?: string;
    workShopName?: string;
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
