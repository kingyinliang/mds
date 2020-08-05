<template>
    <div>
        <div class="tab__heads clearfix">
            <i class="title-icon" />
            <span>NR检测</span>
            <div style="float: right;">
                <el-button v-if="isAuth('pkgCkdInsert')" :disabled="!isRedact" type="primary" size="small" @click="nrAddRow()">
                    新增
                </el-button>
            </div>
        </div>
        <el-table ref="table3" class="newTable borderTable" header-row-class-name="tableHead" :data="nrList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column width="195" :show-overflow-tooltip="true">
                <template slot="header">
                    <i class="reqI">*</i><span>检测时间</span>
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.checkDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 170px;" placeholder="请选择时间" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="NR含量（%）">
                <el-table-column label="第一排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrContentOne" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrContentOne')" />
                    </template>
                </el-table-column>
                <el-table-column label="第二排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrContentTwo" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrContentTwo')" />
                    </template>
                </el-table-column>
                <el-table-column label="第三排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrContentThree" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrContentThree')" />
                    </template>
                </el-table-column>
                <el-table-column label="第四排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrContentFour" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrContentFour')" />
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="NR流量（L/min）">
                <el-table-column label="第一排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrFlowOne" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrFlowOne')" />
                    </template>
                </el-table-column>
                <el-table-column label="第二排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrFlowTwo" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrFlowTwo')" />
                    </template>
                </el-table-column>
                <el-table-column label="第三排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrFlowThree" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrFlowThree')" />
                    </template>
                </el-table-column>
                <el-table-column label="第四排" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.nrFlowFour" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrFlowFour')" />
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="罐内温度（°C）" width="140" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.potTemplate" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'potTemplate')" />
                </template>
            </el-table-column>
            <el-table-column label="NR温度（°C）" width="140" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.nrTemplate" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrTemplate')" />
                </template>
            </el-table-column>
            <el-table-column label="NR纯度（%）" width="140" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.nrFineness" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'nrFineness')" />
                </template>
            </el-table-column>
            <el-table-column label="二级储压（Mpa）" width="140">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.pressure" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'pressure')" />
                </template>
            </el-table-column>
            <el-table-column label="混合比重（%）" width="140" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.proportion" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(nrList,scope.$index,'proportion')" />
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
                    <el-button v-if="isAuth('pkgCkdDel')" :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="nrDelRow(scope.row,scope.$index)">
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
        name: 'Nr',
        components: {
        }
    })

    export default class Nr extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        nrList: NrData[] = [];
        originNrList: NrData[] = [];
        nrDelList: string[] = [];
        orderNo = ''
        orderId = ''

        init(formHeader) {
            PKG_API.PKG_CHECKDATA_NR_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo
            }).then(({ data }) => {
                  if (data.data !== null) {
                    this.originNrList = JSON.parse(JSON.stringify(data.data))
                    this.nrList = data.data
                }
            })
            this.orderNo = formHeader.orderNo
            this.orderId = formHeader.id
        }

        nrAddRow() {
            const newRow: NrData = {
                id: '',
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.orderNo,
                orderId: this.orderId,
                checkDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                nrContentOne: '',
                nrContentTwo: '',
                nrContentThree: '',
                nrContentFour: '',
                nrFlowOne: '',
                nrFlowTwo: '',
                nrFlowThree: '',
                nrFlowFour: '',
                potTemplate: '',
                nrTemplate: '',
                nrFineness: '',
                pressure: '',
                proportion: '',
                remark: '',
                changer: getUserNameNumber()
            }
            if (this.nrList.length) {
                const last = JSON.parse(JSON.stringify(this.nrList[this.nrList.length - 1]));
                newRow.nrFlowOne = last.nrFlowOne;
                newRow.nrFlowTwo = last.nrFlowTwo;
                newRow.nrFlowThree = last.nrFlowThree;
                newRow.nrFlowFour = last.nrFlowFour;
            }
            this.nrList.push(newRow);
        }

        nrDelRow(row, index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.id.length) {
                    this.nrDelList.push(row.id);
                }
                this.nrList.splice(index, 1);
            });
        }

        nrDataRul() {
            let nrRul = true
            this.nrList.some(item => {
                if (!item.checkDate) {
                    this.$warningToast('NR检测检测时间必填')
                    nrRul = false
                    return true
                }
            })
            return nrRul
        }

        returnNrData() {
            const inserts: NrData[] = []
            const updates: NrData[] = []
            const pkgNr = {
                pkgNrDelete: JSON.parse(JSON.stringify(this.nrDelList)),
                pkgNrInsert: inserts,
                pkgNrUpdate: updates
            }
            this.nrList.some(item => {
                if (item.id === '') {
                    pkgNr.pkgNrInsert.push(item);
                } else {
                    this.originNrList.forEach(newItem => {
                        if (newItem.id === item.id) {
                            if (!compareObject(item, newItem)) {
                                pkgNr.pkgNrUpdate.push(item);
                            }
                        }
                    })
                }
            })
            return pkgNr
        }

        cancelNrData() {
            this.nrList = JSON.parse(JSON.stringify(this.originNrList))
        }

        changeInputType(arr, index, type) {
            // 先把非数字的都替换掉(空)，除了数字和.
            arr[index][type] = arr[index][type].replace(/[^\d.]/g, '');
            // 如果第一个字符为.则替换为0.
            arr[index][type] = arr[index][type].replace(/^\./g, '0.');
            //保证不能出现..
            arr[index][type] = arr[index][type].replace(/\.{2,}/g, '.');
            // 如果第一个数字为0则之后只能输入.
            arr[index][type] = arr[index][type].replace(/^0[^\.]+/g, '0');
            //只允许输入一个小数点
            arr[index][type] = arr[index][type].replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
            //保留两位小数
            arr[index][type] = arr[index][type].replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        }
    }

interface NrData {
    id?: string;
    factory?: string;
    orderNo?: string;
    orderId?: string;
    checkDate?: string;
    nrContentOne?: string;
    nrContentTwo?: string;
    nrContentThree?: string;
    nrContentFour?: string;
    nrFlowOne?: string;
    nrFlowTwo?: string;
    nrFlowThree?: string;
    nrFlowFour?: string;
    potTemplate?: string;
    nrTemplate?: string;
    nrFineness?: string;
    pressure?: string;
    proportion?: string;
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
