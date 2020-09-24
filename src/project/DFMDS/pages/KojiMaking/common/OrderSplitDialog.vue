<template>
    <el-dialog title="订单拆分" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1200px" custom-class="dialog__class">
        <div style="text-align: right;">
            <el-button v-if="isAuth('steSplit')" type="primary" size="small" @click="addSplitTable">
                新增
            </el-button>
        </div>
        <el-table :data="splitTable" :row-class-name="rowDelFlag" header-row-class-name="tableHead" class="newTable" border tooltip-effect="dark">
            <el-table-column type="index" width="55" label="序号" fixed align="center" />
            <el-table-column label="曲房状态" width="80" prop="status" :show-overflow-tooltip="true" />
            <el-table-column label="生产订单" width="120" prop="orderNo" :show-overflow-tooltip="true" />
            <el-table-column min-width="250" label="生产物料" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                </template>
            </el-table-column>
            <el-table-column label="计划数量" width="100" prop="planOutput" />
            <el-table-column label="单位" width="70" prop="outputUnit" />
            <el-table-column label="曲房号" width="160" prop="kojiHouseNo" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">* </span>曲房号
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.kojiHouseNo" size="small" filterable clearable :disabled="!['N','S','R'].includes(scope.row.status)">
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
                    <el-select v-model="scope.row.fermentPotNo" size="small" :disabled="!['N','S','R'].includes(scope.row.status)" filterable clearable>
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
                    <el-date-picker v-model="scope.row.addKojiDate" type="date" placeholder="选择日期" size="small" style="width: 150px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="!['N','S','R'].includes(scope.row.status)" @change="val=>{checkDate(val,scope.row)}" />
                </template>
            </el-table-column>
            <el-table-column label="出曲日期" width="160" prop="outKojiDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <!-- <el-date-picker v-model="scope.row.outKojiDate" type="date" placeholder="选择日期" size="small" style="width: 140px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" /> -->
                    {{ scope.row.outKojiDate }}
                </template>
            </el-table-column>
            <el-table-column label="操作人" width="160" prop="changer" :show-overflow-tooltip="true" />
            <el-table-column label="操作时间" width="180" prop="changed" :show-overflow-tooltip="true" />
            <el-table-column label="操作" fixed="right" align="center" width="80">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('steSplit')" type="text" icon="el-icon-delete" :disabled="['D','C','P'].includes(orderObj.orderStatus)" @click="removeDataRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" :disabled="splitTable.length===0" @click="submitForm()">确定</el-button>
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


        init(row) {
            console.log('弹窗过来数据！')
            console.log(row)
            this.getFermentationHolder() // 发酵罐下拉
            this.getKojiHolder(row) // 曲房号下拉
            KOJI_API.ORDER_SPLITE_QUERY_BY_ID_API({
                current: 1,
                size: 9999,
                orderNo: row.orderNo
            }).then(({ data }) => {
                console.log('拆分回传！')
                console.log(data)
                this.orderObj = row;
                this.dialogFormVisible = true;
                this.splitTable = JSON.parse(JSON.stringify(data.data.records))
                this.orgSplitTable = JSON.parse(JSON.stringify(data.data.records))
            })

        }

        // 确认同日期下是否有多车间
        checkDate(val, row) {
            console.log(val)
            console.log(row)
            // this.splitTable.forEach(item => {
            //     if (item.addKojiDate === val) {
            //         if (item.status === 'C' && item.id !== row.id) {
            //             this.$warningToast('关联订单人工工时已提交，此订单不可调整入曲日期，请取消已审核订单：831000019423，831000019423');
            //             return false
            //         }
            //     }
            // })

            row.outKojiDate = getNewDay(row.addKojiDate, 2)
        }

        getFermentationHolder() {
            COMMON_API.HOLDER_QUERY_API({
                // deptId: params.workShop,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: '001',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                this.fermentPotNoOptions = []
                data.data.records.forEach(item => {
                    this.fermentPotNoOptions.push({ optLabel: item.holderName, optValue: item.holderNo })
                })
            })
        }

        getKojiHolder(params) {
            COMMON_API.HOLDER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: params.workShop,
                holderType: '005',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                this.kojiHouseNoOptions = []
                data.data.records.forEach(item => {
                    this.kojiHouseNoOptions.push({ optLabel: item.holderName, optValue: item.holderNo })
                })
            })
        }

        // potNoChange(row) {
        //     const holderObj: (any) = this.holder.filter(it => it.holderNo === row.potNo);// eslint-disable-line
        //     row.potCount = holderObj[0].holderBatch;
        //     row.potAmount = holderObj[0].holderVolume;
        // }

        addSplitTable() {
            this.splitTable.push({
                id: '',
                delFlag: 0,
                addKojiDate: this.orderObj.orderStartDate,
                // fermentPotId: this.orderObj.fermentPotId,
                // fermentPotNo: this.orderObj.fermentPotNo,
                orderNo: this.orderObj.orderNo,
                // kojiHouseId: string;
                // kojiHouseNo: string;
                materialCode: this.orderObj.materialCode,
                materialName: this.orderObj.materialName,
                // orderId: string;
                // orderNo: string;
                // orderType: string;
                outKojiDate: getNewDay(this.orderObj.orderStartDate, 2),
                // productDate: Date;
                status: 'N',
                // workShop: string;
                // workShopName: string;
                planOutput: this.orderObj.planOutput,
                outputUnit: this.orderObj.outputUnit,
                outputUnitName: this.orderObj.outputUnitName,
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber()
            })
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
                // console.log(dataArr[i + 1].productDate)
                // if (dataArr[i].productDate !== dataArr[i + 1].productDate) {
                //     this.$warningToast('同一订单不允许跨天生产');
                //     return false
                // }
                if (dataArr[i].productDate) {
                    productDateMap.push(dataArr[i].productDate);
                }
            }

            const tempObj: string[] = []

            this.splitTable.forEach((item) => {

                if (!tempObj.includes(`${item.kojiHouseNo}+${item.addKojiDate}`)) {
                    tempObj.push(`${item.kojiHouseNo}+${item.addKojiDate}`)
                } else {
                    this.$warningToast('同日期下曲房不可重复');
                    return false
                }
            })

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

        // 删除行
        removeDataRow(row) {
            this.$confirm('确定是否删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
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
        delFlag?: number;
        addKojiDate?: string;
        changed?: string;
        changer?: string;
        fermentPotId?: string;
        fermentPotNo?: string;
        id?: string;
        kojiHouseId?: string;
        kojiHouseNo?: string;
        materialCode?: string;
        materialName?: string;
        orderId?: string;
        orderNo?: string;
        orderType?: string;
        outKojiDate?: string;
        productDate?: string;
        status?: string;
        workShop?: string;
        workShopName?: string;
        planOutput?: number;
        outputUnit?: string;
        outputUnitName?: string;
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
    }
</script>

<style scoped>

</style>
