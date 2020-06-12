<template>
    <div>
        <div class="tab__heads clearfix">
            <i class="title-icon" />
            <span>称重记录：g</span>
            <div style="float: right;">
                <el-button :disabled="!isRedact" type="primary" size="small" @click="weightAddRow()">
                    新增
                </el-button>
            </div>
        </div>
        <el-table ref="table2" class="newTable" header-row-class-name="tableHead" :data="weightList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column width="195">
                <template slot="header">
                    <i class="reqI">*</i><span>检测时间</span>
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.recordDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 170px;" placeholder="请选择时间" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="第一排净含量" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.netWeightOne" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'netWeightOne')" />
                </template>
            </el-table-column>
            <el-table-column label="第一排调称" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.adjustmentOne" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'adjustmentOne')" />
                </template>
            </el-table-column>
            <el-table-column label="第二排净含量" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.netWeightTwo" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'netWeightTwo')" />
                </template>
            </el-table-column>
            <el-table-column label="第二排调称" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.adjustmentTwo" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'adjustmentTwo')" />
                </template>
            </el-table-column>
            <el-table-column label="第三排净含量" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.netWeightThree" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'netWeightThree')" />
                </template>
            </el-table-column>
            <el-table-column label="第三排调称" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.adjustmentThree" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'adjustmentThree')" />
                </template>
            </el-table-column>
            <el-table-column label="第四排净含量" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.netWeightFour" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'netWeightFour')" />
                </template>
            </el-table-column>
            <el-table-column label="第四排调称" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.adjustmentFour" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'adjustmentFour')" />
                </template>
            </el-table-column>
            <el-table-column label="酱盒重量下限" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.boxWeightFloor" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'boxWeightFloor')" />
                </template>
            </el-table-column>
            <el-table-column label="酱盒重量上限" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.boxWeightCeiling" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(weightList,scope.$index,'boxWeightCeiling')" />
                </template>
            </el-table-column>
            <el-table-column label="厂家" width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.manufactor" :disabled="!isRedact" maxlength="64" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="备注" width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" :disabled="!isRedact" maxlength="200" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="记录人" width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.changer" disabled size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                    <el-button :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="weightDelRow(scope.row,scope.$index)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
    import { PKG_API } from 'common/api/api';
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber, compareObject } from 'utils/utils';
    @Component({
        name: 'Weight',
        components: {
        }
    })

    export default class Weight extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        weightList: WeightData[] = [];
        originWeightList: WeightData[] = [];
        weightDelList: string[] = [];
        orderNo = ''
        orderId = ''

        init(formHeader) {
            PKG_API.PKG_CHECKDATA_WEIGHT_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo
            }).then(({ data }) => {
                if (data.data !== null) {
                    this.originWeightList = JSON.parse(JSON.stringify(data.data))
                    this.weightList = data.data
                }
            })
            this.orderNo = formHeader.orderNo
            this.orderId = formHeader.id
        }

        weightAddRow() {
            const newRow: WeightData = {
                id: '',
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.orderNo,
                orderId: this.orderId,
                recordDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                netWeightOne: '',
                adjustmentOne: '',
                netWeightTwo: '',
                adjustmentTwo: '',
                netWeightThree: '',
                adjustmentThree: '',
                netWeightFour: '',
                adjustmentFour: '',
                boxWeightFloor: '',
                boxWeightCeiling: '',
                manufactor: '',
                remark: '',
                changer: getUserNameNumber()
            }
            if (this.weightList.length) {
                const last = JSON.parse(JSON.stringify(this.weightList[this.weightList.length - 1]));
                newRow.boxWeightFloor = last.boxWeightFloor;
                newRow.boxWeightCeiling = last.boxWeightCeiling;
                newRow.manufactor = last.manufactor;
            }
            this.weightList.push(newRow);
        }

        weightDelRow(row, index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.id.length) {
                    this.weightDelList.push(row.id);
                }
                this.weightList.splice(index, 1);
            });
        }

        weightDataRul() {
            let weightRul = true
            this.weightList.some(item => {
                if (!item.recordDate) {
                    this.$warningToast('称重纪录检测时间必填')
                    weightRul = false
                    return true
                }
            })
            return weightRul
        }

        returnWeightData() {
            const inserts: WeightData[] = []
            const updates: WeightData[] = []
            const pkgWeight = {
                pkgWeightDelete: JSON.parse(JSON.stringify(this.weightDelList)),
                pkgWeightInsert: inserts,
                pkgWeightUpdate: updates
            }
            this.weightList.some(item => {
                if (item.id === '') {
                    pkgWeight.pkgWeightInsert.push(item);
                } else {
                    this.originWeightList.forEach(newItem => {
                        if (newItem.id === item.id) {
                            if (!compareObject(item, newItem)) {
                                pkgWeight.pkgWeightUpdate.push(item);
                            }
                        }
                    })
                }
            })
            return pkgWeight
        }

        cancelWeightData() {
            this.weightList = JSON.parse(JSON.stringify(this.originWeightList))
        }

        changeInputType(arr, index, type) {
            this.$nextTick(() => {
                console.log(index);
                // 先把非数字的都替换掉(空)，除了数字和.
                arr[index][type] = arr[index][type].replace(/[^\d.]/g, '');
                // 如果第一个字符为.则替换为0.
                arr[index][type] = arr[index][type].replace(/^\./g, '0.');
                //保证不能出现..
                arr[index][type] = arr[index][type].replace(/\.{2,}/g, '.');
                // 如果第一个数字为0则之后只能输入.
                arr[index][type] = arr[index][type].replace(/^0[^\.]+/g, '0');
                //保留两位小数
                arr[index][type] = arr[index][type].replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
            });
        }
    }
interface WeightData {
    id?: string;
    factory?: string;
    orderNo?: string;
    orderId?: string;
    recordDate?: string;
    netWeightOne?: string;
    adjustmentOne?: string;
    netWeightTwo?: string;
    adjustmentTwo?: string;
    netWeightThree?: string;
    adjustmentThree?: string;
    netWeightFour?: string;
    adjustmentFour?: string;
    boxWeightFloor?: string;
    boxWeightCeiling?: string;
    manufactor?: string;
    remark?: string;
    changer?: string;
}

</script>

<style scoped>
.tab__heads {
    margin-bottom: 10px;
    line-height: 32px;
}
.title-icon {
    float: left;
    width: 4px;
    height: 12px;
    margin-top: 10px;
    margin-right: 5px;
    background: #487bff;
    border-radius: 2px;
}
</style>
