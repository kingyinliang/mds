<template>
    <div>
        <div class="tab__heads clearfix">
            <i class="title-icon" />
            <span>扭力检测</span>
            <div style="float: right;">
                <el-button :disabled="!isRedact" type="primary" size="small" @click="torqueAddRow()">
                    新增
                </el-button>
            </div>
        </div>
        <el-table ref="table4" class="newTable" header-row-class-name="tableHead" :data="torqueList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column width="195">
                <template slot="header">
                    <i class="reqI">*</i><span>检测时间</span>
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.checkDate" :disabled="!isRedact" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 170px;" placeholder="请选择时间" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="扭力矩/N.m" width="200" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.torque" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(torqueList,scope.$index,'torque')" />
                </template>
            </el-table-column>
            <el-table-column label="真空度/Mpa" width="200" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.vacuum" :disabled="!isRedact" maxlength="12" size="mini" @input="changeInputType(torqueList,scope.$index,'vacuum')" />
                </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" :disabled="!isRedact" maxlength="200" size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="检查人" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.checkMan" disabled size="mini" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button :disabled="!isRedact" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="torqueDelRow(scope.row,scope.$index)">
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
        name: 'Torque',
        components: {
        }
    })

    export default class Torque extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        torqueList: TorqueData[] = [];
        originTorqueList: TorqueData[] = [];
        torqueDelList: string[] = [];
        orderNo = ''
        orderId = ''

        init(formHeader) {
            PKG_API.PKG_CHECKDATA_TORQUE_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo
            }).then(({ data }) => {
                if (data.data !== null) {
                    this.originTorqueList = JSON.parse(JSON.stringify(data.data))
                    this.torqueList = JSON.parse(JSON.stringify(data.data))
                }
            })
            this.orderNo = formHeader.orderNo
            this.orderId = formHeader.id
        }

        torqueAddRow() {
            const newRow: TorqueData = {
                id: '',
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.orderNo,
                orderId: this.orderId,
                checkDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                torque: '',
                vacuum: '',
                remark: '',
                checkMan: getUserNameNumber()
            }
            console.log(newRow);
            this.torqueList.push(newRow);
        }

        torqueDelRow(row, index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.id.length) {
                    this.torqueDelList.push(row.id);
                }
                this.torqueList.splice(index, 1);
            });
        }

        torqueDataRul() {
            let torqueRul = true
            this.torqueList.some(item => {
                if (!item.checkDate) {
                    this.$warningToast('扭力检测检测时间必填')
                    torqueRul = false
                    return true
                }
            })
            return torqueRul
        }

        returnTorqueData() {
            const inserts: TorqueData[] = []
            const updates: TorqueData[] = []
            const pkgTorque = {
                pkgTorqueDelete: JSON.parse(JSON.stringify(this.torqueDelList)),
                pkgTorqueInsert: inserts,
                pkgTorqueUpdate: updates
            }
            this.torqueList.some(item => {
                if (item.id === '') {
                    pkgTorque.pkgTorqueInsert.push(item);
                } else {
                    this.originTorqueList.forEach(newItem => {
                        if (newItem.id === item.id) {
                            if (!compareObject(item, newItem)) {
                                pkgTorque.pkgTorqueUpdate.push(item);
                            }
                        }
                    })
                }
            })
            return pkgTorque
        }

        cancelTorqueData() {
            this.torqueList = JSON.parse(JSON.stringify(this.originTorqueList))
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
interface TorqueData {
    id?: string;
    factory?: string;
    orderNo?: string;
    orderId?: string;
    checkDate?: string;
    torque?: string;
    vacuum? : string | null;
    remark?: string | null;
    checkMan?: string;
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
