<template>
    <div>
        <el-table headerRowClassName="tableHead" :rowClassName="RowDelFlag" :data="MaterialList" border tooltipEffect="dark">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column
                label="物料"
                :showOverflowTooltip="true"
                width="150"
            >
                <template slot-scope="scope">
                    {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                </template>
            </el-table-column>
            <el-table-column label="单位" :showOverflowTooltip="true" prop="unitName" width="50" />
            <el-table-column label="需求用量" :showOverflowTooltip="true" prop="needAmount" width="80" />
            <el-table-column label="操作" :showOverflowTooltip="true" prop="kjmWorkShopName" width="80">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.isSplit === '0'" type="text" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="splitDate(scope.row, scope.$index)">
                        <i class="icons iconfont factory-chaifen" />拆分
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="批次 " :showOverflowTooltip="true" prop="kjmWorkShopName" width="140">
                <template slot="header">
                    <i class="reqI">*</i><span>批次</span>
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.batch" placeholder="手工录入" size="mini" maxlength="10" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="生产使用量 " :showOverflowTooltip="true" width="140">
                <template slot="header">
                    <i class="reqI">*</i><span>生产使用量</span>
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.productUseAmount" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @change="ChangeNum()" />
                </template>
            </el-table-column>
            <el-table-column label="本班损耗 " :showOverflowTooltip="true" prop="kjmWorkShopName" width="100">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.classLoss" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="不合格数 " :showOverflowTooltip="true" prop="kjmWorkShopName" width="100">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.belowGradeAmount" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="供应商 " :showOverflowTooltip="true" prop="kjmWorkShopName" width="140">
                <template slot="header">
                    <i class="reqI">*</i><span>供应商</span>
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.supplier" placeholder="请选择" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')">
                        <el-option v-for="(iteam, index) in supplier" :key="index" :label="iteam.value" :value="iteam.code" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="备注" :showOverflowTooltip="true" prop="kjmWorkShopName" width="120">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="手工录入" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" />
                </template>
            </el-table-column>
            <el-table-column label="操作" :showOverflowTooltip="true" prop="kjmWorkShopName" width="70" fixed="right">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.isSplit === '1'" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delMaterial(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <auditLog :tableData="MaterialAudit" />
    </div>
</template>

<script>
import { BOTTLE_API } from '@/api/api';
import { GetStatus, accAdd, accSub } from '@/net/validate';
export default {
    name: 'Material',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean,
            default() {
                return false;
            }
        },
        supplier: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            MaterialList: [],
            MaterialAudit: [],
            num: ''
        };
    },
    computed: {
        sumNum: function() {
            let num = 0;
            this.MaterialList.forEach(item => {
                if (item.delFlag !== '1') {
                    num += Number(item.productUseAmount);
                }
            });
            return num;
        }
    },
    watch: {
        num(n) {
            this.setAmount(n);
        }
    },
    methods: {
        // 获取物料领用
        getDataList(formHeader) {
            let status = '';
            this.$http(`${BOTTLE_API.BOTTLE_PRO_MATERIAL_LIST}`, 'POST', {
                orderId: this.$store.state.common.bottle.ProOrderId,
                status: formHeader.orderStatus,
                orderNo: formHeader.orderNo
            })
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.MaterialList = data.list;
                        this.MaterialAudit = data.vrList;
                        status = GetStatus(this.MaterialList);
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                })
                .finally(() => {
                    this.$emit('setApplyMaterielState', status);
                });
        },
        // setNum (num) {
        //   let tmp = num
        //   this.num = JSON.stringify(tmp)
        // },
        // setAmount (num) {
        //   this.MaterialList.forEach(item => {
        //     if (!item.status) {
        //       item.productUseAmount = num
        //     } else if (item.status === 'saved' || item.status === 'noPass') {
        //       item.productUseAmount = num
        //     }
        //   })
        // },
        ChangeNum() {
            this.$emit('SetMeaterielNum', this.sumNum);
        },
        // 保存提交
        SaveOrSubmitData(str, resolve, reject) {
            this.MaterialList.forEach(item => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
            });
            this.$http(`${str === 'saved' ? BOTTLE_API.BOTTLE_PRO_MATERIAL_SAVE : BOTTLE_API.BOTTLE_PRO_MATERIAL_SUBMIT}`, 'POST', this.MaterialList).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('物料领用' + data.msg);
                    }
            });
        },
        // 校验
        dataRul() {
            let ty = true;
            this.MaterialList.forEach(item => {
                if (item.delFlag !== '1') {
                    if (!(item.batch && item.productUseAmount && item.supplier)) {
                        ty = false;
                        this.$warningTost('物料领用必填项未填');
                        return false;
                    }
                    if (item.batch.length !== 10) {
                        ty = false;
                        this.$warningTost('物料领用批次十位');
                        return false;
                    }
                }
            });
            return ty;
        },
        // 拆分
        splitDate(row) {
            // this.MaterialList.splice(index + 1, 0, {
            let serialNumber = 0;
            const maxlength = this.MaterialList.length;
            if (maxlength === 0) {
                serialNumber = 1;
            } else {
                serialNumber = accAdd(this.MaterialList[accSub(maxlength, 1)].serialNumber, 1);
            }
            this.MaterialList.push({
                isSplit: '1',
                orderId: this.$store.state.common.bottle.ProOrderId,
                status: '',
                id: '',
                materialCode: row.materialCode,
                materialName: row.materialName,
                unit: row.unit,
                unitName: row.unitName,
                needAmount: row.needAmount,
                batch: '',
                productUseAmount: '',
                classLoss: '',
                belowGradeAmount: '',
                supplier: '',
                supplierName: '',
                remark: '',
                delFlag: '0',
                serialNumber: serialNumber
            });
        },
        // 删除
        delMaterial(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        }
    }
};
</script>

<style scoped></style>
