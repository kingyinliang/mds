<template>
    <div>
        <div class="tab__heads clearfix">
            <i class="title-icon" />
            <span>密封度：Kpa</span>
            <div style="float: right;">
                <el-button v-if="isAuth('pkgCkdInsert')" :disabled="!isRedact" type="primary" size="small" @click="sealAddRow()">
                    新增
                </el-button>
            </div>
        </div>
        <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="sealList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column width="195">
                <template slot="header">
                    <i class="reqI">*</i><span>检测时间</span>
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.checkDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 170px;" placeholder="请选择时间" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="第一排" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.pressOne" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(sealList,scope.$index,'pressOne')" />
                </template>
            </el-table-column>
            <el-table-column label="第二排" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.pressTwo" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(sealList,scope.$index,'pressTwo')" />
                </template>
            </el-table-column>
            <el-table-column label="第三排" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.pressThree" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(sealList,scope.$index,'pressThree')" />
                </template>
            </el-table-column>
            <el-table-column label="第四排" width="120" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.pressFour" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(sealList,scope.$index,'pressFour')" />
                </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" :disabled="!isRedact" maxlength="200" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="记录人" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.changer" disabled size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('pkgCkdDel')" :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="sealDelRow(scope.row,scope.$index)">
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
        name: 'Seal',
        components: {
        }
    })

    export default class Seal extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        sealList: SealData[] = []
        orginSealList: SealData[] = []
        sealDelList: string[] = []
        orderNo = ''
        orderId = ''

        init(formHeader) {
            PKG_API.PKG_CHECKDATA_SEAL_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo
            }).then(({ data }) => {
                if (data.data !== null) {
                    this.orginSealList = JSON.parse(JSON.stringify(data.data))
                    this.sealList = data.data
                }
            })
            this.orderNo = formHeader.orderNo
            this.orderId = formHeader.id
        }

        sealAddRow() {
            if (this.sealList.length) {
                const newRow = JSON.parse(JSON.stringify(this.sealList[this.sealList.length - 1]))
                newRow.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                newRow.id = ''
                newRow.checkDate = dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
                this.sealList.push(newRow);
            } else {
                const newRow: SealData = {
                    id: '',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    orderNo: this.orderNo,
                    orderId: this.orderId,
                    checkDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                    pressOne: '',
                    pressTwo: '',
                    pressThree: '',
                    pressFour: '',
                    remark: '',
                    changer: getUserNameNumber()
                }
                this.sealList.push(newRow);
            }
        }

        sealDelRow(row, index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.id.length) {
                    this.sealDelList.push(row.id);
                }
                this.sealList.splice(index, 1);
            });
        }

        sealDataRul() {
            let sealRul = true
            this.sealList.some(item => {
                if (!item.checkDate) {
                    this.$warningToast('密封度检测检测时间必填')
                    sealRul = false
                    return true;
                }
            })
            return sealRul
        }

        returnSealData() {
            const inserts: SealData[] = []
            const updates: SealData[] = []
            const pkgSeal = {
                sealDels: JSON.parse(JSON.stringify(this.sealDelList)),
                sealInserts: inserts,
                sealUpdates: updates
            }
            this.sealList.some(item => {
                if (item.id === '') {
                    pkgSeal.sealInserts.push(item);
                } else {
                    this.orginSealList.forEach(newItem => {
                        if (newItem.id === item.id) {
                            if (!compareObject(item, newItem)) {
                                pkgSeal.sealUpdates.push(item);
                            }
                        }
                    })
                }
            })
            return pkgSeal
        }

        cancelSealData() {
            this.sealList = JSON.parse(JSON.stringify(this.orginSealList))
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
            arr[index][type] = arr[index][type].replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
        }
    }

interface SealData {
    id?: string;
    factory?: string;
    orderNo?: string;
    orderId?: string;
    checkDate?: string;
    pressOne?: string;
    pressTwo?: string;
    pressThree?: string;
    pressFour?: string;
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
