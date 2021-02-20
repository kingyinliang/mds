<template>
    <el-dialog title="订单拆分" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1200px" custom-class="dialog__class">
        <div style="text-align: right;">
            <el-button v-if="isAuth('kjSplitAdd')" type="primary" size="small" @click="addSplitTable">
                新增
            </el-button>
        </div>
        <el-table :data="splitTable.filter(item=>item.delFlag!==1)" :row-class-name="rowDelFlag" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
            <el-table-column type="index" :index="index => getIndexMethod(index, splitTable.filter(item=>item.delFlag!==1))" width="55" label="序号" fixed align="center" />
            <el-table-column label="曲房状态" width="80" prop="statusName" :show-overflow-tooltip="true" />
            <el-table-column label="生产订单" width="120" prop="orderNo" :show-overflow-tooltip="true" />
            <el-table-column min-width="250" label="生产物料" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                </template>
            </el-table-column>
            <el-table-column label="计划数量" width="100" prop="planOutput" />
            <el-table-column label="单位" width="70" prop="outputUnitName" />
            <el-table-column label="曲房号" width="160" prop="kojiHouseNo" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">* </span>曲房号
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.kojiHouseNo" size="small" filterable clearable :disabled="!['N','S','R'].includes(scope.row.status)" @change="changeKojiHouseNoControl(scope.row)">
                        <el-option
                            v-for="item in kojiHouseNoOptions"
                            :key="item.optValue"
                            :label="item.optLabel"
                            :value="item.optValue"
                        />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="发酵罐/池" width="160" prop="fermentPotNo" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.fermentPotNo" size="small" :disabled="!['N','S','R'].includes(scope.row.status) || unchangeableFermentPotNo" filterable clearable @change="val=>setTheSameFermentPot(val,scope.row)">
                        <el-option
                            v-for="item in fermentPotNoOptions"
                            :key="item.optValue"
                            :label="item.optLabel"
                            :value="item.optValue"
                        />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="入曲日期" width="180" prop="addKojiDate" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">* </span>入曲日期
                </template>
                <template slot-scope="scope">
                    <el-date-picker
                        v-model="scope.row.addKojiDate"
                        type="date"
                        placeholder="选择日期"
                        size="small"
                        style="width: 150px;"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        :disabled="!['N','S','R'].includes(scope.row.status)||!scope.row.isChangeAddKojiDate"
                        @change="val=>{checkKojiDate(val,scope.row)}"
                        @blur="checkKojiDateEvent(scope.row,'blur')"
                        @focus="checkKojiDateEvent(scope.row,'focus')"
                    />
                </template>
            </el-table-column>
            <el-table-column label="出曲日期" width="160" prop="outKojiDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.outKojiDate }}
                </template>
            </el-table-column>
            <el-table-column label="操作人" width="160" prop="operator" :show-overflow-tooltip="true" />
            <el-table-column label="操作时间" width="180" prop="operateTime" :show-overflow-tooltip="true" />
            <el-table-column label="操作" fixed="right" align="center" width="80">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('kjSplitDel')" type="text" icon="el-icon-delete" :disabled="scope.row.status !== 'S' && scope.row.status !== 'N'" @click="removeDataRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button v-if="isAuth('kjSplitcnf')" type="primary" :disabled="splitTable.length===0" @click="submitForm()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber, getNewDay } from 'utils/utils';
    import _ from 'lodash';

    @Component
    export default class OrderSplitDialog extends Vue {
        dialogFormVisible = false;
        fermentPotNoOptions: OptionObj[] = [];
        kojiHouseNoOptions: OptionObj[] = [];
        splitTable: SplitObj[] = [];
        orgSplitTable: SplitObj[] = [];
        orderObj: OrderObject;
        orderStatusMapping: object={}

        init(row, orderStatusMapping) {
            this.getFermentationHolder() // 发酵罐下拉
            this.getKojiHolder(row) // 曲房号下拉
            this.orderObj = row;
            this.orderStatusMapping = orderStatusMapping
            KOJI_API.ORDER_SPLITE_QUERY_BY_ID_API({
                current: 1,
                size: 9999,
                orderNo: row.orderNo
            }).then(({ data }) => {
                this.dialogFormVisible = true;
                this.splitTable = JSON.parse(JSON.stringify(data.data.records))
                this.splitTable.forEach(item => {
                    this.$set(item, 'statusName', this.orderStatusMapping[item.status])
                    this.$set(item, 'isChangeAddKojiDate', true)
                    this.$set(item, 'delFlag', 0)
                })
                this.orgSplitTable = JSON.parse(JSON.stringify(this.splitTable))
            })

        }

        // 只要有一个不是 ['N', 'S', 'R'] 三个可编辑状态，就都不可修改
        get unchangeableFermentPotNo() {
            return this.splitTable.some(item => !['N', 'S', 'R'].includes(item.status))
        }

        // 同步发酵罐值
        setTheSameFermentPot(val, item) {
            console.log(item)
            if (val !== '') {
                const fermentPotIdTemp = this.fermentPotNoOptions.filter(subItem => subItem.optValue === item.fermentPotNo)[0].optId
                const fermentPotNameTemp = this.fermentPotNoOptions.filter(subItem => subItem.optValue === item.fermentPotNo)[0].optLabel
                this.splitTable.forEach(element => {
                    element.fermentPotNo = item.fermentPotNo
                    element.fermentPotId = fermentPotIdTemp
                    element.fermentPotName = fermentPotNameTemp
                })
            } else {
                this.splitTable.forEach(element => {
                    element.fermentPotNo = ''
                    element.fermentPotId = ''
                    element.fermentPotName = ''
                })
            }

        }

        // 确认同曲房下是否有同日期
        changeKojiHouseNoControl(item) {

            if (this.checkTheSame()) {
                this.$warningToast('同一个订单同一个制曲日期下，不允许曲房重复')
                item.kojiHouseNo = ''
                item.kojiHouseId = ''
                item.kojiHouseName = ''
                return
            }
            item.kojiHouseId = this.kojiHouseNoOptions.filter(element => element.optValue === item.kojiHouseNo)[0].optId
            item.kojiHouseName = this.kojiHouseNoOptions.filter(element => element.optValue === item.kojiHouseNo)[0].optLabel


        }

        checkTheSame() {
            const tempCheckArray: string[] = []
            const tempSplitTable: object[] = []
            this.splitTable.forEach(item => {
                if (item.kojiHouseNo && item.addKojiDate && item.delFlag !== 1) {
                    tempSplitTable.push(item)
                    const temp = `${item.kojiHouseNo}-${item.addKojiDate}`
                    if (!(tempCheckArray.includes(temp))) {
                        tempCheckArray.push(`${item.kojiHouseNo}-${item.addKojiDate}`)
                    }
                }
            })

            if (tempCheckArray.length === tempSplitTable.length) {
                return false
            }
            return true
        }

        checkKojiDateEvent(item, event) {
            KOJI_API.ORDER_SPLITE_DELETE_VALIDATEDATE_API({
                date: item.addKojiDate,
                workShop: this.orderObj.workShop
            }).then(({ data }) => {
                if (data.data.length !== 0) {
                    if (event === 'blur') {
                        this.$warningToast(`此日期关联订单人工工时已提交，订单不调整至此日期下，请取消已审核订单：${data.data.join(',')}`)
                        item.outKojiDate = ''
                        item.addKojiDate = ''
                    }

                    if (event === 'focus') {
                        this.$warningToast(`关联订单人工工时已提交，此订单不可调整入曲日期，请取消已审核订单：${data.data.join(',')}`)
                        item.isChangeAddKojiDate = false
                    }
                }
            })
        }

        // 确认同日期下是否有同曲房
        checkKojiDate(val, item) {
            if (this.checkTheSame()) {
                this.$warningToast('同一个订单同一个制曲日期下，不允许曲房重复')
                item.addKojiDate = ''
                item.outKojiDate = ''
            } else {
                item.outKojiDate = getNewDay(item.addKojiDate, 2)
            }


        }

        // 获取发酵罐下拉选项
        getFermentationHolder() {
            COMMON_API.HOLDER_QUERY_BY_NOPAGE_API({
                // deptId: params.workShop,
                holderStatus: 'E',
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: '001'
            }).then(({ data }) => {
                this.fermentPotNoOptions = []
                data.data.forEach(item => {
                    this.fermentPotNoOptions.push({ optLabel: item.holderName, optValue: item.holderNo, optId: item.id })
                })
            })
        }

        // 获取曲房下拉选项
        getKojiHolder(params) {
            COMMON_API.HOLDER_QUERY_BY_NOPAGE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: params.workShop,
                holderType: '005'
            }).then(({ data }) => {
                this.kojiHouseNoOptions = []
                data.data.forEach(item => {
                    this.kojiHouseNoOptions.push({ optLabel: item.holderName, optValue: item.holderNo, optId: item.id })
                })
            })
        }

        // 新增 item
        addSplitTable() {

            const splitTableTemp: SplitObj[] = this.splitTable.filter(item => item.delFlag !== 1)
            const splitTableTempLength = splitTableTemp.length

            if (splitTableTempLength !== 0) {
                this.splitTable.push({
                    id: '',
                    delFlag: 0,
                    isChangeAddKojiDate: true, // 是否可改变入曲时间改变
                    addKojiDate: this.orderObj.orderStartDate,
                    fermentPotId: splitTableTemp[splitTableTempLength - 1].fermentPotId,
                    fermentPotNo: splitTableTemp[splitTableTempLength - 1].fermentPotNo,
                    fermentPotName: splitTableTemp[splitTableTempLength - 1].fermentPotName,
                    orderNo: this.orderObj.orderNo,
                    kojiHouseId: this.orderObj.kojiHouseId,
                    kojiHouseNo: '',
                    materialCode: this.orderObj.materialCode,
                    materialName: this.orderObj.materialName,
                    // orderId: string;
                    orderType: this.orderObj.orderType,
                    outKojiDate: getNewDay(this.orderObj.orderStartDate, 2),
                    productDate: this.orderObj.productDate,
                    statusName: '未录入',
                    status: 'N',
                    workShopName: this.orderObj.workShopName,
                    workShop: this.orderObj.workShop,
                    planOutput: this.orderObj.planOutput,
                    outputUnit: this.orderObj.outputUnit,
                    outputUnitName: this.orderObj.outputUnitName,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber(),
                    operator: getUserNameNumber(),
                    operateTime: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                })

            } else {
                this.splitTable.push({
                    id: '',
                    delFlag: 0,
                    isChangeAddKojiDate: true, // 是否可改变入曲时间改变
                    addKojiDate: this.orderObj.orderStartDate,
                    // fermentPotId: this.fermentPotNoOptions[0].optId,
                    // fermentPotNo: this.fermentPotNoOptions[0].optValue,
                    // fermentPotName: this.fermentPotNoOptions[0].optLabel,
                    fermentPotId: '',
                    fermentPotNo: '',
                    fermentPotName: '',
                    orderNo: this.orderObj.orderNo,
                    kojiHouseId: this.orderObj.kojiHouseId,
                    kojiHouseNo: '',
                    materialCode: this.orderObj.materialCode,
                    materialName: this.orderObj.materialName,
                    // orderId: string;
                    orderType: this.orderObj.orderType,
                    outKojiDate: getNewDay(this.orderObj.orderStartDate, 2),
                    productDate: this.orderObj.productDate,
                    statusName: '未录入',
                    status: 'N',
                    workShopName: this.orderObj.workShopName,
                    workShop: this.orderObj.workShop,
                    planOutput: this.orderObj.planOutput,
                    outputUnit: this.orderObj.outputUnit,
                    outputUnitName: this.orderObj.outputUnitName,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber(),
                    operator: getUserNameNumber(),
                    operateTime: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                })
            }

        }

        submitForm() {
            const dataArr = this.splitTable.filter(it => it.delFlag !== 1)
            // eslint-disable-next-line
            const productDateMap: any[] = [];

            for (let i = 0; i < dataArr.length; i++) {
                if (!dataArr[i].kojiHouseNo || !dataArr[i].addKojiDate) {
                    this.$warningToast('请填写必填项');
                    return false
                }
                if (dataArr[i].productDate) {
                    productDateMap.push(dataArr[i].productDate);
                }
            }
            const submitObj: SubmitObj = {
                orderId: this.orderObj.id,
                orderNo: this.orderObj.orderNo,
                orderStatus: this.orderObj.orderStatus,
                deleteIds: [],
                insertList: [],
                updateList: []
            };
            this.splitTable.forEach((item, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        submitObj.deleteIds.push(item.id);
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.orgSplitTable[index], item)) {
                        submitObj.updateList.push(item);
                    }
                } else {
                    submitObj.insertList.push(item);
                }
            })
            KOJI_API.ORDER_SPLITE_SAVE_API(submitObj).then(({ data }) => {
                this.$successToast(data.msg);
                this.dialogFormVisible = false;
                this.$emit('getList');
            })
        }

        // 删除 item
        removeDataRow(row) {
            if (row.canBeDeleted === '0') {
                if (row.materialFlag === '1') {
                    this.$warningToast('该曲房订单下存在领料数据，请删除数据后再删除曲房订单');
                    return;
                }
                if (row.manHourFlag === '1') {
                    this.$warningToast('关联订单人工工时已提交，此订单不可删除，请取消已审核订单：' + row.manHourOrders);
                    return;
                }
                return;
            }
            this.$confirm('确定是否删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.id) {
                    KOJI_API.ORDER_SPLITE_REMOVE_VALIDATEDATE_API({
                        kojiOrderNo: row.kojiOrderNo
                    }).then(({ data }) => {
                        if (data.data === true) {
                            this.$set(row, 'delFlag', 1)
                        } else {
                            this.$warningToast(`该曲房订单下存在领料数据，请删除数据后再删除曲房订单`)
                        }
                    })
                } else {
                    this.$set(row, 'delFlag', 1)
                }
            });
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }
    }
    interface OptionObj {
        optLabel?: string;
        optValue?: string;
        optId?: string;
    }

    interface CheckObj {
        kojiHouseNo?: string;
        addKojiDate?: string;
    }

    interface SubmitObj {
        orderId?: string;
        orderNo?: string;
        orderStatus?: string;
        deleteIds: string[];
        insertList: SplitObj[];
        updateList: SplitObj[];
    }
    interface SplitObj {
        isChangeAddKojiDate?: boolean;
        statusName?: string;
        delFlag?: number;
        addKojiDate?: string;
        changed?: string;
        changer?: string;
        fermentPotId?: string;
        fermentPotNo?: string;
        fermentPotName?: string;
        id?: string;
        kojiHouseId?: string;
        kojiHouseNo?: string;
        kojiHouseName?: string;
        materialCode?: string;
        materialName?: string;
        orderId?: string;
        orderNo?: string;
        orderType?: string;
        outKojiDate?: string;
        productDate?: string;
        status: string;
        workShop?: string;
        workShopName?: string;
        planOutput?: number;
        outputUnit?: string;
        outputUnitName?: string;
        canBeDeleted?: string;
        operateTime?: string;
        operator?: string;
    }

    interface OrderObject {
        changed: string;
        changer: string;
        countMan: number;
        countOutput: number;
        countOutputUnit: string;
        deviceTime: number;
        dispatchMan: string;
        exceptionDateCount: number;
        factory: string;
        factoryName: string;
        germs: number;
        id: string;
        materialCode: string;
        materialName: string;
        operator: string;
        operatorDate: string;
        orderEndDate: string;
        orderNo: string;
        orderStartDate: string;
        orderStatus: string;
        orderStatusName: string;
        orderType: string;
        outputUnit: string;
        outputUnitName: string;
        planOutput: number;
        productDate: string;
        productLine: string;
        productLineName: string;
        readyTime: number;
        realInAmount: number;
        realOutput: number;
        userTime: number;
        workShop: string;
        workShopName: string;
        fermentPotId: string;
        kojiHouseId: string;
    }
</script>

<style scoped>

</style>
