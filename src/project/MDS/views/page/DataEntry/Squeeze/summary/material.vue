<template>
    <div>
        <el-row class="clearfix">
            <p style="float: left; font-size: 14px;">
                布浆总量：
            </p>
            <el-button type="primary" style="float: right;" size="small" :disabled="true">
                酱醪领用
            </el-button>
        </el-row>
        <el-table ref="table1" headerRowClassName="tableHead" :data="SumDate" :rowClassName="RowDelFlag" @row-dblclick="GetLog">
            <el-table-column label="原汁信息">
                <el-table-column label="状态" width="95">
                    <template slot-scope="scope">
                        <span
                            :style="{
                                color: scope.row.material.childStatus === 'noPass' ? 'red' : scope.row.material.childStatus === 'checked' ? '#67C23A' : '',
                            }"
                        >{{
                            scope.row.material.childStatus === 'noPass'
                                ? '审核不通过'
                                : scope.row.material.childStatus === 'saved'
                                    ? '已保存'
                                    : scope.row.material.childStatus === 'submit'
                                        ? '已提交'
                                        : scope.row.material.childStatus === 'checked'
                                            ? '通过'
                                            : scope.row.material.childStatus === '已同步'
                                                ? '未录入'
                                                : '未录入'
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="110">
                    <template slot="header">
                        <i class="reqI">*</i><span>原汁罐号</span>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.fumet.potNoName }}
                    </template>
                </el-table-column>
                <el-table-column label="是否混合罐" width="95" prop="fumet.fullPort" />
                <el-table-column label="物料" width="220">
                    <template slot-scope="scope">
                        {{ scope.row.fumet.material }}
                    </template>
                </el-table-column>
                <el-table-column label="入罐数量" width="80" :showOverflowTooltip="true" prop="fumet.inPotAmount" />
                <el-table-column label="满罐数量" width="80" :showOverflowTooltip="true" prop="fumet.fullPotAmount" />
                <el-table-column label="单位" width="50" prop="fumet.unit" />
                <el-table-column label="满罐日期" width="90" :showOverflowTooltip="true" prop="fumet.fullPotDate" />
                <el-table-column label="原汁批次" width="110" :showOverflowTooltip="true" prop="fumet.batch" />
                <el-table-column label="生产订单" width="110" :showOverflowTooltip="true" prop="fumet.orderNo" />
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.fumet.fullPort !== '正常'"
                        type="text"
                        :disabled="!(isRedact && scope.row.material.childStatus !== 'submit' && scope.row.material.childStatus !== 'checked')"
                        @click="splitDate(scope.row.fumet, scope.$index)"
                    >
                        <i class="icons iconfont factory-chaifen" />拆分
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="发酵罐号">
                <el-table-column width="120">
                    <template slot="header">
                        <i class="reqI">*</i><span>发酵罐号</span>
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.material.childPotNo" filterable placeholder="请选择" :disabled="!(isRedact && scope.row.material.childStatus !== 'submit' && scope.row.material.childStatus !== 'checked')" size="small" @visible-change="PotChange($event, scope.row)">
                            <el-option v-for="item in potList" :key="item.holderId" :label="item.holderName" :value="item.holderId" />
                            <el-option v-if="potSelect(scope.row.material)" :key="scope.row.material.childPotNo" :label="scope.row.material.holderName" :value="scope.row.material.childPotNo" :disabled="true" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="类别" width="80">
                    <template slot-scope="scope">
                        {{ scope.row.material.type }}
                    </template>
                </el-table-column>
                <el-table-column label="物料" width="220">
                    <template slot-scope="scope">
                        {{ scope.row.material.childMaterial }}
                    </template>
                </el-table-column>
                <el-table-column width="120">
                    <template slot="header">
                        <i class="reqI">*</i><span>当日用量</span>
                    </template>
                    <template
                        slot-scope="scope"
                    >
                        <el-input
                            v-model="scope.row.material.childUsedAmount"
                            size="small"
                            placeholder="手工录入"
                            :disabled="!(isRedact && scope.row.material.childStatus !== 'submit' && scope.row.material.childStatus !== 'checked')"
                            @focus="GetOldAmount(scope.row)"
                            @blur="PostAmount(scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="50">
                    <template slot-scope="scope">
                        {{ (scope.row.material.childUnit = 'L') }}
                    </template>
                </el-table-column>
                <el-table-column label="物料批次" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.material.childBatch }}
                    </template>
                </el-table-column>
                <el-table-column label="剩余数量" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.material.childFullPotAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="记录人" width="120" prop="material.childRecordMan" />
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="70">
                <template slot-scope="scope">
                    <el-button v-if="dangerIf(scope.row)" class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!(isRedact && scope.row.material.childStatus !== 'submit' && scope.row.material.childStatus !== 'checked')" @click="dellist(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <auditLog :tableData="MaterialAudit" />
    </div>
</template>

<script>
import { SQU_API } from '@/api/api';
import { accAdd, accSub, DeepClone } from '@/net/validate.js';
export default {
    name: 'Material',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean
        },
        fumet: {
            type: Array,
            default() {
                return [];
            }
        },
        serchSapList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            SumDate: [],
            materialDate: [],
            sumAmount1: {},
            sumAmount2: {},
            potList: [],
            materialS: '',
            MaterialAudit: [],
            oldHolderId: 0,
            oldChildUsedAmount: 0
        };
    },
    computed: {
        potSelect: function() {
            return (row) => {
                if (row.childPotNo) {
                    if (this.potList.filter(item => item.holderId === row.childPotNo).length === 0) {
                        return true;
                    }
                        return false;

                }
                    return false;

            };
        },
        dangerIf: function() {
            return (row) => {
                let s = 0;
                this.SumDate.forEach(item => {
                    if (item.delFlag !== '1' && row.fumet.id === item.fumet.id) {
                        s++;
                    }
                });
                if (s > 1) {
                    return true;
                }
                    return false;

            };
        }
        // SqueezePot: {
        //   get () { return this.$store.state.common.SqueezePot },
        //   set (val) { this.$store.commit('common/updateSqueezePot', val) }
        // }
    },
    watch: {
        fumet: {
            handler() {
                for (let i = 0; i < this.SumDate.length; i++) {
                    this.PotChange('', this.SumDate[i]);
                }
            },
            deep: true
        }
    },
    methods: {
        // 获取酱醪领用
        getMaterialList(formHeader, resolve, reject) {
            this.$http(`${SQU_API.SUM_MATERIAL_LIST_API}`, 'POST', {
                factory: formHeader.factory,
                productDate: formHeader.productDate,
                workShop: formHeader.workShop
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.materialDate = data.maList;
                    this.MaterialAudit = data.MaterialAudit;
                    let sub = 0;
                    let che = 0;
                    let no = 0;
                    let sav = 0;
                    this.sumAmount1 = {};
                    data.maList.forEach(item => {
                        if (item.childPotNo && item.childUsedAmount) {
                            this.sumAmount1[item.childPotNo] ? (this.sumAmount1[item.childPotNo] += Number(item.childUsedAmount)) : (this.sumAmount1[item.childPotNo] = Number(item.childUsedAmount));
                        }
                        if (item.childStatus === 'noPass') {
                            no = no + 1;
                        } else if (item.childStatus === 'submit') {
                            sub = sub + 1;
                        } else if (item.childStatus === 'checked') {
                            che = che + 1;
                        } else if (item.childStatus === 'saved') {
                            sav = sav + 1;
                        } else if (item.childStatus === '') {
                            sav = sav + 1;
                        }
                    });
                    // console.log(this.sumAmount1)
                    if (no > 0) {
                        this.materialS = 'noPass';
                    } else if (sub > 0) {
                        this.materialS = 'submit';
                    } else if (sav > 0) {
                        this.materialS = 'saved';
                    } else if (che > 0) {
                        this.materialS = 'checked';
                    }
                    this.mergeDate();
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    if (reject) {
                        reject(data.msg);
                    }
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 日志
        GetLog(row) {
            this.$http(`${SQU_API.SUM_LOG_MATERIAL_API}`, 'POST', {
                orderNo: row.fumet.orderNo
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.MaterialAudit = data.listRecord;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 修改酱
        updateMaterial(str, resolve, reject, st = false) {
            const tmp = [];
            this.SumDate.forEach((item) => {
                if (!item.material.childUsedAmount) {
                    item.material.childUsedAmount = '0';
                }
                if (item.childStatus) {
                    if (item.material.childStatus === 'saved') {
                        item.material.childStatus = str;
                    } else if (item.material.childStatus === 'noPass' && str === 'submit') {
                        item.material.childStatus = str;
                    }
                } else {
                    item.material.childStatus = str;
                }
                item.material.childMaterialCode = item.material.childMaterial.substring(0, item.material.childMaterial.indexOf(' '));
                item.material.childMaterialName = item.material.childMaterial.substring(item.material.childMaterial.indexOf(' ') + 1);
                if (item.delFlag === '1') {
                    item.material.delFlag = '1';
                }
                tmp.push(item.material);
            });
            // console.log(this.sumAmount2)
            // Object.keys(this.sumAmount2).forEach((key) => {
            //   if (this.potList.filter(it => it.holderId === key).length !== 0) {
            //     if (this.sumAmount2[key] - (this.sumAmount1[key] ? this.sumAmount1[key] : 0) === this.potList.filter(it => it.holderId === key)[0].sumAmount) {
            //       this.$http(`${SQU_API.SUM_POT_STATUS_API}`, 'POST', {holderId: key}).then(({data}) => {})
            //     }
            //   }
            // })
            this.$http(`${st === false ? SQU_API.SUM_MATERIAL_UPDATE_API : SQU_API.SUM_MATERIAL_SUBMIT_API}`, 'POST', tmp).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    if (reject) {
                        reject(data.msg);
                    }
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        PotChange(event, row) {
            if (event !== '') {
                if (event === true) {
                    this.oldHolderId = DeepClone(row.material.childPotNo);
                } else if (event === false) {
                    if (this.oldHolderId === '' && row.material.childUsedAmount !== 0) {
                        // 拆分
                        const PotsumAmount = this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount;
                        const newAmount = DeepClone(accSub(PotsumAmount, row.material.childUsedAmount));
                        this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount = newAmount;
                        this.ChangeDataListFullAmount(row.material.childPotNo, newAmount);
                    } else if (this.oldHolderId !== '' && this.oldHolderId !== row.material.childPotNo) {
                        // 变更
                        const OldAmountAdd = accAdd(this.potList.find(item => item.holderId === this.oldHolderId).sumAmount, row.material.childUsedAmount);
                        const NewAmountSub = accSub(this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount, row.material.childUsedAmount);
                        this.potList.find(item => item.holderId === this.oldHolderId).sumAmount = DeepClone(OldAmountAdd);
                        this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount = DeepClone(NewAmountSub);
                        this.ChangeDataListFullAmount(row.material.childPotNo, NewAmountSub, this.oldHolderId, OldAmountAdd);
                    }
                }
            }
            const pot = this.potList.filter(it => it.holderId === row.material.childPotNo)[0];
            if (pot) {
                row.material.childMaterial = pot.materialCode + ' ' + pot.materialName;
                row.material.childBatch = pot.batch;
                row.material.childFullPotAmount = pot.sumAmount;
                if (row.fumet.fullPort === '正常') {
                    row.material.type = pot.halfName;
                } else {
                    row.material.type = '味极鲜';
                }
                if (row.fumet.fullPort === '正常') {
                    this.SqueezePot = {
                        orderType: pot.orderType,
                        potNoName: row.fumet.potNoName
                    };
                    this.$emit('PoTest', this.SqueezePot);
                }
            } else if (row.fumet.fullPort === '正常') {
                    row.material.type = '';
                } else {
                    row.material.type = '味极鲜';
                }
        },
        // 校验
        materialRul() {
            this.sumAmount2 = {};
            let ty = true;
            this.SumDate.forEach(item => {
                if (item.delFlag !== '1') {
                    if (!item.material.childPotNo && !item.material.childUsedAmount) {
                        ty = false;
                        this.$warningTost('物料领用必填项未填写');
                        return false;
                    }
                        this.sumAmount2[item.material.childPotNo]
                            ? (this.sumAmount2[item.material.childPotNo] += Number(item.material.childUsedAmount ? item.material.childUsedAmount : 0))
                            : (this.sumAmount2[item.material.childPotNo] = Number(item.material.childUsedAmount ? item.material.childUsedAmount : 0));

                }
            });
            Object.keys(this.sumAmount2).forEach(key => {
                console.log(key, this.sumAmount2[key], this.sumAmount1[key]);
                if (this.sumAmount2[key] - (this.sumAmount1[key] ? this.sumAmount1[key] : 0) > (this.potList.filter(it => it.holderId === key).length ? this.potList.filter(it => it.holderId === key)[0].sumAmount : 0)) {
                    ty = false;
                    this.$warningTost('剩余量不足');
                    return false;
                }
            });
            return ty;
        },
        // 数量校验
        AmountRul() {
            this.sumAmount2 = {};
            let ty = true;
            // this.SumDate.forEach((item) => {
            //   if (item.material.childPotNo) {
            //     this.sumAmount2[item.material.childPotNo] ? this.sumAmount2[item.material.childPotNo] += (item.material.childUsedAmount ? item.material.childUsedAmount : 0) * 1 : this.sumAmount2[item.material.childPotNo] = (item.material.childUsedAmount ? item.material.childUsedAmount : 0) * 1
            //   }
            // })
            // Object.keys(this.sumAmount2).forEach((key) => {
            //   console.log(key, this.sumAmount2[key], this.sumAmount1[key])
            //   if (this.sumAmount2[key] - (this.sumAmount1[key] ? this.sumAmount1[key] : 0) > (this.potList.filter(it => it.holderId === key).length ? this.potList.filter(it => it.holderId === key)[0].sumAmount : 0)) {
            //     ty = false
            //     this.$warningTost('剩余量不足')
            //     return false
            //   }
            // })
            for (const item of this.SumDate) {
                if (item.material.childFullPotAmount < 0) {
                    ty = false;
                    this.$warningTost('剩余量不足');
                    return false;
                }
            }
            return ty;
        },
        // 拆分
        splitDate(row, index) {
            this.SumDate.splice(index + 1, 0, {
                fumet: row,
                material: {
                    childId: '',
                    midPrsOrderId: row.id,
                    childMaterial: '',
                    childMaterialCode: '',
                    childMaterialName: '',
                    childPotNo: '',
                    childUsedAmount: 0,
                    childUnit: '',
                    childBatch: '',
                    childFullPotAmount: '',
                    childRecordMan: '',
                    childRemark: '',
                    childDelFlag: '0'
                }
            });
        },
        // 删除
        dellist(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let s = 0;
                this.SumDate.forEach(item => {
                    if (item.delFlag !== '1' && row.fumet.id === item.fumet.id) {
                        s++;
                    }
                });
                if (s > 1) {
                    row.delFlag = '1';
                    row.material.childDelFlag = '1';
                    this.SumDate.splice(this.SumDate.length, 0, {});
                    this.SumDate.splice(this.SumDate.length - 1, 1);
                    // 更改库存余量
                    const PotsumAmount = this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount;
                    const newAmount = DeepClone(accAdd(PotsumAmount, row.material.childUsedAmount));
                    this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount = newAmount;
                    this.ChangeDataListFullAmount(row.material.childPotNo, newAmount);
                } else {
                    this.$warningTost('此订单最后一条了，不能删除');
                }
            });
        },
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        // 获取罐
        getPot(formHeader, resolve, reject) {
            this.$http(`${SQU_API.SUM_POT_LIST_API}`, 'POST', {
                factory: formHeader.factory,
                workShop: formHeader.workShop
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.potList = data.holderInfo;
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    if (reject) {
                        reject(data.msg);
                    }
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 合并数据
        mergeDate() {
            this.SumDate = [];
            if (this.materialDate.length === 0) {
                this.fumet.forEach((item) => {
                    const tmp = {
                        childId: '',
                        midPrsOrderId: item.id,
                        childMaterial: '',
                        childMaterialCode: '',
                        childMaterialName: '',
                        childPotNo: '',
                        childUsedAmount: 0,
                        childUnit: '',
                        childBatch: '',
                        childFullPotAmount: '',
                        childRecordMan: '',
                        childRemark: '',
                        childStatus: '',
                        childDelFlag: '0'
                    };
                    this.SumDate.push({
                        fumet: item,
                        material: tmp,
                        delFlag: '0'
                    });
                });
            } else {
                this.materialDate.forEach((item) => {
                    if (this.potList.find(items => items.holderId === item.childPotNo)) {
                        item.childFullPotAmount = this.potList.find(items => items.holderId === item.childPotNo).sumAmount;
                    }
                    item.childMaterial = item.childMaterialCode + ' ' + item.childMaterialName;
                    const tmp = this.fumet.find(items => items.id === item.midPrsOrderId);
                    this.SumDate.push({
                        fumet: tmp,
                        material: item,
                        delFlag: '0'
                    });
                });
                this.fumet.forEach(item => {
                    if (typeof this.materialDate.find(items => items.midPrsOrderId === item.id) === 'undefined') {
                        const tmp = {
                            childId: '',
                            midPrsOrderId: item.id,
                            childMaterial: '',
                            childMaterialCode: '',
                            childMaterialName: '',
                            childPotNo: '',
                            childUsedAmount: 0,
                            childUnit: '',
                            childBatch: '',
                            childFullPotAmount: '',
                            childRecordMan: '',
                            childRemark: '',
                            childStatus: '',
                            childDelFlag: '0'
                        };
                        this.SumDate.push({
                            fumet: item,
                            material: tmp,
                            delFlag: '0'
                        });
                    }
                });
            }
        },
        GetOldAmount(row) {
            this.oldChildUsedAmount = row.material.childUsedAmount;
        },
        PostAmount(row) {
            if (this.oldChildUsedAmount !== row.material.childUsedAmount && row.material.childPotNo !== '') {
                const PotsumAmount = this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount;
                const newAmount = DeepClone(accSub(accAdd(PotsumAmount, this.oldChildUsedAmount), row.material.childUsedAmount));
                this.potList.find(item => item.holderId === row.material.childPotNo).sumAmount = newAmount;
                this.ChangeDataListFullAmount(row.material.childPotNo, newAmount);
            }
        },
        ChangeDataListFullAmount(newHolderId, newAmount, oldHolderId = '', oldAmount = '') {
            this.SumDate.map(item => {
                if (item.material.childPotNo === newHolderId) {
                    item.material.childFullPotAmount = newAmount;
                }
                if (item.oldHolderId !== '') {
                    if (item.material.childPotNo === oldHolderId) {
                        item.material.childFullPotAmount = oldAmount;
                    }
                }
            });
        }
    }
};
</script>

<style scoped></style>
